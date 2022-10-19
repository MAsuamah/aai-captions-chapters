let summary = document.querySelector("#summary")
let captions = document.querySelector("#captions")

const getCaptions = () => {
  console.log("clicked") 
  fetch('http://localhost:8000')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (data) {

    const { chapters } = data

    summary.innerHTML = chapters.map(item => {
      return `<p id="title">${item.gist}</p><p id="headline">${item.headline}</p><p id="summary"><span id="bold-sum">Summary:</span> ${item.summary}</p>`
    }).join("")
  })
};

captions.addEventListener("click", getCaptions)
