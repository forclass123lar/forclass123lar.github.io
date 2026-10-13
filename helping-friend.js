var latInput;
var longInput;
var dataValueInput;

function setup() {
  createCanvas(800, 420);
// The actual coordinates will appear within a 720 by 360 pixel range. The extra pixels are there to create space for the interactivity and provide a sense of a border.
// textAlign(CENTER, CENTER)
  
  dataValueInput = createInput("100", "number").size(60, 20);
  dataValueInput.position(100,380);
  dataValuePrefix = createElement("p", "Data value is");
  dataValuePrefix.position(
    dataValueInput.x - 90, 
    dataValueInput.y -13);
  
  dataValueSuffix = createElement("p", "|");
  dataValueSuffix.position(
    dataValueInput.x + 72, 
    dataValueInput.y -13);

  latInput = createInput("0", "number").size(60, 20);
  latInput.position(260,380);
  latPrefix = createElement("p", "Latitude is");
  latPrefix.position(
    latInput.x - 75, // rosenorth adjusted position
    latInput.y - 13);
  latSuffix = createElement("p", "|");
  latSuffix.position(
    latInput.x + 72, 
    latInput.y -13);

  longInput = createInput("0", "number").size(60, 20);
  longInput.position(435,380); // rosenorth adjusted position
  longPrefix = createElement("p", "Longitude is");
  longPrefix.position(
    longInput.x - 85, // rosenorth adjusted position
    longInput.y - 13);
  longSuffix = createElement("p", "|");
  longSuffix.position(
    longInput.x + 72, 
    longInput.y -13);
  
}

function draw() {
  background(220);

  var dataValue;
  var lat;
  var long;

  dataValue = Number(dataValueInput.value());
  lat = Number(latInput.value());
  long = Number(longInput.value());

  noStroke();

// circle(long + 360, 180 - lat, dataValue);
// smallCircle =   circle(long + 360, 180 - lat, 5);
// mediumCircle =  circle(long + 360, 180 - lat, 10);
// largeCircle =   circle(long + 360, 180 - lat, 15);

  if ((lat < -90) || (lat > 90)) {
    return;
  }
  if ((long < -180) || (long > 180)) {
    return;
  }
  if (dataValue < 0) {
    fill(255, 0, 0);
  }  else if (dataValue > 0) {
    fill(0);
  }  else if (dataValue == 0) {
    fill(0); 
  }
  // rosenorth added line 74, changed if statements to else if

  
  if (dataValue < 0) {
    return textSize(20) && text('X', 2 * long + 360, 180 + lat * -2);
  }
  if ((dataValue <= 100) && (dataValue >= 0)) {
    return circle(2 * long + 400, 180 + lat * -2, 5);
  }
  else if ((dataValue <= 200) && (dataValue > 100)) {
    return circle(2 * long + 400, 180 + lat * -2, 10);
  }
  else if (dataValue > 200) {
    return circle(2 * long + 400, 180 + lat * -2, 15);
  }

/* rosenorth attempted to add response to mouse position, unable to complete it. Need to change variable names so that the one called below is referencing the correct one from above. 

  if (mouseX === circle(lat) || mouseY === circle(long)) {
    return circle(long + 15, lat + 15)
  }
*/
  
}
