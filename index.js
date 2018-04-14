const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://strobo.fm');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/donate', (req, res) => {
  const {
    amount,
    currency,
    source,
    description
  } = req.body;

  try {
    stripe.charges.create({
      amount,
      currency,
      source,
      description
    }, (error, charge) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({ charge });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 5000);
