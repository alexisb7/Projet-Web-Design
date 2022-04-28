// Script pour le jeu de Ball-trap 

//Classe Game pour trier les scores
class Game {
//on utilise une classe ici pour lier les noms/scores/temps/nbcibles entre eux via un objet regroupant toutes ces données
//on peut ensuite trier les scores correspondant à une partie donnée avec le nom du joueur, son temps, etc..

    //Constructeur de la classe
    constructor(name, score, targets, time) {
        this.name = name;
        this.score = score;
        this.targets = targets;
        this.time = time;
    }

    //Méthode de tri décroissante des scores 
    sortGames(tabGames) {
        tabGames.sort((x, y) => y.score - x.score);
    }
}

var time = 0; //timer variable
var nb_target = 0; //nombre de cibles 
var chrono = null; //id du chrono

//Affiche le tableau des scores au chargement de la page
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

function updateChrono() { //Maj de l'affichage du chrono
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

function clearGround() { //Nettoie le terrrain 
    clearInterval(chrono);
    time = 0;
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("tenth").innerHTML = "0";
    var terrain = document.getElementById("terrain");
    var targets = document.getElementsByClassName("target");
    for(var j = 0; j < targets.length; j++) {
        targets[j].style.opacity = 0;
        terrain.removeChild(targets[j]); //supprime les éléments enfants du terrain
        j--;
    }
}

function endGame() { //Fin du jeu / Affichage du score
    if(nb_target == 0){
        clearInterval(chrono);
        saveGame();
        time = 0;
    }
}

function saveGame() { //Sauvegarde de la partie jouée
    //récupère les données de la partie
    var name = document.getElementById("nom").value;
    var targets = document.getElementById("nbtargets").value;
    var score = targets / (time * 0.1); //score en s 
    if(localStorage.getItem("list_names") != null){ //vérifie si des parties ont été jouées avant
        var list_names = localStorage.getItem("list_names"); //récupère le string stockant les noms 
        var names = list_names.split(","); //création d'un tableau de noms
        names.push(name); //ajout de la dernière partie
        localStorage.setItem("list_names", names); //maj de l'item dans le localstorage
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
        document.getElementById("scoreboard").removeChild(document.getElementById("scoretable")); //supprime le précédent tableau des scores
        printScores(); //maj du tabscores
    }
    else { //aucune partie jouée avant --> 1er score
        localStorage.setItem("list_names", name);
        localStorage.setItem("list_scores", Math.round(score * 1000) / 1000); //arrondi 3 chiffres après la virgule
        localStorage.setItem("list_targets", targets);
        localStorage.setItem("list_times", Math.round((time * 0.1) * 10) / 10); //arrondi à 1 chiffre près
        document.getElementById("scoreboard").removeChild(document.getElementById("scoretable")); 
        printScores(); 
    }
}

function printScores() { //Affichage des scores
    //récupère les données de la partie
    var name = document.getElementById("nom").value;
    var targets = document.getElementById("nbtargets").value;
    var score = Math.round((targets / (time * 0.1)) * 1000) / 1000;
    var table = document.createElement("table"); //création d'un élément tableau
    table.id = "scoretable";
    //affectation de styles sur le tableau
    table.style.marginTop = "10px";
    table.style.width = "464px";
    table.style.borderCollapse = "collapse";
    table.style.border = "solid rgba(92, 114, 69, 0.952)";
    var thead = table.createTHead(); //création d'en-tetes sur le tableau
    var row = thead.insertRow(); //ajout d'une ligne
    row.style.backgroundColor = "rgba(161, 192, 127, 0.952)";
    row.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
    var cell = row.insertCell(); //ajout d'une cellule
    cell.appendChild(document.createTextNode("#")); //première colonne : classement
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Nom")); //deuxieme colonne : nom
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Score (cibles/s)")); //troisieme colonne : score
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Cibles")); //quatrieme colonne : nb de cibles
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)"; 
    cell = row.insertCell();
    cell.appendChild(document.createTextNode("Temps")); //cinquieme colonne : temps
    cell.style.borderRight = "solid rgba(92, 114, 69, 0.952)";
    if(localStorage.getItem("list_targets") != null){ //vérifie si des parties ont déjà été jouées
        var tbody = table.createTBody(); //création du corps du tableau
        tbody.style.backgroundColor = "#edf0f1";
        var list_names = localStorage.getItem("list_names");
        var names = list_names.split(",");
        var list_scores = localStorage.getItem("list_scores");
        var scores = list_scores.split(",");
        var list_targets = localStorage.getItem("list_targets");
        var t_targets = list_targets.split(",");
        var list_times = localStorage.getItem("list_times");
        var times = list_times.split(",");
        var tabGames = []; //création d'un tableau d'objets Game
        for(var i = 0 ; i < names.length ; i++){
            var game = new Game(names[i], scores[i], t_targets[i], times[i]); //création d'un objet Game pour chaque partie jouée
            tabGames.push(game); //ajout au tableau
            game.sortGames(tabGames); //appel à la méthode de tri des scores
        }
        var bool = false; //bool pour vérifier si on a affiché la partie jouée
        if(tabGames.length > 20){ //controle du nb de parties affichées 
            //on n'affiche que les 19 meilleures parties et/y compris celle venant d'etre jouée
            for(i = 0; i < 19 ; i++){
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
                if(tabGames[i].name == name && tabGames[i].score == score && !bool){ //colorie la ligne de la partie jouée en vert
                    row.style.backgroundColor = "#80e972";
                    bool = true;
                }
            }
            if(bool == false) { //si la partie jouée n'est pas dans les 19 meilleures, on l'ajoute en bas du tableau 
                for(i = 19 ; i < tabGames.length ; i++){
                    if(tabGames[i].name == name && tabGames[i].score == score){
                        row = tbody.insertRow();
                        cell = row.insertCell();
                        cell.appendChild(document.createTextNode(i+1));
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
                        row.style.backgroundColor = "#80e972";
                        bool = true;
                    }
                }
            }
        }
        else { //si on a moins de 20 parties jouées, on les affiche toutes
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
        }  
        document.getElementById("scoreboard").appendChild(table); //ajout du tableau en tant qu'enfant de l'élément scoreboard
    }
    else { //si aucune partie jouée, on n'a que les en-tetes du tableau
        document.getElementById("scoreboard").appendChild(table);
    }
}



	

