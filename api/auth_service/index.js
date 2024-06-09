require("express-async-handler");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./src/routes");
const ErrorHandlerMiddleware = require("./src/middleware/ErrorHandler");
require("dotenv").config();
require("./src/connection/connMongo");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json({ limit: 50 }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);

// Routes
app.use("/api", router);

// Error Handler Middleware
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
