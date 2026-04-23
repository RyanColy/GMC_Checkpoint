function generateReport(name, scores) {
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const status = average >= 10 ? 'Pass' : 'Fail';
  return `Student: ${name}\nScores: ${scores.join(', ')}\nAverage: ${average.toFixed(2)}\nStatus: ${status}`;
}

module.exports = { generateReport };
