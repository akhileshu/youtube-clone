import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { createError } from "../middlewares/errorHandling.js";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    // name,email both should be unique
    const findWithName = await User.findOne({ name: req.body.name });
    if (findWithName)
      next(
        createError(
          409,
          "UserName  is already in use. Please choose a different one."
        )
      );
    const findWithEmail = await User.findOne({ email: req.body.email });
    if (findWithEmail)
      next(
        createError(
          409,
          "Email address is already in use. Please choose a different one."
        )
      );
    const newUser = await User.create({ ...req.body, password: hash });
    const obj = { message: "your account has been created!" };
    res.status(200).json(obj);
  } catch (err) {
    console.log(17, err.message);
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(password, user.password); //it returns a promise so use await even on warning

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password: pw, ...others } = user._doc; //todo:fix

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
export const checkUser = async (req, res, next) => {
  try {
    // i am applying verify token middleware so if there is logged in user we simply send it in res
    const user = await User.findById(req.user.id);
    if (user) res.json(user);
    else next(createError(401, "user not authenticated"));
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { expires: new Date(0) });

    res.json({ message: "user logged out successfully" });
  } catch (err) {
    next(err);
  }
};
