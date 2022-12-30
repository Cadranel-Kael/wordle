settings = {
    wordList: ['crane', 'piano', 'saves', 'class', 'boxes'],
    answer: 'piano',
    displayAnswer: true,
    randomAnswer: true,
    getRandomAnswer () {
        this.answer = this.wordList[Math.floor(Math.random() * ((this.wordList.length-1) + 1))];
    }
}

const tableRows = document.querySelectorAll('table tr');
const form = document.querySelector('form.keyboard');
const keyboardKeys = document.querySelectorAll('.keyboard button');
const endGameP = document.querySelector('.end-game');

let currentWord;
let currentRow;
let currentRowCells;
let row = -1;

function nextRow() {
    row+= 1;
    if (row > tableRows.length-1) {
        endGameP.textContent = `The word was: ${settings.answer}`;
    }
    currentRow = tableRows[row];
    currentRowCells = currentRow.querySelectorAll('td');
}

function deleteLastLetter (length) {
    if (length < 0) {
        return;
    }
    if (currentRowCells[length].textContent !== '') {
        currentRowCells[length].textContent = '';
        currentRowCells[length].classList.remove('got-letter');
        return;
    }
    deleteLastLetter (length-1);
}

function placeLetter (letter) {
    for (const currentRowCell of currentRowCells) {
        if (currentRowCell.textContent === '') {
            currentRowCell.textContent = letter;
            currentRowCell.classList.add('got-letter');
            currentRowCell.classList.add('typed');
            currentRowCell.addEventListener('transitionend', () => {
                currentRowCell.classList.remove('typed');
            })
            return;
        }
    }
}

function createWord () {
    currentWord = '';
    for (const currentRowCell of currentRowCells) {
        currentWord+= currentRowCell.textContent;
    }
}

function checkWord () {
    createWord();
    if (currentWord === settings.answer) {
        endGameP.textContent = 'BRAVO!!!'
    }
}

function checkCorrection (i) {
    currentRowCells[i].classList.add('checked');
    if (currentRowCells[i].textContent === settings.answer[i]) {
        currentRowCells[i].classList.add('correct');
        document.getElementById(currentRowCells[i].textContent).classList.add('correct');
    } else if (settings.answer.includes(currentRowCells[i].textContent)) {
        currentRowCells[i].classList.add('placement');
        document.getElementById(currentRowCells[i].textContent).classList.add('placement');
    } else {
        currentRowCells[i].classList.add('incorrect');
        document.getElementById(currentRowCells[i].textContent).classList.add('incorrect');
    }
    currentRowCells[i].addEventListener('transitionend', () => {
        if (i >= currentRowCells.length-1) {
            createWord();
            if (currentWord === settings.answer) {
                endGameP.textContent = 'BRAVO!!!'
            }
            nextRow();
        } else {
            checkCorrection(i+1)
        }
    })
}

function onSubmission () {
    if (currentRowCells[currentRowCells.length-1].textContent === '') {
        console.error('not enough letters');
        return;
    }
    checkCorrection(0);
}
if (settings.randomAnswer) {
    settings.getRandomAnswer();
}

if (settings.displayAnswer) {
    console.log(settings.answer)
}

nextRow();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmission();
})


for (const keyboardKey of keyboardKeys) {
    keyboardKey.addEventListener('click', (e)=> {
        if (currentWord === settings.answer) {
            return;
        }
        if (e.currentTarget.id !== 'backspace') {
            placeLetter(e.currentTarget.id);
            return;
        }
        deleteLastLetter(currentRowCells.length-1);
    })
}

window.addEventListener('keydown', (e) => {
    if (currentWord === settings.answer) {
        return;
    }
    if (e.key === 'Backspace') {
        deleteLastLetter(currentRowCells.length-1);
    }
    if (e.key >= 'a' && e.key <= 'z') {
        placeLetter(e.key);
    }
    if (e.key === 'Enter') {
        onSubmission();
    }
})


