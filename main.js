/*
  Add shift amount indicators,
  Better listing,
  Better style,
  Language-selector
*/

const range = 26; // A-Z + ÄÖÜ
const first = 65; // A

// German
const languageProfile = {
  E: 17.40,
  N: 9.78,
  I: 7.55,
  S: 7.27,
  R: 7.00,
  A: 6.51
};

function App() {
  return (
    <div>
      <h1>Input:</h1>
      <form onsubmit={submit}>
        <textarea $bind={{ value: "input" }} />
        <input type="submit" />
      </form>

      <h1>Output</h1>
      <textarea $bind={{ value: "combinations" }} />
    </div>
  );
}

Modular.render(App, "#root");

function submit(e) {
  e.preventDefault();
  const input = Modular.getBinding("input")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .replace("Ö", "OE")
    .replace("Ä", "AE")
    .replace("Ü", "UE")
    .replace(/[^\w\ ]/g, "");

  Modular.setBinding("input", input);

  Modular.setBinding("combinations", getLikelinessRanking(getCombinations(input)).join("\n-----\n"));
}

function shiftChar(character, offset) {
  return String.fromCharCode((character.charCodeAt(0) + offset) % range + first);
}

function shiftString(text, offset) {
  return text
    .split("")
    .map(char => shiftChar(char, offset))
    .join("");
}

function getCombinations(text) {
  const words = text.split(" ").filter(item => item.trim());

  const combinations = [];

  for (let i = 1; i <= range; i++) {
    combinations.push(
      words
        .map(word => shiftString(word, i))
        .join(" ")
    );
  }

  return combinations;
}

function getOccurrence(_text) {
  const text = _text.replace(" ", "");
  const charAmount = text.length;
  const chars = {};
  const res = [];

  text.split("").map(char => {
    if (chars[char]) chars[char]++;
    else chars[char] = 1;
  });

  Object.entries(chars).map(item => {
    res.push({
      char: item[0],
      value: item[1] / charAmount * 100
    });
  });



  return res;
}

function getDifference(chars) {
  let difference = 0;

  chars.map(item => {
    difference += Math.abs((languageProfile[item.char] || 0) - item.value);
  });

  return difference;
}

function getLikelinessRanking(combinations) {
  let leaderBoard = {};
  const res = [];

  combinations.map(combination => {
    leaderBoard[getDifference(getOccurrence(combination))] = combination;
  });

  return Object.entries(leaderBoard).sort((a, b) =>  a[0] - b[0]).map(item => item[1]);
}