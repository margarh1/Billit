// required modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var Invoice = require('./models/invoice');
var session = require('express-session');
var db = require('./models');
var app = express();
var text = 'hello world from email';
var nodemailer = require('nodemailer');

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
app.use(bodyParser.json());



// ROUTES ////////////





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
      res.redirect('/loginerror');
      // console.log('authentication error: ', err);
      // res.status(500).send();
    } else {
      req.session.userId = loggedInUser._id;
      res.redirect('/dashboard');
    }
  });
});

// get login error page route
app.get('/loginerror', function(req, res) {
   res.render('pages/loginerror');
});

// get signed out page route
app.get('/signedout', function(req, res) {
   res.render('pages/signedout');
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

// get new invoice page route
app.get('/newinvoice', function (req, res) {
User.findOne({_id: req.session.userId}, function (err, currentUser) {
  res.render('pages/newinvoice.ejs', {user: currentUser})
  });
});

// get logout route
app.get('/logout', function (req, res) {
// remove the session user id
req.session.userId = null;
// redirect to login
res.redirect('/login');
});

// display json database
app.get('/api/invoices', function(req, res) {
  Invoice.find({})
    .populate('user')
    .exec(function(err, success) {
      console.log(err);
      res.json(success);
    });
});

// post new invoice to database
// app.post('/api/invoices', function(req, res) {
//   Invoice.find({})
//     .populate('user')
//     db.Invoice.create(req.body, function(err, invoice) {
//       if (err) { console.log('post create unsuccessful', err); }
//       console.log(invoice);
//       res.json(invoice);
//     });
// });

/////////
app.post('/api/invoices', function(req, res) {
    var newInvoice = new Invoice(req.body);
    User.findOne({
        name: req.body.user,
    }, function(err, invoiceUser) {
        if (err) {
            console.log(err);
            return
        }
        newInvoice.user = invoiceUser;
        invoiceUser.invoice.push(newInvoice);
        invoiceUser.save(function(err, succ) {
            if (err) {
                console.log(err);
            }
            newInvoice.save(function(err, succ) {
                if (err) {
                    console.log(err);
                }
                res.redirect('../dashboard');
            })
        });
    });
});

// delete an invoice
app.delete('/api/invoices/:id', function(req, res) {
  Invoice.find({})
  .populate('user')
  db.Invoice.findOneAndRemove({ _id: req.params.id }, function(err, foundInvoice){
    res.json(foundInvoice);
  });
});

app.put('/api/invoices/:id', function(req, res) {
  db.Invoice.findById(req.params.id, function(err, foundInvoice) {
    if(err) { console.log('invoicesController.update error', err); }
    foundInvoice.title = req.body.title;
    foundInvoice.number = req.body.number;
    foundInvoice.save(function(err, savedInvoice) {
      if(err) { console.log('saving altered invoice failed'); }
      res.json(savedInvoice);
    });
  });
})

app.get('/showUser', function(req, res){
  res.render('pages/showuser.ejs')
  console.log();
})

app.get('/asd', function(req,res){
  console.log("testing");
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'billitcustomer@gmail.com',
          pass: 'meanstack'
      }
  });
  var mailOptions = {
      from: 'kevin2005tran@gmail.com', // sender address
      to: 'billitcustomer@gmail.com', // list of receivers
      subject: 'Email Example', // Subject line
      text: "testing" //, // plaintext body
  }

  transporter.sendMail(mailOptions, function(error, info){
  if(error){
      console.log(error);
  }else{
      console.log('Message sent: ' + info.response);
  };
});
});



app.listen(3000, function () {
  console.log('server started on locahost:3000');
});
