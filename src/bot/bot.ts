import { Telegraf } from 'telegraf'
import start from './commands/start'
import getMyPattes from './keyboards/getMyPattes'
import onText from './actions/onText'
import exportRedisDB from './commands/export'

const tgBot = new Telegraf(process.env.BOT_TOKEN as string)

tgBot.start(start)
tgBot.command('export', exportRedisDB)
tgBot.hears('Get my Pattes', getMyPattes)
tgBot.on('text', onText)


if (process.env.NODE_ENV == 'production') {
    const url = process.env.RENDER_EXTERNAL_URL + '/webhook'
    tgBot.telegram.setWebhook(url, { secret_token: 'authorized_request_from_pattebookbot' })
    console.log('bot running throw webhook on', url)
} else {
    tgBot.launch()
    console.log('bot running')
}

export default tgBot