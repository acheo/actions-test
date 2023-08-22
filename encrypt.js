const CryptoJS = require("crypto-js");
const { languages } = require('./languages');
const { readFileSync, writeFileSync } = require('fs');

const key = 'cedeac05084fb9a7d748a69744735650d95edec3a6a95cc5449f99f1aa47bfeb';

function encryptQuestionFile(infilename, outfilename){

    const d = readFileSync(infilename);

    let obj = JSON.parse(d)
    
    obj.data = obj.data.map((question) => {
        const encryptedTitle =  CryptoJS.AES.encrypt(question.attributes.title, key).toString();
        question.attributes.title = encryptedTitle;
        question.attributes.answers = question.attributes.answers.map((answer) => {        
            const encryptedAnswerText = CryptoJS.AES.encrypt(answer.text, key).toString();
            answer.text = encryptedAnswerText;
            return answer;
        });
        return question;
    });
    
    try {
        writeFileSync(outfilename, JSON.stringify(obj, null, 2), 'utf8');
    } catch (error) {
        console.log('An error has occurred writing the file', error);
    }

}

languages.forEach((language)=>{
    console.log("encrypting "+language);
    encryptQuestionFile('./temp/questions-'+language+'.json', './temp/questions-enc-'+language+'.json');
})
