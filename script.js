/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */
const STARTSCHERM = 0;
const LEVELSCHERM = 3;
const LEVEL1 = 1;
const LEVEL2 = 4;
const LEVEL3 = 5;
const GAMEOVER = 2;
var spelStatus = STARTSCHERM;
var medicijnen = 3; // aantal medicijnen van de speler
var schildTijd = 2; // tijd in seconden voor het schild
var schildActief = false; // geeft aan of het schild actief is
var schildBeginTijd = 0; // tijd waarop het schild begint

var spelerBreedte = 25; // breedte van de speler (2 keer kleiner)
var spelerHoogte = 25; // hoogte van de speler (2 keer kleiner)
var spelerX = 600; // x-positie van speler
var spelerY = 600; // y-positie van speler
var health = 100;  // health van speler
var score = 0; // score van de speler
var hoogsteScore = 0; // hoogste score bereikt door de speler

var vijandX = 100; // x-positie van vijand
var vijandY = 200; // y-positie van vijand
var vijandDiameter = 100; // diameter van de vijand (2 keer groter)
var vijandSpeed = 3; // snelheid van de vijand
var vijandDirection = 1; // richting van de vijand (1 voor rechts, -1 voor links)

var kogels = []; // array om kogels van de vijand bij te houden

var spelerSnelheidX = 0; // snelheid van de speler in de x-richting
var spelerSnelheidY = 0; // snelheid van de speler in de y-richting

/* ********************************************* */
/* functies die je gebruikt in je game           */
/* ********************************************* */

// Functie om het startscherm te tekenen
var tekenStartScherm = function() {
  background('#E798F9');
  fill('#FF046B');
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Nijiura Nights", width / 2, height / 2 - 50);
  textSize(30);
  text("Begin", width / 2, height / 2 + 50);
  text("Levels", width / 2, height / 2 + 100);
};

// Functie om het levels scherm te tekenen
var tekenLevelScherm = function() {
  background('#E798F9');
  fill('#FF046B');
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Kies een Level", width / 2, height / 2 - 150);
  textSize(30);
  text("Level 1", width / 2, height / 2 - 50);
  text("Level 2", width / 2, height / 2 + 50);
  text("Level 3", width / 2, height / 2 + 150);
};

// Functie om de muisinteractie te controleren
function mouseClicked() {
  if (spelStatus === STARTSCHERM) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
      spelStatus = LEVEL1; // Begin knop
    } else if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 75 && mouseY < height / 2 + 125) {
      spelStatus = LEVELSCHERM; // Levels knop
    }
  } else if (spelStatus === LEVELSCHERM) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50) {
      if (mouseY > height / 2 - 75 && mouseY < height / 2 - 25) {
        spelStatus = LEVEL1; // Level 1 knop
      } else if (mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
        spelStatus = LEVEL2; // Level 2 knop
      } else if (mouseY > height / 2 + 125 && mouseY < height / 2 + 175) {
        spelStatus = LEVEL3; // Level 3 knop
      }
    }
  } else if (spelStatus === GAMEOVER && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
    resetSpel(); // Opnieuw knop
  }
}

// Functie om het spel te resetten
function resetSpel() {
  spelStatus = STARTSCHERM;
  medicijnen = 3;
  spelerX = 600;
  spelerY = 600;
  health = 100;
  vijandX = 100;
  vijandY = 200;
  kogels = [];
  score = 0; // Reset de score
}

// Setup functie
function setup() {
  createCanvas(1280, 720);
}

// Draw functie
function draw() {
  if (spelStatus === STARTSCHERM) {
    tekenStartScherm();
  } else if (spelStatus === LEVELSCHERM) {
    tekenLevelScherm();
  } else if (spelStatus === LEVEL1) {
    speelLevel1();
  } else if (spelStatus === LEVEL2) {
    speelLevel2();
  } else if (spelStatus === LEVEL3) {
    speelLevel3();
  } else if (spelStatus === GAMEOVER) {
    tekenGameOverScherm();
  }
}

/* ********************************************* */
/* Level 1 functies                              */
/* ********************************************* */

function speelLevel1() {
  beweegAlles();
  beheerSchild();
  verwerkBotsing();
  tekenAlles();
  if (medicijnen <= 0) {
    spelStatus = GAMEOVER;
  }
}

// functie om de positie van de vijand te updaten
var beweegVijand = function() {
  if (vijandX <= 0 || vijandX >= width) {
    vijandDirection *= -1;
  }
  vijandX += vijandSpeed * vijandDirection;
  schietKogel();
};

// Definieer verschillende kogeltypes
var kogelTypes = [
  { diameter: 10, snelheid: 4, patroon: 'cirkel' },  // normale kogels
  { diameter: 80, snelheid: 2, patroon: 'groot' },   // veel grotere kogels
  { diameter: 8, snelheid: 5, patroon: 'spiraal' }   // snellere spiraalkogels
];

// Functie om een kogel van de vijand te maken
var schietKogel = function() {
  // Normale en spiraalpatronen worden elke seconde afgeschoten
  if (frameCount % 60 === 0) {
    schietPatroon('cirkel');
    schietPatroon('spiraal');
  }
  // Grote kogels worden elke drie seconden afgeschoten
  if (frameCount % 180 === 0) {
    schietPatroon('groot');
  }
};

// Functie om een specifiek patroon te schieten
var schietPatroon = function(type) {
  var kogelType = kogelTypes.find(k => k.patroon === type);
  if (!kogelType) return;

  if (kogelType.patroon === 'cirkel') {
    // Cirkelpatroon
    for (var i = 0; i < 20; i++) {
      var hoek = TWO_PI / 20 * i;
      var kogel = {
        x: vijandX,
        y: vijandY,
        diameter: kogelType.diameter,
        snelheidX: cos(hoek) * kogelType.snelheid,
        snelheidY: sin(hoek) * kogelType.snelheid
      };
      kogels.push(kogel);
    }
  } else if (kogelType.patroon === 'groot') {
    // Grotere kogels in een kruispatroon
    for (var i = 0; i < 8; i++) {
      var hoek = HALF_PI / 2 * i;
      var kogel = {
        x: vijandX,
        y: vijandY,
        diameter: kogelType.diameter,
        snelheidX: cos(hoek) * kogelType.snelheid,
        snelheidY: sin(hoek) * kogelType.snelheid,
        kleur: 'groot' // Markeer deze kogel voor speciale weergave
      };
      kogels.push(kogel);
    }
  } else if (kogelType.patroon === 'spiraal') {
    // Spiraalpatroon
    for (var i = 0; i < 20; i++) {
      var hoek = TWO_PI / 20 * i + frameCount * 0.1;
      var kogel = {
        x: vijandX,
        y: vijandY,
        diameter: kogelType.diameter,
        snelheidX: cos(hoek) * kogelType.snelheid,
        snelheidY: sin(hoek) * kogelType.snelheid
      };
      kogels.push(kogel);
    }
  }
};

// functie om kogels van de vijand te tekenen
var tekenKogels = function() {
  for (var i = 0; i < kogels.length; i++) {
    var kogel = kogels[i];
    if (kogel.kleur === 'groot') {
      // Teken de grote kogels zoals in de afbeelding
      noStroke();
      fill(255, 0, 0);
      ellipse(kogel.x, kogel.y, kogel.diameter * 0.5); // Rode kern
      stroke(255);
      strokeWeight(4);
      fill(255, 255, 255, 150);
      ellipse(kogel.x, kogel.y, kogel.diameter); // Witte buitenrand
      strokeWeight(2);
      noFill();
      stroke(255, 0, 0);
      ellipse(kogel.x, kogel.y, kogel.diameter + 10); // Extra rode rand
    } else {
      // Normale kogels
      stroke('#000000'); // zwarte rand voor de kogel
      strokeWeight(2); // dikte van de rand
      fill('#FFFFFF'); // witte kleur voor de kogel
      var hoek = atan2(kogel.snelheidY, kogel.snelheidX) + PI / 4;
      hoek += PI / 4;
      push(); // Bewaar de huidige transformatie-instellingen
      translate(kogel.x, kogel.y); // Verplaats naar de positie van de kogel
      rotate(hoek); // Roteer de kogel naar de berekende hoek
      // Teken de kogel als een driehoek om de punt van het mes te simuleren
      beginShape();
      vertex(-4, 0); // linkerbovenhoek
      vertex(4, 0); // rechterbovenhoek
      vertex(0, 30); // punt van de kogel (verlengde diagonale lijn)
      endShape(CLOSE);
      pop(); // Herstel de oorspronkelijke transformatie-instellingen
    }
  }
};

// functie om de positie van de kogels te updaten
var beweegKogels = function() {
  for (var i = 0; i < kogels.length; i++) {
    var kogel = kogels[i];
    kogel.x += kogel.snelheidX;
    kogel.y += kogel.snelheidY;
    if (kogel.x < 0 || kogel.x > width || kogel.y < 0 || kogel.y > height) {
      kogels.splice(i, 1);
      i--;
    }
  }
};

// functie om de speler te tekenen
var tekenSpeler = function() {
  fill('#39FF14');
  rect(spelerX, spelerY, spelerBreedte, spelerHoogte);
};

// functie om de vijand te tekenen
var tekenVijand = function() {
  fill('red');
  ellipse(vijandX, vijandY, vijandDiameter, vijandDiameter);
};



// functie om alle objecten te tekenen
var tekenAlles = function() {
  background('black');
  tekenSpeler();
  tekenVijand();
  tekenKogels();
  fill("white");
  textSize(24);
  text("Score: " + score, 10, 30);
  text("Highscore: " + hoogsteScore, 10, 60);
  text("Health: " + health, 10, 90);
  text("Medicijnen: " + medicijnen, 10, 120);

  // Schilder het schild van de speler
  if (schildActief) {
    fill(0, 0, 255, 100); // blauwe doorzichtige kleur
    ellipse(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, 50, 50);
  }
};

// functie om de speler te bewegen
var beweegSpeler = function() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Links (A)
    spelerX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Rechts (D)
    spelerX += 5;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // Omhoog (W)
    spelerY -= 5;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // Omlaag (S)
    spelerY += 5;
  }
};

// functie om botsingen te verwerken
var verwerkBotsing = function() {
  for (var i = 0; i < kogels.length; i++) {
    var kogel = kogels[i];
    if (dist(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, kogel.x, kogel.y) < spelerBreedte / 2 + kogel.diameter / 2) {
      if (schildActief) {
        kogels.splice(i, 1);
        i--;
        continue;
      }
      health -= 10;
      kogels.splice(i, 1);
      i--;
    }
  }
  if (health <= 0) {
    medicijnen--;
    health = 100;
  }
};

// functie om alles te bewegen
var beweegAlles = function() {
  beweegSpeler();
  beweegVijand();
  beweegKogels();
  score++;
  if (score > hoogsteScore) {
    hoogsteScore = score;
  }
};

// Functie om het schild te beheren
var beheerSchild = function() {
  if (keyIsDown(32) && !schildActief && millis() - schildBeginTijd > 3000) {
    schildActief = true;
    schildBeginTijd = millis();
  }

  if (schildActief && millis() - schildBeginTijd > schildTijd * 1000) {
    schildActief = false;
  }
};

// Functie om het game over scherm te tekenen
var tekenGameOverScherm = function() {
  background(0);
  fill("red");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 50);
  textSize(30);
  text("Opnieuw", width / 2, height / 2 + 50);
}

/* ********************************************* */
/* Level 2 functies                              */
/* ********************************************* */

function speelLevel2() {
  // Voeg hier de code voor level 2 toe
  background(100);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Level 2", width / 2, height / 2);
}

/* ********************************************* */
/* Level 3 functies                              */
/* ********************************************* */

function speelLevel3() {
  // Voeg hier de code voor level 3 toe
  background(150);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Level 3", width / 2, height / 2);
}
