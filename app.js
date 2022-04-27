const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '625592bc39d08a99d5deb442',
  };

  next();
});

const { login, createUser } = require('./controllers/users');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'По указанному пути ничего нет' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
