var CryptoJS = require("crypto-js");
const { readFileSync, writeFileSync } = require('fs');

var key = 'cedeac05084fb9a7d748a69744735650d95edec3a6a95cc5449f99f1aa47bfeb';

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('Hello World', key).toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText);

function encryptQuestionFile(infilename, outfilename){

    const d = readFileSync(infilename);

    let obj = JSON.parse(d)
    
    obj.data = obj.data.map((question) => {
        //console.log(question.id);
        const encryptedTitle =  CryptoJS.AES.encrypt(question.attributes.title, key).toString();
        //console.log(question.attributes.title);
        //console.log(encryptedTitle);
        question.attributes.title = encryptedTitle;
    
    
        question.attributes.answers = question.attributes.answers.map((answer) => {        
            const encryptedAnswerText = CryptoJS.AES.encrypt(answer.text, key).toString();
            //console.log(answer.text);
            //console.log(encryptedAnswerText);
            answer.text = encryptedAnswerText;
            return answer;
        });
    
        return question;
    });
    
    //console.log(JSON.stringify(obj));
    
    try {
        writeFileSync(outfilename, JSON.stringify(obj, null, 2), 'utf8');
    } catch (error) {
        console.log('An error has occurred writing the file', error);
    }

}

const languages = [
    "en",
    "es",
    "fr",
    "it",
    "de",
    "pt",
    "tr",
    "pl",
    "es-419",
    "pt-BR"
];

languages.forEach((language)=>{
    console.log("encrypting "+language);
    encryptQuestionFile('./questions-'+language+'.json', './questions-enc-'+language+'.json');
})
