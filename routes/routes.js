import express from "express";
import Controller from "../Controller/Controller.js";
import {
    isValid
} from "../middlewares/middlewareValidUser.js";
import {
    testMiddleware
} from "../middlewares/testMiddleware.js";

const router = express.Router();

router.get("/", Controller.getSignIn);
router.get("/dashboard", isValid, Controller.getDashboard);
router.get("/sign_up", Controller.getSignUp);
router.post("/sign_up", Controller.postSignUp);
router.get("/sign_in", Controller.getSignIn);
router.post("/sign_in", Controller.postSignIn);
router.post("/logout", Controller.logout);

export default router;