const { MongoClient } = require('mongodb');
require('dotenv').config(); // Для загрузки переменных окружения из .env файла

// const uri = process.env.MONGODB_URI;
const uri = 'mongodb://localhost:27017/mui';

if (!uri) {
    throw new Error('Please add your Mongo URI to .env file');
}

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
