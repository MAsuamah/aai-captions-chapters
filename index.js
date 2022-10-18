const axios = require("axios"); 
const fs = require("fs")
const { writeCaptions } = require('./utils/write');
const refreshInterval = 5000
let chapters = document.querySelector("#chapters")

 const assemblyUpload = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "d3ea1c6ea69346818666761fd6495ada",
        "content-type": "application/json",
        "transfer-encoding": "chunked",
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

const file = "./captions/remove-stains.mp4";

fs.readFile(file, (err, data) => {
    if (err) return console.error(err);

    assemblyUpload
        .post("/upload", data)
        .then((res) => {
            const assembly = axios.create({ baseURL: "https://api.assemblyai.com/v2",
                headers: {
                    authorization: "d3ea1c6ea69346818666761fd6495ada",
                    "content-type": "application/json",
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            const getTranscript = async () => {
                // Sends the audio file to AssemblyAI for transcription
                const response = await assembly.post("/transcript", {
                    audio_url: res.data.upload_url,
                    auto_chapters: true
                })
            
                // Interval for checking transcript completion
                const checkCompletionInterval = setInterval(async () => {
                    const transcript = await assembly.get(`/transcript/${response.data.id}`)
                    const transcriptStatus = transcript.data.status
                
                    if (transcriptStatus !== "completed") {

                    console.log(`Transcript Status: ${transcriptStatus}`)

                    } else if (transcriptStatus === "completed") {
                    console.log(transcript.data.chapters)
                    const summary = transcript.data.chapters
                    chapters.innerHTML = summary.map()
                    const results = await assembly.get(`/transcript/${response.data.id}/srt`)
                    const captions = results.data
                    writeCaptions(captions)
                    clearInterval(checkCompletionInterval)
                    }
                }, refreshInterval)
            }  
            getTranscript() 
        })
        .catch((err) => console.error(err));
}); 
