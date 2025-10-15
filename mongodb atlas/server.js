const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Atlas connection
mongoose.connect(
  "mongodb+srv://kesavaa_db_user:5Fq4t9PjCzcx75s1@cluster0.hmwzvvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB Atlas Connected"))
.catch((err) => console.error("Error:", err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Item = mongoose.model("Item", ItemSchema);

// CRUD Routes

// Create
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.send(newItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Read
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update
app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete
app.delete("/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.send({ message: "Item deleted" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html> 
<html> 
<head> 
  <title>MongoDB Atlas CRUD</title> 
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
      text-align: center;
    }
    .input-group {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }
    input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex: 1;
    }
    button {
      padding: 10px 20px;
      background-color: #007cba;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #005a87;
    }
    .delete-btn {
      background-color: #dc3545;
    }
    .delete-btn:hover {
      background-color: #c82333;
    }
    .update-btn {
      background-color: #28a745;
    }
    .update-btn:hover {
      background-color: #218838;
    }
    .item {
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-info {
      flex: 1;
    }
    .item-actions {
      display: flex;
      gap: 10px;
    }
  </style>
</head> 
<body> 
  <div class="container">
    <h2>MongoDB Atlas CRUD App</h2> 
    
    <div class="input-group">
      <input id="name" placeholder="Item Name"> 
      <input id="quantity" type="number" placeholder="Quantity"> 
      <button onclick="addItem()">Add Item</button> 
    </div>
    
    <h3>Items List:</h3> 
    <div id="items"></div> 
  </div>
 
  <script> 
    const apiUrl = "/items"; 
 
    async function getItems() { 
      try {
        const res = await fetch(apiUrl); 
        const data = await res.json(); 
        const list = document.getElementById("items"); 
        list.innerHTML = ""; 
        
        if (data.length === 0) {
          list.innerHTML = "<p>No items found. Add some items above!</p>";
          return;
        }
        
        data.forEach(item => { 
          const div = document.createElement("div"); 
          div.className = "item";
          div.innerHTML = \`
            <div class="item-info">
              <strong>\${item.name}</strong> (Quantity: \${item.quantity})
            </div>
            <div class="item-actions">
              <button class="update-btn" onclick="updateItem('\${item._id}')">Update</button> 
              <button class="delete-btn" onclick="deleteItem('\${item._id}')">Delete</button>
            </div>
          \`; 
          list.appendChild(div);
        });
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Error loading items. Check console for details.");
      }
    } 
 
    async function addItem() { 
      const name = document.getElementById("name").value; 
      const quantity = document.getElementById("quantity").value; 
      
      if (!name || !quantity) {
        alert("Please enter both name and quantity!");
        return;
      }
      
      try {
        await fetch(apiUrl, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ name, quantity: parseInt(quantity) })
        }); 
        
        // Clear input fields
        document.getElementById("name").value = "";
        document.getElementById("quantity").value = "";
        
        getItems();
      } catch (error) {
        console.error("Error adding item:", error);
        alert("Error adding item. Check console for details.");
      }
    } 
  
    async function updateItem(id) { 
      const newQty = prompt("Enter new quantity:"); 
      if (newQty && !isNaN(newQty)) { 
        try {
          await fetch(apiUrl + "/" + id, { 
            method: "PUT", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ quantity: parseInt(newQty) }) 
          }); 
          getItems();
        } catch (error) {
          console.error("Error updating item:", error);
          alert("Error updating item. Check console for details.");
        }
      } else {
        alert("Please enter a valid number!");
      }
    } 
 
    async function deleteItem(id) { 
      if (confirm("Are you sure you want to delete this item?")) {
        try {
          await fetch(apiUrl + "/" + id, { method: "DELETE" }); 
          getItems();
        } catch (error) {
          console.error("Error deleting item:", error);
          alert("Error deleting item. Check console for details.");
        }
      }
    } 
    getItems(); 
  </script> 
</body> 
</html>
  `);
});
app.listen(5000, () => console.log("Server running on http://localhost:5000"));