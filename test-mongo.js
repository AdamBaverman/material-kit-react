// import { env } from 'node:process';

const { MongoClient } = require('mongodb');
require('dotenv').config(); // Для загрузки переменных окружения из .env файла

let uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Please add your Mongo URI to .env file');
    // throw new Error('Please add your Mongo URI to .env file');
    }

uri = 'mongodb://localhost:27017/mui';
    
async function run() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
