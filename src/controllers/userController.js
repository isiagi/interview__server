import User from "../models/userModel";
import sendEmail from "../util/nodemailer";
import crypto from "crypto";

const userController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    return signToken(res, 200, user);
  },

  register: async (req, res) => {
    const { username, password, email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    try {
      const newUser = await User.create({
        username: username,
        password: password,
        email: email,
      });
      return signToken(res, 200, newUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    try {
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const resetToken = await user.getResetToken();

      await user.save();

      //create reset url url
      const resetUrl = `http://localhost:5173/passwordreset/${resetToken}`;

      //html message: "Reset token"
      const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

      const options = {
        email: email,
        subject: "Forgot Password",
        text: message,
      };

      try {
        await sendEmail(options);
        res.status(200).json({ success: true, data: "Email sent" });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  },

  resetPassword: async (req, res, next) => {
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    try {
      const user = await User.findOne({
        passwordResetToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ error: "user does not exist" });
      }
      user.password = req.body.password;
      user.resetPasswordExpire = undefined;
      user.passwordResetToken = undefined;

      await user.save();

      res.status(201).json({
        suceess: true,
        data: "Password Updated Success",
        token: await user.getSignedJwtToken(),
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

const signToken = async function (res, status, user) {
  const token = await user.getSignedJwtToken();

  var date = new Date();
  const cookieOptions = {
    maxAge: date.setTime(date.getTime() + 5 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // only for SSL in production

  await res.cookie("jwt", token, cookieOptions);

  return res.status(status).json({ message: "success", token });
};

export default userController;
