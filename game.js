// Global Variables
var ref = [];
var qCount = 0;

var score = 0;
var correctNum = 0;
var totalQs = 0;

var hintUsed = 0;
var hintOrder = [];

var correctAns = [];
var choices = [];


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
            
            // Insert next function call here
            queryCorrectAnswer();
        }
    }

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
        
        }
    }

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
        
        }
    }

    xhr.send();
}
