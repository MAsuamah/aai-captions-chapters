import myJson from "../data/chapters.json" assert {type: "json"};
let summary = document.querySelector("#summary")

const { chapters } = myJson

summary.innerHTML = chapters.map(item => {
  return `<p id="title">${item.gist}</p><p id="headline">${item.headline}</p><p id="summ"><span id="bold-sum">Summary:</span> ${item.summary}</p>`
}).join("")

const init = () => {
  fetch("http://localhost:3000/vtt")
  .then(response => response.json())
  .then(data => {
    const cues = data.slice(1);
    const captions = cues.map(cue => {
      return {
        ...cue.data,
        start: cue.data.start/1000,
        end: cue.data.end/1000  
      }
    })

    let video = document.querySelector("video");
    let track = video.addTextTrack("captions", "Captions", "en");
    track.mode = "showing";
    captions.map(caption => track.addCue(new VTTCue(caption.start, caption.end, caption.text)))
  });
}

init();
