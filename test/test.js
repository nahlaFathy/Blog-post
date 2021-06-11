process.env.NODE_ENV='test'

// Import libraries
const chai = require('chai');
const chaiHttp = require('chai-http');
const session = require('express-session');
const should = chai.should();


// Import server
let server = require('../index');


// use chaiHttp for making the actual HTTP requests        
chai.use(chaiHttp);


describe('User API', function() {

  it('should Register user on /register POST', function(done) {
    chai.request(server)
  
        // register request
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        // send user registration details
        .send({
              'email':"nehal.a@gmail.com",
              'username': "nehal",
              'password': "n12345",
              'gender':"female",
              'role':"admin"
            }) 
        .end((err, res) => { // when we get a resonse from the endpoint
         // res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.equal("user was registered successfully");
          done();
        })
  })

  it('should login user, check token and get user on /user/loginUser GET', function(done) {
            // follow up with login
            chai.request(server)
                .post('/api/login')
                // send user login details
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    'email': 'nehal.a@gmail.com',
                    'password': 'n12345'
                })
                .end((err, res) => {
                    res.body.should.have.property('token');
                    var token = res.body.token;
  
                    // follow up with requesting user protected page
                    chai.request(server)
                    .get('/api//user/loginUser')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('user-token',token)
                    .end(function(err, res) {
                      res.body.should.be.an.instanceof(Object)
                      .that.includes.all.keys([ '_id', 'email','username','password','gender','role'])
                      done();
                })
        })
  })
  
  it('should login user, check token and get users if admin on /users GET', function(done) {
    // follow up with login
    chai.request(server)
        .post('/api/login')
        // send user login details
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            'email': 'nehal.a@gmail.com',
            'password': 'n12345'
        })
        .end((err, res) => {
            res.body.should.have.property('token');
            var token = res.body.token;

            // follow up with requesting user protected page
            chai.request(server)
            .get('/api/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('user-token',token)
            .end(function(err, res) {

              res.body.should.be.an.instanceof(Array)
              .and.to.have.property(0)
              .that.includes.all.keys([ '_id', 'email','username','password','gender','role'])
              done();
        })
})
})
it('should login user, check token and update user on /user PATCH', function(done) {
  // follow up with login
  chai.request(server)
      .post('/api/login')
      // send user login details
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
          'email': 'nehal.a@gmail.com',
          'password': 'n12345'
      })
      .end((err, res) => {
          res.body.should.have.property('token');
          var token = res.body.token;

            chai.request(server)
              // we set the auth header with our token
              .patch('/api/user')
              .set('user-token',token)
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send({
                'username':"nahla"               
              })
              .end(function(err, resonse) {
        
                  // the res object should have a status of 200
                  resonse.should.have.status(200);
                  resonse.body.should.have.property('message');
                  resonse.body.message.should.equal("user was edited successfully");
                  resonse.body.should.have.property('user');
                  done();
             
              
      })
})
})
it('should login user, check token and logout on /logout GET', function(done) {
  // follow up with login
  chai.request(server)
      .post('/api/login')
      // send user login details
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
          'email': 'nehal.a@gmail.com',
          'password': 'n12345'
      })
      .end((err, res) => {
          res.body.should.have.property('token');
          var token = res.body.token;
          // follow up with requesting user protected page
          chai.request(server)
          .get('/api/logout')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('user-token',token)
          .end(function(err, response) {
            response.should.have.status(200);
            response.body.should.have.property('message');
            response.body.message.should.equal("Loggedout successfully");
            done();
      })
})
})

  it('should  login user, check token and delete  user on /api/user DELETE', function(done) {
            // follow up with login
            chai.request(server)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                
                // send user login details
                .send({
                    'email': 'nehal.a@gmail.com',
                    'password': 'n12345'
                })
              
                .end((err, res) => {
                  
                    res.body.should.have.property('token');
                    var token = res.body.token;
                    // follow up with requesting user protected page                       
                            chai.request(server)
                                .delete('/api/user') 
                                // we set the auth header with our token
                                .set('user-token',token)
                                .end((error, resonse) =>{
                                    resonse.should.have.status(200);
                                    resonse.body.should.have.property('message');
                                    resonse.body.message.should.equal("User deleted successfully !!");
                                    done();
                                });
                        })
                })
        

  });
    

describe('Post API', function() {

it('should Register user, login user, check token and get all posts on /post/show/all GET', function(done) {
  chai.request(server)

      // register request
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      // send user registration details
      .send({
            'email':"nehal.f@gmail.com",
            'username': "nehal",
            'password': "n12345",
            'gender':"female",
            'role':"admin"
          }

      ) // this is like sending $http.post or this.http.post in Angular
      .end((err, res) => { // when we get a resonse from the endpoint

          // follow up with login
          chai.request(server)
              .post('/api/login')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              // send user login details
              .send({
                  'email': 'nehal.f@gmail.com',
                  'password': 'n12345'
              })
              .end((err, res) => {
                
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                  
                      // we set the auth header with our token
                      
                      .get('/api/post/show/All')
                      .set('user-token',token)
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.an.instanceof(Array)
                        .and.to.have.property(0)
                        .that.includes.all.keys([ '_id', 'content', 'postedBy','comments','createdAt' ])
                      
                        done();

                              
                      })
              })
      })
})
it('should login user, check token and add post on /post/add POST', function(done) {
          // follow up with login
          chai.request(server)
              .post('/api/login')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              // send user login details
              .send({
                  'email': 'nehal.f@gmail.com',
                  'password': 'n12345'
              })
              .end((err, res) => {
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                      // we set the auth header with our token
                      .post('/api/post/add')
                      .set('user-token',token)
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .send({
                        'content':"test",
                        'comments': [{'text':'test'}],
                       
                      })
                      .end(function(err, resonse) {
                
                          // the res object should have a status of 200
                          resonse.should.have.status(200);
                          resonse.body.should.have.property('message');
                          resonse.body.message.should.equal("new post added successfully");
                          done();
                     
                      });
              })
      
})

it('should login user, check token and update on /post/update POST', function(done) {
          // follow up with login
          chai.request(server)
              .post('/api/login')
              // send user login details
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send({
                  'email': 'nehal.f@gmail.com',
                  'password': 'n12345'
              })
              .end((err, res) => {
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                  .get('/api/post/show/All')
                  .set('Content-Type', 'application/json')
                  .set('Accept', 'application/json')
                  .set('user-token',token)
                  .end(function(err, res) {

                    chai.request(server)
                      // we set the auth header with our token
                      .patch('/api/post/update/'+ res.body[res.body.length-1]._id)
                      .set('user-token',token)
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .send({
                        'content':"update",
                        'comments': [{'text':'update'}],
                       
                      })
                      .end(function(err, resonse) {
                
                          // the res object should have a status of 200
                          resonse.should.have.status(200);
                          resonse.body.should.have.property('message');
                          resonse.body.message.should.equal("Your post was edited successfully");
                          resonse.body.should.have.property('post');
                          done();
                     
                      });
              })
      })
})

it('should  login user, check token and delete a post on /api/post/<id> DELETE', function(done) {
          // follow up with login
          chai.request(server)
              .post('/api/login')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              
              // send user login details
              .send({
                  'email': 'nehal.f@gmail.com',
                  'password': 'n12345'
              })
            
              .end((err, res) => {
                  res.body.should.have.property('token');
                  var token = res.body.token;
                  
                  // follow up with requesting user protected page
                  
                  chai.request(server)
                      .get('/api/post/show/All')
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .set('user-token',token)
                      .end(function(err, res ) {
                      
                          chai.request(server)
                              .delete('/api/post/' + res.body[res.body.length-1]._id) 
                              .set('Content-Type', 'application/json')
                              .set('Accept', 'application/json')
                              // we set the auth header with our token
                              .set('user-token',token)
                              .end(function(error, resonse) {
                                  resonse.should.have.status(200);
                                  resonse.body.should.have.property('message');
                                  resonse.body.message.should.equal("Post deleted successfully");
                                  done();
                              });
                      })
              })
      })



});


describe('Comment API', function() {

  it('should Register user, login user, check token and get all comments on /post/<id>/comments GET', function(done) {
    chai.request(server)
  
        // register request
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        // send user registration details
        .send({
              'email':"nehal.f@gmail.com",
              'username': "nehal",
              'password': "n12345",
              'gender':"female",
              'role':"admin"
            }
  
        ) // this is like sending $http.post or this.http.post in Angular
        .end((err, res) => { // when we get a resonse from the endpoint
  
            // follow up with login
            chai.request(server)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                // send user login details
                .send({
                    'email': 'nehal.f@gmail.com',
                    'password': 'n12345'
                })
                .end((err, res) => {
                  
                    res.body.should.have.property('token');
                    var token = res.body.token;
  
                    // follow up with requesting user protected page
                    chai.request(server)
                    
                        // we set the auth header with our token
                        
                        .get('/api/post/show/All')
                        .set('user-token',token)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .end(function(err, res) {
                            chai.request(server)
                            // we set the auth header with our token
                            .get('/api/post/'+res.body[0]._id+'/comments')
                            .set('user-token',token)
                            .set('Content-Type', 'application/json')
                            .set('Accept', 'application/json')
                            .end(function(err, response) {
                              response.should.have.status(200);
                              response.body.should.be.an.instanceof(Object)
                              .that.includes.all.keys([ 'message', 'comments'])
                              done();
                                  
                          })
                                
                        })
                })
        })
  })
  
  
  it('should login user, check token and add comment on /post/<id>/comment POST', function(done) {
    // follow up with login
    chai.request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        // send user login details
        .send({
            'email': 'nehal.f@gmail.com',
            'password': 'n12345'
        })
        .end((err, res) => {
            res.body.should.have.property('token');
            var token = res.body.token;
           // follow up with requesting user protected page
           chai.request(server)
                    
           // we set the auth header with our token
           
           .get('/api/post/show/All')
           .set('user-token',token)
           .set('Content-Type', 'application/json')
           .set('Accept', 'application/json')
           .end(function(err, res) {
            // follow up with requesting user protected page
            chai.request(server)
                // we set the auth header with our token
                .post('/api/post/'+res.body[0]._id+'/comment')
                .set('user-token',token)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                  'text':"test"                 
                })
                .end(function(err, resonse) {
          
                    // the res object should have a status of 200
                    resonse.should.have.status(200);
                    resonse.body.should.have.property('message');
                    resonse.body.message.should.equal("new comment added successfully");
                    done();
               
                });
        }) })

})

 
it('should login user, check token and update comment on /post/:postid/comment/:commentid PATCH', function(done) {
  // follow up with login
  chai.request(server)
      .post('/api/login')
      // send user login details
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
          'email': 'nehal.f@gmail.com',
          'password': 'n12345'
      })
      .end((err, res) => {
          res.body.should.have.property('token');
          var token = res.body.token;

          // follow up with requesting user protected page
          chai.request(server)
          .get('/api/post/show/All')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('user-token',token)
          .end(function(err, res) {
            chai.request(server)
              // we set the auth header with our token
              .patch('/api/post/'+ res.body[0]._id+'/comment/'+res.body[0].comments[res.body[0].comments.length-1]._id)
              .set('user-token',token)
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send({
                "text":"updated "
               
              })
              .end(function(err, resonse) {
        
                  // the res object should have a status of 200
                  resonse.should.have.status(200);
                  resonse.body.should.have.property('message');
                  resonse.body.message.should.equal("Your comment was edited successfully");
                  done();
             
              });
      })
})
})


it('should  login user, check token and delete a comment on /api/post/<postid>/comment/<commentid>  DELETE', function(done) {
  // follow up with login
  chai.request(server)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      
      // send user login details
      .send({
          'email': 'nehal.f@gmail.com',
          'password': 'n12345'
      })
    
      .end((err, res) => {
          res.body.should.have.property('token');
          var token = res.body.token;
          
          // follow up with requesting user protected page
          
          chai.request(server)
              .get('/api/post/show/All')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .set('user-token',token)
              .end(function(err, res ) {
              
                  chai.request(server)
                      .delete('/api/post/'+ res.body[0]._id+'/comment/'+ res.body[0].comments[res.body[0].comments.length-1]._id ) 
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      // we set the auth header with our token
                      .set('user-token',token)
                      .end(function(error, resonse) {
                          resonse.should.have.status(200);
                          resonse.body.should.have.property('message');
                          resonse.body.message.should.equal("Comment deleted successfully");
                          done();
                      });
              })
      })
})


  });
  
