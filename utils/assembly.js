const axios = require("axios");

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "d3ea1c6ea69346818666761fd6495ada",
        "content-type": "application/json",
    }
});

module.exports = { assembly }