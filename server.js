const express = require('express');
const axios = require('axios');
const fs = require("fs")
const cors = require('cors');
const refreshInterval = 5000
const { writeCaptions } = require('./utils/write');
const { assembly } = require("./utils/assembly")

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
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

    const file = "./captions/remove-stains.mp4"

    fs.readFile(file, (err, data) => {

        if (err) return console.error(err);
    
        assemblyUpload
            .post("/upload", data)
            .then((resp) => {
    
                const getTranscript = async () => {
                    const response = await assembly.post("/transcript", {
                        audio_url: resp.data.upload_url,
                        auto_chapters: true
                    })
                
                    const checkCompletionInterval = setInterval(async () => {
                        const transcript = await assembly.get(`/transcript/${response.data.id}`)
                        const transcriptStatus = transcript.data.status
                    
                        if (transcriptStatus !== "completed") {
    
                        console.log(`Transcript Status: ${transcriptStatus}`)
                        if(transcriptStatus === "error") {
                            console.log(transcript.data.error)
                        }
    
                        } else if (transcriptStatus === "completed") {
                            res.json(transcript.data)             
                            console.log(transcript.data.chapters)
    
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

});


app.set('port', 8000);
const server = app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${server.address().port}`);
});