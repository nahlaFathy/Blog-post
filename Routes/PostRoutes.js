const express = require('express');
const router = express.Router();
const Post = require('../routers_helpers/PostRoutersHelper');
const jwtauth = require('../middlewares/jwtauth');
const sessionauth = require('../middlewares/sessionauth');
const roles = require('../middlewares/userRoles')
const validate = require('../middlewares/reqBodyValidator')


// get posts for logined user 
router.get('/own', jwtauth, sessionauth, roles.grantAccess('readOwn', 'post'), Post.getUserPosts)

// get posts for user by user id 
router.get('/user/:id', jwtauth, sessionauth, roles.grantAccess('readAny', 'post'), Post.getUserPosts)

// get  post by id
router.get('/:id', jwtauth, sessionauth, roles.grantAccess('readAny', 'post'), Post.getPostById)


/// get all posts 
router.get('/show/All', jwtauth, sessionauth, roles.grantAccess('readAny', 'post'), Post.getPosts)


/// add new post
router.post('/add', jwtauth, sessionauth, validate.postValidationRules(), validate.validation, Post.addPost)


//update post data
router.patch('/update/:id', jwtauth, sessionauth, roles.grantAccess('updateOwn', 'post'), Post.updatePost)


// delete post by id
router.delete('/:id', jwtauth, sessionauth, roles.grantAccess('deleteOwn', 'post'), Post.DeletePost)


// get  post  comments by post id
router.get('/:id/comments', jwtauth, sessionauth, roles.grantAccess('readAny', 'post'), Post.getComments)


/// add new comment
router.post('/:id/comment', jwtauth, sessionauth, validate.commentValidationRules(), validate.validation, Post.addComment)


//update comment data
router.patch('/:postid/comment/:commentid', jwtauth, sessionauth, roles.grantAccess('updateOwn', 'post'), Post.updateComment)


// delete comment by id
router.delete('/:postid/comment/:commentid', jwtauth, sessionauth, roles.grantAccess('deleteOwn', 'post'), Post.DeleteComment)



module.exports = router
