// Global Variables
var ref = [];
var qCount = 0;

var score = 0;
var numCorrect = 0;
var totalQs = 0;

var hintsUsed = 0;
var hintOrder = [];

var correctAns = [];
var choices = [];

/* HELPER FUNCTIONS */

// Shuffles the given array
function shuffle(arr) {

    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1 ));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

}

// Returns random integer between the given minimum and maximum values
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Disables the multiple choice buttons
function disableButtons() {
    for (var i = 1; i < 5; ++i)
    { 
		btn = document.getElementById("opt-" + i);
        btn.disabled = true;
	}
}

// Returns buttons back to original state
function resetButtons() {
    for (var i = 1; i < 5; ++i)
    { 
		btn = document.getElementById("opt-" + i);
        btn.disabled = false;                       // Reactivating button
        btn.style.border = "8px solid #ffbe73";   // Returning border back to normal
	}
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
                ref.push(response[i].id); // Pushing the shuffled ids to the reference array
            }
            
            totalQs = ref.length;   // Setting the total number of questions in the quiz
            updateGame();           // Starting the game
        }
    };

    xhr.send();
}

// Queries database for the name and url of the group for the current question and populates the correctAns array
function queryCorrectAnswer(){

    var id = ref[qCount];   // id to reference in database

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "includes/getCorrectAnswer.inc.php?id=" + id, true);

    xhr.onload = function() {
        if(this.status == 200) {
            var response = JSON.parse(this.responseText);
            
            // Updating the data for the current answer
            correctAns[0] = response[0].name;
            correctAns[1] = response[0].url;

            updateImage();              // Updating image being shown
            queryWrongAnswers(id);      // Querying the database for the wrong answers
        
        }
    };

    xhr.send();
}

// Queries the database for 4 group names that do not correspond to the correct answer and populates them in the choices array
function queryWrongAnswers(id){

    // var id = ref[qCount];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "includes/getWrongAnswers.inc.php?id=" + id, true);

    xhr.onload = function() {
        if(this.status == 200) {
            var response = JSON.parse(this.responseText);

            // Updating the choices array
            for (var i in response) {
                choices[i] = response[i].name;
            }

            updateChoices(); // Updates the multiple choice answers
        
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
    updateScoreBar(score);

}

// Updating the image currently being displayed
function updateImage() {
    var randImg = document.getElementById("pic");
    randImg.setAttribute("src", correctAns[1]);                 // url
    randImg.setAttribute("alt", "Image of " + correctAns[0]);   // name
}

// Updating the score bar
function updateScoreBar(score) {

    if (score < 100) {
        // "Filling" the score bar based on user's current score
        var scoreBar = document.getElementById("fill");
        scoreBar.style.height = score + "%";
        scoreBar.textContent = score + "%";
    }
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

    choices[randButton - 1] = correctAns[0]; // Inserting correct name in corresponding choices index

    generateHints(choices); // Determining the hint order
}

// onclick function for user selection
function buttonClicked(self) {
    var userAns = self.getAttribute("value");
    var feedback = document.getElementById("user-feedback");

    document.getElementById("hint-btn").disabled = true;                // Hints are disabled if answer is already selected
    document.getElementById("next-btn").textContent = "Next Question";  // "Skip" is changed to "Next"

    if (userAns == correctAns[0])   // If the user selection is correct ...
    { 
        // Provide necessary visual feedback and increment correct answer counter
        self.style.border = "8px solid #00a708"; // Highlighting the answer choice to be green
        feedback.textContent = "Congrats! " + correctAns[0] + " is the correct answer!";
        feedback.style.color = "#00a708";
        numCorrect++;  
    } 
    else {  // Otherwise ...
        // Provide necessary visual feedback
        self.style.border = "8px solid #c90000"; // Highlighting the answer choice to be red
        feedback.textContent = "Sorry! " + correctAns[0] + " is the correct answer!";
        feedback.style.color = "#c90000";

        // Highlighting the correct answer choice
        var correctChoice = document.querySelector('[value="' + correctAns[0] + '"]');
        correctChoice.style.border = "8px solid #00a708";
    }

    feedback.style.display = "block";   // Display feedback text
    disableButtons();                   // Disable answer choices

}

// Generating the order of elimination for the wrong answer choices
function generateHints(options) {

    for (var i = 0; i < 4; i++) {

        if (options[i] != correctAns[0]) {
            hintOrder.push(options[i]);
        }
        
    }
    
    shuffle(hintOrder); // Shuffles wrong answer options

}

// onclick function for hint button
function eliminateChoice() {

    var totalHints = hintOrder.length;

    if (hintsUsed <= totalHints) { // If the hints are not exhausted yet
        
        // Reference random wrong answer choice by value and disable it
        var eliminatedButton = document.querySelector('[value="' + hintOrder[hintsUsed] + '"]');
        eliminatedButton.style.border = "8px solid #848484";
        eliminatedButton.disabled = true;
        hintsUsed++;

        if (hintsUsed == hintOrder.length) { // If all hints are used ...
            document.getElementById("hint-btn").disabled = true;                // Disable the hint button
            document.getElementById("next-btn").textContent = "Next Question";  // "Skip" is changed to "Next"

            // Highlight the correct answer button and disable it
            var answerButton = document.querySelector('[value="' + correctAns[0] + '"]');
            answerButton.style.border = "8px solid #00a708"; // Highlighting the answer choice to be green
            answerButton.disabled = true;

            // Provide feedback for the user
            var answerFeedback = document.getElementById("user-feedback");
            answerFeedback.textContent = correctAns[0] + " is the correct answer for this question!";
            answerFeedback.style.color = "#00a708";
        }

    }

    // Calculate remaining hints and update the user
    var hintsRemaining = totalHints - hintsUsed;
    var hintStatus = document.getElementById("hint-feedback");
    hintStatus.style.color = "#848484";

    // Grammar consideration
    if (hintsRemaining == 1) {
        hintStatus.textContent = hintsRemaining + " Hint Remaining";
    }
    else {
        hintStatus.textContent = hintsRemaining + " Hints Remaining";
    }
    
}

// Reseting game properties and progressing game to the next question
function next() {
    
    resetButtons(); // Reseting answer choice buttons

    // Reseting hint components
    document.getElementById("hint-btn").disabled = false;
    document.getElementById("hint-feedback").textContent = "";
    hintOrder = []; // Emptying the hints generated for the last question
    hintsUsed = 0;

    document.getElementById("user-feedback").textContent = "";              // Clearing user feedback for next question
    document.getElementById("next-btn").textContent = "Skip Question";      // Displays "Skip" instead of "Next"
    
    ++qCount;   // Increment "loop counter"

    if (qCount == totalQs) {  // If the end of the quiz has been reached ...
        score = (numCorrect/totalQs) * 100;     // Calculate user's final score
        endGame();                              // End the game
    } 
    else {  // Otherwise ...
        updateGame();   // Update and progress the game
    }
    
}

// Hiding gameplay UI elements and shows ending UI element in view to indicate end of game
function endGame() {

    document.getElementsByClassName("game-page")[0].style.display = "none";     // Hide game page elements
    document.getElementsByClassName("end-page")[0].style.display = "block";     // Show end page elements

    // Updating end page elements
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
