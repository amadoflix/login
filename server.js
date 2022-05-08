const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.mkh11.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(error, client){
    if (error) return console.log(error);
    db = client.db('todoapp');
    //서버띄우는 코드 여기로 옮기기
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
  })

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

app.post('/login', passport.authenticate('local', {
     failureRedirect : '/login'
}), function(request, response){    
    // response.send("<script>alert('login success')</script>");
    response.redirect('http://localhost:3000/react-masterclass');
});

app.get('/login', function(request, response){
    response.render('login.ejs');
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (error, result) {
      if (error) return done(error)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == result.pw) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });
  
  passport.deserializeUser(function (아이디, done) {
    db.collection('login').findOne({ id: 아이디 }, function (error, result) {
        done(null, result);
      })
  }); 