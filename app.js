const express = require("express");
// Improt middlwares
const Logger = require("./middlewares/Logger");
const { notFound, errorHandler } = require("./middlewares/errors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const path = require("path");
const helmet = require('helmet');
const cors = require('cors');
// Connect to MongoDB
connectDB();
// init express app
const app = express();

// Static Folder
app.use(express.static(path.join(__dirname, "images")));

// Apply middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // this middleware will be applied to take req from view html
app.use(Logger); // Apply Logger middleware

// helmet middleware to do backend is more security sensitive
app.use(helmet());
app.use(cors());
// Set up EJS as view engine for rendering HTML templates
app.set("view engine", "ejs");

// routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

// Error handling middleware
app.use(notFound); // Apply notFound middleware
app.use(errorHandler); // Apply errorHandler middleware

// Running the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
