import express from "express";
import { authentication } from "../middleware/authentication.js";
import {
  deleteProfilePic,
  googleOauthUser,
  login,
  logout,
  signUp,
  updateProfilePic,
} from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/login").post(login);
authRouter.route("/oauth-login").post(googleOauthUser);
authRouter.route("/logout").post(logout);
authRouter.route("/check-auth").get(authentication, (req, res) => {
  return res.status(200).json({ message: "Authenticated", user: req.user });
});
authRouter
  .route("/profile")
  .patch(authentication, updateProfilePic)
  .delete(authentication, deleteProfilePic);

export default authRouter;
