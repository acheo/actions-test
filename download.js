const http = require('http');
const fs = require('fs');
const { languages } = require('./languages');

function downloadFile(url, filename) {
    http.get(url, (res) => {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log('Downloaded ' + url)
        });
    })
}

languages.forEach((language)=>{
    console.log("downloading "+language);

    const url = "http://strapi-v2.eastus.cloudapp.azure.com:1337/api/questions?populate[0]=media.url&populate[1]=answers.media.url&filters[enabled][$eq]=true&filters[quizPack][$eq]=WWC23&locale="+language;
    const filename = "./temp/questions-"+language+".json"
    downloadFile(url,filename);
})