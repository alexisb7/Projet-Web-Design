class Game {

    constructor(name, score, targets, time) {
        this.name = name;
        this.score = score;
        this.targets = targets;
        this.time = time;
    }

    sortGames(tabGames) {
        tabGames.sort((x, y) => y.score - x.score);
    }
}

// Script pour le jeu de Ball-trap 
var time = 0; //timer variable
var nb_target = 0; //nombre de cibles 
var chrono = null; //id du chrono

if (document.readyState === 'complete') {
    printScores();
} 
else {
    document.addEventListener('DOMContentLoaded', function() {
      printScores();
    });
}

function startGame() { //démarre une partie
    clearGround(); //reset le terrain et le chrono
    nb_target = document.getElementById("nbtargets").value;
    for(var i=0; i<nb_target; i++){
        createTarget(); //créé le nb de cibles demandées
    }
    document.getElementById("remaining").innerHTML = "" + nb_target;
    startChrono(); //démarre le chrono
}

function createTarget() { //création d'un objet cible
    var target = document.createElement("div"); 
    //attributs de l'élément cible
    var terrain = document.getElementById("terrain");
    target.id = "target-" + (terrain.childElementCount +1); 
    target.className = "target";
    target.onclick = function() { //efface l'élément du terrain 
        target.style.opacity = 0;
        terrain.removeChild(target); //supprime l'élément vav de son parent
        nb_target--;
        document.getElementById("remaining").innerHTML = "" + nb_target;
        endGame(); //vérifie s'il reste des cibles --> fin du jeu si oui
    };
    //image aléatoire pour l'élément
    var img = "images/" + "cible-"+ (Math.floor(Math.random() * 21)) + ".png";
    target.style.backgroundImage = "url("+ '"'+img +'"'+")";
    document.getElementById("terrain").appendChild(target); //élément enfant du terrain
    positionTarget(target.id); 
}

function positionTarget(id_target) { //positionnement aléatoire de la cible
    var terrain = document.getElementById("terrain");
    var t_width= terrain.style.width;
    var t_height = terrain.style.height;
    //génération de coordonnées aléatoires pour top et left 
    var target_top = Math.floor(Math.random() * parseInt(t_height.substring(0,2))*9);
    var target_left = Math.floor(Math.random() * parseInt(t_width.substring(0,2))*9);
    var left_position = target_left + "px";
    var top_position = target_top + "px";
    //application au style de l'élément 
    document.getElementById(id_target).style.top=top_position;
    document.getElementById(id_target).style.left=left_position;
}

//démarrage du chrono
function startChrono() {
    chrono = setInterval(updateChrono, 100);//incrémente le chrono toutes les 100ms
}

function updateChrono() {
    time++;//temps en dixième de seconds
    //éléments HTML du chrono
    var tenth = document.getElementById("tenth");
    var seconds = document.getElementById("seconds");
    var minutes = document.getElementById("minutes");
    //gestion de l'affichage du chrono 
    if(time > 9 && time < 100) { 
        var sec = time.toString().substring(0,1);
        var ten = time.toString().substring(1,);
        seconds.innerHTML = "0"+sec;
        tenth.innerHTML = ""+ten;
    }
    else if(time > 100 && time < 600) {
        var sec = time.toString().substring(0,2);
        var ten = time.toString().substring(2,);
        seconds.innerHTML = ""+sec;
        tenth.innerHTML = ""+ten;
    }
    else if(time > 600) {
        var min = Math.floor(time/600);
        var rest = time % 600;
        if(rest > 9 && rest < 100) {
            var sec = rest.toString().substring(0,1);
            var ten = rest.toString().substring(1,);
            minutes.innerHTML = ""+min;
            seconds.innerHTML = "0"+sec;
            tenth.innerHTML = ""+ten;
        }
        else if(rest > 100 && rest < 600) {
            var sec = rest.toString().substring(0,2);
            var ten = rest.toString().substring(2,);
            minutes.innerHTML = ""+min;
            seconds.innerHTML = ""+sec;
            tenth.innerHTML = ""+ten;
        }
        else {
            minutes.innerHTML = ""+min;
            seconds.innerHTML = "00";
            tenth.innerHTML = ""+rest;
        }
    }
    else {
        tenth.innerHTML = ""+time;
    }
}

function clearGround() {
    clearInterval(chrono);
    time = 0;
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("tenth").innerHTML = "0";
    var terrain = document.getElementById("terrain");
    var targets = document.getElementsByClassName("target");
    for(var j = 0; j < targets.length; j++) {
        targets[j].style.opacity = 0;
        terrain.removeChild(targets[j]);
        j--;
    }
}

function endGame() {
    if(nb_target == 0){
        clearInterval(chrono);
        saveGame();
        time = 0;
    }
}

function saveGame() {
    var name = document.getElementById("nom").value;
    var targets = document.getElementById("nbtargets").value;
    var score = targets / (time * 0.1);
    if(localStorage.getItem("list_names") != null){
        var list_names = localStorage.getItem("list_names");
        var names = list_names.split(",");
        names.push(name);
        localStorage.setItem("list_names", names);
        var list_scores = localStorage.getItem("list_scores");
        var scores = list_scores.split(",");
        scores.push(Math.round(score * 1000) / 1000);
        localStorage.setItem("list_scores", scores);
        var list_targets = localStorage.getItem("list_targets");
        var t_targets = list_targets.split(",");
        t_targets.push(targets);
        localStorage.setItem("list_targets", t_targets);
        var list_times = localStorage.getItem("list_times");
        var times = list_times.split(",");
        times.push(Math.round((time * 0.1) * 10) / 10);
        localStorage.setItem("list_times", times);
        document.getElementById("scoreboard").removeChild(document.getElementById("scoretable"));
        printScores();
    }
    else{
        localStorage.setItem("list_names", name);
        localStorage.setItem("list_scores", score);
        localStorage.setItem("list_targets", targets);
        localStorage.setItem("list_times", (time * 0.1));
        printScores();
    }
}

function printScores() {
    var name = document.getElementById("nom").value;
    var targets = document.getElementById("nbtargets").value;
    var score = Math.round((targets / (time * 0.1)) * 1000) / 1000;
    var scoreboard = document.getElementById("scoreboard");
    var table = document.createElement("table");
    table.id = "scoretable";
    table.style.marginTop = "10px";
    table.style.width = "449px";
    table.style.borderCollapse = "collapse";
    table.style.border = "solid rgba(92, 114, 69, 0.952)";
    var thead = table.createTHead();
    var row = thead.insertRow();
    row.style.backgroundColor = "rgba(161, 192, 127, 0.952)";
    row.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
    var cell = row.insertCell();
    cell.appendChild(document.createTextNode("#"));
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Nom"));
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Score"));
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Cibles"));
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Temps"));
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    if(localStorage.getItem("list_targets") != null){
        var tbody = table.createTBody();
        tbody.style.backgroundColor = "#edf0f1";
        var list_names = localStorage.getItem("list_names");
        var names = list_names.split(",");
        var list_scores = localStorage.getItem("list_scores");
        var scores = list_scores.split(",");
        var list_targets = localStorage.getItem("list_targets");
        var t_targets = list_targets.split(",");
        var list_times = localStorage.getItem("list_times");
        var times = list_times.split(",");
        var tabGames = [];
        for(var i = 0 ; i < names.length ; i++){
            var game = new Game(names[i], scores[i], t_targets[i], times[i]);
            tabGames.push(game);
            game.sortGames(tabGames)
        }
        var bool = false;
        for(var i = 0; i < tabGames.length ; i++){
            var index = i+1;
            row = tbody.insertRow();
            cell = row.insertCell();
            cell.appendChild(document.createTextNode(index));
            cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
            cell.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
            cell = row.insertCell();
            cell.appendChild(document.createTextNode(tabGames[i].name));
            cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
            cell.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
            cell = row.insertCell();
            cell.appendChild(document.createTextNode(tabGames[i].score));
            cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
            cell.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
            cell = row.insertCell();
            cell.appendChild(document.createTextNode(tabGames[i].targets));
            cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
            cell.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
            cell = row.insertCell();
            cell.appendChild(document.createTextNode(tabGames[i].time));
            cell.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
            if(tabGames[i].name == name && tabGames[i].score == score && !bool){
                row.style.backgroundColor = "#80e972";
                bool = true;
            }
        }
        scoreboard.appendChild(table);
    }
    else {
        scoreboard.appendChild(table);
    }
}



	

