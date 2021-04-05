const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));

app.use(bodyParser.json());

app.get('/catalogData', (req, res) => {
    fs.readFile('js/products.json', 'utf8', (err, data) => {
      if(!err) {
          res.setHeader('Content-Type', 'Application/json');
          res.end(data);
          console.log(data);
      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
    });
});

app.get('/cart', (req, res) => {
  fs.readFile('js/cart.json', 'utf-8', (err, data) => {
      if(!err) {
          res.setHeader('Content-Type', 'Application/json');
          console.log(data);
          res.end(data);
          
      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
  })
});


app.post('/cart', bodyParser.json(), (req, res) => {
  fs.readFile('js/cart.json', 'utf-8', (err, data) => {
     if(!err) {
         const goods = JSON.parse(data);

         goods.push(req.body);
         console.log(req.body);

         fs.writeFile('js/cart.json', JSON.stringify(goods), (err) => {
              if(!err) {
                  res.end();
              }  else {
                  console.log(err);
                  res.end(JSON.stringify(err));
              }
         });

      } else {
          console.log(err);
          res.end(JSON.stringify(err));
      }
  })
});


app.delete('/cart', bodyParser.json(), (req, res) => {
  fs.readFile('js/cart.json', 'utf-8', (err, data) => {
    if(!err) {
      const cart = JSON.parse(data);
      const id = req.body.id;
      const goodIndex = cart.findIndex((item) => item.id == id);
      cart.splice(goodIndex, 1);
      fs.writeFile('js/cart.json', JSON.stringify(cart), (err) => {
        if(!err) {
            res.end();
        }  else {
            console.log(err);
            res.end(JSON.stringify(err));
        }
      });
    }
  })
})



app.listen(3200, function() {
  console.log('server is running on port 3200!');
});

//comment