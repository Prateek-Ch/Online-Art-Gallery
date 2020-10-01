var express = require('express');
var blog = express.Router();

var Post = require('../models/blogs');

// TO GET About PAGE (this or app)
blog.get("/", function(req, res){
  Post.find({}, function(err, posts){
    var chunks = []
    for(var i =0; i<posts.length;i+=3){
      chunks.push(posts.slice(i,i+3));
    }
    res.render("Blog", { posts: chunks });
  });
});


blog.get('/compose', function(req,res){
  if(!req.isAuthenticated()){
    return res.redirect('/user/signin');
  }
  res.render('Compose')
});

blog.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
    else{
      console.log(err);
    }
  });
});

blog.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

module.exports = blog;
