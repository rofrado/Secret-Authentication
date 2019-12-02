//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser =  require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose =  require("mongoose");
const encrypt =  require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/userDB",{ useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);




app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req, res){
 let newUsername =  new User({
   email: req.body.username,
   password: req.body.password
 });

 newUsername.save(function(err){
   if(!err){
     res.render("secrets");
   }
   else{
     console.log(err);
   }
 });
});

app.post("/login", function(req, res){

  let username = req.body.username;
  let password = req.body.password;

  User.findOne({email:username}, function(err, usernameFound){
    if(usernameFound.password === password){
      console.log(usernameFound.password);
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});





app.listen(3000,function(){
  console.log("listening port 3000");
});
