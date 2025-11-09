const jwt = require('jsonwebtoken');
const {  APIError , asyncHandler } = require('../util/errorHandler');
const logger  = require('../util/logger');
const RefreshToken = require('../model/RefreshToken');
const authMiddleware = asyncHandler(async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) throw new APIError(401, "Please log in to continue");

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      
      const userTokens = await RefreshToken.findOne({ authToken: token });
      if (!userTokens) throw new APIError(403, "No refresh token found");

      const refreshUser = jwt.verify(userTokens.refreshToken, process.env.JWT_SECRET);

      if (refreshUser._id.toString() !== userTokens.userId.toString()) {
        throw new APIError(403, "Invalid refresh token");
      }


      const newToken = jwt.sign({
        _id: refreshUser._id,
        username: refreshUser.username,
        email:refreshUser.email
      }, process.env.JWT_SECRET, { expiresIn: "1h" });

      userTokens.authToken = newToken;
      await userTokens.save();

      res.cookie("token", newToken, {
        maxAge: 1.5 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: true
      });

      user = refreshUser;
    } else {
      throw new APIError(403, "Invalid token");
    }
  }

  logger.info({
    message: "token checked",
    visitedURL: req.url,
    userID: user._id,
    username: user.username
  });

  req.user = user;
  next();
});


module.exports = { authMiddleware };