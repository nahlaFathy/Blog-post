const bcrypt = require('bcrypt')
const Blacklist = require('../helper/TokenBlackList');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



/* #region get all users */
exports.getUsers = async (req, res) => {

    try {
    
        const users = await User.find();
        if (users) return res.send(users);
        else return res.status(404).send("something went wrong");
              
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */


/* #region get useer by id */
exports.getUserById = async (req, res) => {
    // if request path contain variable in query string so it will be logined id 
    //else id will be extracted from login user token 

    const loginedID = (req.params.id != null && req.params.id != undefined) ? req.params.id :req.user._id;
     
    try {
        const user = await User.findById(loginedID);
        if (user) return  res.send(user);
        else return res.status(404).send("This user id is not exist")
    }
    catch (err) {
        res.send(err);
    }
}
/* #endregion */

/* #region add user */
exports.addUser = async (req, res) => {

     ////// chech if user register before
     let isUser = await User.findOne({ email: req.body.email })
     if (isUser) return res.status(400).send('This email already registered')
    
     const newUser=req.body;
     ////// create new user
     let role = (newUser.role != undefined && newUser.role != null) ? newUser.role : 'user'
     const user = new User({
       email: newUser.email.toLowerCase(),
       username: newUser.username,
       password: newUser.password,
       gender: newUser.gender,
       role:role.toLowerCase()
 
     });
     //// hashing password
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt)
 
     ///// save new user
     try {
       await user.save()
       //sendMail(user.email, user.username, user._id);
       return res.send({ message: 'user was registered successfully' })
     }
     catch (err) {
       res.send({ error: err })
     }
    
}
/* #endregion */

/* #region update user */
exports.updateUser = async (req, res) => {
    const loginedID = (req.params.id != undefined && req.params.id != null) ? req.params.id : req.user._id;
    let user = await User.findById(loginedID);
    if(!user) return res.send({ message: 'This user id is not exist' })

    const updatedUser = req.body;
     /// if user send new password
     if (updatedUser.Password != undefined && updatedUser.Password != null) {
        //// hashing password
        const salt = await bcrypt.genSalt(10);
        updatedUser.Password = await bcrypt.hash(updatedUser.Password, salt)
    }


    let updates = {
      email: (updatedUser.email != "" && updatedUser.email != null) ?updatedUser.email.toLowerCase() : user.email.toLowerCase(),
      username: (updatedUser.username != "" && updatedUser.username != null) ? updatedUser.username : user.username,
      password: (updatedUser.password != "" && updatedUser.password != null) ? updatedUser.password : user.password,
      gender: (updatedUser.gender != "" && updatedUser.gender != null) ? updatedUser.gender : user.gender,
      role: (updatedUser.role != undefined && updatedUser.role != null) ? updatedUser.role.toLowerCase() : user.role.toLowerCase()
  
    }
    try{
        user = await User.findByIdAndUpdate(loginedID, updates, {
            new: true
          });
        if (user)
            return res.send({ message: 'user was edited successfully', user: user })
    }
    catch(err)
    {
        return res.send(err);
    }
    
}
/* #endregion */

/* #region delete user */
exports.DeleteUser = async (req, res) => {

    const loginedID = (req.params.id != undefined && req.params.id != null) ? req.params.id : req.user._id;
    const user = await User.findById(loginedID);
    if (!user) return res.status(404).send({ message: "the user ID is not exist" })
    try{
        await User.deleteOne(user)
        return res.status(200).redirect('http://localhost:3000/api/logout')
    }
    catch(err){
        return res.send(err);
    }
   
}
/* #endregion */

/* #region logout */
exports.logout = async (req, res) => {
      const token = req.token;
    /// invalidate token by adding it to blacklist
    (await Blacklist).add(token);

    //// invalidate session token by destroy it and clear cookie
    res.clearCookie('user');
    req.session.destroy(err => {
        if (err) {
            return res.send(err)
        }

        res.send("Loggedout successfully");
    })
}
/* #endregion */

/* #region login */
exports.login = async (req, res) => {
     
       //////////////chech if username is registered
       let user=await User.findOne({email:req.body.email.toLowerCase()})
       if(!user) return res.status(400).send('invalid email or password') 
       
       /////////// chech if password match username password 
       const validPassword=await bcrypt.compare(req.body.password,user.password)
       if(validPassword===false)return res.status(400).send('invalid email or password') 

    
     /////////// create token by user id and its role//////////
       const token=jwt.sign({ _id:user._id, role: user.role.toLowerCase() }, process.env.SECRET_KEY, { expiresIn: '1h' })

     //////// set user session with session id 
        req.session.user = req.session.id;
        req.cookies.user = req.session.id;
       return res.header('user-token',token).send({
           message:'logined in successfully',
           token:token
        }) 

}
/* #endregion */

