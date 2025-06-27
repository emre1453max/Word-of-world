fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const a1Words = data["A1"].slice(0, 5);
    const container = document.getElementById("game");
    a1Words.forEach(pair => {
      const div = document.createElement("div");
      div.textContent = pair.en + " = " + pair.tr;
      container.appendChild(div);
    });
  });
