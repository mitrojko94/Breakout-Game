const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

// How many rows and columns bricks will have
const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (x - right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * - 1;
  }

  // Wall collision (y - top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) == 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

// Kratko objasnjenje:
// Za vise informacija o canvasu mogu naci na https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
// Varijabla rules je ona sto sadrzi pravila igre i zato nad njom stavljam i skidam klasu show, koja ima osobine za prikaz pravila
// Da bih kreirao canvas, samo je potrebno da ga pozovem i da nad njim pozovem getContext("2d")
// Pravim neka svojstva za ball i posto zelim da mi je lopta na sredini, zato delim sirini u visinu kanvasa sa 2. dx je smer kretanja lopte po X osi, a dy po Y osi. Negativan je broj za dy, jer hocu da lopta ide gore, da je pozitivan isla bi dole
// Kreiram loptu tako sto koristim arc metodu. Prvi parametar x osa, drugi y osa, treci radijus kruga, cetvrti je 0, da bih imao pravi krug. Posto se to ne vidi, moram da stavim fillStyle da bi se videlo i na kraju da pozovem fill() metodu da bih imao na ekranu
// Za paddle isto stavljam neka svojstva. I stavljam tu samo dx, jer ce paddle da se krece samo po X osi
// Kad pravim paddle (f-ja drawPaddle) koristim rect metodu za pravougaonik. Ona zahteva prvi parametar x osa, drugi y osa, treci sirina i cetvrti visina
// Kad pravim score koristim ugradjene metode u canvas, tipa ctx.font gde definisem koji je font i koji size i da bih popunio koristim ctx.filLText, gde stavljam koji tekst hocu da imam kao prvi parametar, a kao drugi parametar je pozicija teksta na X osi, a treci pozicija teksta na Y osi
// Na X osi sam stavio da je tekst sirina kanvasa manje 100, tako da ne bude skroz na kraju, a na Y osi sam stavio da je 30, znaci da je od Y ose udaljen 30px
// Kad pravim svojstva za brick, stavljam sirinu, visinu, razmak, zatim offsetX to je pozicija na X osi, dok je offsetY pozicija na Y osi. I stavljma visible parametar koji je po defaultu true, a kad se pogodi postaje false
// Kad crtam bricks, koristim dva puta forEach metodu, jer u prvom putu dobijam column koji je isto niz, pa zbog toga nad njim opet zovem forEach metodu i na kraju tek dobijam bricks koji cu da crtam na canvasu
// Kad sam izvukao bricks iz drugog niza, koristim ctx.rect da nacrtam pravougaonik, koji ima cetri parametra, x osa, y osa, sirina i visina. Nakon toga koristim fillStyle da stavim boju pravougaoniku i ako je visible true onda je boja plava, a ako je false, onda je transparent tj. providan
// Na kraju crtanja bricksa kao pravougaonika i dodavanja boje, samo pozovem metodu fill() da se pojavi na ekranu korisnika i zatvorim path, pomocu closePath()
// Pravim f-je za pritisak dugmeta na tastaturi, to mi rade f-je keyDown za klik dugmeta i keyUp za pustanje tog dugmeta. To sam uradio nad celim dokumentom
// Funkcija keyDown proverava da li je e.key zapravo leva ili desna strelica. Ako je desna, on pomera paddle.dx po X osi za brzinu paddle, a ako je levo, samo oduzima brzinu paddle
// U f-ji draw() prvo sam stavio ctx.clearRect(), jer moram da izbrisem sve sto se nalazi u pravougaoniku, inace ce mi paddle biti ogromna linija, a ne mala linija. Prosledim mu parametre, x osa, y osa, sirina i visina canvasa
// U f-ji keyUp() pravim tako sto proveravam da li mi je e.key jednak levo ili desno i ako jeste stavljam da je paddle.dx po X osi jednak 0, to znaci da kad ga pomerim i pustim strelicu da on stane, jer sam pustio dugme i vrednost po X osi je 0
// Za kretanje loptice pravim po X i Y osi, po X osi proveravam da li je x osa i size veci od sirine kanvasa ili manji od 0, ako jeste mnozim dx lopte sa -1. To isto radim i sa Y osom, samo koristim dy
// Za unistenje pravougaonika, gledam sve strane, da li lopta dodiruje i ako dodiruje mnozim dy sa -1 i stavljam da je brick.visible jednak false, a to znaci da je transparent tj. providan, tako sam definisao kad sam crtao bricks
// Da vidim da li je korisnik izgubio proveravam da li je ball.y i ball.size vece od visine kanvasa, ako jeste, izgubio sam i stavljam score na 0 i stavljam f-ju da se ponovo prikazu pravougaonici
// Da bih dobio ponovo sve pravougaonike, samo stavim da je njihov visible true
// Da bih povecao score za 1, moram da koristim modul operator (%), da vidim da nije ostala neka kockica. To gledam tako sto proveravam da li je jednako 0, ako jeste, znaci da nema kockica i ponovo ih ucitam
