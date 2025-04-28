import dotenv from 'dotenv';

dotenv.config();

export const TOKEN_SECRET = process.env.JWT_SECRET;