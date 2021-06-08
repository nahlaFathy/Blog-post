
const User = require('../Schema/User');
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
exports.getPostById = async (req, res) => {

      const postID=req.params.id;
    try {
     //check if the id is valid mongoose object id
     var isValid = mongoose.Types.ObjectId.isValid( postID);
     if (!isValid) return res.status(400).send("This  id is not valid"); 

        const post = await Post.findById(postID);
        if (post) return res.send(post);
        else return res.status(404).send("something went wrong");
              
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */

/* #region get user posts  */
exports.getUserPosts = async (req, res) => {
    // if request path contain variable in query string so it will be logined id 
    //else id will be extracted from login user token 

    const loginedID = (req.params.id != null && req.params.id != undefined) ? req.params.id :req.user._id;
       console.log(loginedID)
    try {
        //check if the id is valid mongoose object id
         var isValid = mongoose.Types.ObjectId.isValid(loginedID);
         if (!isValid) return res.status(400).send("This user id is not valid"); 

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
   
    const loginedID =req.user._id;
 
    ////// chech if user exist
    let isUser = await User.findById(loginedID)
    if (!isUser) return res.status(404).send('This user is not exist')
   
    const newPost=req.body;

    ////// create new post
   
    const post = new Post({
      content: newPost.content,
      postedBy:loginedID
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
        text:newComment.text,
        commentedBy:loginedID
    }

    ///// save new comment
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

/* #region update post  by id*/
exports.updatePost = async (req, res) => {

    const loginedID = req.user._id;
    const postID=req.params.id;
     
    //check if the id is valid mongoose object id
    var isValid = mongoose.Types.ObjectId.isValid(postID);
    if (!isValid) return res.status(400).send("This user id is not valid"); 

    //check if post exist
    let post = await Post.find({_id:postID,postedBy:loginedID});
    if(post.length==0) return res.send({ message: 'This post id is not exist in your profile' })

    const updatedPost = req.body;
     
    let updates = {
      content: (updatedPost.content != "" && updatedPost.content != null) ?updatedPost.content : post.content,
      postedBy:post.postedBy
    }
    try{
        post = await Post.findByIdAndUpdate(postID, updates, {
            new: true
          });
        if (post)
            return res.send({ message: 'Your post was edited successfully', post: post })
    }
    catch(err)
    {
        return res.send(err);
    }
    
}
/* #endregion */

/* #region get comments for a post by post id */
exports.getComments = async (req, res) => {

    const postID=req.params.id;

     //check if the id is valid mongoose object id
     var isValid = mongoose.Types.ObjectId.isValid(postID);
     if (!isValid) return res.status(400).send("This post id is not valid"); 
      
    try{
        let post = await Post.findById(postID);
        if(!post) return res.send({ message: 'This post  is not exist ' })


         return res.send({ message: 'Post comments', comments: post.comments })
    }
    catch(err)
    {
        return res.send(err);
    }
    
}
/* #endregion */

/* #region update comment by post id and comment id */
exports.updateComment = async (req, res) => {

    const loginedID = req.user._id;
    const postID=req.params.postid;
    const commentID=req.params.commentid;
     

    //check if the id is valid mongoose object id
    var isValid = mongoose.Types.ObjectId.isValid(postID);
    if (!isValid) return res.status(400).send("This post id is not valid"); 
    isValid = mongoose.Types.ObjectId.isValid(commentID);
    if (!isValid) return res.status(400).send("This comment id is not valid"); 

    let comment = await Post.find({_id:postID,"comments._id":commentID}, {_id: 0,comments:1, comments: {$elemMatch: {_id:commentID}}});
    if(!comment) return res.send({ message: 'This comment  is not exist' })
    //console.log(comment[0].comments[0]._id)
    comment=comment[0].comments[0]
    
    if(loginedID != comment.commentedBy) return res.send({ message: 'You dont have permission to perform this action' })
    const updatedcomment = req.body;

    try{
        
        comment = await Post.updateOne({_id:postID ,"comments._id":commentID},
            { $set: 
            {
              
                "comments.$.text": (updatedcomment.text!=""&&updatedcomment.text!=null)?updatedcomment.text:comment.text,
                "comments.$.commentedBy":comment.commentedBy
            } }, {
            new: true
          });
        if (comment)
            return res.send({ message: 'Your comment was edited successfully' })
    }
    catch(err)
    {
        return res.send(err);
    }
    
}
/* #endregion */

/* #region delete post*/
exports.DeletePost = async (req, res) => {

    const loginedID =req.user._id;
    const postID=req.params.id;
      
     //check if the id is valid mongoose object id
     var isValid = mongoose.Types.ObjectId.isValid(postID);
     if (!isValid) return res.status(400).send("This post id is not valid"); 

     //check if post exist
    const post = await Post.findById(postID);
    if (!post) return res.status(404).send({ message: "this post is not exist" })

    if(req.user.role=="user"&&post.postedBy!=loginedID) return res.status(401).send({ message: "You don't have enough permission to perform this action" })

    try{
        await Post.deleteOne(post)
        return res.status(200).send({message:"Post deleted successfully"})
    }
    catch(err){
        return res.send(err);
    }
   
}
/* #endregion */



/* #region delete comment in post*/
exports.DeleteComment = async (req, res) => {

    const loginedID =req.user._id;
    const postID=req.params.postid;
    const commentID=req.params.commentid;
      
     //check if the id is valid mongoose object id
     var isValid = mongoose.Types.ObjectId.isValid(postID);
     if (!isValid) return res.status(400).send("This post id is not valid"); 
     isValid = mongoose.Types.ObjectId.isValid(commentID);
     if (!isValid) return res.status(400).send("This comment id is not valid"); 


    let comment = await Post.find({_id:postID,"comments._id":commentID}, {_id: 0,comments:1, comments: {$elemMatch: {_id:commentID}}});
    if(comment.length==0) return res.send({ message: 'This comment  is not exist' })

    
    if(req.user.role=="user"&&comment.commentedBy!=loginedID) return res.status(401).send({ message: "you can only delete your own comments" })

    try{
        await Post.updateOne({ _id: postID },
        { $pull: { comments: {_id:commentID}}}
     );
        return res.status(200).send({message:"Comment deleted successfully"})
    }
    catch(err){
        return res.send(err);
    }
   
}
/* #endregion */
