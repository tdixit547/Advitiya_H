import mongoose from 'mongoose';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectMongoDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-link-hub';

    try {
        await mongoose.connect(uri);
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('✗ MongoDB connection error:', error);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });
};

// Redis Client
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
    console.log('✓ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('✗ Redis connection error:', err);
});

// Graceful shutdown
export const closeConnections = async (): Promise<void> => {
    await mongoose.connection.close();
    await redis.quit();
    console.log('All connections closed');
};
