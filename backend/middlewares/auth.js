const jwt = require('jsonwebtoken');
const { JWT } = require('../utils/const');

const auth = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    next(res.status(401).send({ message: 'Вы не прошли авторизацию' }));
  } else {
    const token = cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, JWT);
    } catch (err) {
      next(res.status(401).send({ message: 'Вы не прошли авторизацию' }));
    }

    req.user = payload;
    next();
  }
};

module.exports = auth;
