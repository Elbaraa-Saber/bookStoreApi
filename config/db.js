// Import mongoose
const mongoose = require("mongoose");

function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}

module.exports = { connectDB };

// this is old way of connecting to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.log("Connection failed To MongoDB: ", error));
