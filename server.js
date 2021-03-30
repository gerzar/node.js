const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));

app.use(bodyParser.json());

app.get('/catalogData', (req, res) => {
    fs.readFile('js/products.json', 'utf8', (err, data) => {
        res.send(data);
        // console.log(data);
    });
});

app.post('/addToCart', (req, res) => {
    fs.readFile('js/cart.json', 'utf8', (err, data) => {
      if (err) {
        res.send('{"result": 0}');
      } else {
        const cart = JSON.parse(data);
        const item = req.body;
        
        cart.push(item);
  
        fs.writeFile('js/cart.json', JSON.stringify(cart), (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
        });
      }
    });
});

app.listen(3000, function() {
  console.log('server is running on port 3000!');
});