import app from "./app";
import config from "./app/config";
import { Initiate, closeConnection } from "./app/utils/db";

let server;

Initiate().then(() => {
  server = app.listen(config.PORT, function () {
    console.log(`app running on ${config.PORT} on ${config.ENV}`);
  });
});

process.on("uncaughtException", (err) => {
  console.warn("Uncaught Exception!! Shutting down process..");
  console.error(err.stack);
  // send alerts for system error/termination
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.warn("Unhandled Rejection!! " + err);
  // send alerts for system error/termination
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log(
    "Received SIGINT. Terminating Server. \n Press Control-D to exit."
  );
  process.exit();
});

process.on("exit", (code) => {
  console.log("Server Terminated: ", code);
  closeConnection();
});

export default server;
