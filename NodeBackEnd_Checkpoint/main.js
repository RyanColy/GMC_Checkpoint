const { generateReport } = require('./reportGenerator');

const report1 = generateReport('Alice', [14, 12, 16, 10]);
console.log(report1);

console.log('---');

const report2 = generateReport('Bob', [8, 6, 9, 7]);
console.log(report2);
