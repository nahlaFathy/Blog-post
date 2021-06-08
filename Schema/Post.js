const { ObjectID } = require('bson');
const mongoose = require('mongoose');
ObjectID = require('mongodb').ObjectID;

//////////// schema for posts table in DB ////////////////////
const postSchema = new mongoose.Schema({
    content:{require:true,type:String},
    postedBy: {        
        type: mongoose.Schema.Types.ObjectId,        
        ref: 'User'    
     },    
     comments: [{   
        commentId:new ObjectID(),     
        text: String,        
        commentedBy: {            
          type: mongoose.Schema.Types.ObjectId,            
          ref: 'User'        
        }    
     }]
    
})


///////match post schema with post table ///////
const Post = mongoose.model('posts', postSchema)

module.exports = Post;
