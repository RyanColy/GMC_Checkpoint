const express = require('express');
const path = require('path');
const timeCheck = require('./middleware/timeCheck');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(timeCheck);

app.get('/', (req, res) => res.render('home'));
app.get('/services', (req, res) => res.render('services'));
app.get('/contact', (req, res) => res.render('contact', { success: false }));
app.post('/contact', (req, res) => res.render('contact', { success: true }));

app.listen(PORT, () => console.log(`NexaStudio running → http://localhost:${PORT}`));
