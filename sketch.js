// Variáveis principais
let madeira = 0;
let taxaAutomatica = 0;
let ultimaAtualizacao = 0;

let precoUpgrade1 = 10;
let nivelUpgrade1 = 0;

let folhasExplodindo = []; // Partículas das folhas no clique

// Som
let osc;
let tocandoSom = false;

function setup() {
  createCanvas(500, 500);
  textAlign(CENTER, CENTER);
  ultimaAtualizacao = millis();

  // Configura som simples
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function draw() {
  // Desenha fundo e elementos
  desenharFundo();

  // Gera madeira automaticamente a cada segundo
  let agora = millis();
  if (agora - ultimaAtualizacao >= 1000) {
    madeira += taxaAutomatica;
    ultimaAtualizacao = agora;
  }

  // Desenha árvore e interface
  desenharArvore();
  desenharFolhas();
  desenharUI();
}

function desenharFundo() {
  // Céu com gradiente
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(0, 70, 140), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Grama
  noStroke();
  fill(30, 150, 30);
  rect(0, height * 0.75, width, height * 0.25);
}

function desenharArvore() {
  // Tronco
  fill(101, 67, 33);
  rect(220, 300, 60, 120, 10);

  // Textura no tronco
  stroke(80, 50, 20);
  for (let i = 305; i < 420; i += 10) {
    line(230, i, 270, i + 5);
  }
  noStroke();

  // Copa da árvore (folhas)
  fill(34, 139, 34);
  ellipse(250, 230, 180, 180);
  fill(25, 120, 25);
  ellipse(230, 210, 70, 80);
  ellipse(270, 210, 80, 70);
  ellipse(250, 180, 110, 100);
}

function desenharFolhas() {
  // Partículas de folhas explodindo ao clicar
  for (let i = folhasExplodindo.length - 1; i >= 0; i--) {
    let f = folhasExplodindo[i];
    fill(30, 160, 30, f.alpha);
    noStroke();
    ellipse(f.x, f.y, f.size);
    f.x += f.vx;
    f.y += f.vy;
    f.alpha -= 4;
    f.vy += 0.1;

    if (f.alpha <= 0) {
      folhasExplodindo.splice(i, 1);
    }
  }
}

function desenharUI() {
  // Painel inferior
  fill(0, 100, 0, 200);
  rect(0, 440, width, 60);

  // Texto de madeira
  textSize(30);
  fill(0, 0, 0, 150);
  text("Madeira: " + floor(madeira), width / 2 + 2, 50 + 2);
  fill(255);
  text("Madeira: " + floor(madeira), width / 2, 50);

  // Texto da taxa automática
  textSize(16);
  fill(255, 255, 255, 180);
  text("Madeira por segundo: " + taxaAutomatica, width / 2, 80);

  // Botão de upgrade
  let mx = mouseX;
  let my = mouseY;
  let btnX = 150;
  let btnY = 450;
  let btnW = 200;
  let btnH = 40;

  if (mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH) {
    fill(80, 160, 80);
    cursor(HAND);
  } else {
    fill(50, 120, 50);
    cursor(ARROW);
  }
  rect(btnX, btnY, btnW, btnH, 12);

  // Texto do botão
  fill(255);
  textSize(18);
  if (madeira >= precoUpgrade1) {
    text("Comprar Serraria (" + precoUpgrade1 + ")", btnX + btnW / 2, btnY + btnH / 2 + 3);
  } else {
    fill(200, 200, 200, 180);
    text("Serraria (" + precoUpgrade1 + ")", btnX + btnW / 2, btnY + btnH / 2 + 3);
  }

  // Mostra nível da serraria
  fill(255);
  textSize(14);
  text("Nível da Serraria: " + nivelUpgrade1, width / 2, btnY - 20);
}

function mousePressed() {
  // Verifica clique na copa da árvore
  let d = dist(mouseX, mouseY, 250, 230);
  if (d < 90) {
    ganharMadeira(mouseX, mouseY);
  }

  // Verifica clique no botão upgrade
  if (mouseX > 150 && mouseX < 350 && mouseY > 450 && mouseY < 490) {
    comprarSerraria();
  }
}

function keyPressed() {
  // Permite usar espaço como clique na árvore
  if (key === ' ' || key === 'Spacebar') {
    ganharMadeira(250, 230);
  }
}

function ganharMadeira(x, y) {
  // Incrementa madeira, gera som e folhas
  madeira++;
  tocarSomClique();
  gerarFolhas(x, y);
}

function comprarSerraria() {
  // Verifica se há madeira suficiente e compra
  if (madeira >= precoUpgrade1) {
    madeira -= precoUpgrade1;
    nivelUpgrade1++;
    taxaAutomatica += 1;
    precoUpgrade1 = floor(precoUpgrade1 * 1.5);
    tocarSomClique();
  }
}

function gerarFolhas(x, y) {
  // Gera partículas visuais no clique
  for (let i = 0; i < 15; i++) {
    folhasExplodindo.push({
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-3, -1),
      size: random(4, 8),
      alpha: 255
    });
  }
}

function tocarSomClique() {
  // Som simples de clique
  if (!tocandoSom) {
    tocandoSom = true;
    osc.freq(600);
    osc.amp(0.2, 0.05);
    setTimeout(() => {
      osc.amp(0, 0.1);
      tocandoSom = false;
    }, 150);
  }
}
