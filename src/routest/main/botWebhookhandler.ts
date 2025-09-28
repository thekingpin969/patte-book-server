import type { Context } from "hono";
import tgBot from "../../bot/bot";

async function botWebhookHandler(c: Context) {
    try {
        const body = await c.req.json();
        await tgBot.handleUpdate(body);
        return c.json({ ok: true });
    } catch (error) {
        console.log(error)
        return c.text('error', 500)
    }
}

export default botWebhookHandler