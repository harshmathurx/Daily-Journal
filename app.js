//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
var lodash = require('lodash');
const homeStartingContent = "These are just blogs, for fun";
const aboutContent = "Hey everyone, My name is Harsh Mathur and I'm a fullstack web developer. I work on the MERN stack.";
const contactContent = "Use any one of the links below or just drop an email";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://harshmathurx:Utorrent@123@cluster0.1qbpu.mongodb.net/blogsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const blogsSchema = {title: String, content: String,route:String};
const Blog = mongoose.model("Blog", blogsSchema);

app.get("/",function(req,res){
  Blog.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    if(foundItems.length == 0){
      console.log("We Might have a problem");
      res.render("home",{startingContent:homeStartingContent,blogs:[]})
    }
    else{
      res.render("home",{startingContent:homeStartingContent,blogs:foundItems})
    }
  });
 
});

app.get("/about",function(req,res){
  res.render("about",{startingContent:aboutContent});
})

app.get("/contact",function(req,res){
  res.render("contact",{startingContent:contactContent});
})

app.get("/compose",function(req,res){
  res.render("compose");
});
  
app.post("/compose",function(req,res){
    const title = req.body.blogTitle;
    const content = req.body.blogBody;
    const route = lodash.kebabCase(title);
    const newBlog = new Blog({title:title,content:content,route:route});
    newBlog.save();

  res.redirect("/");
});

app.get("/posts/:name",function(req,res){
  const requestedTitle = req.params.name;
  console.log(requestedTitle);

  Blog.findOne({route:requestedTitle},function(err,foundList){
    if(!err){
      if(!foundList){
       //Render not found
       console.log("not found");
      }
      else{
        res.render("post",{title:foundList.title,content:foundList.content})
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
