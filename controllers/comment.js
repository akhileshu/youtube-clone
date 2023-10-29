import { createError } from "../middlewares/errorHandling.js";
import Comment from "../models/comment.js";

export const addComment = async (req, res, next) => {
  // first create and then save is better approach ,but for now we are doing in single step
  // However, in more complex scenarios or when you need to enforce specific data constraints, it's beneficial to separate the creation and saving steps. This allows you to have more control over the data and perform additional checks or processing before saving it to the database.
  try {
    const data = { userId: req.user.id, ...req.body };
    const addedComment = await Comment.create(data);
    res.status(200).json(addedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const commentFound = await Comment.findById(req.params.id);
    const videoFound = await Comment.findById(commentFound.videoId);
    const eligigleToDelete =
      commentFound.userId === req.user.id || videoFound.userId === req.user.id;
    if (eligigleToDelete) {
      await Comment.findByIdAndDelete(req.params.id);
      const obj = { message: "comment deleted successfully" };
      res.status(200).json(obj);
    } else return next(createError(403, "you can delete only your comment"));
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  try {
    const filter = { videoId: req.params.videoId };
    const commentsCount = 40;
    const sortOption = { createdAt: -1 };
    const comments = await Comment.find(filter)
      .limit(commentsCount)
      .sort(sortOption);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
