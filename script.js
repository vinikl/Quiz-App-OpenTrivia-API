const question = document.getElementById('question')
const options = document.querySelector('.quiz-options')
const checkBtn = document.getElementById('check-answer')
const playAgain = document.getElementById('play-again')
const currentQuestion = document.getElementById('current-question')
const total_question = document.getElementById('total-question')
const result = document.getElementById('result')

let correctAnswer = ''
let totalScore = 0
let askedCount = 0
let totalQuestion = 10

async function loadQuestion() {
    const API_URL = 'https://opentdb.com/api.php?amount=1'
    const response = await fetch(API_URL)
    const data = await response.json()
    result.innerHTML = '' 
    showQuestion(data.results[0])
}

function eventListeners() {
    checkBtn.addEventListener('click', checkAnswer)
    playAgain.addEventListener('click', restartQuiz)
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion()
    eventListeners()
    currentQuestion.innerHTML = askedCount
    total_question.innerHTML = totalQuestion
})

function showQuestion(data){
    checkBtn.disabled = false
    correctAnswer = data.correct_answer
    let incorrectAnswer = data.incorrect_answers
    let optionsList = incorrectAnswer
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer)

    question.innerHTML = data.question
    options.innerHTML = `
        ${optionsList.map((option, index) => 
            `<li> ${index + 1}. <span>${option}</span> </li>`).join('')}`;
    selectOption()
}

function selectOption() {
    options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            let activeOption = options.querySelector('.selected')

            if (activeOption) {
                activeOption.classList.remove('selected')
            }
            option.classList.add('selected')
        })
    })
}


function checkAnswer() {
    checkBtn.disabled = true

    if (options.querySelector('.selected')) {
        let selectedAnswer = options.querySelector('.selected span').textContent
        if (selectedAnswer == HTMLDecode(correctAnswer)) {
            totalScore ++
            result.style.color = 'green'
            result.style.fontWeight = 'bold'
            result.innerHTML = 'Correct Answer'
        } else {
            result.style.color = 'red'
            result.style.fontWeight = 'bold'
            result.innerHTML = 'Incorrect Answer'
        }
        checkCount()
    } else {
        result.style.color = 'black'
        result.style.fontWeight = 'bold'
        result.innerHTML = 'Please select an option!'
        checkBtn.disabled = false
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, 'text/html')
    return doc.documentElement.textContent
}

function checkCount() {
    askedCount++
    setCount()
    if (askedCount == totalQuestion) {
        setTimeout(() => {
            console.log('')
        }, 5000)

        result.innerHTML = `End of the game, your score is ${totalScore}.`
        result.style.color = 'black'
        playAgain.style.display = 'block'
        checkBtn.style.display = 'none'
    } else {
        setTimeout(() => {
            loadQuestion()
        }, 300);
    }
}

function setCount() {
    total_question.textContent = totalQuestion
    currentQuestion.textContent = askedCount
}

function restartQuiz() {
    playAgain.style.display = 'none'
    checkBtn.style.display = 'block'
    checkBtn.disabled = 'false'
    askedCount = 0
    totalScore = 0
    setCount()
    loadQuestion()
}