const router = require("express").Router();

const multer = require("multer");
const upload = require("../middleware/libraries/upload");
const auth = require("./authRoutes");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");

router.use("/auth", auth);

router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError)
      throw new ErrorResponse("The file is not uploaded from library", err);
    else if (err) throw new ErrorResponse("The file is not uploaded", err);
    else
      return new Response(req.savedImages, "File upload is successful").success(
        res
      );
  });
});

module.exports = router;
