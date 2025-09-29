import type { Context } from "hono";
import { Redis } from "../../db/redis";

async function settleDue(c: Context) {
    try {
        const { id: userId } = c.get("tgUserData");

        const { paidAmount } = await c.req.json();
        let remaining = Number(paidAmount);

        if (isNaN(remaining) || remaining <= 0) return c.text("Invalid paid amount", 400);

        const rawData = await Redis.get(`data:${userId}`);
        const dues = JSON.parse(rawData || "[]");

        if (!Array.isArray(dues) || dues.length === 0) {
            return c.text("No dues to settle", 404);
        }

        dues.sort((a: any, b: any) => a.time - b.time);

        const paidDues: any[] = [];
        const remainingDues: any[] = [];
        const curTime = new Date().getTime();

        let index = 0;
        while (remaining > 0 && index < dues.length) {
            const item = dues[index];
            const amount = Number(item.amount);

            if (amount <= remaining) {
                remaining -= amount;
                paidDues.push({ ...item });
            } else {
                paidDues.push({ ...item, amount: remaining });
                remainingDues.push({ ...item, amount: amount - remaining });
                remaining = 0;
            }

            index++;
        }

        for (; index < dues.length; index++) {
            remainingDues.push(dues[index]);
        }

        const invoice = {
            paidAmount: +paidAmount,
            settledAt: curTime,
            paidDues
        }

        const pastSettlements = JSON.parse(await Redis.get(`settlements:${userId}`) || '[]')
        pastSettlements.push(invoice)
        await Redis.set(`settlements:${userId}`, JSON.stringify(pastSettlements));
        await Redis.set(`data:${userId}`, JSON.stringify(remainingDues));

        return c.text('ok')

    } catch (error) {
        console.error("Error settling dues:", error);
        return c.text("Something went wrong!", 500);
    }
}

export default settleDue;
