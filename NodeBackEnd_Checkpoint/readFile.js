const fs = require('fs');

const content = fs.readFileSync('./message.txt', 'utf8');
console.log(content);
