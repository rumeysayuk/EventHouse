const express = require("express");
require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./helpers/connection/conn_mongo");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routes");
const authRoutes = require("./routes/authRoutes");
const app = express();

connectDB();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/api", routers);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port => ${PORT}`);
});
