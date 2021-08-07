const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
var utils = require('./utils');
var books = require('./books');
app.use(cookieParser());

const port = 7435;


let usersList;
fs.readFile('users.json', (err, data) => {
	if (err) throw err;
	usersList = JSON.parse(data);
});

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.clearCookie("errorMessage");
	userName = req.cookies.user !== undefined ? req.cookies.user.name : undefined
	errorMsg = req.cookies.errorMessage !== undefined ? req.cookies.errorMessage : undefined
	res.render('index', { name: userName, error: errorMsg });
	
});

app.get('/login', (req, res) =>{
	userName = req.cookies.user !== undefined ? req.cookies.user.name : undefined
	admin = utils.checkAdmin(userName, usersList);	
	res.render('login', { name: userName, admin });
	
});

app.get('/library', (req, res) =>{
	userName = req.cookies.user !== undefined ? req.cookies.user.name : undefined
	admin = utils.checkAdmin(userName, usersList);	
	res.render('library', { name: userName, admin });
});

app.get('/logout', (req, res) => {
	res.clearCookie('user');
	res.redirect('/');
});

app.get('/books', (req, res) => {
    userName = req.cookies.user !== undefined ? req.cookies.user.name : undefined
	admin = utils.checkAdmin(userName, usersList);
	if(admin){
		res.send(books.generateBookList());
	}else{
		res.sendStatus(403);
	}
	
});

app.post('/verify-login', (req, res) => {

	var username = req.body.username;
	var password = req.body.password;
	var userInfo = utils.checkLogin(username, password, usersList)
	if (userInfo !== undefined && req.cookies.user === undefined && req.cookies.errorMessage === undefined) {
		res.cookie('user', userInfo, { secure: true, httpOnly: true });
		res.redirect('http://localhost:7435/library');

	} else if (userInfo === undefined) {
		res.cookie("errorMessage", "User or password doesn't match", { secure: true, httpOnly: true });
		res.redirect('http://localhost:7435/login');
	} else {
		res.cookie("errorMessage", "General Error");
	}
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:%s`,port));