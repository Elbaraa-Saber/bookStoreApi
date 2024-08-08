const express = require("express");
// Import routes
const bookPath = require("./routes/books");
const authorPath = require("./routes/authors");
// Import mongoose
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/bookStoreDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Connection failed To MongoDB: ", error));

// init express app
const app = express();

// Apply middleware to parse JSON request bodies
app.use(express.json());

// Define routes
app.use("/api/books", bookPath);
app.use("/api/authors", authorPath);

// Running the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
