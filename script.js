/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */
const SPELEN = 1;
const GAMEOVER = 2;
const STARTSCHERM = 0;
var spelStatus = STARTSCHERM;
var levens = 3; // aantal levens van de speler
var schildTijd = 2; // tijd in seconden voor het schild
var schildActief = false; // geeft aan of het schild actief is
var schildBeginTijd = 0; // tijd waarop het schild begint

var spelerBreedte = 50; // breedte van de speler (2 keer kleiner)
var spelerHoogte = 50; // hoogte van de speler (2 keer kleiner)
var spelerX = 600; // x-positie van speler
var spelerY = 600; // y-positie van speler
var health = 100;  // health van speler

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
  levens = 3;
  spelerX = 600;
  spelerY = 600;
  health = 100;
  vijandX = 100;
  vijandY = 200;
  kogels = [];
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

// functie om een kogel van de vijand te maken
var schietKogel = function() {
  if (frameCount % 60 === 0) { // schiet elke seconde
    for (var i = 0; i < 20; i++) { // schiet 20 kogels tegelijkertijd
      var hoek = TWO_PI / 20 * i; // bereken hoek voor patroon
      var kogel = {
        x: vijandX,
        y: vijandY,
        diameter: 10,
        snelheidX: cos(hoek) * 5, // x-snelheid volgens hoek
        snelheidY: sin(hoek) * 5 // y-snelheid volgens hoek
      };
      kogels.push(kogel); // voeg kogel toe aan de array
    }
  }
};

// functie om de vijand te tekenen als Sakuya van Touhou
var tekenVijand = function() {
  fill('silver'); // zilverkleur voor Sakuya
  ellipse(vijandX, vijandY, vijandDiameter, vijandDiameter); // teken de vijand als een cirkel
  fill('black');
  ellipse(vijandX - 20, vijandY - 10, 20, 20); // linkeroog
  ellipse(vijandX + 20, vijandY - 10, 20, 20); // rechteroog
  rect(vijandX - 20, vijandY + 10, 40, 10); // mond
};

// functie om kogels van de vijand te tekenen
var tekenKogels = function() {
  fill('red'); // kleur van kogels
  for (var i = 0; i < kogels.length; i++) {
    ellipse(kogels[i].x, kogels[i].y, kogels[i].diameter, kogels[i].diameter);
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
      levens--;
      if (levens > 0) {
        respawnSpeler(); // respawn de speler als hij levens over heeft
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
        levens--;
        if (levens > 0) {
          respawnSpeler(); // respawn de speler als hij levens over heeft
          schildActief = true;
          schildBeginTijd = millis();
        }
      }
    }
  }

  // update punten en health
};

// functie om de speler te laten respawnen met een schild
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


  fill("goldenrod"); 
  ellipse(spelerX + spelerBreedte / 2, spelerY + spelerHoogte / 2, spelerBreedte, spelerHoogte); 
  fill("black");
  ellipse(spelerX + 30, spelerY + 15, 10, 10); 
  ellipse(spelerX + 70, spelerY + 15, 10, 10); 
  rect(spelerX + 25, spelerY + 30, 50, 10); 

  // punten en health
  fill("white");
  text("Levens: " + levens, 10, 20);
};

// functie om het game-over scherm te tekenen
var tekenGameOverScherm = function() {
  background('black');
  fill('white');
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  textSize(30);
  text("Opnieuw spelen", width / 2, height / 2 + 50);
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
    if (levens <= 0) {
      spelStatus = GAMEOVER;
    }
  }
  if (spelStatus === GAMEOVER) {
    tekenGameOverScherm();
  }
}
