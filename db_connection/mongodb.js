const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

/////////////check if connected to db or no ///////////////
mongoose.connect("mongodb+srv://BlogPost:blogpost123@blog-post.og6qd.mongodb.net/blog?retryWrites=true&w=majority" || 'mongodb://localhost:27017/BlogPost', 
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to MongodDB ...'))
    .catch((err) => console.error('can not connect to MongoDB', err))
