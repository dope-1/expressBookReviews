const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   const getBooks = () => {
        return new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve(books);
   }),1000});
        };
    
    getBooks().then((books) => {
        res.json(books);
    }).catch((err) =>{
      res.status(500).json({error: "An error occured"});
    });


});

// Get book details based on ISBN

const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

public_users.get('/isbn/:isbn',function (req, res) {
     getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let new_books = {}
  const new_author = req.params.author;
  let i=1;
  for(let bookid in books){
      if(books[bookid].author === new_author ){
        new_books[i++] = books[bookid];
      }
    }
 await res.send(JSON.stringify(new_books))
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
   let new_books = {}
  const re_title = req.params.title;
  let i = 1;
  for(bookid in books){
      if(books[bookid].title === re_title ){
        new_books[i++] = books[bookid]
      }
  }
  await res.send(JSON.stringify(new_books))

 
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    await res.send(JSON.stringify(books[isbn].reviews),null,4);
 
});

module.exports.general = public_users;
