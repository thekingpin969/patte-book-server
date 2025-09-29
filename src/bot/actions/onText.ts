import { randomBytes } from "crypto"
import { Redis } from "../../db/redis"

async function onText(ctx: any) {
    try {
        const { text, chat: { id } } = ctx.update.message
        const [amount, category, ...rest]: any = text.split(' ')
        if (+amount && typeof +amount == 'number' && amount > 0 && typeof category == 'string') {
            const additional = rest.join('-')
            const prevData = JSON.parse(await Redis.get(`data:${id}`) || '[]')
            const data = { id: randomBytes(6).toString('hex'), amount: +amount, category, additional, time: new Date().getTime() }
            prevData.push(data)
            await Redis.set(`data:${id}`, JSON.stringify(prevData))
            return await ctx.reply('sett 💪')
        } else {
            return ctx.replyWithHTML(
                'Oops 😐,\nInvalid format! Please use the following format:\n\n' +
                '<i>amount &lt;space&gt; category &lt;space&gt; additional_data</i>\n\n' +
                'Example:\n<code>10 food restaurant</code>'
            );
        }

    } catch (error) {
        console.log(error)
        return await ctx.reply('something went wrong!')
    }
}

export default onText