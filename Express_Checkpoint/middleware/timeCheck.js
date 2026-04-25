module.exports = (req, res, next) => {
  const now = new Date();
  const day = now.getDay();   // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();

  const isWeekend = day === 0 || day === 6;
  const isOutsideHours = hour < 9 || hour >= 17;

  if (isWeekend || isOutsideHours) {
    return res.status(503).render('closed', {
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
  }

  next();
};
