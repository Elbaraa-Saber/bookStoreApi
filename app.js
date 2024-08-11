const express = require("express");
// Improt middlwares
const Logger = require("./middlewares/Logger");
const { notFound, errorHandler } = require("./middlewares/errors");

require("dotenv").config();
const { connectDB } = require("./config/db");

// Connect to MongoDB
connectDB();
// init express app
const app = express();

// Apply middleware to parse JSON request bodies
app.use(express.json());
app.use(Logger); // Apply Logger middleware

// routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Error handling middleware
app.use(notFound); // Apply notFound middleware
app.use(errorHandler); // Apply errorHandler middleware

// Running the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
