import { setUpRedis } from './src/db/redis'
import { serve } from "bun"
import routes from './src/routes/routes'

await setUpRedis()
await import('./src/bot/bot')

serve({
    fetch: routes.fetch,
    port: 3000,
    idleTimeout: 30,
})