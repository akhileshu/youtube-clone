import { createError } from "../middlewares/errorHandling.js";
import Video from "../models/video.js";
import User from "../models/user.js";

export const addVideo = async (req, res, next) => {
  try {
    const data = { userId: req.user.id, ...req.body };

    const addedVideo = await Video.create(data);
    res.status(200).json(addedVideo);
  } catch (error) {
    next(error);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const update = { $set: req.body };
    const options = { new: true };
    const videoFound = await Video.findById(req.params.id);
    if (!videoFound) return next(createError(404, "video not found"));
    const eligigleToUpdate = req.user.id === videoFound.userId;
    if (eligigleToUpdate) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        update,
        options
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "you can update only your videos"));
    }
  } catch (error) {
    next(error);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const videoFound = await Video.findById(req.params.id);
    if (!videoFound) return next(createError(404, "video not found"));
    const eligigleToDelete = req.user.id === videoFound.userId;
    if (eligigleToDelete) {
      await Video.findByIdAndDelete(req.params.id);
      const obj = { message: "the video has been deleted" };
      res.status(200).json(obj);
    } else {
      return next(createError(403, "you can update only your videos"));
    }
  } catch (error) {
    next(error);
  }
};
export const addView = async (req, res, next) => {
  try {
    const update = { $inc: { views: 1 } };
    await Video.findByIdAndUpdate(req.params.id, update);
    const obj = { message: "the view has been increased" };
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
};
export const getByTag = async (req, res, next) => {
  try {
    // change: now in query string we get words seperated by ","

    let inputTags = req.query.tags.split(",");
    // inputTags = JSON.parse(inputTags);
    // console.log(tags); //['js','c  '  ,'py'] currently its unable to process symbols
    // for this we will do const url = `http://example.com/api/endpoint?items=${encodeURIComponent(stringifiedArray)}`;
    // stringify the array in client and parse it to use
    const filter = {
      tags: { $in: inputTags },
    };
    // both tags and inputTags are arrays, and you're querying documents where the tags array contains at least one value that matches any value in the inputTags array.
    const videosLimit = 20;
    const videos = await Video.find(filter).limit(videosLimit);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};
export const random = async (req, res, next) => {
  try {
    const videosCount = 40;
    const pipeline = [
      { $sample: { size: videosCount } }, // Select random documents
    ];
    const videos = await Video.aggregate(pipeline);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    // if any part of video's title matches query sting
   const filter = {
     $or: [
       {
         title: {
           $regex: query,
           $options: "i",
         },
       },
       {
         desc: {
           $regex: query,
           $options: "i",
         },
       },
     ],
   };

    const videosCount = 40;
    const videos = await Video.find(filter).limit(videosCount);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const sub = async (req, res, next) => {
  try {
    // in user schema there is subscribedUsers[] containing multiple ids

    // we need to find all videos of subscribedUserIds
    // where subscriedUserId is a UserId field in Video schema

    // const list = Promise.all(
    //   subscribedUserIds.map((userId) => {
    //     return Video.find({ userId });
    //   })
    // );
    // above code works but lets do it in  a efficient way

    // we use the $in operator to query for videos with userId values that match any of the values in the subscribedUserIds array.
    // sort all videos- descending by created date - latest by created date
    // we can also do videos.sort((a, b) => b.createdAt - a.createdAt);
    const { subscribedUsers: subscribedUserIds } = await User.findById(
      req.user.id
    );
    const filter = { userId: { $in: subscribedUserIds } };
    const condition = { createdAt: -1 };
    const videosCount = 40;
    const videos = await Video.find(filter).limit(videosCount).sort(condition);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const fetchOwnVideos = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    const condition = { createdAt: -1 };
    const videosCount = 40;
    const videos = await Video.find(filter).limit(videosCount).sort(condition);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const getNoOfVideos = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    const videos = await Video.find(filter)
    res.status(200).json(videos.length);
  } catch (error) {
    next(error);
  }
};
export const trend = async (req, res, next) => {
  try {
    const condition = {
      views: -1,
    };
    const videosCount = 40;
    const videos = await Video.find().sort(condition).limit(videosCount);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
