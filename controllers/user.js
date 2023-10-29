import { createError } from "../middlewares/errorHandling.js";
import User from "../models/user.js";
import Video from "../models/video.js";

export const update = async (req, res, next) => {
  if (req.params.id == req.user.id) {
    //can cause confisuion
    try {
      const update = {
        $set: req.body,
      };
      const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      const obj = { message: "User has been deleted." };
      res.status(200).json(obj);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    const idToSubscribe = req.params.id;
    const updateSelf = {
      $addToSet: { subscribedUsers: idToSubscribe },
    };
    const updateCreator = {
      $inc: { subscribers: 1 },
    };
    await User.findByIdAndUpdate(req.user.id, updateSelf);
    await User.findByIdAndUpdate(idToSubscribe, updateCreator);
    const obj = { message: "subscribed successfully" };
    res.status(200).json(obj); //default status:200
  } catch (error) {
    next(error);
  }
};
export const unsubscirbe = async (req, res, next) => {
  try {
    const idToUnsubscirbe = req.params.id;
    const updateSelf = {
      $pull: { subscribedUsers: idToUnsubscirbe },
    };
    const updateCreator = {
      $inc: { subscribers: -1 },
    };
    await User.findByIdAndUpdate(req.user.id, updateSelf);
    await User.findByIdAndUpdate(idToUnsubscirbe, updateCreator);
    const obj = { message: "unsubscribed successfully" };
    res.status(200).json(obj); //default status:200
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  // for like dislike we get videoId in req.parms.videoId && fields in model are string[]
  try {
    const id = req.user.id;
    const update = { $addToSet: { likes: id }, $pull: { dislikes: id } };
    await Video.findOneAndUpdate(req.params.id, update);
    const obj = { message: "you liked the video" };
    res.status(200).json(obj)
  } catch (error) {
    next(error);
  }
};
export const dislike = async (req, res, next) => {
  try {
    const id = req.user.id;
    const update = { $addToSet: { dislikes: id }, $pull: { likes: id } };
    await Video.findOneAndUpdate(req.params.id, update);
    const obj = { message: "you disliked the video" };
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
}; /*
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}
export const update=async(req,res,next)=>{

}

*/
