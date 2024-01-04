const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const passport = require('./src/config/passport.js');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.use('/api/', limiter);


app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8001;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = {
  app,
  server,  // Export the server instance as well
};
