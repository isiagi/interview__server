import express from "express";

import Protect from '../middleware/auth'

import UserRouter from "../controllers/userController";
import PercelRouter from "../controllers/percelController";

const router = express.Router();

router.route("/register").post(UserRouter.register);

router.route("/login").post(UserRouter.login);

router.route("/forgotPassword").post(UserRouter.forgotPassword);
router.route("/passwordreset/:resetToken").post(UserRouter.resetPassword);

router.route("/percel/all").get(Protect, PercelRouter.getAll);
router.route("/percel/create").post(Protect, PercelRouter.postProduct);
router.route("/percel/:id").delete(Protect, PercelRouter.deleteProduct);

export default router;
