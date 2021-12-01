import { config } from 'dotenv';

config();

export const keys = {
  PORT: process.env['PORT'] || 8000,
  STRIPE_PUB_KEY: process.env['STRIPE_PUB_KEY'] || '',
  STRIPE_SECRET_KEY: process.env['STRIPE_SECRET_KEY'] || '',
  MONGO_URI: process.env['MONGODB_URI'] || '',
  JWT_KEY: process.env['JWT_KEY'] || ''
};

export const constants = {
  CHAT_ADMIN: 'SYSTEM',
};
