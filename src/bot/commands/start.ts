import { randomBytes } from "crypto";
import { Redis } from "../../db/redis";

async function start(ctx: any) {
    try {
        const msg = ctx.startPayload
        const { chat: { id } } = ctx.update.message
        if (msg) {
            const [amount, category, ...rest]: any = msg.split('-')
            if (+amount && typeof +amount == 'number' && amount > 0 && typeof category == 'string') {
                const additional = rest.join('-')
                const prevData = JSON.parse(await Redis.get(`data:${id}`) || '[]')
                const data = { id: randomBytes(6).toString('hex'), amount: +amount, category, additional, time: new Date().getTime() }
                prevData.push(data)
                await Redis.set(`data:${id}`, JSON.stringify(prevData))
                return await ctx.reply(`${amount} ${category} ${rest}\nsett 💪`)
            } else {
                return ctx.replyWithHTML(
                    'Oops 😐,\nInvalid format! Please use the following format:\n\n' +
                    '<i>amount &lt;space&gt; category &lt;space&gt; additional_data</i>\n\n' +
                    'Example:\n<code>10 food kakka</code>'
                );
            }
        } else {
            return await ctx.reply('Hellow,\n\nwelcome to patte book bot 🥰', {
                reply_markup: {
                    keyboard: [
                        ['Get my Pattes'],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: false
                }
            })
        }
    } catch (error) {
        console.log(error)
        return await ctx.reply('something went wrong!')
    }
}

export default start