let allWords = [];              // Tüm kelimeler (200 adet)
let usedWords = [];             // Kullanılan kelimeler (id veya kelime)
let wrongAnswers = [];
let correctCount = 0;

const MAX_WRONG = 5;
const WORD_BATCH = 5;

async function startGame() {
  const res = await fetch("word.json");
  const data = await res.json();
  allWords = data.A1; // A1 seviyesinden al

  const savedState = JSON.parse(localStorage.getItem("gameState"));
  if (savedState) {
    usedWords = savedState.usedWords;
    wrongAnswers = savedState.wrongAnswers;
    correctCount = savedState.correctCount;
  }

  loadNewWords();
}

function loadNewWords() {
  const unusedWords = allWords.filter(w => !usedWords.includes(w.en));
  
  if (wrongAnswers.length >= MAX_WRONG) {
    showEndMessage("5 yanlış yaptınız!");
    return;
  }

  if (unusedWords.length === 0) {
    showEndMessage("Tüm kelimeleri bitirdiniz!");
    return;
  }

  const newSet = getRandomWords(unusedWords, WORD_BATCH);
  usedWords.push(...newSet.map(w => w.en));
  renderWords(newSet);
  saveGameState();
}

function saveGameState() {
  const state = {
    usedWords,
    wrongAnswers,
    correctCount
  };
  localStorage.setItem("gameState", JSON.stringify(state));
}

function handleMatch(en, tr) {
  const match = allWords.find(w => w.en === en && w.tr === tr);
  if (match) {
    correctCount++;
  } else {
    wrongAnswers.push({ en, tr });
  }

  if (correctCount % WORD_BATCH === 0) {
    loadNewWords();
  }

  saveGameState();
}

function showEndMessage(msg) {
  document.body.innerHTML += `
    <div class="end-message">
      <h2>${msg}</h2>
      <button onclick="restartGame()">Yeniden Başla</button>
    </div>
  `;
}

function restartGame() {
  localStorage.removeItem("gameState");
  location.reload();
}

function getRandomWords(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
