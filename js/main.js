const socket = io.connect();
let c, s, people, conns, timer;
let intv = 600000;
let time = new Date().getTime() + intv;

function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  background(255);
  c = select('#colorSelector');
  s = select('#sizeSlider');
  conns = select('#connections');
  timer = select('#timer');
  people = 1;

  updatePeople();
  updateTimer();
}

function draw() {
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
  time = new Date().getTime() + intv;
});

socket.on('update-people-counter', (amount) => {
  people = amount;
});

socket.on('timer-info', (lastClean, interval) => {
  intv = parseInt(interval);
  time = parseInt(lastClean) + intv;
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 50);
  background(255);
  socket.emit('redraw');
}

function updatePeople() {
  let msg = "<strong>" + people.toLocaleString() + " people</strong> are on right now.";

  if (people === 1) {
    msg = "<strong>1 person</strong> is on right now";
  }

  if (people > 100000) {
    msg = "<strong>+100,000 people</strong> are on right now.";
  }

  conns.html(msg);

  setTimeout(updatePeople, 2000);
}

function updateTimer() {
  let left = time - new Date().getTime();
  let minutes = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((left % (1000 * 60)) / 1000);

  if(minutes <= -1 || seconds <= -1) {
    window.location.reload(); // Server connection error, attempt reload to hopefully fix this.

    return;
  }

  timer.html("Time until reset: <strong>" + padLeadingZeros(minutes) + ":" + padLeadingZeros(seconds) + "</strong>");

  setTimeout(updateTimer, 1);
}

function padLeadingZeros(num) {
  let s = num + "";

  while (s.length < 2) {
    s = "0" + s;
  }

  return s;
}