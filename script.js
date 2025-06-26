fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const level = "A1"; // Sabit A1 seviyesi, sonra kullanıcı seçimi eklenebilir
    const wordPairs = data[level].slice(0, 5); // İlk 5 kelime

    const enWords = shuffleArray([...wordPairs]); // İngilizce
    const trWords = shuffleArray([...wordPairs]); // Türkçe

    const container = document.getElementById("game");
    container.innerHTML = `
      <h2>İngilizce Kelimeler</h2>
      <div id="english-words" class="word-column"></div>
      <h2>Türkçe Anlamlar</h2>
      <div id="turkish-words" class="word-column"></div>
      <div id="result"></div>
    `;

    const enDiv = document.getElementById("english-words");
    const trDiv = document.getElementById("turkish-words");
    const resultDiv = document.getElementById("result");

    let selectedEn = null;
    let selectedTr = null;
    let wrongPairs = [];

    enWords.forEach(pair => {
      const btn = document.createElement("button");
      btn.textContent = pair.en;
      btn.onclick = () => {
        selectedEn = pair;
        checkMatch();
      };
      enDiv.appendChild(btn);
    });

    trWords.forEach(pair => {
      const btn = document.createElement("button");
      btn.textContent = pair.tr;
      btn.onclick = () => {
        selectedTr = pair;
        checkMatch();
      };
      trDiv.appendChild(btn);
    });

    function checkMatch() {
      if (selectedEn && selectedTr) {
        const isCorrect = selectedEn.en === selectedTr.en;
        const msg = document.createElement("p");
        msg.textContent = `${selectedEn.en} = ${selectedTr.tr} ➜ ${isCorrect ? "✅ Doğru" : "❌ Yanlış"}`;
        resultDiv.appendChild(msg);
        if (!isCorrect) wrongPairs.push(selectedEn);
        selectedEn = null;
        selectedTr = null;
      }
    }

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  });
