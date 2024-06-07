const redis = require('redis');

const client = redis.createClient({
    password: 'c4llsPh8kTJFiMRdIJNmQEn1IR3sSTqh',
    socket: {
        host: 'redis-11202.c325.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 11202
    }
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

process.on('exit', () => {
    client.quit();
});

module.exports = client;
