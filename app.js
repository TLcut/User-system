const {userDB} = require("./data/data");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
var session = require('express-session');
const uuid4 = require('uuid4')

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret: uuid4(),
    cookie: { maxAge: 600 * 1000 }
}));

app.set("views", path.join(__dirname,"public", "views"));
app.set("view engine", "pug");

app.get('/',(req,res)=>{
    res.render('index');
    req.session.id ,req.session.password ,req.session.username = null ,null ,null;
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.post('/signup',(req,res)=>{
    try{
        const findUser = userDB.find(data => data.id === req.body.id);
        if(!findUser){
            const newUser = {
                username: req.body.username,
                id: req.body.id,
                password: req.body.password,
            }
            userDB.push(newUser);
            req.session.id ,req.session.password ,req.session.username = newUser.id ,newUser.password , newUser.username;
            res.redirect(`/user/${req.session.username}`);
        }else{
            res.redirect(`/login`);
        }
    }catch(err){
        res.send("伺服器錯誤:(" + err);
    }
})

app.post('/login',(req,res)=>{
    try{
        const findUser = userDB.find(data => data.id === req.body.id);
        if(findUser && req.body.password === findUser.password){
            req.session.id ,req.session.password ,req.session.username= findUser.id ,findUser.password , findUser.username;
            res.redirect(`/user/${req.session.username}`);
        }else{
            res.render('login',{
                message:"查無此帳"
            })
        }
    }catch{
        res.send("伺服器錯誤:("+err);
    }
})

app.get('/user/:username',(req,res)=>{
    res.render('links');
})

server.listen(PORT,()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
})