import { Telegraf } from 'telegraf'
import { Redis } from '../db/redis'
import groupData from './utils/groupData'
import { randomBytes } from 'crypto'

const tgBot = new Telegraf(process.env.BOT_TOKEN as string)

tgBot.start(async (ctx) => {
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
                    ['Get my Pattes', 'Pay Patte'],
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
        })
    }
})

tgBot.hears('Get my Pattes', async (ctx) => {
    const { chat: { id } } = ctx.update.message
    const data = JSON.parse(await Redis.get(`data:${id}`) || '[]')
    const sortedData = data.sort((a: any, b: any) => a.time - b.time)
    const totalAmount = sortedData.reduce((acc: any, item: any) => {
        return acc + +item.amount
    }, 0)
    if (sortedData.length <= 0) return await ctx.reply('no patts remaining...')
    const grouped = groupData(sortedData)
    const lastWeek = Object.keys(grouped).slice(0, 7)
    const msg = `Here is your unpaid patts:\n\n${lastWeek.map((item: any) => {
        return `<blockquote><b>Date: ${item}</b></blockquote>\n${grouped[item].map((p: any) => {
            return `<i>amount: ${p.amount}</i>\n<i>category: ${p.category}</i>\n<i>additional: ${p.additional}</i>`
        }).join('\n\n')}\n----------------------------------------\n`;
    }).join('\n')}\n<b>Total due: ${totalAmount}</b>`;

    return await ctx.replyWithHTML(msg, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "View More", web_app: { url: 'https://pattebook.vercel.app/' } }
                ]
            ]
        }
    });
})

tgBot.on('text', async (ctx) => {
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
            'Example:\n<code>10 food kakka</code>'
        );
    }
})


if (process.env.NODE_ENV == 'production') {
    const url = 'https://patte-book-server.onrender.com' + '/webhook'
    tgBot.telegram.setWebhook(url, {})
} else {
    tgBot.launch()
}
console.log('bot running')

export default tgBot