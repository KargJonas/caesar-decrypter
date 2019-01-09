/*
  Add shift amount indicators,
  Better listing,
  Better style,
  Language-selector
*/

const range = 26; // A-Z + ÄÖÜ
const first = 65; // A

const languages = [
  ["German", {
    E: 17.40,
    N: 9.78,
    I: 7.55,
    S: 7.27,
    R: 7.00,
    A: 6.51
  }],
  ["English", {
    E: 12.70,
    T: 9.06,
    A: 8.17,
    O: 7.51,
    I: 6.97,
    N: 6.75
  }]
];

let languageProfile = languages[0][1];

function App() {
  return (
    <div>
      <h1>Input:</h1>
      <form onsubmit={submit}>
        <textarea $bind={{ value: "input" }} />
        <input type="submit" />
      </form>

      <hr />
      <h1>Output (Most likely first):</h1>
      <div id="outputs" />
    </div>
  );
}

Modular.render(App, "#root");

function languageChange() {
  const index = Modular.getBinding("language");
  console.log(index);
  languageProfile = languages[index][0];
}

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

  Modular.render(Outputs(getLikelinessRanking(getCombinations(input))),
    "#outputs");
}

function Outputs(items) {
  const elements = items.map(item => <li>{item}</li>);
  return (
    <ol>
      {elements}
    </ol>
  );
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

  combinations.map(combination => {
    const val = getDifference(getOccurrence(combination));

    if (!leaderBoard[val]) {
      leaderBoard[val] = [];
    }

    leaderBoard[val].push(combination);
  });

  const res = [];
  Object.entries(leaderBoard).map(items => items[1].map(item => res.push(item)));

  return res.sort((a, b) => a - b).map(item => item);
}