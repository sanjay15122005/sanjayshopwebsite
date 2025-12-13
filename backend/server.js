const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------ CONNECT TO MONGODB ------------------
 
 mongoose.connect("mongodb+srv://sanjay:sanjayvijay1976@sanjaycluster.aumoorb.mongodb.net/sanjayDB?retryWrites=true&w=majority&appName=sanjayCluster")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// ------------------ ADMIN MODEL ------------------
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String   // hashed password
});



// ------------------ LOGIN API ------------------

const SECRET_KEY = "sanjay_secret_key";

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false, message: "Wrong password" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });

    res.json({ success: true, token });
});

function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.json({ success: false, message: "No token" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.json({ success: false, message: "Invalid token" });
        next();
    });
}


// PRODUCT SCHEMA
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: String
});

const Product = mongoose.model("Product", ProductSchema);

// ADD PRODUCT
app.post("/add-product", verifyToken, async (req, res) => {
    const { name, price, image, category } = req.body;

    const newProduct = new Product({ name, price, image, category });
    await newProduct.save();

    res.json({ success: true, message: "Product added successfully!" });
});

// GET ALL PRODUCTS
app.get("/products", verifyToken, async (req, res) => {
    const items = await Product.find({});
    res.json(items);

});


// DELETE PRODUCT
app.post("/delete-product", verifyToken, async (req, res) => {
    const { id } = req.body;

    await Product.findByIdAndDelete(id);

    res.json({ success: true, message: "Product deleted!" });
});

// UPDATE PRODUCT
app.post("/update-product", verifyToken, async (req, res) => {
    const { id, name, price, image, category } = req.body;

    await Product.findByIdAndUpdate(id, {
        name,
        price,
        image,
        category
    });

    res.json({ success: true, message: "Product updated!" });
});
 



