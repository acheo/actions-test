const fs = require('fs');
const { languages } = require('./languages');

async function downloadFile(url, filename) {
    const response = await fetch(url);
    const json = await response.json();
    fs.writeFileSync(filename, JSON.stringify(json, null, 2), 'utf8');
    console.log("saved "+filename);
}

// ensure temp folder exists
var dir = './temp';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

async function main() {
    console.log("Download teams metadata");
    await downloadFile("http://strapi-v2.eastus.cloudapp.azure.com:1337/api/teams?populate=*","./uploads/teams.json");

    console.log("Download frontend translations");
    await downloadFile("http://strapi-v2.eastus.cloudapp.azure.com:1337/api/translations","./temp/translations.json");

    for (const language of languages){
        console.log("downloading "+language);

        const url = "http://strapi-v2.eastus.cloudapp.azure.com:1337/api/questions?populate[0]=media.url&populate[1]=answers.media.url&filters[enabled][$eq]=true&filters[quizPack][$eq]=WWC23&locale="+language;
        const filename = "./temp/questions-"+language+".json"
        await downloadFile(url,filename);
    }
}

main();