/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */
const SPELEN = 1;
const GAMEOVER = 2;
const STARTSCHERM = 0;
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
};

// Functie om de muisinteractie te controleren
function mouseClicked() {
  if (spelStatus === STARTSCHERM && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
    spelStatus = SPELEN; // Begin knop
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
  tekenSchermen();
}

// functie om de positie van de vijand te updaten
var beweegVijand = function() {
  // controleer of de vijand binnen het canvas blijft
  if (vijandX <= 0 || vijandX >= width) {
    // keer de richting om als de vijand de rand bereikt
    vijandDirection *= -1;
  }
  // update de x-positie van de vijand met de snelheid en richting
  vijandX += vijandSpeed * vijandDirection;

  // schiet kogels
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

/**
 * Updatet globale variabelen met posities van speler, vijanden en kogels
 */
var beweegAlles = function() {
  // speler
  updateSpelerPositie();

  // vijand
  beweegVijand();

  // kogel van de vijand
  for (var i = kogels.length - 1; i >= 0; i--) {
    kogels[i].x += kogels[i].snelheidX;
    kogels[i].y += kogels[i].snelheidY;

    // Verwijder kogels die buiten het scherm zijn
    if (kogels[i].x < 0 || kogels[i].x > width || kogels[i].y < 0 || kogels[i].y > height) {
      kogels.splice(i, 1);
    }
  }
};

// Andere functies blijven hetzelfde

// Zorg ervoor dat de setup- en draw-functies aanwezig zijn
function setup() {
  createCanvas(1280, 720);
}

function draw() {
  if (spelStatus === STARTSCHERM) {
    tekenStartScherm();
  }
  if (spelStatus === SPELEN) {
    beweegAlles();
    beheerSchild();
    verwerkBotsing();
    tekenAlles();
    if (medicijnen <= 0) {
      spelStatus = GAMEOVER;
    }
  }
  if (spelStatus === GAMEOVER) {
    tekenGameOverScherm();
  }
}


// functie om de vijand te tekenen als Sakuya van Touhou
var tekenVijand = function() {
  fill('silver'); // zilverkleur voor Sakuya
  ellipse(vijandX, vijandY, vijandDiameter, vijandDiameter); // teken de vijand als een cirkel
  fill('black');
  ellipse(vijandX - 20, vijandY - 10, 20, 20); // linkeroog
  ellipse(vijandX + 20, vijandY - 10, 20, 20); // rechteroog
  rect(vijandX - 20, vijandY + 10, 40, 10); // mond
};



/**
 * Updatet globale variabelen met posities van speler, vijanden en kogels
 */
var beweegAlles = function() {
  // speler
  updateSpelerPositie();

  // vijand
  beweegVijand();

  // kogel van de vijand
  for (var i = 0; i < kogels.length; i++) {
    kogels[i].x += kogels[i].snelheidX;
    kogels[i].y += kogels[i].snelheidY;
  }
};

/**
 * Checkt botsingen
 * Verwijdert neergeschoten dingen
 * Updatet globale variabelen punten en health
 */
var verwerkBotsing = function() {
  // botsing speler tegen vijand
  var afstand = dist(spelerX, spelerY, vijandX, vijandY);
  if (afstand < spelerBreedte / 2 + vijandDiameter / 2) {
    if (!schildActief) {
      medicijnen--;
      if (medicijnen > 0) {
        respawnSpeler(); // respawn de speler als hij medicijnen over heeft
        schildActief = true;
        schildBeginTijd = millis();
      }
    }
  }

  // botsing speler tegen kogels van de vijand
  for (var i = 0; i < kogels.length; i++) {
    var afstandKogelSpeler = dist(spelerX, spelerY, kogels[i].x, kogels[i].y);
    if (afstandKogelSpeler < spelerBreedte / 2) {
      if (!schildActief) {
        medicijnen--;
        if (medicijnen > 0) {
          respawnSpeler(); // respawn de speler als hij medicijnen over heeft
          schildActief = true;
          schildBeginTijd = millis();
        }
      }
    }
  }

  // update punten en health
  score += 1; // Verhoog de score bij elke frame
  hoogsteScore = max(hoogsteScore, score); // Update de hoogste score
};

// functie om de speler te laten respawnen met medicijnen
var respawnSpeler = function() {
  spelerX = 600;
  spelerY = 600;
  schildActief = true;
  schildBeginTijd = millis();
};

// functie om het schild van de speler te beheren
var beheerSchild = function() {
  if (schildActief) {
    var verstrekenTijd = (millis() - schildBeginTijd) / 1000;
    if (verstrekenTijd >= schildTijd) {
      schildActief = false;
    }
  }
};

// Functie om het schild van de speler te tekenen
var tekenSchild = function() {
  if (schildActief) {
    // Teken een gele bubbel rond de speler om het schild weer te geven
    noFill();
    stroke('yellow');
    strokeWeight(3);
    ellipse(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, spelerBreedte + 20, spelerHoogte + 20);
  }
};

// Functie om de score en levens van de speler te tekenen
var tekenUI = function() {
  fill('white');
  textSize(20);
  textAlign(LEFT);
  text("Levens: " + medicijnen, 20, 40); // Tekent aantal levens
  text("Score: " + score, 20, 70); // Tekent de score
  text("Hoogste Score: " + hoogsteScore, 20, 100); // Tekent de hoogste score
};

function updateSpelerPositie() {  
  const snelheid = 5;

  // Reset de snelheid wanneer geen toetsen worden ingedrukt
  spelerSnelheidX = 0;
  spelerSnelheidY = 0;

  // Controleer welke toetsen worden ingedrukt en update de snelheid dienovereenkomstig
  if (keyIsDown(87) && spelerY > 0) { // W-toets
    spelerSnelheidY = -snelheid;
  }
  if (keyIsDown(83) && spelerY < height - spelerHoogte) { // S-toets
    spelerSnelheidY = snelheid;
  }
  if (keyIsDown(65) && spelerX > 0) { // A-toets
    spelerSnelheidX = -snelheid;
  }
  if (keyIsDown(68) && spelerX < width - spelerBreedte) { // D-toets
    spelerSnelheidX = snelheid;
  }

  // Update de positie van de speler op basis van de berekende snelheden
  spelerX += spelerSnelheidX;
  spelerY += spelerSnelheidY;
}


/**
 * Tekent spelscherm
 */
var tekenAlles = function() {
  // achtergrond
  background('#31043C');

  // vijand
  tekenVijand();

  // kogels van de vijand
  tekenKogels();

  // Teken de medicijnen
  for (var i = 0; i < medicijnen; i++) {
    fill("red");
    ellipse(30 + i * 30, 20, 20, 20); // Tekent een rood cirkel voor elk medicijn
  }

  // Teken het schild van de speler
  tekenSchild();

  // Speler
  fill("goldenrod"); 
  ellipse(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, spelerBreedte, spelerHoogte); 


  // Teken de UI
  tekenUI();
};

// functie om het game-over scherm te tekenen
var tekenGameOverScherm = function() {
  background('purple');
  fill('white');
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  textSize(30);
  text("terug naar menu", width / 2, height / 2 + 50);
};

/* ********************************************* */
/* setup() en draw() functies / hoofdprogramma   */
/* ********************************************* */

/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
  createCanvas(1280, 720);

  // Kleur de achtergrond blauw, zodat je het kunt zien
}

/**
 * draw
 * de code in deze functie wordt 50 keer per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  if (spelStatus === STARTSCHERM) {
    tekenStartScherm();
  }
  if (spelStatus === SPELEN) {
    beweegAlles();
    beheerSchild();
    verwerkBotsing();
    tekenAlles();
    if (medicijnen <= 0) {
      spelStatus = GAMEOVER;
    }
  }
  if (spelStatus === GAMEOVER) {
    tekenGameOverScherm();
  }
}