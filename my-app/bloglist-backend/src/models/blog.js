const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

const url = config.MONGODB_URI; // needs to be configured in .env file

logger.info("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

const blogSchema = new mongoose.Schema({
  title: { type: String },
  author: String,
  url: { type: String },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
