const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    let validUser = users.filter((user) => {
        return (user.username === username)
    })

    if (validUser.length > 0) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password) => { 
    let authUser = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    if (authUser.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" })
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        },  "access", { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User logged in successfully")
    } else {
        return res.status(208).json({ message: "Invalid login. Check username and password" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn_num = req.params.isbn
    const user_review = req.body.review
    let book = books[isbn_num]
    const user = req.session.authorization.username

    if (isbn_num > 0 && isbn_num < 13) {
        if (book.reviews.hasOwnProperty(user)) {
            book.reviews[user] = user_review
        } else {
            book.reviews = { 
                ...book.reviews,
                [user]: user_review
            }
        }
        return res.status(200).json({message:"Review added successfully"})()
    } else {
        return res.status(404).json({message: "Invalid ISBN number"});
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn_num = req.params.isbn
    let book = books[isbn_num]
    const user = req.session.authorization.username

    if (user) {
        if (isbn_num > 0 && isbn_num < 13) {
            if (book.reviews[user]) {
                delete book.reviews[user]
                return res.status(200).json({message:"Review deleted successfully"})
            } else {
                return res.status(404).json({message:"There are no reviews for user:" + user})
            }
        } else {
            return res.status(404).json({message: "Invalid ISBN number"});
        }
    } else {
        return res.status(404).json({message: "User undefined"})
    }
    });
    
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
