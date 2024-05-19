const sendJwtToClient = (user, res, admin) => {
  const token = user.generateJwtFromUser();
  // const {JWT_COOKIE, NODE_ENV} = process.env;
  return res.status(200).json({
    success: true,
    admin,
    access_token: token,
  });
  // .cookie("access_token", token, {
  //    httpOnly: true,
  //    expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
  //    secure: NODE_ENV === "development" ? false : true,
  // })
};
const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
  );
};

const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  return authorization.split(" ")[1];
};
module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
