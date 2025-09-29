import { parse, isValid } from '@telegram-apps/init-data-node';

const mainBotToken = process.env.BOT_TOKEN as string

function TelegramAuth() {
    return async (c: any, next: any) => {
        const freeEndpoints = ['/webhook']
        if (freeEndpoints.includes(c.req.path || '')) {
            return await next()
        }
        const dataString = c.req.header('datastring')
        if (!dataString) return c.text('telegram authentication error', 400)

        const initData = new URLSearchParams(dataString)
        if (typeof (initData as any).sort === 'function') (initData as any).sort()

        const validUser = isValid(initData, mainBotToken)
        const parsedInitData = parse(initData);
        if (!validUser && process.env.NODE_ENV == 'production') return c.text('telegram authentication error', 400)

        c.set('tgUserData', parsedInitData.user)
        return await next()
    }
}

export default TelegramAuth