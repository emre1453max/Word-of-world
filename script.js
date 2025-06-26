fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const level = "A1"; // Şu an sadece A1
    const wordPairs = data[level].slice(0, 5);

    const enWords = shuffleArray([...wordPairs]);
    const trWords = shuffleArray([...wordPairs]);

    const container = document.getElementById("game");
    container.innerHTML = `
      <div class="word-grid">
        <div>
          <h2>İngilizce</h2>
          <div id="english-words" class="word-column"></div>
        </div>
        <div>
          <h2>Türkçe</h2>
          <div id="turkish-words" class="word-column"></div>
        </div>
      </div>
      <div id="result"></div>
    `;

    const enDiv = document.getElementById("english-words");
    const trDiv = document.getElementById("turkish-words");
    const resultDiv = document.getElementById("result");

    let selectedEn = null;
    let selectedTr = null;
    let matchedWords = new Set();

    function createButton(pair, lang) {
      const btn = document.createElement("button");
      btn.textContent = lang === 'en' ? pair.en : pair.tr;
      btn.dataset.key = pair.en; // ortak anahtar
      btn.classList.add("word-button");

      btn.onclick = () => {
        if (btn.classList.contains("matched")) return;

        const isEnglish = lang === 'en';
        const selected = isEnglish ? selectedEn : selectedTr;

        // Seçiliyse kaldır
        if (selected === btn) {
          btn.classList.remove("selected");
          if (isEnglish) selectedEn = null;
          else selectedTr = null;
          return;
        }

        // Önceki varsa temizle
        if (selected) selected.classList.remove("selected");

        // Yeni seçimi ata
        btn.classList.add("selected");
        if (isEnglish) selectedEn = btn;
        else selectedTr = btn;

        // Eşleştirme kontrolü
        if (selectedEn && selectedTr) {
          const keyEn = selectedEn.dataset.key;
          const keyTr = selectedTr.dataset.key;

          const isMatch = keyEn === keyTr;
          const result = document.createElement("p");
          result.textContent = `${keyEn} = ${selectedTr.textContent} ➜ ${isMatch ? "✅ Doğru" : "❌ Yanlış"}`;
          resultDiv.appendChild(result);

          if (isMatch) {
            selectedEn.classList.add("matched");
            selectedTr.classList.add("matched");
            selectedEn.disabled = true;
            selectedTr.disabled = true;
            matchedWords.add(keyEn);
          }

          selectedEn.classList.remove("selected");
          selectedTr.classList.remove("selected");
          selectedEn = null;
          selectedTr = null;
        }
      };
      return btn;
    }

    enWords.forEach(pair => enDiv.appendChild(createButton(pair, 'en')));
    trWords.forEach(pair => trDiv.appendChild(createButton(pair, 'tr')));

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  });
