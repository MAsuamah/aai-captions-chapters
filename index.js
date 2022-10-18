let chapters = document.querySelector("#chapters")
let captions = document.querySelector("#captions")

const getCaptions = async() => {
  console.log("clicked")
  try {
    const results = await fetch('http://localhost:8000')
    if (!results.ok) {
      throw new Error('something went wrong!');
    }

    const { chapters } = await results.json()
    console.log(chapters)


    chapters.innerHTML = "Test"
/* 
    chapters.innerHTML = chapters.map(item => {

      //return `Title: ${item.gist}<br>Headline: ${item.headline}<br>Summary: ${item.summary}<br>`
    }).join("") */

  } catch(err) {
    console.error(err);
  }
}

captions.addEventListener("click", getCaptions)
