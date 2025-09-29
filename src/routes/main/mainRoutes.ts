import { Hono } from 'hono';
import { cors } from 'hono/cors';
import TelegramAuth from '../../auth/telegramAuth';
import getData from './getData';
import editData from './editData';
import deleteData from './deleteData';
import settleDue from './settleDue';
import getSettlements from './getSettlements';
import botWebhookHandler from './botWebhookhandler';

const app = new Hono();
app.use(cors({ origin: "*" }));
app.use(TelegramAuth());

app.get('/getData', getData)
app.get('/getSettlements', getSettlements)

app.post('/settleDue', settleDue)
app.post('/webhook', botWebhookHandler)

app.patch('/editData', editData)

app.delete('/deleteData', deleteData)

export default app