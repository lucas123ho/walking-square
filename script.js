let arenaPixels = [];
let copiaPixels = [];
let arenaWidth = 3;
let arenaHeight = 3;
const containerAtena = document.getElementById("arena");
const containerInterface = document.getElementById("interface");
const containerMsg = document.querySelector(".msg");
const containerPontuacao = document.querySelector(".pontuacao");
const center = Math.floor((arenaHeight*arenaWidth)/2);
let obstaculos = [];
let currentPixel = 0;
let dificuldade = 3;
const colors = ["#ff9900","#cc7a00","#804d00"];
let pontuacao = 0;

function start(){
    pontuacao = 0;
    startGame();
    renderArena();
}

function createArenaStructure(){
    arenaPixels = [];
    const arenaSize = arenaWidth * arenaHeight;
    for(let i=0;i<arenaSize;i++){
        arenaPixels[i] = 0;
    }
}

function startGame(){
    containerMsg.style.visibility = "hidden";
    createArenaStructure();
    arenaPixels[center] = 1;
    currentPixel = center;
    createObstaculos();
    document.onkeydown = controls;
    gerarInterface();
    renderPontuacao();
}

function renderArena(){
    let html = "<table>";
    for(let row = 0;row < arenaHeight;row++){
        html += "<tr>";
        for(let column = 0;column < arenaWidth;column++){
            const pixelIndex = column + (arenaWidth * row);
            const current = currentPixel == pixelIndex ? "current" : "";
            const valuePixel = arenaPixels[pixelIndex];
            const color = colors[valuePixel-1] ? colors[valuePixel-1] : "white";
            html += `<td class="${current}" style="background-color:${color}">`;
            // html += `<div class="index">${pixelIndex}</div>`;
            // html += valuePixel;
            html += "</td>";
        }
        html += "</tr>"
    }
    html += "</table>";
    containerAtena.innerHTML = html;
}

function controls(event){
    const keyCode = event ? event.keyCode : null;
    const KEY_DOWN = 40; 
    const KEY_UP = 38; 
    const KEY_LEFT = 37; 
    const KEY_RIGHT = 39;
    if(keyCode == KEY_DOWN){
        move("down");
    }else if(keyCode == KEY_LEFT){
        move("left");
    }else if(keyCode == KEY_UP){
        move("up");
    }else if(keyCode == KEY_RIGHT){
        move("right");
    }
}

function move(direction){
    let position = currentPixel;
    if(direction == "down"){
        position = position + arenaWidth;
    }else if(direction == "left"){
        position = position - 1;
    }else if(direction == "up"){
        position = position - arenaWidth;
    }else if(direction == "right"){
        position = position + 1;
    }
    if(position < arenaPixels.length && position >= 0){
        arenaPixels[position]++;
        const value = arenaPixels[position];
        if(value==1){
            pontuacao++;
        }else if(value==2){
            pontuacao--;
        }
        currentPixel = position;
        copiaPixels = [...arenaPixels];
        renderPontuacao();
    }
    renderArena();
    check();
}

function createObstaculos(){
    const area = arenaHeight*arenaWidth;
    const quantidade = Math.floor(area*0.05);
    for(let i = 0;i < quantidade;i++){
        const random = Math.floor(Math.random() * area-1);
        const randomPosition = random != currentPixel && obstaculos.indexOf(random) == -1 ? random : area;
        arenaPixels[randomPosition]++;
        // console.log(randomPosition)
        obstaculos.push(randomPosition);
    }
    renderArena();
}

function check(){
    const colisao = arenaPixels.filter(function(value){
        return value >= dificuldade;
    })
    const endGame = arenaPixels.filter(function(value){return value>=1 && value<dificuldade}).length == arenaPixels.length;
    // console.log(endGame);
    if(!endGame){
        if(colisao != false){
            // console.log("bateu");
            gameOver();
        }
    }else{
        win();
    }
    
    
}

function gameOver(){
    pontuacao -= Math.floor(pontuacao/2);
    containerMsg.innerHTML = "Game Over";
    document.onkeydown = function(){};
    // console.log(copiaPixels)
    let contador = 0;
    const temporizador = setInterval(function(){
        if(contador <= 6){
            if(contador%2 != 0){
                restituir();
                // console.log("Restituir:",copiaPixels);
            }else{
                zerarPixels();
                // console.log("Zerar:",arenaPixels);
            }
            renderArena();
        }else{
            clearInterval(temporizador);
            if(arenaHeight!=3 && arenaWidth!=3){
                arenaWidth -= 3;
                arenaHeight -= 3;
            }
            startGame();
            document.onkeydown = controls;
        }
        contador++;
    }, 200);
}

function win(){
    // pontuacao += 50;
    containerMsg.innerHTML = "You Win";
    document.onkeydown = function(){};
    // console.log(copiaPixels)
    let contador = 0;
    const temporizador = setInterval(function(){
        if(contador <= 6){
            if(contador%2 != 0){
                restituir();
                // console.log("Restituir:",copiaPixels);
            }else{
                zerarPixels();
                // console.log("Zerar:",arenaPixels);
            }
            renderArena();
        }else{
            clearInterval(temporizador);
            arenaWidth += 3;
            arenaHeight += 3;
            startGame();
            document.onkeydown = controls;
        }
        contador++;
    }, 200);
}

function zerarPixels(){
    containerMsg.style.visibility = "hidden";
    for(let i = 0;i<arenaPixels.length;i++){
        arenaPixels[i] = 0;
    }
}
function restituir(){
    containerMsg.style.visibility = "visible";
    for(let i=0;i<arenaPixels.length;i++){
        arenaPixels[i] = copiaPixels[i];
    }
}


function gerarInterface(){
    containerInterface.innerHTML = `${arenaWidth}X${arenaHeight}`
}

function renderPontuacao(){
    containerPontuacao.innerHTML = pontuacao;
}

start()