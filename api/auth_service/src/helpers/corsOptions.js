const whiteList = ["http://localhost:3000"];

const corsOptions = (req, cb) => {
  let corsOpts;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOpts = { origin: true };
  } else {
    corsOpts = { origin: false };
  }

  cb(null, corsOpts);
};

module.exports = corsOptions;
