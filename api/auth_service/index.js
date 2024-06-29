require("express-async-handler");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./src/routes");
const ErrorHandlerMiddleware = require("./src/middleware/ErrorHandler");
require("dotenv").config();
require("./src/connection/connMongo");
const cors = require("cors");
const corsOptions = require("./src/helpers/corsOptions");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
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

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname));

app.use(cors(corsOptions));
// this is protect our api for mongo injection
app.use(mongoSanitize({ replaceWith: "_" }));
// Routes
app.use("/api", router);

// Error Handler Middleware
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
