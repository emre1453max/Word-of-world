fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const level = "A1";
    const wordPairs = data[level].slice(0, 5);

    const enWords = shuffleArray([...wordPairs]);
    const trWords = shuffleArray([...wordPairs]);

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
    let matchedWords = new Set();

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

    function createButton(text) {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.onclick = () => handleClick(btn);
      return btn;
    }

    function handleClick(btn) {
      const isEnglish = btn.parentElement.id === "english-words";

      // Seçim iptali
      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        if (isEnglish) selectedEnBtn = null;
        else selectedTrBtn = null;
        return;
      }

      // Zaten eşleştirilmiş butona tıklanırsa işlem yapma
      if (btn.classList.contains("matched")) return;

      // Seçim
      btn.classList.add("selected");
      if (isEnglish) selectedEnBtn = btn;
      else selectedTrBtn = btn;

      // Eşleştirme yapılabilir mi?
      if (selectedEnBtn && selectedTrBtn) {
        const enWord = selectedEnBtn.dataset.en;
        const trWord = selectedTrBtn.dataset.en;

        const correct = enWord === trWord;

        const msg = document.createElement("p");
        msg.textContent = `${selectedEnBtn.textContent} = ${selectedTrBtn.textContent} ➜ ${correct ? "✅ Doğru" : "❌ Yanlış"}`;
        resultDiv.appendChild(msg);

        if (correct) {
          selectedEnBtn.classList.remove("selected");
          selectedTrBtn.classList.remove("selected");

          selectedEnBtn.classList.add("matched");
          selectedTrBtn.classList.add("matched");

          selectedEnBtn.disabled = true;
          selectedTrBtn.disabled = true;

          matchedWords.add(enWord);
        } else {
          selectedEnBtn.classList.remove("selected");
          selectedTrBtn.classList.remove("selected");
        }

        selectedEnBtn = null;
        selectedTrBtn = null;
      }
    }

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  });
