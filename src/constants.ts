import { configDotenv } from "dotenv";

configDotenv()
export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
  expiresIn: '1d',
  refreshExpiresIn: '7d',
};