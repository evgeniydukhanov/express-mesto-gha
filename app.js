const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'По указанному пути ничего нет' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
