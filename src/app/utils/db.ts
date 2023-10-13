import mongoose from "mongoose";
import config from "../config";

const mongoUrl = String(config.DB);

export const Initiate = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUrl).then(() => {
      console.log("Server Database Connected!!!");
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const closeConnection = async () => mongoose.disconnect();
