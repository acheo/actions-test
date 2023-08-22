const jq = require('node-jq');
const fs = require('fs');
const { languages } = require('./languages');

async function extractFile(language) {
    // some locales hyphens are replaced by underscores in the source json
    let code = language;
    if (language === 'es-419') code = 'es_419';
    if (language === 'pt-BR') code = 'pt_BR';

    const filter = ".data | map({(.attributes.key): .attributes.value_"+code+"}) | add";
    const options = {};
    const inFile = "./temp/translations.json";
    const outFile = "./uploads/translation-"+language+".json";

    await jq.run(filter, inFile, options)
    .then((output) => {
        fs.writeFileSync(outFile,output);
        console.log("saved "+outFile);
    })
    .catch((err) => {
        console.error(err)
    })
}

async function main() {
    for (const language of languages){
        console.log("extracting "+language);
        await extractFile(language);
    }
}

main();