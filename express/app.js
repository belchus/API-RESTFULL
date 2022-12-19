const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
  }

  saveData = async (data) => {
    try {
      await fs.promises.writeFile(this.nombre, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("error escritura en archivo!", error);
    }
  };

  save = async (item) => {
    const allProducts = (await this.getAll()) || [];
    try {
      let id = 0;
       allProducts.length === 0
      ? (id = 1)
      : (id = allProducts[allProducts.length - 1].id + 1);
      const newProduct = { ...item, id: id };
      allProducts.push(newProduct);
      await this.saveData(allProducts);
      console.log(` ${item.title} fue ingresado`);
      return newProduct.id;
    } catch (error) {
      console.log("error", error);
    }
  };

  getById = async (id) => {
    const allProducts = (await this.getAll()) || [];
    try {
      const productId = allProducts.find((product) => product.id === id);
      console.log("El producto buscado es: \n", productId || "Producto inexistente");
      return productId || null;
    } catch (error) {
      console.log("Error, ", error);
    }
  };

  getAll = async () => {
    try {
      const content = await fs.promises.readFile(this.nombre);
      const myProducts = JSON.parse(content);
      console.log("Todos los productos: \n", myProducts);
      return myProducts;
    } catch (error) {
      console.log("Carrito vacio");
    }
  };

  deleteById = async (id) => {
    const allProducts = (await this.getAll()) || [];
    try {
      const filteredProducts = allProducts.filter(
        (product) => product.id !== id
      );
      this.saveData(filteredProducts)
      console.log("Producto eliminado con exito!");
    } catch (error) {
      console.log(" Lo siento no se pudo eliminar el producto deseado!", error);
    }
  };

  deleteAll = async () => {
    try {
      this.saveData([]);
      console.log("Producto eliminado con exito!");
    } catch (error) {
      console.log("Lo siento no se pudo eliminar el producto deseado!", error);
    }
  };
}

const item = {
    title:'Aros',
    price:900,
    thumbnail:'https://imagendeejemplo.com',
};
const item2 = {
    title:'Pulsera',
    price:1000,
    thumbnail:'https://imagendeejemplo2.com',
};


const productos = new Contenedor("productos.txt");

productos.save(item2)

//productos.getAll()

//productos.deleteAll()

 //productos.getById(1)

//productos.deleteById(2)

module.exports = Contenedor