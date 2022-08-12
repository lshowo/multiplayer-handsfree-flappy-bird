// assign our port number to be whatever heroku give us OR the dafault 3000
var PORT = process.env.PORT || 3000;
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
app.use(express.static('public'));

var io = require('socket.io')(server); //创建服务器io对象

var scores = []; //对象数组 存放client的id与对应成绩

let find = 0;

//收到client的连接,
io.sockets.on('connection',
    function (socket) { //收到client的socket,
        console.log("We have a new client: " + socket.id);
        var score = new User(socket.id, '', 0); 
        //console.log(score);
        scores.push(score);
        console.log(scores);

        //成绩更新
        socket.on('updateScore', function (score, username) {
            find = 0;
            console.log('🌟', score, 'a new score received from: ', socket.id);
            for (var i in scores){
                if(scores[i].username == username){
                    //scores[i].username = username;
                    scores[i].score = score; 
                    find = 1; 
                    break;
                }
            }
            if(!find){
                console.log('addddddddd');
                scores[scores.length-1].username = username;
                scores[scores.length-1].score = score;
            }

            //console.log(scores);
            displayScore(scores);
            

        });
    }
);
 

function displayScore(){
    scores.sort(sortBy('score',false));
    io.sockets.emit('displayScore', scores);
}

function User(id, username, score){
    this.id = id;
    this.username = username;
    this.score = score;
}

function sortBy(attr,rev){
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }
    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}