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
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('testpdf.html', 'utf8');
var options = { format: 'Letter' };

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

// post to invoices
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

app.put('/api/invoices/:id', function(req, res) {
  db.Invoice.findById(req.params.id, function(err, foundInvoice) {
    if(err) { console.log('invoicesController.update error', err); }
    foundInvoice.title = req.body.title;
    foundInvoice.number = req.body.number;
    foundInvoice.date = req.body.date;
    foundInvoice.status = req.body.status;
    foundInvoice.customerName = req.body.customerName;
    foundInvoice.description = req.body.description;
    foundInvoice.quantity = req.body.quantity;
    foundInvoice.rate = req.body.rate;
    foundInvoice.customerEmail = req.body.customerEmail;
    foundInvoice.save(function(err, savedInvoice) {
      if(err) { console.log('saving altered invoice failed'); }
      res.json(savedInvoice);
    });
  });
})

// delete an invoice
app.delete('/api/invoices/:id', function(req, res) {
  Invoice.find({})
  .populate('user')
  db.Invoice.findOneAndRemove({ _id: req.params.id }, function(err, foundInvoice){
    res.json(foundInvoice);
  });
});

app.get('/showUser', function(req, res){
  res.render('pages/showuser.ejs')
  console.log();
})

// get current user route
app.get('/api/currentuser', function(req, res) {
  User.findOne({
    _id: req.session.userId
  })
  .populate('invoice')
  .exec(function(err, user) {
     if(!user) {
       console.log("no user found", null);
     } else {
       res.json(user);
     }
  });
})

app.post('/printpdf', function(req, res1){
  console.log("print button works!");
  pdf.create(html, options).toFile('./testpdf.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }

  });
})

// get email reminder route & transporter
app.post('/emailreminder', function(req,res){
  var email = req.query.email;
  console.log("email is: " + email);
  // console.log("data: " + req.data);
  // console.log(req.data.invoiceTitle);
  // console.log("trying to send email");
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'billitcustomer@gmail.com',
          pass: 'meanstack'
      }
  });
  var mailOptions = {
      from: 'billitcustomer@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Invoice payment reminder', // Subject line
      text: "Hi! This is an email reminder to pay your invoice" //, // plaintext body
  }

  transporter.sendMail(mailOptions, function(error, info){
  if(error){
      console.log(error);
  }else{
      console.log('Message sent: ' + info.response);
  };
});
});

app.listen(process.env.PORT || 3000)
