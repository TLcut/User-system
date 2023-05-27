"use strict";

var _require = require("./data/data"),
    userDB = _require.userDB;

var path = require("path");

var bodyParser = require("body-parser");

var http = require("http");

var express = require("express");

var session = require('express-session');

var uuid4 = require('uuid4');

var app = express();
var server = http.createServer(app);
var PORT = 3000;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, "public")));
app.use(session({
  secret: uuid4(),
  cookie: {
    maxAge: 600 * 1000
  }
}));
app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "pug");
app.get('/', function (req, res) {
  res.render('index');
  req.session.id, req.session.password, req.session.username = null, null, null;
});
app.get('/login', function (req, res) {
  res.render('login');
});
app.get('/signup', function (req, res) {
  res.render('signup');
});
app.post('/signup', function (req, res) {
  try {
    var findUser = userDB.find(function (data) {
      return data.id === req.body.id;
    });

    if (!findUser) {
      var newUser = {
        username: req.body.username,
        id: req.body.id,
        password: req.body.password
      };
      userDB.push(newUser);
      req.session.id, req.session.password, req.session.username = newUser.id, newUser.password, newUser.username;
      res.redirect("/user/".concat(req.session.username));
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.send("伺服器錯誤:(" + err);
  }
});
app.post('/login', function (req, res) {
  try {
    var findUser = userDB.find(function (data) {
      return data.id === req.body.id;
    });

    if (findUser && req.body.password === findUser.password) {
      req.session.id, req.session.password, req.session.username = findUser.id, findUser.password, findUser.username;
      res.redirect("/user/".concat(req.session.username));
    } else {
      res.render('login', {
        message: "查無此帳"
      });
    }
  } catch (_unused) {
    res.send("伺服器錯誤:(" + err);
  }
});
app.get('/user/:username', function (req, res) {
  res.render('links');
});
server.listen(PORT, function () {
  console.log("server is listening on http://localhost:".concat(PORT));
});