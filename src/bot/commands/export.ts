import exportRedis from "../../helpers/exportData"

async function exportRedisDB(ctx: any) {
    try {
        await exportRedis()
        return await ctx.reply('export success.')
    } catch (error) {
        console.log(error)
        return await ctx.reply('something went wrong!')
    }
}

export default exportRedisDB