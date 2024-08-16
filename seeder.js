// we will use this fill for adding all data at once to data server in mongoDB
const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { books, authors } = require("./data");
const {connectDB} = require("./config/db");
require("dotenv").config();

connectDB();

// import books
const importBooks = async () => {
  try {
    // insertMany is a method in Mongoose to insert arr
    await Book.insertMany(books);
    console.log("Books imported successfully");
  } catch (error) {
    console.log(error);
    // process.exit(1) will stop connection to database
    process.exit(1);
  }
};

// import Authors
const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors imported successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Remove books
const removeBooks = async () => {
  try {
    // deleteMany is a method in Mongoose to delete all data
    await Book.deleteMany();
    console.log("Books removed successfully");
  } catch (error) {
    console.log(error);
    // process.exit(1) will stop connection to database
    process.exit(1);
  }
};

// process is async function to handle command line arguments, argv is an array of command line arguments from Node.js
// node seeder -import
// argv[0] = node
// argv[1] = seeder
// argv[2] = -import
if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
}