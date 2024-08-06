const express = require("express");

// Import routes
const bookPath = require("./routes/books");

// init express app
const app = express();

// Apply middleware to parse JSON request bodies
app.use(express.json());

// Define routes
app.use("/api/books", bookPath);


// Running the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
