// Fixed 10 questions list
var questionBank = [
    { q: "Which language runs in a web browser?", a: ["Java", "C", "Python", "JavaScript"], correct: 3 },
    { q: "What does CSS stand for?", a: ["Central Style Sheets", "Cascading Style Sheets", "Cascading System Sheets", "Control Style Sheets"], correct: 1 },
    { q: "What does HTML stand for?", a: ["Hypertext Markup Language", "Hypertext Markdown Language", "Hyperloop Machine Language", "None"], correct: 0 },
    { q: "What year was JavaScript launched?", a: ["1996", "1995", "1994", "None of these"], correct: 1 },
    { q: "Which symbol is used for comments in JS?", a: ["//", "/* */", "", "#"], correct: 0 },
    { q: "How do you declare a block-scoped variable in JS?", a: ["var", "let", "set", "declare"], correct: 1 },
    { q: "Which method adds an element to the end of an array?", a: ["pop()", "shift()", "push()", "unshift()"], correct: 2 },
    { q: "Is JavaScript case-sensitive?", a: ["Yes", "No", "Only variables", "Only functions"], correct: 0 },
    { q: "What is the correct syntax for an alert box?", a: ["msg('Hello')", "alertBox('Hello')", "alert('Hello')", "msgBox('Hello')"], correct: 2 },
    { q: "How do you write an arrow function?", a: ["() => {}", "function => {}", "() -> {}", "=> {}"], correct: 0 }
];

var questions = [];
var currentIdx = 0;
var score = 0;
var timerInterval;
var timeLeft = 30;
var hasAnswered = false;

// HTML elements selection
var quizScreen = document.getElementById('quiz-screen');
var resultsScreen = document.getElementById('results-screen');
var qText = document.getElementById('question-text');
var optionsContainer = document.getElementById('options-container');
var progressText = document.getElementById('progress-text');
var progressBar = document.getElementById('progress-bar');
var timeClock = document.getElementById('time-clock');
var nextBtn = document.getElementById('next-btn');

// Simple Function to shuffle/mix items in our array manually
function shuffleQuestions() {
    questions = [];
    // Copy question bank items over
    for (var i = 0; i < questionBank.length; i++) {
        questions.push(questionBank[i]);
    }
    // Mix elements randomly
    for (var j = questions.length - 1; j > 0; j--) {
        var randomPos = Math.floor(Math.random() * (j + 1));
        var temp = questions[j];
        questions[j] = questions[randomPos];
        questions[randomPos] = temp;
    }
}

function initQuiz() {
    shuffleQuestions();
    currentIdx = 0;
    score = 0;
    resultsScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    hasAnswered = false;
    nextBtn.style.display = 'none';
    timeLeft = 30;
    timeClock.textContent = timeLeft;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(countdown, 1000);

    var currentQ = questions[currentIdx];
    qText.textContent = currentQ.q;
    
    // UI indicators update
    progressText.textContent = "Question " + (currentIdx + 1) + " of " + questions.length;
    var percentageWidth = ((currentIdx + 1) / questions.length) * 100;
    progressBar.style.width = percentageWidth + "%";

    // Clear old choices and generate new simple choice buttons
    optionsContainer.innerHTML = '';
    for (var k = 0; k < currentQ.a.length; k++) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = currentQ.a[k];
        
        // Setup manual index values so buttons know which index option they hold
        btn.setAttribute('data-index', k);
        btn.onclick = function() {
            var selectedIdx = parseInt(this.getAttribute('data-index'));
            selectAnswer(selectedIdx, this);
        };
        optionsContainer.appendChild(btn);
    }
}

function countdown() {
    timeLeft = timeLeft - 1;
    timeClock.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
    }
}

function handleTimeout() {
    hasAnswered = true;
    var buttons = optionsContainer.getElementsByClassName('option-btn');
    var correctIdx = questions[currentIdx].correct;
    
    buttons[correctIdx].classList.add('correct');
    
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    nextBtn.style.display = 'block';
}

function selectAnswer(selectedIdx, selectedBtn) {
    if (hasAnswered === true) return;
    hasAnswered = true;
    clearInterval(timerInterval);

    var correctIdx = questions[currentIdx].correct;
    var buttons = optionsContainer.getElementsByClassName('option-btn');

    if (selectedIdx === correctIdx) {
        selectedBtn.classList.add('correct');
        score = score + 1;
    } else {
        selectedBtn.classList.add('wrong');
        buttons[correctIdx].classList.add('correct');
    }

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    nextBtn.style.display = 'block';
}

nextBtn.onclick = function() {
    currentIdx = currentIdx + 1;
    if (currentIdx < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    var finalPercentage = Math.round((score / questions.length) * 100);
    document.getElementById('score-text').textContent = score + " / " + questions.length;
    document.getElementById('percentage-text').textContent = finalPercentage + "%";
    
    var message = "Keep practicing!";
    if (finalPercentage >= 80) {
        message = "Excellent job! Master Status unlocked.";
    } else if (finalPercentage >= 50) {
        message = "Great effort! You know your basics.";
    }
    document.getElementById('feedback-msg').textContent = message;
}

document.getElementById('restart-btn').onclick = initQuiz;

// Auto boot
initQuiz();