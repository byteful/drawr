const Express = require('express')
const app = Express();
const path = require("path");
const io = require("socket.io")(app.listen(3000, "0.0.0.0", () => console.log("Listening on port: 3000")));
let data = [];
let lastClean = new Date().getTime();
let interval = 600000;

app.use(Express.static(path.join(__dirname, '/')));

app.get("/drawr.png", (req, res) => {
  res.sendFile(__dirname + "/drawr.png");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    socket.emit('clear');
    socket.emit('timer-info', lastClean, interval);
    io.emit('update-people-counter', io.sockets.sockets.size);
    data.forEach(msg => socket.emit('draw', msg));

    socket.on('draw', (msg) => {
        if(msg.size > 10) {
            return;
        }

        io.emit('draw', msg);
        data.push(msg);
    });

    socket.on('redraw', () => {
        data.forEach(msg => socket.emit('draw', msg));
    });

    socket.on('disconnect', () => {
      io.emit('update-people-counter', io.sockets.sockets.size);
    });
});

debug();
function debug() {
    console.log("Amount of Data: " + data.length);
    console.log("Amount of Connected Users: " + io.sockets.sockets.size);

    setTimeout(debug, 5000);
}
cleaner();
function cleaner() {
    doClean();

    setTimeout(cleaner, interval);
}

function doClean() {
    data = [];
    io.emit('clear');
    lastClean = new Date().getTime();
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
    text = text.trim();
    if (text === 'quit' || text === 'close' || text === 'stop') {
        process.exit(0);
    } else if(text === 'clear') {
        doClean();
    }
});