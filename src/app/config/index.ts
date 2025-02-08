import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 3000,
  database_url: process.env.MONGODB_DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  salt: process.env.SALT,
  jwtAccess: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpireIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefresh: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpireIn: process.env.JWT_REFRESH_EXPIRES_IN,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_SECRET_KEY,
  store_id: process.env.STORE_ID,
  store_pass: process.env.STORE_PASS,
  sandBox_URL: process.env.SANDBOX_URL,
  domain: process.env.DOMAIN,
  server_url: process.env.SERVER_URL,
};
