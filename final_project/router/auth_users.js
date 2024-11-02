const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let filtered_users = users.filter((user)=> user.username === username);
if(filtered_users){
    return true;
}
return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
if(isValid(username)){
    let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
    if(filtered_users){
        return true;
    }
    return false;
   
}
return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({message: "Invalid username or password"});
  }

});

  //deleting a review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
    }
    else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
  });
  



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
        //Write your code here
        let userd = req.session.username;
        let ISBN = req.params.isbn;
        let details = req.query.review;
        let rev = {user:userd,review:details}
        books[ISBN].reviews = rev;
        return res.status(201).json({message:"Review added successfully"})
        
 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
