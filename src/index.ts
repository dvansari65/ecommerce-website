

import dotenv from "dotenv";
dotenv.config()
import connectDB from "./config/db";
import app from "./app";



connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running on port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the server:", error);
  });
