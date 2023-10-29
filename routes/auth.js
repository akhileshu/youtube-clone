import express from "express";
// login signup
import {  checkUser, logout, signin, signup } from "../controllers/auth.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//CREATE A USER
router
  .post("/signup", signup) //register
  .post("/signin", signin) //login
  .get("/check", verifyToken, checkUser) //login
  .get("/logout", verifyToken, logout);//login
//   .post("/google", googleAuth);



export default router;
