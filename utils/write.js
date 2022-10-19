const fs = require('fs');

const writeCaptions = fileContent => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./captions/remove-stains.vtt', fileContent, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        ok: true,
        message: 'File created!'
      });
    });
  });
};

module.exports = { writeCaptions };
  
