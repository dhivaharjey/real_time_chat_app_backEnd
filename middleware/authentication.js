import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/generateToken.js";
import User from "../model/userSchema.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  // path: "/",
};

async function authentication(req, res, next) {
  try {
    // console.log(req.cookies);

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    // console.log(accessToken, refreshToken);

    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({ message: "Access Denied: No token  " });
      } else {
        return await refreshAccessToken(req, res, next);
      }
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (refreshToken) {
            console.log("Access token expired, attempting refresh...");
            return await refreshAccessToken(req, res, next);
          } else {
            return res
              .status(401)
              .json({ message: "Access Denied: No  token provided" });
          }
        }

        const user = await User.findById(decoded?.id);

        // req.user = { id: user?._id };
        req.user = user.toJSON();
        // console.log(req.user);

        next();
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
}

async function refreshAccessToken(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Access Denied: No  refresh token " });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (refreshErr, refreshDecoded) => {
      if (refreshErr) {
        return res
          .status(401)
          .json({ message: "Access Denied: No  refresh token " });
      }
      const user = await User.findOne({
        _id: refreshDecoded?.id,
        refreshToken,
      });
      if (!user) {
        return res
          .status(403)
          .json({ message: "Session expired, please login again." });
      }
      const newRefreshToken = generateRefreshToken(user?._id);
      const newAccessToken = generateAccessToken(user?._id);

      user.refreshToken = newRefreshToken;
      // user.markModified("refreshToken");
      await user.save();

      res
        .status(200)
        .cookie("accessToken", newAccessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 2 * 24 * 60 * 60 * 1000,
        });
      // .json({ message: "Token refreshed" });
      req.user = user.toJSON();
      next();
    }
  );
}

export { authentication };
