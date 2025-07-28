// Global Variables
var ref = [];
var qCount = 0;

var score = 0;
var numCorrect = 0;
var totalQs = 0;

var hintUsed = 0;
var hintOrder = [];

var correctAns = [];
var choices = [];

/* HELPER FUNCTIONS */

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* DATABASE HANDLERS */

// Queries database for shuffled question order and populates reference array
function queryShuffledOrder() { 
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "includes/getShuffledOrder.inc.php", true);

    xhr.onload = function() {
        if(this.status == 200) {
            var response = JSON.parse(this.responseText);

            for (var i in response) {
                ref.push(response[i].id);
            }
            
            totalQs = ref.length;
            updateGame();
        }
    };

    xhr.send();
}

// Queries database for the name and url of the group for the current question and populates the correctAns array
function queryCorrectAnswer(){

    var id = ref[qCount];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "includes/getCorrectAnswer.inc.php?id=" + id, true);

    xhr.onload = function() {
        if(this.status == 200) {
            var response = JSON.parse(this.responseText);
            
            correctAns[0] = response[0].name;
            correctAns[1] = response[0].url;

            updateImage();
            queryWrongAnswers();
        
        }
    };

    xhr.send();
}

// Queries the database for 4 group names that do not correspond to the correct answer and populates them in the choices array
function queryWrongAnswers(){

    var id = ref[qCount];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "includes/getWrongAnswers.inc.php?id=" + id, true);

    xhr.onload = function() {
        if(this.status == 200) {
            var response = JSON.parse(this.responseText);

            for (var i in response) {
                choices[i] = response[i].name;
            }

            updateChoices();
        
        }
    };

    xhr.send();
}

/* MAIN GAME FUNCTIONS */

// Hiding the welcome UI elements and shows the game UI elements in the view to indicate start of game
function startGame() {
    document.getElementsByClassName("home-page")[0].style.display = "none";
    document.getElementsByClassName("game-page")[0].style.display = "block";
    
    queryShuffledOrder(); // Querying the database for shuffled question order
}

// Updating general game components
function updateGame() {
    queryCorrectAnswer(); // Querying the database for the name and url that corresponds to the current question
    
    score = (numCorrect/totalQs) * 100;   // Updating user's score

    // Updating gameplay UI elements
    document.getElementById("qstn-num").textContent = "Question # " + (qCount + 1);
    document.getElementById("score").textContent = "Score: " +  score + "%";

}

// Updating the image currently being displayed
function updateImage() {
    var randImg = document.getElementById("pic");
    randImg.setAttribute("src", correctAns[1]);                 // url
    randImg.setAttribute("alt", "Image of " + correctAns[0]);   // name
}

// Updating the answer choices for the current question
function updateChoices(){

    for (var n = 1; n <= 4; ++n) // Looping to assign values to multiple choice buttons (1, 2, 3, and 4)
    {	

        // Creating the buttons for our multiple choice answers, assigning the values, and adding event listeners
        choice = document.getElementById("opt-" + n);
        choice.setAttribute("type", "button");
        choice.setAttribute("value", choices[n - 1]);		           
        choice.setAttribute("onclick", "buttonClicked(this)");	
        
    } 

    // Replacing one of the wrong answers (randomly) with the correct answer
    var randButton = getRandomInt(1, 4);
    correctButton = document.getElementById("opt-" + randButton);
    correctButton.setAttribute("value", correctAns[0]);
}

// onclick function for user selection
function buttonClicked(self) {
    var userAns = self.getAttribute("value");

    if (userAns == correctAns[0])
    { 
        console.log("Correct!");
        numCorrect++; 
    } 
    else {
        console.log("Incorrect!");
    }

    next() // Temporary
}

// Progressing game to the next question
function next() {
    ++qCount;   // Increment "loop counter"

    if (qCount == totalQs) {
        endGame();      // End the game
    } 
    else {
        updateGame();   // Update and progress the game
    }
    
}

// Hiding gameplay UI elements and shows ending UI element in view to indicate end of game
function endGame() {
    document.getElementsByClassName("game-page")[0].style.display = "none";
    document.getElementsByClassName("end-page")[0].style.display = "block";
            
    document.getElementById("final-score").textContent = "Your final score is " +  score + "%";
            
    var msg = document.getElementById("special-msg");

    if (score < 70) {
        msg.textContent = "Sorry, you failed :( It seems like you might need a little more practice!";
    } else if (score >= 70 && score < 100){
        msg.textContent = "Yay, you passed :) You missed a few, but you seem to know quite a bit about Kpop!";
    } else { // score == 100
        msg.textContent = "Congrats, you got a perfect score! You've definitely earned yourself some bragging rights!";
    }

}
