var express = require('express');

var bodyParser = require('body-parser');

var cookieParser=require('cookie-parser');

var app = express();

app.use(cookieParser());

app.use(express.static('node_modules/'));

app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');

app.set('views','./view');

var server = require('http').Server(app);

var io = require('socket.io')(server);

app.get('/',function(req,res){
	if(!req.cookies.name){
		res.render('login');
	}else{
		res.render('index');
	}
});

app.post('/dologin',function(req,res){
	username = req.body.name
	res.cookie('name',username,{maxAge:900000,httpOnly:true});
	res.redirect('/');
	res.end();
});

app.post('/uname',function(req,res){
	if(req.body.name==req.cookies.name){
		res.json({code:0});
		res.end();
	}else{
		res.json({code:1});
		res.end();
	}
});

server.listen(3389);

io.on('connection',function(socket){
	
	socket.on('news',function(data){
		console.log(data);
		socket.broadcast.emit('news',data);
	});
});