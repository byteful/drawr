const socket = io.connect();
let c, s;

function setup() {
    createCanvas(windowWidth, windowHeight - 50);
    background(255);
    c = select('#colorSelector');
    s = select('#sizeSlider');
}

function draw() {
    console.log(frameRate())
    if (mouseIsPressed && mouseX <= windowWidth && mouseY <= windowHeight - 50) {
        let data = {
            color: c.value(),
            size: s.value(),
            x: mouseX,
            y: mouseY,
            x2: pmouseX,
            y2: pmouseY
        };

        socket.emit('draw', data);
        handle(data);
    }
}

function handle(data) {
    stroke(data.color);
    strokeWeight(data.size);
    line(data.x, data.y, data.x2, data.y2);
}

socket.on('draw', (msg) => {
    handle(msg);
});

socket.on('clear', () => {
    background(255);
});

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 50);
    background(255);
    socket.emit('redraw');
}