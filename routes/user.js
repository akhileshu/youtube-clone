import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unsubscirbe, update } from "../controllers/user.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();


router
  .put("/:id",verifyToken, update) //update user
  .delete("/:id",verifyToken, deleteUser) //update user
  .get("/find/:id", getUser) //useful when want to get channel details
  .put("/sub/:id",verifyToken, subscribe) //update user
  .put("/unsub/:id",verifyToken, unsubscirbe) //update user
  .put("/like/:videoId",verifyToken, like) //update user
  .put("/dislike/:videoId",verifyToken, dislike); //update user



export default router;
