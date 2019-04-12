
    /**
    * 通过stream复制文件，从filename => newFilename
    *
    **/

   const fs = require('fs');

    module.exports =  function (filename, newFilename, options = {}) {
    return new Promise((resolve, reject) => {
        let w = fs.createWriteStream(newFilename, options);

        w.on('error', err => {
        reject(err)
        });

        let r = fs.createReadStream(filename).pipe(w);

        r.on('error', err => {
        reject(err);
        });
        r.on('close', () => {
        resolve();

        });
    })
    };
