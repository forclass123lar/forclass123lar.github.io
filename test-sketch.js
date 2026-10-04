function setup() {
    createCanvas(800, 600);
}

function draw() {
    background("yellow");
    //circle in the center with a width of 100
    //when mouse button is pressed, circles turn black
    if (mouseIsPressed === true) {
    fill(0);
} else {
  fill(255);
}

//white circles drawn at mouse position
circle(mouseX, mouseY, 100);
}
