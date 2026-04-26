// load environment variables from .env before anything else
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// no database connection needed — data is stored in memory
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
