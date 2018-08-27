//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    bodyParser  = require('body-parser'),
    mongodb = require('mongodb');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/views', express.static(__dirname + '/views'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    // ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    ip = "localhost",
    // mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURL = "mongodb://lite_user:ULO6ryRzeUjq9HzQ@saint-cluster-shard-00-00-xkgnt.mongodb.net:27017,saint-cluster-shard-00-01-xkgnt.mongodb.net:27017,saint-cluster-shard-00-02-xkgnt.mongodb.net:27017/test?ssl=true&replicaSet=saint-cluster-shard-0&authSource=admin&retryWrites=true",
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      // mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoDatabase = "lite_db",
      // mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoPassword = "ULO6ryRzeUjq9HzQ",
      // mongoUser = process.env[mongoServiceName + '_USER'];
      mongoUser = "lite_user";

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURL;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};
app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails, userName: 'Кретинчик *))'});
    });
  } else {
    res.render('index.html', { pageCountMessage : null, userName : 'Дебилёнок x)'});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});
app.post('/add', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
    if (db) {
    var col = db.collection('users');
    console.log(req.body);
    col.insert(req.body.user);
  } else {
    res.send('Ошибка подключения к БД');
  }
});
app.post('/show', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('users');
    col.find({}).toArray(function(err, result){
      if(err) throw(err);
      var sendBack;
      if(result.length > 0){
        sendBack = "<tr><td>Name</td><td>Last Name</td><td>Age</td></tr>\n";
        result.forEach(function(el, n){
          console.log(el);
          sendBack += "<tr><td>" + el["name"] + "</td><td>" + el["last_name"] + "</td><td>" + el["age"] + "</td><td><a class=\"remove-item\" href=\"#\" data-id=\"" + el["_id"] + "\">X</a></tr>\n";
        });
      }
      else sendBack = "<b>Нет никого</b>"
      res.send(sendBack);
    });
  } else {
    res.send('<b>Ошибка подключения к БД</b>');
  }
});
app.post('/remove', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('users');
    console.log(req.body.remove_id);
    if(req.body.remove_id) col.deleteOne({_id: mongodb.ObjectId(req.body.remove_id)}, function(err, result) {if(err) throw(err);});
    else res.send("Не удалось найти элемент");
  } else {
    res.send('<b>Ошибка подключения к БД</b>');
  }
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
