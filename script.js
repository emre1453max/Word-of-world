fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const level = "A1";
    const maxWrong = 10;
    let wrongCount = 0;
    let wrongLog = [];
    let currentIndex = 0;

    const allWords = shuffleArray([...data[level]]);
    const container = document.getElementById("game");
    container.innerHTML = `
      <div class="columns">
        <div id="english-words" class="word-column">
          <h2>İngilizce</h2>
        </div>
        <div id="turkish-words" class="word-column">
          <h2>Türkçe</h2>
        </div>
      </div>
      <div id="result"></div>
    `;

    const enDiv = document.getElementById("english-words");
    const trDiv = document.getElementById("turkish-words");
    const resultDiv = document.getElementById("result");

    let selectedEnBtn = null;
    let selectedTrBtn = null;

    function loadNextSet() {
      if (wrongCount >= maxWrong || currentIndex >= allWords.length) {
        endGame();
        return;
      }

      enDiv.innerHTML = "";
      trDiv.innerHTML = "";

      const wordSet = allWords.slice(currentIndex, currentIndex + 5);
      const enWords = shuffleArray([...wordSet]);
      const trWords = shuffleArray([...wordSet]);

      enWords.forEach(pair => {
        const btn = createButton(pair.en);
        btn.dataset.en = pair.en;
        enDiv.appendChild(btn);
      });

      trWords.forEach(pair => {
        const btn = createButton(pair.tr);
        btn.dataset.en = pair.en;
        trDiv.appendChild(btn);
      });

      currentIndex += 5;
    }

    function createButton(text) {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.onclick = () => handleClick(btn);
      return btn;
    }

    function handleClick(btn) {
      const isEnglish = btn.parentElement.id === "english-words";

      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        if (isEnglish) selectedEnBtn = null;
        else selectedTrBtn = null;
        return;
      }

      if (btn.classList.contains("matched")) return;

      btn.classList.add("selected");
      if (isEnglish) selectedEnBtn = btn;
      else selectedTrBtn = btn;

      if (selectedEnBtn && selectedTrBtn) {
        const enWord = selectedEnBtn.dataset.en;
        const trWord = selectedTrBtn.dataset.en;
        const correct = enWord === trWord;

        if (correct) {
          selectedEnBtn.classList.remove("selected");
          selectedTrBtn.classList.remove("selected");
          selectedEnBtn.classList.add("matched");
          selectedTrBtn.classList.add("matched");
          selectedEnBtn.disabled = true;
          selectedTrBtn.disabled = true;

          const wasWrong = wrongLog.find(w => w.en === enWord);
          if (wasWrong && !wasWrong.corrected) {
            resultDiv.innerHTML += `<p>${selectedEnBtn.textContent} = ${selectedTrBtn.textContent}</p>`;
            wasWrong.corrected = true;
          }
        } else {
          selectedEnBtn.classList.remove("selected");
          selectedTrBtn.classList.remove("selected");

          if (!wrongLog.find(w => w.en === enWord)) {
            wrongLog.push({ en: enWord, tr: trWord, corrected: false });
            wrongCount++;
          }
        }

        selectedEnBtn = null;
        selectedTrBtn = null;

        const matchedCount = enDiv.querySelectorAll(".matched").length;
        if (matchedCount === 5 * 2) {
          loadNextSet();
        }
      }
    }

    function endGame() {
      enDiv.innerHTML = "<p>Oyun bitti. 10 yanlış hakkını kullandın.</p>";
      trDiv.innerHTML = "";
    }

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    loadNextSet();
  });
