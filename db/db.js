import mongoose, { mongo } from "mongoose";
import { config } from "dotenv";

config();
console.log(process.env.MONGO_DB_CONNECTION_STRING);

const MONGO_DB_URL = process.env.MONGO_DB_CONNECTION_STRING;

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_DB_URL);
    console.log("DB is connected");
  } catch (error) {
    console.log("Mongo Db error", error);

    process.exit(1);
  }
  // mongoose.connect(MONGO_DB_URL);

  // mongoose.connection.on("connected", () => {
  //   console.log("Mongo DB is connected");
  // });

  // mongoose.connection.on("error", (error) => {
  //   console.log("Mongo DB connection error", error?.message);
  //   process.exit(1);
  // });
  // mongoose.connection.on("disconnected", () => {
  //   console.log("Mongo DB is disconnected");
  // });
};
