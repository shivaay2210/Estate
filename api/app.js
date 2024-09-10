import express from "express";
import cors from "cors";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const app = express();
const frontEndUrl = String(process.env.FRONT_END_URL);

// middlewares
app.use(
  cors({
    origin: frontEndUrl,
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
// app.use(cors());

app.use(express.json()); // allow our application to send json data
app.use(cookieParser());

// api endpoints
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

export { app };
