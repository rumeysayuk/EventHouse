const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "get is success",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server running port on ${process.env.PORT}`);
});
