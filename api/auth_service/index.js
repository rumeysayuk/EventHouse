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
const limitter = require("./src/middleware/rateLimit");
const expressWinston = require("express-winston");
const logger = require("./src/utils/logger");

require("moment-timezone").tz.setDefault("Europe/Istanbul");
const app = express();
const port = process.env.PORT || 5000;
app.use(expressWinston.logger({ winstonInstance: logger, statusLevels: true })); //logging operations

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
app.use("/api", limitter); // Rate limiter middleware
app.use("/api", router);

// Error Handler Middleware
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
