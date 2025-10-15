//npm install
//npm install express
//npm install nodemon
//node filename.js

const express = require('express');
const app = express();

app.use(express.json());

// Sample mobile hardware spares
let spares = [
  {
    id: 1,
    type: "Battery",
    brand: "Samsung",
    price: 3000.00
  },
  {
    id: 2,
    type: "Display",
    brand: "Redmi",
    price: 7000.00
  },
  {
    id: 3,
    type: "Motherboard",
    brand: "Oppo",
    price: 10000.00
  },
  {
    id: 4,
    type: "Camera Module",
    brand: "Vivo",
    price: 2500.00
  },
  {
    id: 5,
    type: "Charging Port",
    brand: "Realme",
    price: 1200.00
  }
];

// GET all spares
app.get('/api/spares', (req, res) => {
  res.send(spares);
});

// GET spare by ID
app.get('/api/spares/:id', (req, res) => {
  const spare = spares.find(s => s.id === parseInt(req.params.id));
  if (!spare) return res.status(404).send('Spare not found');
  res.send(spare);
});

// POST new spare
app.post('/api/spares', (req, res) => {
  const spare = {
    id: spares.length + 1,
    type: req.body.type,
    brand: req.body.brand,
    price: parseFloat(req.body.price)
  };
  spares.push(spare);
  res.send(spare);
});

// PUT update spare
app.put('/api/spares/:id', (req, res) => {
  const spare = spares.find(s => s.id === parseInt(req.params.id));
  if (!spare) return res.status(404).send('Spare not found');

  spare.type = req.body.type;
  spare.brand = req.body.brand;
  spare.price = parseFloat(req.body.price);
  res.send(spare);
});

// DELETE spare
app.delete('/api/spares/:id', (req, res) => {
  const index = spares.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Spare not found');

  const deleted = spares.splice(index, 1);
  res.send(deleted[0]);
});

// Start server
const port = process.env.PORT || 8080;
app.use(express.static(__dirname));

app.listen(port, () => console.log(`Spare API running on port ${port}..`));


/*GET http://localhost:8080/api/spares

POST http://localhost:8080/api/spares with JSON body

PUT http://localhost:8080/api/spares/:id

DELETE http://localhost:8080/api/spares/:id*/

