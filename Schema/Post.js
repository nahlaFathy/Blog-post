
const mongoose = require('mongoose');

//////////// schema for posts table in DB ////////////////////
const postSchema = new mongoose.Schema({
    content:{require:true,type:String},
    postedBy: {        
        type: mongoose.Schema.Types.ObjectId,        
        ref: 'User'    
     }, 
     createdAt: { type: Date, default: Date.now },   
     comments: [{       
        text: String,        
        commentedBy: {            
          type: mongoose.Schema.Types.ObjectId,            
          ref: 'User'        
        } ,
        createdAt: { type: Date, default: Date.now }   
     }]
    
})


///////match post schema with post table ///////
const Post = mongoose.model('posts', postSchema)

module.exports = Post;
