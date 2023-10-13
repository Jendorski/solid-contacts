import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import config from "./app/config";
import morganMiddleware from "./app/utils/morgan";
import Utils from "./app/utils/response";

dotenv.config();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

app.use(morganMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic ? Response
app.get("/", (req: Request, res: Response) => {
  return Utils.success(
    res,
    {},
    `${config.APP_NAME} is online ${Date()} on ${req.app.get(
      "env"
    )} Environment`
  );
});

//  Not Found Response
app.use("**", (req: Request, res: Response, next: NextFunction) => {
  const err = {
    name: "Not Found",
    message: `${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`,
    code: 404,
    isOperational: true,
  };
  next(err);
});

export default app;
export { NextFunction, Request, Response };
