import type { Context } from "hono";
import exportRedis from "../../helpers/exportData";

async function redisExport(ctx: Context) {
    try {
        await exportRedis()
        return ctx.text('ok', 200)
    } catch (error) {
        console.log(error)
        return ctx.text('ok', 500)
    }
}

export default redisExport