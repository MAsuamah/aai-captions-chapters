import myJson from '../chapters.json' assert {type: 'json'};
let summary = document.querySelector("#summary")

const { chapters } = myJson
console.log(chapters)
summary.innerHTML = chapters.map(item => {
  return `<p id="title">${item.gist}</p><p id="headline">${item.headline}</p><p id="summ"><span id="bold-sum">Summary:</span> ${item.summary}</p>`
}).join("")


