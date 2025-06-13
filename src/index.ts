import connectDB from "./config/db";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running on port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the server:", error);
  });
