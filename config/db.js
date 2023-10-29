import mongoose from "mongoose";

// "mongodb://127.0.0.1:27017/youtube"
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    throw err;
  });


