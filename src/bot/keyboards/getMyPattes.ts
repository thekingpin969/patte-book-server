import { Redis } from "../../db/redis"
import groupData from "../utils/groupData"

async function getMyPattes(ctx: any) {
    try {
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
    } catch (error) {
        console.log(error)
        return await ctx.reply('something went wrong!')
    }
}

export default getMyPattes