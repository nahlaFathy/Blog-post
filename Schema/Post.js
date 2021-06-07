const mongoose = require('mongoose');

//////////// schema for posts table in DB ////////////////////
const postSchema = new mongoose.Schema({
    content:{require:true,type:String},
    postedBy: {        
        type: mongoose.Schema.Types.ObjectId,        
        ref: 'User'    
     },    
     comments: [{        
        text: String,        
        postedBy: {            
          type: mongoose.Schema.Types.ObjectId,            
          ref: 'User'        
        }    
     }]
    
})


///////match post schema with post table ///////
const Post = mongoose.model('posts', postSchema)

module.exports = Post;
