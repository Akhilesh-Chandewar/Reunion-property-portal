import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 3000 ;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Connected to MongoDB!`);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});