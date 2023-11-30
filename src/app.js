const express = require("express");
const { ProductManager } = require("./ProductManager");

const app = express();
const port = 8080;

let productManager;

// Manejo de errores
const errorHandler = (err, res) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

// carga productos antes de cada solicitud
const loadProducts = async (req, res, next) => {
  try {
    if (!productManager) {
      // Inicializamos productManager si aún no está inicializado
      productManager = await new ProductManager("./products.json");
    }
    await productManager.loadProducts();
    next();
  } catch (err) {
    errorHandler(err, res);
  }
};

// cargamos los productos antes de cada solicitud
app.use(loadProducts);

// obtener todos los productos con opción de límite
app.get("/products", (req, res) => {
  const limit = req.query.limit;
  const products = limit
    ? productManager.getProducts().slice(0, limit)
    : productManager.getProducts();
  res.json({ products });
});

// obtener un producto por su ID
app.get("/products/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    await productManager.loadProducts();
    const product = productManager.getProductById(pid);
    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    errorHandler(err, res);
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
