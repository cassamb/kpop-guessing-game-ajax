# Kpop Guessing Game: AJAX Implementation

This is the last of three iterations in the Kpop Guessing Game series which also includes the [kpop-guessing-game-js](https://github.com/cassamb/kpop-guessing-game-js) and [kpop-guessing-game-php](https://github.com/cassamb/kpop-guessing-game-php) projects.

![Static Badge](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=white)
![Static Badge](https://img.shields.io/badge/HTML-%23e34c26?style=for-the-badge&logo=HTML5&logoColor=white)
![Static Badge](https://img.shields.io/badge/CSS-%231572B6?style=for-the-badge&logo=CSS&logoColor=white)
![Static Badge](https://img.shields.io/badge/PHP-%238993be?style=for-the-badge&logo=PHP&logoColor=white)
![Static Badge](https://img.shields.io/badge/MySQL-%2300758f?style=for-the-badge&logo=MySQL&logoColor=white)
![Static Badge](https://img.shields.io/badge/XAMPP-%23fb7a24?style=for-the-badge&logo=XAMPP&logoColor=white)

**Disclaimer:** Due to the knowledge and experience gained since this project was originally commissioned in 2019, some specifications (i.e., certain technologies, requirements, and practices) have been modified and/or removed to improve the overall quality of the program while maintaining the original intent. **Any notable modifications made in this iteration (and beyond) will be addressed accordingly.**

## Introduction

### Background

This project was originally commissioned by Professor Kumar of Nova Southeastern University's College of Computing and Engineering for the 2019 Web Programming and Design course. Students were tasked with creating a flashcard quiz game on the topic of their choosing. The **K-pop genre** was selected as the subject matter for this implementation due to personal interest as well as the music genre's growing popularity at the time. 

This is a continuation of the PHP implementation (refer to the [kpop-guessing-game-php](https://github.com/cassamb/kpop-guessing-game-php) repository for further details) which mainly consisted of integrating a database into the existing foundation of the program. The PHP version is an improvement from the original in terms of storage and efficiency, but not as flexible as it can be. Through the use of AJAX (Asynchronous JavaScript and XML), this version of the Kpop Guessing Game allows for a more dynamic and responsive program. Thus, the purpose of the final iteration of the project was to improve the user experience (UX) and the efficiency of the program (specifically the storage) with AJAX as well as demonstrate one’s understanding of database communication, server-side languages and processes, relational databases, and incremental development by implementing additional functionalities in an existing project. This project was tested in the Google Chrome web browser and developed using PHP, SQL, mySQL, AJAX, JavaScript, HTML, CSS, Visual Studio Code, and XAMPP v3.3.0.

    Although there are libraries such as jQuery that allow for simplified JavaScript programming when working with projects that use AJAX, students were explicitly instructed to only use vanilla JavaScript for this iteration in an effort to further demonstrate their understanding of XHR objects and JavaScript as a whole. 

### Project Overview

As mentioned before, this project is a flashcard quiz game so the user is presented an image of a Kpop group along with four possible names for that group (3 wrong answers, one correct answer). If the user selects the correct answer, their score is incremented; otherwise, the score stays the same. This continues until the array of "flashcards" has been exhausted. Once the game is considered over, the user’s final score is displayed and they are prompted to return to the home page to start the game again.

## Specifications

### UI Requirements

The UI design was left to the student’s discretion, so there was a freedom to do however little or however much one desired in terms of aesthetics as long as the following "pages" and elements within them were included:
* **Start Page**: Page that welcomes the user and explains the rules of the quiz.
  * Game Title
  * Game Explanation
  * Start Button
* **Game Page**: Page in which the actual gameplay occurs.
  * Question Number
  * Randomized Image
  * Prompt
  * Multiple Choice Buttons
  * Skip/Next Button
  * Hint Button
  * **Quit Button**
  * **Score Bar**
* **Ending Page**: Page that is displayed once the user completes the game and displays the user's final score.
  * Final Score
  * Customized Goodbye Message
  * Home Button

The **bold** elements denote components of the UI that were not required in the original assignment specification; however, they are included in this implementation in an effort to improve the usability and user experience while operating the program.

### Logical Requirements

In addition to the requirements outlined in the previous iterations of this program, students were only tasked with doing the following:
- [x] Updating the page dynamically using AJAX, PHP, and vanilla JavaScript.

## Design

### Front-End Design

“Boba runs” and cafe hangouts are popular activities amongst Kpop fans, so much so that bubble tea shops often host events catering to fans of Kpop. So, an in an effort to appeal to the demographic and pay homage to the aesthetic, the UI utilizes bright neutrals to evoke a feeling of familiarity and comfort for the users. In addition, the borders of the images are rounded to mimic that of photocards that fans receive in the albums they purchase and trade with each other at events hosted by various bubble tea shops. Overall, the UI is designed to evoke the feelings of attending a trading card event at a cozy bubble tea shop with friends. 

### Architectural Design

In the previous iteration, we simply used PHP to query the database for the group names and urls. Given the flexibility we've been granted with this iteration via AJAX, we're allowed to make better use of PHP in the sense that we don't have to store everything on the client side. Since we can update the page dynamically without having to refresh the entire page, we can query the database for the information that is needed at the moment. So, instead of having all the names and groups of the images that are to be randomly displayed stored on the client side (even though only one image is displayed at a time).

Just like the previous iterations of the program we're using the procedural programming paradigm for development. However, since we're now allowed to query the database freely via AJAX, some of the processes in previous iterations have been refactored (or completely removed) to improve storage capabilities of the client-side. The update() function still essentially serves as the “main” which controls the progression of the game by calling modular functions to carry out the various responsibilities of the program. Instead of having to call various intermediary functions to reach a certain conclusion (i.e., generating and setting the answer choices), we query the database to obtain them directly. There are still some helper functions which assist the subroutines during their execution throughout the program, but they aren't nearly as convoluted as the previous iterations.

### Back-End Design

Since the PHP implementation of the program already makes use of a database, there aren’t any major changes in terms of the setup. So, just as before we'll be working with the 'flashcards' database which contains a 'groups' table that holds the ID (primary key), NAME, and URL for each group. The data was to be specifically loaded from the groups.csv file. Originally, students were provided files that contained SQL code to assist with instantiating the database, it's table, and it's data manually. The process was a bit convulted, so instead an external database handler (see [kpop-guessing-game-dbh](https://github.com/cassamb/kpop-guessing-game-dbh) repository) has been created to streamline the initialization process a bit more. The handler is responsible for the following:
* Establishing a server connection and checking whether or not the ‘flashcards’ database currently exists on the user’s local machine. 
* Instantiates the ‘flashcards’ database if it does not currently exist.
* Displays the 'groups' table entries to ensure the images are rendered properly.

The only thing of note being that since AJAX is being used, we’re able to perform more queries on the database throughout the program’s execution. Meaning, all of the data from the groups table doesn’t have to be saved in the program logic like in previous iterations. Instead we directly query the database when we need the information (i.e., shuffling the groups and storing the ids rather than the urls and names). Therefore, this implementation has an 'includes' folder which contains all the following PHP files that are necessary to communicate with the database and execute those queries.
* **dbh.inc.php**: Database handler file that creates a PDO object which establishes a connection to the 'flashcards' database.
* **getCorrectAnswer.inc.php**: Queries the database for the name and url that corresponds to the given id.
* **getShuffledOrder.inc.php**: Queries the database for the shuffled ids of the "groups' table entries which determines the order of the quiz.
* **getWrongAnswers.inc.php**: Queries the database for 4 names from the 'groups' table that _do not_ correspond to the given id.

## Afterword

### Previous Limitations & Modifications

#### Functional Modifications

Given this project was assigned in a lower-level programming and design course, the requirements and capabilities of the program are reflective of my knowledge at the time. Therefore, in an effort to improve the quality of this project in terms of usability and generality, the following changes have been made to the program:
* **The inclusion of an external database handler:** Originally, the database initialization was a preliminary step that *had* to be done manually by the user independent of the program's execution. In this implementation, an external database initializer/handler is available to supplement the execution of the program (see [kpop-guessing-game-dbh](https://github.com/cassamb/kpop-guessing-game-dbh) repository for more details). The handler checks whether the “flashcards” database exists or not. If it does not exist, it is instantiated for the user using the provided .csv file; otherwise, the program references the existing database. Thus, all the user is required to do is to start the Apache and MySQL modules in XAMPP. 
* **Using PDO instead of sqli for the database connection:** sqli was used to connect to the server in the original specification; however, in an effort to not constrain the user to only SQL databases, a PDO connection was used in this implementation as well as the next.

#### Non-Functional Modifications

In an effort to improve the user experience, the following additions have been made to the game:
* **The score bar** was included to give the user a better visual of their progress while playing the game. Initially, the user’s score was displayed by text, but this time it is represented by a score bar that closely models a straw. _This ties into the boba aesthetic of the overall program and provides a bit of an incentive for getting more questions right since the “straw”/score bar fills up with each correct answer._
* **The inclusion of a subtle quitting mechanic** because the user previously had to finish or refresh the entire game to get back the home screen. Therefore, a 'Quit' button is now included in the game page and allows the user to quit the game at any point.
* **The hint mechanic** allows users eliminate the wrong answers and improves their chances of choosing the correct answer. Users are allowed two hints and on the third click the correct answer is highlighted. _Currently, using hints does not affect the user's score._


### Future Expectations

Given this is the final project of the Kpop Guessing Game series, it will be treated as the final deliverable of the program. Therefore, all subsequent modifications are left to the discretion of the developer and will focus on expanding the functionality and quality of the program. The future expansion of the program may include the following:
* UX Improvements 
  * An instructions page to give users a better run down of the game and its mechanics (i.e., how hints, question skips, scoring mechanics, and user selection works).
  * A "study guide" page which allows users to review the content of the quiz before taking it.
  * The addition of a highscores table to keep tracking of all highscores.
  * Adding a consequence for using the hint button (a possible score reduction for each hint used).
  * Additional game modes (i.e., limiting/scaling up the number of questions, girl/boy group only quizzes, speed rounds, etc.)

### Updates

As of 8/25/2025 no notable updates have been made to the program.