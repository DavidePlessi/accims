const config = require('./config/config');
const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const exceptionHandler = require('./middleware/exceptionHandler')

const app = express();
connectDb(async () => console.log('DB connected'));

app.use(cors());
app.use(express.json());


app.get(
  '/',
  (req, res) => {
    return res.json({message: "I'm alive!"})
  }
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/translations', require('./routes/translations/translations'));
app.use('/api/translation-categories', require('./routes/translations/translationCategories'));
app.use('/api/translation-settings', require('./routes/translations/translationSettings'));

app.use(exceptionHandler);

app.listen(config.PORT, () => `Running server on port ${config.PORT}`);
