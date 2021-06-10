// Import libraries
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();


// Import server
let server = require('../index');


// use chaiHttp for making the actual HTTP requests        
chai.use(chaiHttp);




describe('Post API', function() {

/*
it('should list ALL User on /api GET', function(done) {
  chai.request(server)
      .get('/api/users')
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('email');
          res.body[0].should.have.property('username');
          res.body[0].should.have.property('password');
          res.body[0].should.have.property('gender');
          res.body[0].should.have.property('role');
         
          done();
      });
});
it('should add a user on / POST', function(done) {
  chai.request(server)
      .post('/api/register')
      .send({
        'email':"nehal.f@gmail.com",
        'username': "nehal",
        'password': "n12345",
        'gender':"female",
        'role':"admin"
      })
      .end(function(err, res) {

          // the res object should have a status of 201
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('email');
          res.body.should.have.property('username');
          res.body.should.have.property('password');
          res.body.should.have.property('gender');
        
          done();
      });
});

it('should update the User on /user/<id> PUT', function(done) {
  chai.request(server)
      .get('/api/user')
      .end(function(err, res) {
          chai.request(server)
              .put('/api/user/' + res.body[0]._id)

              // this is like sending $http.post or this.http.post in Angular\
              .send('user edited successfully')
              // when we get a response from the endpoint
              // in other words,
              .end(function(error, response) {
                  // the res object should have a status of 200
                  response.should.have.status(200);
                  response.should.be.json;
                  response.body.should.be.a('object');
                  response.body.should.have.property('email');
                  response.body.should.have.property('username');
                  response.body.should.have.property('password');
                  response.body.should.have.property('gender');
                  response.body.should.have.property('role');
                  response.body.should.have.property('_id');
                  
                  done();
              });
      });
});*/
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

         
          // the res object should have a status of 201
          res.should.have.status(200);

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
                  console.log('this runs the login part');
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                  
                      // we set the auth header with our token
                      .set('Authorization', 'user-token ' + token)
                      .get('/api/post/show/All')
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('content');
                        res.body.should.have.property('postedBy');
                        res.body.should.have.property('comments');

                        done;

                              
                      })
              })
      })
})
it('should Register user, login user, check token and update on /post/add POST', function(done) {
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

         
          // the res object should have a status of 201
          res.should.have.status(200);

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
                  console.log('this runs the login part');
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                  
                      // we set the auth header with our token
                      .set('Authorization', 'user-token ' + token)
                      .post('/api/post/add')
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .send({
                        'content':"test",
                        'comments': [{'text':'test'}],
                       
                      })
                      .end(function(err, res) {
                
                          // the res object should have a status of 200
                          resonse.should.have.status(200);
                          resonse.body.should.have.property('message');
                          resonse.body.message.should.equal("new post added successfully");
                          done();
                     
                      });
              })
      })
})

it('should Register user, login user, check token and update on /post/update POST', function(done) {
  chai.request(server)

      // register request
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      // send user registration details
      .json({
            'email':"nehal.f@gmail.com",
            'username': "nehal",
            'password': "n12345",
            'gender':"female",
            'role':"admin"
          }

      ) // this is like sending $http.post or this.http.post in Angular
      .end((err, res) => { // when we get a resonse from the endpoint

         
          // the res object should have a status of 201
          res.should.have.status(200);

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
                  console.log('this runs the login part');
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                  .get('/api/post/show/All')
                  .set('Content-Type', 'application/json')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'user-token ' + token)
                  .end(function(err, res) {

                    chai.request(server)
                      // we set the auth header with our token
                      .set('Authorization', 'user-token ' + token)
                      .patch('/api/post/update/'+ res.body[0]._id)
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
                          resonse.body.should.have.property('post');
                          resonse.body.message.should.equal("Your post was edited successfully");
                          done();
                     
                      });});
              })
      })
})
it('should Register user, login user, check token and delete a post on /api/post/<id> DELETE', function(done) {
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

         
          // the res object should have a status of 201
          res.should.have.status(200);

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
                  console.log('this runs the login part');
                  res.body.should.have.property('token');
                  var token = res.body.token;

                  // follow up with requesting user protected page
                  chai.request(server)
                      .get('/api/post/show/All')
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json')
                      .set('Authorization', 'user-token ' + token)
                      .end(function(err, res) {
                          chai.request(server)
                              .delete('/api/post/' + res.body[0]._id)
                              .set('Content-Type', 'application/json')
                              .set('Accept', 'application/json')
                              // we set the auth header with our token
                              .set('Authorization', 'user-token ' + token)
                              .end(function(error, resonse) {
                                  resonse.should.have.status(200);
                                  resonse.body.should.have.property('message');
                                  resonse.body.message.should.equal("Post deleted successfully");
                                  done();
                              });
                      })
              })
      })
})


});
