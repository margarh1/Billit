var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var Invoice = require('./models/invoice');
var session = require('express-session');

// middleware
app.use(express.static('public'));
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minute cookie lifespan (in milliseconds)
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/billit');


// get signup route
app.get('/signup', function (req, res) {
  res.render('signup');
});

// post sign up route
app.post('/users', function (req, res) {
  console.log(req.body)
  // use the email and password to authenticate here
  User.createSecure(req.body.name, req.body.email, req.body.password, function (err, newUser) {
    req.session.userId = newUser._id;
    res.redirect('/dashboard');
  });
});

// get login route
app.get('/login', function (req, res) {
  res.render('login');
});

// authenticate and log in user
app.post('/sessions', function (req, res) {
  // use the email and password to authenticate here
  User.authenticate(req.body.name, req.body.email, req.body.password, function (err, loggedInUser) {
    if (err){
      console.log('authentication error: ', err);
      res.status(500).send();
    } else {
      req.session.userId = loggedInUser._id;
      res.redirect('/dashboard');
    }
  });
});

// get index page route
app.get('/', function(req, res) {
   res.render('pages/index');
});

// get dashboard page route
app.get('/dashboard', function (req, res) {
// find user currently logged in
User.findOne({_id: req.session.userId}, function (err, currentUser) {
  res.render('pages/dashboard.ejs', {user: currentUser})
  });
});

// get how-to page route
app.get('/howto', function (req, res) {
User.findOne({_id: req.session.userId}, function (err, currentUser) {
  res.render('pages/howto.ejs', {user: currentUser})
  });
});

// get logout route
app.get('/logout', function (req, res) {
// remove the session user id
req.session.userId = null;
// redirect to login
res.redirect('/login');
});

app.get('/api/invoices', function(req, res) {
  Invoice.find({})
    .populate('user')
    .exec(function(err, success) {
      res.json(success);
    });
});

app.post('/api/invoices', function(req, res) {
  var newInvoice = new Invoice(req.body);
  User.findOne({
    email: req.body.user,
  }, function(err, invoiceUser) {
    if (err) {
      console.log(err);
      return
    }
    newInvoice.user = invoiceUser;
    invoiceUser.invoices.push(newInvoice);
    invoiceUser.save(function(err, succ) {
      if (err) {
        console.log(err);
      }
      newInvoice.save(function(err, succ) {
        if (err) {
          console.log(err);
        }
      res.redirect('../invoices');
      })
    });
  });
});



app.listen(3000, function () {
  console.log('server started on locahost:3000');
});
