const mongoose = require("mongoose");
require("dotenv").config({ path: "../config/.env" });

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/eventhouse"
    );
    console.log("Mongodb connection is successfully");
  } catch (error) {
    console.error("MongoDb connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
