import type { Context } from "hono";
import { Redis } from "../../db/redis";

async function editData(c: Context) {
    try {
        const { id: userid } = c.get('tgUserData')
        const { id, data: newData } = await c.req.json()

        const data = JSON.parse(await Redis.get(`data:${userid}`) || '[]')
        const newSession = data.map((item: any) => {
            if (item.id == id) {
                return { ...item, ...newData, time: item.time, id }
            } else return item
        })
        await Redis.set(`data:${userid}`, JSON.stringify(newSession))
        return c.text('ok', 200)
    } catch (error) {
        console.log(error)
        return c.text('something went wrong!', 500)
    }
}

export default editData