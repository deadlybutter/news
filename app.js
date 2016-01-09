var express = require('express');
var app = express();
var request = require('superagent');
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: [__dirname + '/views/partials'],
  helpers: {
    stringify: function(obj) {
      return JSON.stringify(obj);
    }
  }
}));
app.set('view engine', 'handlebars');

var sassMiddleware = require('node-sass-middleware');
var path = require('path');
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/@dosomething/forge/dist')));

var data = {};

app.get('/', function(req, res) {
  res.render('home', {data: data});
});

app.get('/data', function(req, res) {
  res.json(data);
});

function startUp() {
  var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}

if (process.env.FIREBASE_URL) {
  var Firebase = require("firebase");
  var rootRef = new Firebase(process.env.FIREBASE_URL);
  rootRef.on('value', function(snapshot) {
    if (snapshot.val() == null) {
      return;
    }
    data = snapshot.val().data;
  });
  startUp();
}
else {
  startUp();
}
