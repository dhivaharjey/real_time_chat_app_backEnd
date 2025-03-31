import User from "../model/userSchema.js";
// import { uploadImage } from "../Utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/generateToken.js";
import { inputValidation } from "../validation/inputValidation.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
  // path: "/",
};

export const googleOauthUser = async (req, res) => {
  try {
    const { email, userName, profileImage, provider, providerId } = req.body;
    // console.log(req.body);

    let user = await User.findOne({ email });

    if (user) {
      // User exists but was created using email/password, update OAuth details
      if (!user.providerId) {
        user.provider = provider;
        user.providerId = providerId;
        user.profileImage = user?.profileImage || profileImage;
        await user.save();
      }
    } else {
      // Create a new user ONLY if it does not exist
      user = await User.create({
        userName,
        email,
        profileImage,
        provider,
        providerId,
      });
    }
    if (String(user?.providerId) === String(providerId)) {
      const accessToken = generateAccessToken(user?._id);
      const refreshToken = generateRefreshToken(user?._id);

      user.refreshToken = refreshToken;
      await user.save();

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie("refreshToken", refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        })
        .json({
          message: "LoggedIn successfully",
          user: user,
        });
    }
    // console.log(user, "new");
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};
export const signUp = async (req, res) => {
  try {
    // console.log(req.body);

    const { userName, email, password, confirmPassword, profileImage } =
      inputValidation(req.body);
    // console.log(userName, email, password, "after");

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser?.email && existingUser?.provider === "google") {
      return res.status(409).json({
        message:
          "An account with this email already exists. Please use Google login or create a new account with a different email.",
      });
    }
    if (existingUser?.email === email) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    if (existingUser?.userName === userName) {
      return res.status(409).json({
        message: "This username is already taken. Please choose another one",
      });
    }

    const newUser = new User({
      userName,
      email,
      password,
      profileImage,
    });
    await newUser.save();
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res
      .status(201)
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      })
      .json({
        message: "Account created successfully",
        user: newUser,
      });
  } catch (error) {
    console.log("signUp error", error);

    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = inputValidation(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Invalid Email " });
    }
    if (user?.provider === "google") {
      return res.status(409).json({
        message: "Login with google, you're already used google login",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(409).json({ message: "Invalid Password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      })
      .json({
        message: "Logged in successfully",
        user: user,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({
        message: "Session already expired",
      });
    }

    user.refreshToken = null;
    await user.save();

    return res
      .status(200)
      .clearCookie("accessToken", COOKIE_OPTIONS)
      .clearCookie("refreshToken", COOKIE_OPTIONS)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    // console.log(req.body);

    const { profileImage } = req.body;
    const userId = req.user?._id;
    if (!profileImage) {
      return res
        .status(400)
        .json({ message: "Please provide a profile picture" });
    }
    // const imageUrl = await uploadImage(profilePic);
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { profileImage: profileImage },
    //   { new: true }
    // );
    const user = await User.findById({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profileImage = profileImage;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profileImage = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile Image deleted successfully", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};
