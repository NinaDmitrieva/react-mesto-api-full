const allowedCors = [
  'https://domainname.mesto-full.nomoreparties.sbs',
  'http://domainname.mesto-full.nomoreparties.sbs',
  'http://localhost:3000',
  'https://localhost:3000',
  'https://api.mesto-full.nomoredomains.sbs',
  'http://api.mesto-full.nomoredomains.sbs',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  res.header('Access-Control-Allow-Credentials', 'true');

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }
  next();
};

module.exports = cors;