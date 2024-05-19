const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connection is successfully");
  } catch (error) {
    console.error("MongoDb connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
