// assign our port number to be whatever heroku give us OR the dafault 3000
var PORT = process.env.PORT || 3000;
var serveStatic = require('serve-static')
const path = require('path')
const cors = require('cors')
const express = require('express'); //引入express框架
const app = express();  //创建网站服务器
const server = app.listen(PORT, () => { //监听端口
    console.log('My socket server is running at 127.0.0.1:3000')
  });
function listen() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}
app.use(cors());
//app.use(express.static('public'));
//app.use('', express.static('./'))
//app.use('/', serveStatic(path.join(__dirname, '/public')));
//app.use('', express.static('./public'))
app.use(express.static(path.join(__dirname, 'public')));

var io = require('socket.io')(server); //创建服务器io对象

//收到client的连接,
io.sockets.on('connection',
    function (socket) { //收到client的socket,
        console.log("We have a new client: " + socket.id);

        socket.on('clicked', 
        function(isClicked){ //收到flap.js的clicked
            isClicked = 1
            console.log('received clicked', isClicked);
            startGame(isClicked) //start game (sketch)
            startCam(isClicked) //start game (flap)
        });
    
        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);
 
function startGame(click){
    io.sockets.emit('startGame', click);
    console.log('sent startGame', click)
}

function startCam(click){
    io.sockets.emit('startCam', click);
    console.log('sent startCam', click)
}
