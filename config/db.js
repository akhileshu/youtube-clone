import mongoose from "mongoose";


mongoose
  .connect("mongodb://127.0.0.1:27017/youtube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    throw err;
  });

