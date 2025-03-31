const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    // if user is already registered, show error
    let user_exists = false
    users.filter(user => {
        if (user.username === username) {
            user_exists = true
        }
    })
    if (user_exists) {
        res.send("A user with this username already exists")
    } else {
        // register user
        new_user = {
            "username": username,
            "password": password
        }
        users.push(new_user)
        res.send(`User "${username}" successfully registered`)
    }
  } else {
    res.send("Please provide a valid username and/or password")
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn_number = req.params.isbn
  const isbn_book = books[isbn_number]
  res.send(JSON.stringify(isbn_book,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_param = req.params.author
  const books_array = Object.keys(books)
  let return_book = {}
  books_array.forEach(book_id => {
    if (books[book_id].author === author_param) {
        return_book = books[book_id]
    }
})
  res.send(JSON.stringify(return_book,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title_param = req.params.title
    const books_array = Object.keys(books)
    let return_book = {}
    books_array.forEach(book_id => {
      if (books[book_id].title === title_param) {
          return_book = books[book_id]
      }
  })
    res.send(JSON.stringify(return_book,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn_number = req.params.isbn
  res.send(JSON.stringify(books[isbn_number].reviews,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
