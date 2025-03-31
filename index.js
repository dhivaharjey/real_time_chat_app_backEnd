import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.js";
import authRouter from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { app, server } from "./Socket/socket.js";

config();

// const app = express();
const allowedOrigins = [
  process.env.FRONT_END_URL,
  process.env.GOOGLE_LOGIN_URL,
];
console.log(process.env.FRONT_END_URL);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: function (origin, callBack) {
    //   if (
    //     !origin ||
    //     allowedOrigins.some((allowed) => origin.startsWith(allowed))
    //   ) {
    //     callBack(null, true);
    //   } else {
    //     callBack(new Error("Cors Error"));
    //   }
    // },
    origin: process.env.FRONT_END_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // exposedHeaders: ["set-cookie"],
  })
);

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  return res.send("App is running Successfully!!1");
});

server.listen(process.env.PORT || 3000, (req, res) => {
  console.log("App is running in port", process.env.PORT);
});
