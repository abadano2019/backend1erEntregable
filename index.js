// Desafio entregable Nro 2, Programación Backend
// Tema: manejo de archivos
// Titular: Ariel Badano
// CoderHouse

const fs = require('fs')
const path = './productos.json'

// Clase utilizada para instanciar los datos de los productos para luego ser dados de alta a la colección junto al
// id generado. También es usada para la modificación de datos, se deberá crear la instancia tal cual existe en 
// la colección de productos con los campos que se desean modificar, puede ser uno o todos, la modificacón se 
// realizará por id.
class Product {
  title
  description
  price
  thumbnail
  code
  stock

  constructor(title, description, price, thumbnail, code, stock){
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.stock = stock
  }

}


class ProductManager {
  
  #id = 1
  #path = ""
  
  // Constructor de la clase recibe la ruta donde se encuentra el archivo donde se almacena la información
  // en caso de existir el archivo y que contenga elementos de la colección se toma el ultimo id para setear
  // el atributo id de la clase
  constructor(path) {
    this.#path = path
    try{
      if (fs.existsSync(this.#path)){
        
        const productos = fs.readFileSync(this.#path, 'utf-8')
        const productosJS = JSON.parse(productos)
        const maxId = Math.max(...productosJS.map(product => product.id), 0);
        console.log("ID MAXIMO")
        console.log(maxId)
        this.#id = maxId + 1
      }
    }
    catch(error){
      console.log(error)
    }

  }

  // Metodo que devuelve la colección de productos almacenada en el archivo que se encuentra en la dirección
  // guardada en el atributo path de la clase. En caso de que el archivo aún no se haya creado devuelve un 
  // arreglo vacio.
  async getProducts() {
    try{
      if (fs.existsSync(this.#path)){
        const productos = await fs.promises.readFile(this.#path, "utf-8")
        const productosJS = JSON.parse(productos)
        return productosJS
      }
      else
      {
        return []
      }
    }
    catch(error){
      console.log(error)
    }
  }

  // Metodo que devuelve un producto dado un Id de producto, en caso de no existir en la colección el metodo
  // devuelve un mensaje "Error: Not Found" en caso contrario devuelve un mensaje con el id, el titulo y la
  // descripción por la consola además de devolver el objeto del producto encontrado.
  async getProductById(idProduct) {
    const productos = await this.getProducts();
    const producto = productos.find((product) => product.id === idProduct)
    if (!producto)
    {
      console.log("Error: Not Found")
    }
    else
    {
      console.log("Producto encontrado: " + 
                  "id: " + producto.id + 
                  " title: " + producto.title + 
                  " descripción: " + producto.description)
      return producto
    }
  }


  // Metodo que creo un producto con las variables title, description, price, thumbnail, code y stock
  // se valida la no duplicación del campo code con productos ya ingresados a la colección, además de que los
  // campos ingresado existan y no sean vacios. En caso de cumplirse todos los anteriores supuestos el metodo 
  // devuelte una instancia del objete Producto.
  createProduct(title, description, price, thumbnail, code, stock){
    // validación de los campos para que no sean undefined, compos obligatorios
    if((!title) || (!description) || (!price) || (!thumbnail) || (!code) || (!stock)){
      console.log('Atención: Los campos del productos son obligatorios (title, description, price, thumbnail, code, stock)')
      return
    }
    
    // validación de los campos, se solicita que no sean vacios
    if(title=='' || description=='' || price =='' || thumbnail == '' || code == '' || stock == ''){
      console.log('Atención: Verifique los campos a ingresar (title, description, price, thumbnail, code, stock)')
      return
    } 
    
    // crear producto 
    const producto = new Product(title,description,price,thumbnail,code,stock)
    return producto

  }

  // Metodo que agrega un producto a la colección de productos almacenada en el archivo ubicado en la dirección 
  // almacenada en el atributo path de la clase. El metodo recibe una instancia del objeto Product.
  async addProduct(producto) {

      // si el campo code no ha sido ingresado en ningun producto procedemos al alta en la colección
      try{
        if (producto){
          const productos = await this.getProducts()
          if(!this.#validarCode(productos, producto.code))
          {
            const prod = {
              id: this.#generarId(),
              ...producto,
            }
            productos.push(prod)  
            await fs.promises.writeFile(this.#path,JSON.stringify(productos))
            console.log("producto agregado")
          }
          else
          {
            console.log("ATENCION: Verifique el campo Code, el mismo ya existe en otro producto")
          }
        }
        else
        {
          console.log("Producto invalido")
        }
      }catch (error) {
        console.log(error)
      }
        
  }
        
  // Metodo que modifica un producto de la colección de productos almacenada en el archivo ubicado
  // en la dirección del atributo path de la clase, el metodo recibe un id un objeto del tipo Product y actualiza
  // el producto encontrado con los datos del producto pasado por parametro, el cual debe tener todos los campos
  // cargado. En caso de no querer modificar un datos se deberá mantener el mismo dato que ya existe en ese campo. 
  async updateProduct(id, producto){
    console.log(id)
    if (!id){
      console.log("ATENCION: Debe ingresar un id valido")
      return
    }

    if(!producto){
      console.log("Atención: no se encuentran los datos de modificación")
    }
    else
    {
    
      try{
        const productos = await this.getProducts()
        const prod = productos.find((product) => product.id === id)
        prod.title = producto.title
        prod.description = producto.description
        prod.price = producto.price
        prod.thumbnail = producto.thumbnail
        prod.code = producto.code
        prod.stock = producto.stock 
        await fs.promises.writeFile(this.#path,JSON.stringify(productos))
        console.log("producto modificdo")
      }
      catch(error) {
        console.log(error)
      }
    }  
  }

  // Metodo que elimina un producto de la colección de productos almacenada en el archivo ubicado
  // en la dirección del atributo path de la clase, recibe el id del producto a ser eliminado. 
  async deleteProduct(id){

    if (!id){
      console.log("ATENCION: Debe ingresar un id valido")
      return
    }

    const productoEncontrado = await this.getProductById(id)
    if(!productoEncontrado) { 
      return 
    }
    
    try{
      const productos = await this.getProducts()
      const newProducts = productos.filter((product) => product.id !== id)
      await fs.promises.writeFile(this.#path,JSON.stringify(newProducts))
      console.log("producto eliminado")
    }
    catch(error) {
      console.log(error)
    }  

  }

  // Metodo privado para la generación del id de los productos
  #generarId() {
    return this.#id++;
  }

  // Metodo privado para la validación del campo code de los productos, no se permite la duplicación.
  #validarCode(productos, newCode) {
    return productos.find((product) => (product.code === newCode))
  }
}

//TESTING
console.log("//////////////////////////////////////////////////////////////////////////////////////////////////")
console.log("/////  Se ejecuta pruebas sugeridas por la letra del ejercicio junto con otras pruebas  //////////")
console.log("//////////////////////////////////////////////////////////////////////////////////////////////////")
console.log("*** Se crea instancia de la clase ProductManager ***")
const productManager = new ProductManager(path)
async function testing (){
  console.log("*** se mestra el contenido de la colección de productos ***")
  let products = await productManager.getProducts()
  console.log(products)
  console.log("*** se carga nuevo producto ***")
  const prod_1 = productManager.createProduct("producto prueba","Este es un producto prueba","200","sin imagen","abc123","25");
  await productManager.addProduct(prod_1);
  console.log("*** se mestra el contenido de la colección de productos ***")
  console.log("Productos cargados:")
  products = await productManager.getProducts()
  console.log(products)

  console.log("*** se carga nuevo producto ***")
  const prod_2 = productManager.createProduct("producto prueba","Este es un producto prueba","200","sin imagen","abc124","25");
  await productManager.addProduct(prod_2);
  console.log("*** se mestra el contenido de la colección de productos ***")
  console.log("Productos cargados:")
  products = await productManager.getProducts()
  console.log(products)

  console.log("*** se carga nuevo producto ***")
  const prod_3 = productManager.createProduct("producto prueba","Este es un producto prueba","200","sin imagen","abc125","25");
  await productManager.addProduct(prod_3);
  console.log("*** se mestra el contenido de la colección de productos ***")
  console.log("Productos cargados:")
  products = await productManager.getProducts()
  console.log(products)

  console.log("*** se buscar producto con id = 1 ***")
  const prod2 = await productManager.getProductById(1)
  console.log("encontrado por id")
  console.log(prod2)
  console.log("*** se buscar producto con id = 100 (existe?)***")
  const prod3 = await productManager.getProductById(100)
  console.log("producto encontrado?:")
  console.log(prod3)

  console.log("*** Se modifica producto con id = 3 ****")
  const prodModificado = productManager.createProduct("--Producto Modificado--","Este es un producto","200","sin imagen","abc123Modificado","25");
  await productManager.updateProduct(3,prodModificado)
  products = await productManager.getProducts()
  console.log(products)

  console.log("*** Se elimina el producto con id = 1***")
  await productManager.deleteProduct(1)
  products = await productManager.getProducts()
  console.log(products)

  console.log("*** Se elimina el producto con id = 20 (no existe)***")
  console.log("se encontró el producto?:")
  await productManager.deleteProduct(20)
  products = await productManager.getProducts()
  console.log(products)

  console.log("/////////////////////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Nota: si se vuelve a ejecutar el codigo se cargarán los datos del producto con id 1 borrado con")
  console.log("otro id y los datos del producto con id 3 antes de ser modificado con otro id ya que en la midificación")
  console.log("el campo code se cambió por otro valor")
  console.log("/////////////////////////////////////////////////////////////////////////////////////////////////////////")
}

testing()