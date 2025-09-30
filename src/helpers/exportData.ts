import { Redis as client } from "../db/redis";
import tgBot from "../bot/bot";

async function exportRedis() {
    const CHAT_ID = process.env.DUMP_CHANNEL || 0
    try {
        const data: any = {};
        let cursor = 0;

        do {
            const { cursor: newCursor, keys } = await client.scan(cursor.toString());
            cursor = parseInt(newCursor, 10);

            if (keys.length > 0) {
                for (const key of keys) {
                    const type = await client.type(key);
                    let value;
                    switch (type) {
                        case 'string':
                            value = await client.get(key);
                            break;
                        case 'hash':
                            value = await client.hGetAll(key);
                            break;
                        case 'list':
                            value = await client.lRange(key, 0, -1);
                            break;
                        case 'set':
                            value = await client.sMembers(key);
                            break;
                        case 'zset':
                            value = await client.zRangeWithScores(key, 0, -1);
                            break;
                        default:
                            value = 'Unknown Type';
                    }
                    data[key] = { type, value };
                }
            }
        } while (cursor !== 0);

        const buffer = Buffer.from(JSON.stringify(data));
        await tgBot.telegram.sendDocument(CHAT_ID, {
            source: buffer,
            filename: `pattebook-redis-backup.json`,
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
export default exportRedis