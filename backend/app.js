require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('./middlewares/cors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { Reg } = require('./utils/const');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use(requestLogger);
app.use(cors({ credentials: true, origin: '*' }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(Reg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.all('*', () => {
  throw new NotFoundError('Страница не найдена');
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, family: 4 });
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleErrors);

app.listen(PORT);
