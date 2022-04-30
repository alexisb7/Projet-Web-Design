// Script pour le jeu de Ball-trap 

//Classe Game pour trier les scores
class Game {
//on utilise une classe ici pour lier les noms/scores/temps/nbcibles entre eux via un objet regroupant toutes ces données
//on peut ensuite trier les scores correspondant à une partie donnée avec ses attributs : le nom du joueur, son temps, etc..

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

//Variables globales
let time = 0; //temps
let nb_target = 0; //nombre de cibles 
let chrono = null; //id du chrono

//Affiche le tableau des scores au chargement de la page
if (document.readyState === 'complete') {
    printScores();
} 
else {
    document.addEventListener('DOMContentLoaded', function() {
      printScores();
    });
}

/* Démarre une partie */
function startGame() { 
    clearGround(); //reset le terrain et le chrono
    nb_target = document.getElementById("nbtargets").value;
    for(let i=0; i<nb_target; i++){
        createTarget(); //créé le nb de cibles demandées
    }
    document.getElementById("remaining").innerHTML = "" + nb_target;
    startChrono(); //démarre le chrono
}
 /* Création d'un objet cible */
function createTarget() { 
    const target = document.createElement("div"); 
    //attributs de l'élément cible
    const terrain = document.getElementById("terrain");
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
    const img = "images/" + "cible-"+ (Math.floor(Math.random() * 21)) + ".png";
    target.style.backgroundImage = "url("+ '"'+img +'"'+")";
    document.getElementById("terrain").appendChild(target); //élément enfant du terrain
    positionTarget(target.id); 
}

/* Positionnement aléatoire de la cible */
function positionTarget(id_target) { 
    const terrain = document.getElementById("terrain");
    const t_width= terrain.style.width;
    const t_height = terrain.style.height;
    //génération de coordonnées aléatoires pour top et left 
    const target_top = Math.floor(Math.random() * parseInt(t_height.substring(0,2))*9);
    const target_left = Math.floor(Math.random() * parseInt(t_width.substring(0,2))*9);
    const left_position = target_left + "px";
    const top_position = target_top + "px";
    //application au style de l'élément 
    document.getElementById(id_target).style.top=top_position;
    document.getElementById(id_target).style.left=left_position;
}

/* Démarrage du chrono */
function startChrono() {
    chrono = setInterval(updateChrono, 100);//incrémente le chrono toutes les 100ms
}
 /* Maj de l'affichage du chrono */
function updateChrono() { 
    time++;//temps en dixième de seconds
    //éléments HTML du chrono
    const tenth = document.getElementById("tenth");
    const seconds = document.getElementById("seconds");
    const minutes = document.getElementById("minutes");
    //gestion de l'affichage du chrono 
    if(time > 9 && time < 100) { 
        let sec = time.toString().substring(0,1);
        let ten = time.toString().substring(1,);
        seconds.innerHTML = "0"+sec;
        tenth.innerHTML = ""+ten;
    }
    else if(time > 100 && time < 600) {
        let sec = time.toString().substring(0,2);
        let ten = time.toString().substring(2,);
        seconds.innerHTML = ""+sec;
        tenth.innerHTML = ""+ten;
    }
    else if(time > 600) {
        let min = Math.floor(time/600);
        let rest = time % 600;
        if(rest > 9 && rest < 100) {
            let sec = rest.toString().substring(0,1);
            let ten = rest.toString().substring(1,);
            minutes.innerHTML = ""+min;
            seconds.innerHTML = "0"+sec;
            tenth.innerHTML = ""+ten;
        }
        else if(rest > 100 && rest < 600) {
            let sec = rest.toString().substring(0,2);
            let ten = rest.toString().substring(2,);
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
 /* Nettoie le terrrain  */
function clearGround() { 
    clearInterval(chrono);
    time = 0;
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("tenth").innerHTML = "0";
    const terrain = document.getElementById("terrain");
    const targets = document.getElementsByClassName("target");
    for(let j = 0; j < targets.length; j++) {
        targets[j].style.opacity = 0;
        terrain.removeChild(targets[j]); //supprime les éléments enfants du terrain
        j--;
    }
}
 /* Fin du jeu / Affichage du score */
function endGame() { 
    if(nb_target == 0){
        clearInterval(chrono);
        saveGame();
        time = 0;
    }
}
 /* Sauvegarde de la partie jouée */
function saveGame() { 
    //récupère les données de la partie
    const name = document.getElementById("nom").value;
    const targets = document.getElementById("nbtargets").value;
    const score = targets / (time * 0.1); //score en s 
    if(localStorage.getItem("list_names") != null){ //vérifie si des parties ont été jouées avant
        const list_names = localStorage.getItem("list_names"); //récupère le string stockant les noms 
        let names = list_names.split(","); //création d'un tableau de noms
        names.push(name); //ajout de la dernière partie
        localStorage.setItem("list_names", names); //maj de l'item dans le localstorage
        const list_scores = localStorage.getItem("list_scores");
        let scores = list_scores.split(",");
        scores.push(Math.round(score * 1000) / 1000);
        localStorage.setItem("list_scores", scores);
        const list_targets = localStorage.getItem("list_targets");
        let t_targets = list_targets.split(",");
        t_targets.push(targets);
        localStorage.setItem("list_targets", t_targets);
        const list_times = localStorage.getItem("list_times");
        let times = list_times.split(",");
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
 /* Affichage des scores */
function printScores() { 
    //récupère les données de la partie
    const name = document.getElementById("nom").value;
    const targets = document.getElementById("nbtargets").value;
    const score = Math.round((targets / (time * 0.1)) * 1000) / 1000;
    const table = document.createElement("table"); //création d'un élément tableau
    table.id = "scoretable";
    //affectation de styles sur le tableau
    table.style.marginTop = "10px";
    table.style.width = "464px";
    table.style.borderCollapse = "collapse";
    table.style.border = "solid rgba(92, 114, 69, 0.952)";
    const thead = table.createTHead(); //création d'en-tetes sur le tableau
    let row = thead.insertRow(); //ajout d'une ligne
    row.style.backgroundColor = "rgba(161, 192, 127, 0.952)";
    row.style.borderBottom = "solid rgba(92, 114, 69, 0.952)";
    let cell = row.insertCell(); //ajout d'une cellule
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
        const tbody = table.createTBody(); //création du corps du tableau
        tbody.style.backgroundColor = "#edf0f1";
        const list_names = localStorage.getItem("list_names");
        const names = list_names.split(",");
        const list_scores = localStorage.getItem("list_scores");
        const scores = list_scores.split(",");
        const list_targets = localStorage.getItem("list_targets");
        const t_targets = list_targets.split(",");
        const list_times = localStorage.getItem("list_times");
        const times = list_times.split(",");
        let tabGames = []; //création d'un tableau d'objets Game
        for(let i = 0 ; i < names.length ; i++){
            let game = new Game(names[i], scores[i], t_targets[i], times[i]); //création d'un objet Game pour chaque partie jouée
            tabGames.push(game); //ajout au tableau
            game.sortGames(tabGames); //appel à la méthode de tri des scores
        }
        let bool = false; //bool pour vérifier si on a affiché la partie jouée
        if(tabGames.length > 20){ //controle du nb de parties affichées 
            //on n'affiche que les 19 meilleures parties et/y compris celle venant d'etre jouée
            for(i = 0; i < 19 ; i++){
                let index = i+1;
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
            for(let i = 0; i < tabGames.length ; i++){
                let index = i+1;
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



	

