import { Hono } from 'hono'
import mainRoutes from './main/mainRoutes'

const routes = new Hono()

routes.route('/', mainRoutes)

export default routes