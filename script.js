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
var medicijnen = 6; // aantal medicijnen van de speler
var schildTijd = 2; // tijd in seconden voor het schild
var schildActief = false; // geeft aan of het schild actief is
var schildBeginTijd = 0; // tijd waarop het schild begint

var spelerBreedte = 25; // breedte van de speler (2 keer kleiner)
var spelerHoogte = 25; // hoogte van de speler (2 keer kleiner)
var spelerX = 600; // x-positie van speler
var spelerY = 600; // y-positie van speler
var health = 1;  // health van speler
var score = 0; // score van de speler
var hoogsteScore = 0; // hoogste score bereikt door de speler

var vijandX = 100; // x-positie van vijand
var vijandY = 200; // y-positie van vijand
var vijandDiameter = 100; // diameter van de vijand (2 keer groter)
var vijandSpeed = 3; // snelheid van de vijand
var vijandDirection = 1; // richting van de vijand (1 voor rechts, -1 voor links)
var vijandLevens = 300; // Aantal levens van de vijand

var kogels = []; // array om kogels van de vijand bij te houden
var spelerKogels = []; // array om kogels van de speler bij te houden
var zigzagOffset = 0;
var zigzagDirection = 1;

var spelerSnelheidX = 0; // snelheid van de speler in de x-richting
var spelerSnelheidY = 0; // snelheid van de speler in de y-richting

var spelerFireRate = 7; // Fire rate van de speler kogels
var spelerKogelSpeed = 10; // Snelheid van de speler kogels
var spelerKogelDamage = 50; // Schade van de speler kogels

var img;

/* ********************************************* */
/* functies die je gebruikt in je game           */
/* ********************************************* */

// Functie om het startscherm te tekenen
var tekenStartScherm = function() {
  background('#111111');
  fill('#FF046B');
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Nijiura Nights", width / 2, height / 2 - 50);
  textSize(30);
  text("Levels", width / 2, height / 2 + 50);
  text("", width / 2, height / 2 + 100);
  image(img, 30, 0,);
};

// Functie om het levels scherm te tekenen
var tekenLevelScherm = function() {
  background('#E798F9');
  fill('#FF046B');
  textSize(50);
  textAlign(CENTER, CENTER)  ;
  text("Kies een Level", width / 2, height / 2 - 150);
  textSize(30);
  text("Level 1", width / 2, height / 2 - 50);
  text("Level 2", width / 2, height / 2 + 50);
  text("Level 3", width / 2, height / 2 + 150);
  image(img2, 30, 0,);
  
};

// Functie om de muisinteractie te controleren
function mouseClicked() {
  if (spelStatus === STARTSCHERM) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {

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
  health = 1;
  vijandX = 100;
  vijandY = 200;
  kogels = [];
  spelerKogels = []; // Reset de speler kogels
  score = 0; // Reset de score
}

// Setup functie

function preload()  {
  img = loadImage('maid.png')
  img2 = loadImage('temple.png')
  img3 = loadImage('dead.png')
  afbeeldingSpeler = loadImage('sakuya.png');
  afbeeldingVijand = loadImage('yakui.png');
  
}

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
/* Level 2 functies                              */
/* ********************************************* */

function speelLevel2() {
  beweegAllesLevel2();
  beheerSchild();
  verwerkBotsing();
  verwerkSpelerBotsing();
  tekenAllesLevel2();
  if (medicijnen <= 0) {
    spelStatus = GAMEOVER;
  }
}

var vijandenLevel2 = [];
var vijandSpawnTimer = 0;
var vijandenSpawned = 0; // Houd het aantal gespawnde vijanden bij

// Functie om de vijanden van Level 2 te maken
function initLevel2() {
  vijandenLevel2 = [];
  vijandSpawnTimer = 0;
  vijandenSpawned = 0; // Reset het aantal gespawnde vijanden
}

var vasteYPositie = 100; // Stel hier de gewenste y-positie in

// Functie om de vijanden van Level 2 te spawnen
function spawnVijandenLevel2() {
  if (vijandenSpawned >= 20) {
    // Stop met spawnen als er 20 vijanden zijn gespawned
    return;
  }

  if (vijandSpawnTimer <= 0) {
    for (var i = 0; i < 6; i++) {
      var vijand = {
        x: i % 2 === 0 ? 0 : width, // Spawnen aan linkerkant of rechterkant
        y: vasteYPositie, // Gebruik de vaste y-positie
        breedte: 30,
        hoogte: 30,
        snelheidX: i % 2 === 0 ? 2 : -3, // Bewegen naar rechts of links
        schietTijd: frameCount + random(30, 400), // Schiet tijd na een willekeurig aantal frames
        levens: 1 // Vijanden hebben 1 HP
      };
      vijandenLevel2.push(vijand);
      vijandenSpawned++; // Verhoog het aantal gespawnde vijanden
    }
    vijandSpawnTimer = 60; // Reset de timer naar 1 seconde
  }
  vijandSpawnTimer--;
}

// Functie om de vijanden van Level 2 te bewegen en schieten
function beweegVijandenLevel2() {
  for (var i = 0; i < vijandenLevel2.length; i++) {
    var vijand = vijandenLevel2[i];
    vijand.x += vijand.snelheidX;
    if (vijand.x < 0 || vijand.x > width) {
      vijandenLevel2.splice(i, 1); // Verwijder vijand als deze buiten beeld gaat
      i--;
    } else if (frameCount >= vijand.schietTijd) {
      schietKogelsVijandLevel2(vijand);
      vijand.schietTijd = frameCount + random(30, 60); // Nieuwe schiettijd instellen
    }
  }
}

// Functie om kogels van de vijanden van Level 2 te schieten
function schietKogelsVijandLevel2(vijand) {
  for (var i = 0; i < 8; i++) {
    var hoek = PI / 4 * i;
    var kogel = {
      x: vijand.x + vijand.breedte / 2,
      y: vijand.y + vijand.hoogte / 2,
      diameter: 20, // Maak de kogel groter
      snelheidX: cos(hoek) * 10,
      snelheidY: sin(hoek) * 5,
      kleur: color(255, 0, 0), // Rode kleur voor de kogel
    };
    kogels.push(kogel);
  }
}

// Functie om alles van Level 2 te bewegen
function beweegAllesLevel2() {
  beweegSpeler();
  beweegVijandenLevel2();
  beweegKogels();
  beweegSpelerKogels();
  verwerkVijandSpelerKogelBotsing(); // Verwerk botsing tussen spelerkogels en vijanden
  schietSpelerKogels();
  spawnVijandenLevel2(); // Spawn vijanden continu
  score++;
  if (score > hoogsteScore) {
    hoogsteScore = score;
  }
}

// Functie om botsing tussen spelerkogels en vijanden te verwerken
function verwerkVijandSpelerKogelBotsing() {
  for (var i = 0; i < spelerKogels.length; i++) {
    var spelerKogel = spelerKogels[i];
    for (var j = 0; j < vijandenLevel2.length; j++) {
      var vijand = vijandenLevel2[j];
      if (
        spelerKogel.x > vijand.x &&
        spelerKogel.x < vijand.x + vijand.breedte &&
        spelerKogel.y > vijand.y &&
        spelerKogel.y < vijand.y + vijand.hoogte
      ) {
        vijandenLevel2.splice(j, 1); // Verwijder de vijand
        spelerKogels.splice(i, 1); // Verwijder de kogel
        i--;
        break;
      }
    }
  }
}

// Functie om alles van Level 2 te tekenen
function tekenAllesLevel2() {
  background('black');
  tekenSpeler();
  tekenKogels();
  tekenSpelerKogels();
  fill("white");
  textSize(24);
  text("Score: " + score, 10, 30);
  text("Highscore: " + hoogsteScore, 10, 60);
  text("Medicijnen: " + medicijnen, 10, 120);

  // Teken de vijanden van Level 2
  for (var i = 0; i < vijandenLevel2.length; i++) {
    var vijand = vijandenLevel2[i];
    fill ('red');
          rect(vijand.x, vijand.y, vijand.breedte, vijand.hoogte);
        }

        // Schilder het schild van de speler
        if (schildActief) {
          fill(0, 0, 255, 100); // blauwe doorzichtige kleur
          ellipse(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, 50, 50);
        }
      }

      // Functie om het spel te resetten
      function resetSpel() {
        spelStatus = STARTSCHERM;
        medicijnen = 6;
        spelerX = 600;
        spelerY = 600;
        health = 1;
        vijandX = 100;
        vijandY = 200;
        vijandLevens = 300; 
        kogels = [];
        spelerKogels = []; // Reset de speler kogels
        score = 0; // Reset de score
      }


/* ********************************************* */
/* Level 1 functies                              */
/* ********************************************* */

function speelLevel1() {
  beweegAlles();
  beheerSchild();
  verwerkBotsing();
  verwerkSpelerBotsing();
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

  // Controleer of de vijand geraakt is door een spelerkogel
    for (var i = 0; i < spelerKogels.length; i++) {
      var kogel = spelerKogels[i];
      if (
        kogel.x > vijandX &&
        kogel.x < vijandX + vijandDiameter &&
        kogel.y > vijandY &&
        kogel.y < vijandY + vijandDiameter
      ) {
        vijandLevens--; // Verminder de levens van de vijand
        spelerKogels.splice(i, 1); // Verwijder de kogel
        i--;

        if (vijandLevens <= 0) {
          // Als vijand geen levens meer heeft, win je
          spelStatus = STARTSCHERM; // Terug naar het startscherm
          alert("Gewonnen!"); // Toon een bericht dat je gewonnen hebt
          resetSpel(); // Reset het spel
        }
      }
    }
  };

// Definieer verschillende kogeltypes
var kogelTypes = [
  { diameter: 10, snelheid: 3, patroon: 'cirkel' },  // normale kogels
  { diameter: 200, snelheid: 2, patroon: 'groot' },   // veel grotere kogels
  { diameter: 8, snelheid: 4, patroon: 'spiraal' }   // snellere spiraalkogels
];

// Functie om een kogel van de vijand te maken
var schietKogel = function() {
  // Normale en spiraalpatronen worden elke seconde afgeschoten
  if (frameCount % 120 === 0) {
    schietPatroon('cirkel');
    schietPatroon('spiraal');
  }
  // Grote kogels worden elke drie seconden afgeschoten
  if (frameCount % 600 === 0) {
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

// functie om kogels te maken
var maakKogels = function(type) {
  var kogelType = {
    diameter: 10,
    snelheid: 2
  };
  if (type === 'spiraal') {
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

// Laden van afbeeldingen
var afbeeldingSpeler;
var afbeeldingVijand;



// functie om de speler te tekenen
var tekenSpeler = function() {
  image(afbeeldingSpeler, spelerX, spelerY, 50, 75);
};

// functie om de vijand te tekenen
var tekenVijand = function() {
  image(afbeeldingVijand, vijandX * 0.8 + 30, vijandY - 120, 400, 300);
};


// functie om speler kogels te schieten
var schietSpelerKogels = function() {
  if (frameCount % spelerFireRate === 0) {
    var kogel1 = {
      x: spelerX + spelerBreedte / 2 - 15,
      y: spelerY,
      breedte: 20,
      hoogte: 20,
      snelheidY: -spelerKogelSpeed,
      damage: spelerKogelDamage
    };
    var kogel2 = {
      x: spelerX + spelerBreedte / 2 + 15,
      y: spelerY - 50, 
      breedte: 20,
      hoogte: 20,
      snelheidY: -spelerKogelSpeed,
      damage: spelerKogelDamage
    };

    spelerKogels.push(kogel1, kogel2);
  }
};

// functie om de speler kogels te tekenen
var tekenSpelerKogels = function() {
  for (var i = 0; i < spelerKogels.length; i++) {
    var kogel = spelerKogels[i];
    drawCheeseburger(kogel.x, kogel.y, kogel.breedte, kogel.hoogte);
  }
};

var drawCheeseburger = function(x, y, breedte, hoogte) {
  // Teken het broodje onderkant
  fill('#D4A017');
  rect(x - breedte / 2, y + hoogte / 4, breedte, hoogte / 4);
  // Teken de hamburger
  fill('#A52A2A');
  rect(x - breedte / 2, y, breedte, hoogte / 4);
  // Teken de kaas
  fill('#FFD700');
  rect(x - breedte / 2, y - hoogte / 4, breedte, hoogte / 4);
  // Teken het broodje bovenkant
  fill('#D4A017');
  rect(x - breedte / 2, y - hoogte / 2, breedte, hoogte / 4);
};


// functie om de positie van de speler kogels te updaten
var beweegSpelerKogels = function() {
  for (var i = 0; i < spelerKogels.length; i++) {
    var kogel = spelerKogels[i];
    kogel.y += kogel.snelheidY;
    // Voeg zigzag beweging toe
    kogel.x += zigzagDirection * 3; // Zigzag snelheid
    zigzagOffset += 3;
    if (zigzagOffset >= 30) { // Zigzag afstand
      zigzagDirection *= -1;
      zigzagOffset = 0;
    }
    if (kogel.y < 0) {
      spelerKogels.splice(i, 1);
      i--;
    }
  }
};


// functie om botsingen tussen de speler en vijandelijke kogels te verwerken
var verwerkSpelerBotsing = function() {
  for (var i = 0; i < kogels.length; i++) {
    var kogel = kogels[i];
    if (
      spelerX < kogel.x + kogel.diameter &&
      spelerX + spelerBreedte > kogel.x &&
      spelerY < kogel.y + kogel.diameter &&
      spelerY + spelerHoogte > kogel.y
    ) {
      // Verwijder de kogel en verminder de gezondheid van de speler
      kogels.splice(i, 1);
      if (!schildActief) {
        medicijnen--;
        if (medicijnen <= 0) {
          spelStatus = GAMEOVER;
        }
      }
      i--;
    }
  }
};

// functie om alle objecten te tekenen
var tekenAlles = function() {
  background('black');
  tekenSpeler();
  tekenVijand();
  tekenKogels();
  tekenSpelerKogels(); // Teken de speler kogels
  fill("white");
  textSize(24);
  text("Score: " + score, 10, 30);
  text("Highscore: " + hoogsteScore, 10, 60);
  text("Medicijnen: " + medicijnen, 10, 120);
  // Teken het aantal levens van de vijand
  fill('white');
  textSize(20);
  text("Vijand Levens: " + vijandLevens, width - 150, 30);
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
  spelerX = constrain(spelerX, 0, width - spelerBreedte);
  spelerY = constrain(spelerY, 0, height - spelerHoogte);
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
      health -= 100;
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
  beweegSpelerKogels(); // Beweeg de speler kogels
  schietSpelerKogels(); // Schiet speler kogels
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
   image(img3, 800, 250, 500, 500);
}