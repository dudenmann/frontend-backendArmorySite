const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const { cloneProducts } = require("../shared/catalog");

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

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Historical Medieval Store API",
      version: "2.0.0",
      description: "Unified CRUD API for historically grounded medieval catalog"
    },
    servers: [{ url: "http://localhost:3000" }]
  },
  apis: [__filename]
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - category
 *         - description
 *         - era
 *         - origin
 *         - material
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Arming Sword
 *         category:
 *           type: string
 *           example: Swords
 *         description:
 *           type: string
 *           example: Single-handed knightly sword for shield-and-sword combat.
 *         era:
 *           type: string
 *           example: 13th century
 *         origin:
 *           type: string
 *           example: Western Europe
 *         material:
 *           type: string
 *           example: Pattern-welded steel, wooden grip
 *         price:
 *           type: number
 *           example: 28900
 *         stock:
 *           type: number
 *           example: 12
 *         rating:
 *           type: number
 *           nullable: true
 *           example: 4.9
 *         image:
 *           type: string
 *           nullable: true
 *           example: /assets/products/arming-sword.jpg
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products (optionally filtered)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search by product fields
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Exact category filter
 *     responses:
 *       200:
 *         description: Product list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - era
 *               - origin
 *               - material
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               era:
 *                 type: string
 *               origin:
 *                 type: string
 *               material:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               rating:
 *                 type: number
 *                 nullable: true
 *               image:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid payload
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               era:
 *                 type: string
 *               origin:
 *                 type: string
 *               material:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               rating:
 *                 type: number
 *                 nullable: true
 *               image:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid update payload
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
app.delete("/api/products/:id", (req, res) => {
  const oldLength = products.length;
  products = products.filter((item) => item.id !== Number(req.params.id));
  if (products.length === oldLength) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product removed" });
});

app.listen(port, () => {
  console.log(`Server ready on http://localhost:${port}`);
  console.log(`Swagger docs on http://localhost:${port}/api-docs`);
});
