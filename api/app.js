import express from 'express'
import cors from 'cors'
import postRoute from './routes/post.route.js'
import authRoute from './routes/auth.route.js'
import testRoute from './routes/test.route.js'
import userRoute from './routes/user.route.js'
import chatRoute from './routes/chat.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"

dotenv.config({
    path: ".env"
})
 
const app = express()
const port = process.env.PORT || 8000
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

app.use(express.json()) // to make sure that our application is allowing us to send json data

app.use(cookieParser())
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/auth", authRoute)
app.use("/api/test", testRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

console.log("test")

app.listen(port, () => {
    console.log("Server is running");
})