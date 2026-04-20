const express = require("express");
const { cloneProducts } = require("../shared/catalog");

const app = express();
const port = 3000;

app.use(express.json());

let products = cloneProducts().map(({ id, name, price }) => ({ id, name, price }));

const isValidPrice = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const isValidName = (value) => typeof value === "string" && value.trim().length > 0;

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { name, price } = req.body;

  if (!isValidName(name) || !isValidPrice(price)) {
    return res.status(400).json({
      message: "Invalid data. Send name (string) and price (number >= 0)."
    });
  }

  const nextId = products.length > 0 ? Math.max(...products.map((item) => item.id)) + 1 : 1;
  const newProduct = { id: nextId, name: name.trim(), price };
  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.patch("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price } = req.body;

  if (name !== undefined) {
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Field name must be a non-empty string." });
    }
    product.name = name.trim();
  }

  if (price !== undefined) {
    if (!isValidPrice(price)) {
      return res.status(400).json({ message: "Field price must be a number >= 0." });
    }
    product.price = price;
  }

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter((item) => item.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product removed" });
});

app.listen(port, () => {
  console.log(`API ready: http://localhost:${port}`);
});
