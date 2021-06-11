# Blog-post Backend APIS


Develpoing steps :

step #1 :
      Extract requirments

step #2 :

Creating database schema for user collection

{

    -email:  String, required
    -username: String, required
    -password: String, required
    -gender: String, required
    -role:String ,default:user

}

Creating database schema for post collection

{

    -content: requir,String
    -postedBy:  ObjectId from 'User'        
    -comments: [{       
        - text: String,        
        - commentedBy: ObjectId from 'User'        
                }]

}

step #3 :

Create node enviroment using npm "express" framework (index.js)
    -in index file :
 
            - check if env variables is set or no .
            - create redis server and redis error logs .
            - initialize express-session to  track the logged-in user across sessions .
            - create middleware that logs the request url, method, and current time 
            - create a global error handler that logs the error for server errors

step #4 :

Create database connection using npm "mongoose"  (dbConnection/mongodb.js)
       
        - First I connect to mongodb locally using Robo 3T tool 
        - Then I created mongodb atlas cluster to access db globally 
        
step #5 :

Create user operations logic to be used in CRUD routes (/routers_helpers/UserRoutersHelper.js)

Create post and comment operations logic to be used in CRUD routes (/routers_helpers/PostRoutersHelper.js)

        - used async and await keywords to enable asynchronous by suspending execution until the returned 
          callback or promise is fulfilled or rejected
        - in register check if email is register before or no then used npm "bcrypt" to hashing user password before 
          store it in database so no one can   know the password 
        - user role property will be "user" by default and only developers can change the role 
        - in login check if the credentials is for registered email or no then generate the user token with payload
          contains user id and user role and expire time 1 hour then set request session with session unique id 
          and set header with user token 
        - in logout invalidate user token by add it to blacklist and destroying established session 
        - in any route of post routes you must login with valid token  and have authorization to do the actions 
        - in any route apply validation for any request parameter id to check if this id is a valid objectId or no 

step #6 :

Create user routes to define APIs pathes (/Routes/UserRoutes.js)
Create post and comment routes to define APIs pathes (/Routes/PostRoutes.js)

- routes created by using express.router => express.router().get(endpoint,callback)
- routes have some parameters :

         - endpoint It’s the value that comes after your domain name 
         - callback tells the server what to do when the requested endpoint matches the endpoint stated
         - optional parameter to add middleware that return a callback 
step #7 :

created middlewares:

    - JWT authentication middleware                    (/middleware/jwtauth.js)
              used to create token-based authentication  
              using npm "jsonwebtoken"  this middleware check whether request contain token or no 
              if true it check if this token blocked or no , if not blocked it decode the token using 
              jwt.verify function and the secret key to determine if this token is valid or not if valid it set the request with the user data in payload part in token  
              - I used npm "jwt-blacklist" to block invalid tokens so no one can use it until it expire and store blocked tokens in redis datastore

    - Session authentication middleware                  (/middleware/jwtauth.js)
              used to create session-based authentication  
              using  npm "express-session" it check if there is a established session or no 
              the session data stored in redis 

    - User roles middleware                              (/middleware/userRoles.js)
              used to check if user has a permission to do that action based on his role or no
              using npm "accesscontrol" in (/helper/Authorization.js) it grant or deny the role with its allowed 
              permessions  

    - Request Body validation middleware                   (/middleware/reqBodyValidator.js)
              used to check if the request body contains the required values to do the action or no
              using npm "express-validator" it contain to parts a function that contains validation 
              rules with error messages for each role and a callback for the validation result 
              I ceated  validators for login request , register request ,add post request , add comment requesr to ensure that client side 
              send a correct data before send it to the databse 
              
-used npm "dotenv" to store any keys in .env file
              
step #8 :
  - Tested all endpoints using postman locally and fixed errors or unhandled exceptions
  
step #9 :
  - Deployed node js using github and heroku 
  - Test all endpoints  and create APIs documentation using postman

step #10 :
  -Make endpoints test using mocha and chai  
  
In this task I learned

     - using session authentication i used to use tokens only 
     - apply authorization roles and permessions in server-side 
       I apllied it before in client-side
     - create API documentation 


created by Nodejs + mongodb for database + mongodb atlas for deolpying database and heroku for deploying node js 

Express framework

Redis labs server for datastore

Postman to test all routes and create API doc in this link : https://documenter.getpostman.com/view/14400429/TzY7dZPU

Deployed Link for APIs : http://blog-post-imaging.herokuapp.com

Github Link : https://github.com/nahlaFathy/Blog-post

Authentication : JWT ,Session

- I created roles as one to one relationship so as an enhancement I can make one to many relationship (one user has many roles) but that depend on business requirements
