import type { Context } from "hono";
import { Redis } from "../../db/redis";

async function deleteData(c: Context) {
    try {
        const { id: userid } = c.get('tgUserData')
        const { id } = await c.req.json()
        const data = JSON.parse(await Redis.get(`data:${userid}`) || '[]')
        const newSession = data.filter((item: any) => item.id != id)
        await Redis.set(`data:${userid}`, JSON.stringify(newSession))
        return c.text('ok', 200)
    } catch (error) {
        console.log(error)
        return c.text('something went wrong!', 500)
    }
}

export default deleteData