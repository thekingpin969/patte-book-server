import type { Context } from "hono";
import { Redis } from "../../db/redis";

async function getSettlements(c: Context) {
    try {
        const { id: userid } = c.get('tgUserData')
        const data = JSON.parse(await Redis.get(`settlements:${userid}`) || '[]')
        return c.json(data, 200)
    } catch (error) {
        return c.text('something went wrong!', 500)
    }
}

export default getSettlements