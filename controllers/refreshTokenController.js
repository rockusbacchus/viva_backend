const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("no secure cookie found");
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;

  console.log(`refresh token: ${refreshToken}`);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  const gbUser = await User.findOne({ email: "gbacchus@123.com" });
  console.log(
    `refresh token in db (${gbUser.refreshToken.length}): ${gbUser.refreshToken}`
  );

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    console.log("potential reuse detected");
    return res.sendStatus(403);
  }

  // // Detected refresh token reuse if !foundUser
  // if (!foundUser) {
  //   console.log("Token reuse detected!");
  //   jwt.verify(
  //     refreshToken,
  //     process.env.REFRESH_TOKEN_SECRET,
  //     async (err, decoded) => {
  //       if (err) return res.sendStatus(403);
  //       const hackedUser = await User.findOne({
  //         email: decoded.email,
  //       }).exec();
  //       hackedUser.refreshToken = [];
  //       console.log("saving hacked user with empty refresh token array.");
  //       const result = await hackedUser.save();
  //     }
  //   );
  //   return res.sendStatus(403); // Forbidden
  // }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      // Refresh token was still valid
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: decoded.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email, roles: roles },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Saving refresh token with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      console.log(`new refresh token: ${newRefreshToken}`);

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
