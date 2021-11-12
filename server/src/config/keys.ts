import { config } from 'dotenv';

config();

export const keys = {
  PORT: process.env['PORT'] || 8000,
  MongoURI: process.env['MONGO_URI'] || '',
  JWTKey: process.env['JWT_KEY'] || ''
};
