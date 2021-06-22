const Express = require('express')
const app = Express();
const path = require("path");
const io = require("socket.io")(app.listen(3000, "0.0.0.0", () => console.log("Listening on port: 3000")));
let data = [];

app.use(Express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    socket.emit('clear');
    data.forEach(msg => socket.emit('draw', msg));

    socket.on('draw', (msg) => {
        if(msg.size > 10) {
            return;
        }

        io.emit('draw', msg);
        data.push(msg);
    });

    socket.on('clear', () => {
        io.emit('clear');
        data = [];
    });

    socket.on('redraw', () => {
        data.forEach(msg => socket.emit('draw', msg));
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
    data = [];
    io.emit('clear');

    setTimeout(cleaner, 600000);
}