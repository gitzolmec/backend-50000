const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextId = 1;
    return (async () => {
      await this.loadProducts();
      return this;
    })();
  }

  // Cargar productos desde el archivo
  loadProducts = async () => {
    try {
      const data = await fs.readFile(this.path);
      this.products = JSON.parse(data);
      this.nextId =
        this.products.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        ) + 1;
    } catch (error) {
      this.products = [];
    }
  };

  // Guardar productos en el archivo
  saveProducts = async () => {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.error("Error al guardar productos:", error.message);
    }
  };

  // Agregar un nuevo producto
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const product = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    await this.saveProducts();
    console.log(`Producto '${title}' agregado con éxito.`);
  };

  // Obtener todos los productos
  getProducts = () => this.products;

  // Obtener un producto por su ID
  getProductById = (id) => {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Producto no encontrado.");
    }

    return product;
  };

  // Actualizar un producto por su ID con nuevos campos
  updateProduct = async (id, updatedFields) => {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error("Producto no encontrado.");
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedFields };

    await this.saveProducts();
    console.log(`Producto con ID ${id} actualizado con éxito.`);
  };

  // Eliminar un producto por su ID
  deleteProduct = async (id) => {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error("Producto no encontrado.");
      return;
    }

    this.products.splice(index, 1);
    await this.saveProducts();
    console.log(`Producto con ID ${id} eliminado con éxito.`);
  };
}
module.exports = {
  ProductManager,
};
