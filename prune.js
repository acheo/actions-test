const jq = require('node-jq');
const fs = require('fs');
const { languages } = require('./languages');

async function pruneFile(language) {

    const filter = "del(.data[].attributes.createdAt,.data[].attributes.updatedAt,.data[].attributes.enabled,.data[].attributes.quizPack,.data[].attributes.tags,.data[].attributes.locale, .data[].attributes.relatedCountry, .data[].attributes.media.data.attributes.formats, .data[].attributes.answers[].media.data.attributes.formats)";
    const options = {};
    const inFile = "./temp/questions-enc-"+language+".json";
    const outFile = "./uploads/questions-enc-"+language+".json";

    jq.run(filter, inFile, options)
    .then((output) => {
        fs.writeFileSync(outFile,output);
        console.log("saved "+outFile);
    })
    .catch((err) => {
        console.error(err)
    })
}

languages.forEach((language)=>{
    console.log("pruning "+language);
    pruneFile(language);
})