import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router
  .post("/", verifyToken, addComment)
  .delete("/:id", verifyToken, deleteComment)
  .get("/:videoId", getComments);

export default router;
