import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  fetchOwnVideos,
  getByTag,
  getNoOfVideos,
  getVideo,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//create a video
router
  .post("/", verifyToken, addVideo)
  .put("/:id", verifyToken, updateVideo)
  .delete("/:id", verifyToken, deleteVideo)
  .get("/sub", verifyToken, sub)
  .get("/own", verifyToken, fetchOwnVideos)
  .get("/noOfVideos", verifyToken, getNoOfVideos)
  .get("/find/:id", getVideo)
  .put("/view/:id", addView)
  .get("/trend", trend)
  .get("/random", random)
  .get("/tags", getByTag)
  .get("/search", search);

export default router;
