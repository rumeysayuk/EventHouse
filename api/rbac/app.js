const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const recordsRoutes = require("./routes/records");
const authController = require("./controllers/authController");
const recordsController = require("./controllers/recordsController");
const rbacMiddleware = require("./middleware/rbacMiddleware");

// Configure middleware
app.use(bodyParser.json());

// Define routes
app.use("/auth", authRoutes);
app.use("/records", rbacMiddleware.checkRole("user"), recordsRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
