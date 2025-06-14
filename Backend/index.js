import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import cors from "cors";

dotenv.config();

const app = express();
import authRoutes from "./Routes/authRoutes.js";
import crimeRecordsRoute from "./Routes/crimeRecordsRoute.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDb;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

app.use("/api/auth", authRoutes);
app.use("/api/records",crimeRecordsRoute)

const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

startServer();