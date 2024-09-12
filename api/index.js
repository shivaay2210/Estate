import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./lib/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB Connection Failed: ", err);
  });
