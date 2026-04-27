const express = require("express");
const cors = require("cors");
const { cloneProducts } = require("../../shared/catalog");

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.get("/", (req, res) => {
  res.send("API работает. Используйте /api/products");
});

let products = cloneProducts();

const isString = (value) => typeof value === "string" && value.trim().length > 0;
const isNumber = (value) => typeof value === "number" && Number.isFinite(value);
const isNullableString = (value) => value === null || isString(value);

function validateForCreate(body) {
  return (
    isString(body.name) &&
    isString(body.category) &&
    isString(body.description) &&
    isString(body.era) &&
    isString(body.origin) &&
    isString(body.material) &&
    isNumber(body.price) &&
    isNumber(body.stock) &&
    (body.rating === undefined || isNumber(body.rating)) &&
    (body.image === undefined || isNullableString(body.image))
  );
}

function applyUpdate(product, patch) {
  const textFields = ["name", "category", "description", "era", "origin", "material", "image"];
  const numberFields = ["price", "stock", "rating"];

  for (const key of Object.keys(patch)) {
    if (textFields.includes(key)) {
      if (!isNullableString(patch[key])) {
        return { ok: false, message: `Invalid ${key}` };
      }
      product[key] = patch[key] === null ? null : patch[key].trim();
    } else if (numberFields.includes(key)) {
      if (!isNumber(patch[key])) {
        return { ok: false, message: `Invalid ${key}` };
      }
      product[key] = patch[key];
    } else {
      return { ok: false, message: `Unknown field ${key}` };
    }
  }

  return { ok: true };
}

app.get("/api/products", (req, res) => {
  let result = [...products];
  const q = req.query.q ? String(req.query.q).trim().toLowerCase() : "";
  const category = req.query.category ? String(req.query.category).trim().toLowerCase() : "";

  if (q) {
    result = result.filter((item) =>
      `${item.name} ${item.description} ${item.era} ${item.origin} ${item.material}`
        .toLowerCase()
        .includes(q)
    );
  }

  if (category) {
    result = result.filter((item) => item.category.toLowerCase() === category);
  }

  res.json(result);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  if (!validateForCreate(req.body)) {
    return res.status(400).json({ message: "Invalid product payload" });
  }

  const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    description: req.body.description.trim(),
    era: req.body.era.trim(),
    origin: req.body.origin.trim(),
    material: req.body.material.trim(),
    price: req.body.price,
    stock: req.body.stock,
    rating: req.body.rating === undefined ? null : req.body.rating,
    image: req.body.image === undefined ? null : req.body.image
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const result = applyUpdate(product, req.body);
  if (!result.ok) {
    return res.status(400).json({ message: result.message });
  }

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const oldLength = products.length;
  products = products.filter((item) => item.id !== Number(req.params.id));
  if (products.length === oldLength) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product removed" });
});

app.listen(port, () => {
  console.log(`Backend ready on http://localhost:${port}`);
});
