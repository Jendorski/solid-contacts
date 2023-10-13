import * as dotenv from "dotenv";
dotenv.config();

export default {
  DB: process.env.DB_URL,
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  ENV: process.env.ENV,
};
