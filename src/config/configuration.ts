import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    databaseTest: process.env.POSTGRES_DATABASE_TEST,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    salt: process.env.JWT_SALT,
  },
}));
