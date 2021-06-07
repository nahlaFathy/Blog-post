const bcrypt = require('bcrypt')
const Blacklist = require('../helper/TokenBlackList');
const jwt = require('jsonwebtoken');
const Post = require('../Schema/Post');
const mongoose = require('mongoose');



/* #region get all posts */
exports.getPosts = async (req, res) => {

    try {
    
        const posts = await Post.find();
        if (posts) return res.send(posts);
        else return res.status(404).send("something went wrong");
              
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */

/* #region get post by id */
exports.getUserPosts = async (req, res) => {
    // if request path contain variable in query string so it will be logined id 
    //else id will be extracted from login user token 

    const loginedID = (req.params.id != null && req.params.id != undefined) ? req.params.id :req.user._id;
    
    try {
        //check if the id is valid mongoose object id
         var isValid = mongoose.Types.ObjectId.isValid(loginedID);
         if (!isValid) return res.status(401).send("This user id is not valid"); 

        //check if user id is exist in DB
        const posts = await Post.find({ postedBy:loginedID});
        if (!posts) return res.status(404).send("This user has no posts") 
        else return res.send(posts);
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */



/* #region add Post */
exports.addPost = async (req, res) => {

    const loginedID = (req.params.id != null && req.params.id != undefined) ? req.params.id :req.user._id;

    ////// chech if user register before
    let isUser = await User.findById(loginedID)
    if (isUser) return res.status(400).send('This user is not exist')
   
    const newPost=req.body;

    ////// create new user
   
    const post = new Post({
      content: newPost.content,
      postedBy:loginedID,
      comments: [{
        text:(newPost.comments[0] != null && newPost.comments[0] != undefined) ? newPost.comments[0].text :null,
        postedBy:(newPost.comments[0] != null && newPost.comments[0] != undefined) ? loginedID :null
    }]

    });

    ///// save new post
    try {
      await post.save();
      return res.send({ message: 'new post added successfully' })
    }
    catch (err) {
      res.send({ error: err })
    }
   
}
/* #endregion */


/* #region add Comment by post id*/
exports.addComment = async (req, res) => {

    const loginedID =req.user._id;
    const postID=req.params.id;

     ////// chech if post is exist
     let post = await Post.findById(postID)
     if (!post) return res.status(400).send('This post is not exist')

   
    const newComment=req.body;

    ////// create new comment
   
    const comment = {
        text:newComment.content,
        postedBy:loginedID
    }

    ///// save new post
    try {
      post.comments.push(comment)
      await post.save();
      return res.status(200).send({ message: 'new comment added successfully' })
    }
    catch (err) {
      res.send({ error: err })
    }
   
}
/* #endregion */
