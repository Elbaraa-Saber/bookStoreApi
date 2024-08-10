const express = require("express");
// Import mongoose
const mongoose = require("mongoose");
// Import routes
const bookPath = require("./routes/books");
const authorPath = require("./routes/authors");
// Improt middlwares
const Logger = require("./middlewares/Logger");
const { notFound, errorHandler } = require("./middlewares/errors");

const dotenv = require("dotenv");
// without config dotnev will not work
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Connection failed To MongoDB: ", error));

// init express app
const app = express();

// Apply middleware to parse JSON request bodies
app.use(express.json());
app.use(Logger); // Apply Logger middleware

// routes
app.use("/api/books", bookPath);
app.use("/api/authors", authorPath);

// Error handling middleware
app.use(notFound); // Apply notFound middleware
app.use(errorHandler); // Apply errorHandler middleware

// Running the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));


