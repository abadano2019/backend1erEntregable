// Desafio entregable Nro 1, Programación Backend
// Titular: Ariel Badano
// CoderHouse

class ProductManager {
  #id = 1
  constructor() {
    this.products = []
  }

  getproducts() {
    return this.products
  }
   
  getproductById(idProduct) {
    const product = this.products.find((product) => product.id === idProduct)
    if (!product)
    {
      console.log("Error: Not Found")
    }
    else
    {
      console.log("Producto encontrado: " + "id: " + product.id + " title: " + product.title + " descripción: " + product.description)
      return product
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // validación de los campos para que no sean undefined, compos obligatorios
    if((!title) || (!description) || (!price) || (!thumbnail) || (!code) || (!stock)){
      console.log('Atención: Los campos del productos son obligatorios (title, description, price, thumbnail, code, stock)')
      return
    }
    
    // validación de los campos, se solicita que no sean vacios
    if(title=='' || description=='' || price =='' || thumbnail == '' || code == '' || stock == ''){
         console.log('Atención: Verifique los campos a ingresar (title, description, price, thumbnail, code, stock)')
    } 
    else
    // alta del producto a la colección products
    {
      // si el campo code no ha sido ingresado en ningun producto procedemos al alta en la colección
      if(!this.#validarCode(code))
      {
        const product = {
          id: this.#generarId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        }
        this.products.push(product)
        console.log("Producto agregado")
      }
      else
      {
        console.log("ATENCION: Verifique el campo Code, el mismo ya existe en otro producto")
      }
    }
  }
    
  #generarId() {
    return this.#id++;
  }

  #validarCode(newCode) {
    return this.products.find((product) => (product.code === newCode))
  }
}

//TESTING
console.log("//////////////////////////////////////////////////////////////////////////")
console.log("/////  Se ejecuta pruebas sugeridas por la letra del ejercicio  //////////")
console.log("//////////////////////////////////////////////////////////////////////////")
console.log("*** Se crea instancia de la clase ProductManager ***")
const productManager = new ProductManager()
console.log("*** se mestra el contenido de la colección de productos ***")
console.log("Productos cargados:")
console.log(productManager.getproducts());
console.log("*** se carga nuevo producto ***")
productManager.addProduct("producto prueba","Este es un producto prueba","200","sin imagen","abc123","25");
console.log("*** se mestra el contenido de la colección de productos ***")
console.log("Productos cargados:")
console.log(productManager.getproducts());
console.log("*** Se intenta ingresar el mismo producto ***")
productManager.addProduct("producto prueba","Este es un producto prueba","200","sin imagen","abc123","25");
console.log("*** se buscar producto con id = 1 ***")
console.log(productManager.getproductById(1));
console.log("*** se busca producto con id = 10")
productManager.getproductById(10);


// OTRAS PRUEBAS
console.log("///////////////////////////////////////////")
console.log("/////Se ejecutan otras pruebas/////////////")
console.log("///////////////////////////////////////////")
console.log("*** validación de campos obligatorios ***")
productManager.addProduct()
console.log("*** validación de campos obligatorios ***")
productManager.addProduct("producto prueba2","200","sin imagen","abc124","25");
console.log("*** validación de campos obligatorios ***")
productManager.addProduct("producto prueba2","Descripción de producto 2","200","sin imagen","abc124","25");
console.log("*** validación de campos obligatorios ***")
productManager.addProduct("","Descripción de producto 2","200","sin imagen","abc124","25");
console.log("*** validación de campos obligatorios ***")
productManager.addProduct("producto prueba 2","Descripción de producto 2","","sin imagen","abc124","25");
console.log("*** se verifica colección de productos ***")
console.log(productManager.getproducts())
console.log("*** se intenta cargar nuevo producto con campo code repetido ***")
productManager.addProduct("producto prueba 2","Descripción de producto 2","200","sin imagen","abc124","25");
console.log("*** se intenta cargar nuevo producto con campo code distinto y resto de campos iguales a otro producto ***")
productManager.addProduct("producto prueba 2","Descripción de producto 2","200","sin imagen","abc125","25");
console.log("*** se verifica colección de productos ***")
console.log(productManager.getproducts())