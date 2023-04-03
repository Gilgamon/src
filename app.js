const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());

// Función para leer el archivo de productos
function readProductsFile() {
    try {
    return JSON.parse(fs.readFileSync('products.json', 'utf8'));
    } catch (err) {
    console.error(err);
    return [];
    }
}

// Función para escribir en el archivo de productos
function writeProductsFile(products) {
    try {
    fs.writeFileSync('products.json', JSON.stringify(products));
    } catch (err) {
    console.error(err);
    }
}

// Función para obtener todos los productos
app.get('/products', (req, res) => {
    const products = readProductsFile();
    res.send(products);
});

// Función para obtener un producto por su ID
app.get('/products/:id', (req, res) => {
    const products = readProductsFile();
    const id = req.params.id;
    const product = products.find((p) => p.id === id);
    if (product) {
    res.send(product);
    } else {
    res.status(404).send('Producto no encontrado');
    }
});

// Función para agregar un nuevo producto
app.post('/products', (req, res) => {
    const products = readProductsFile();
    const newProduct = req.body;
    newProduct.id = Date.now().toString(); // Generar ID único
    products.push(newProduct);
    writeProductsFile(products);
    res.send(`Producto agregado: ${newProduct.title}`);
});

// Función para actualizar un producto por su ID
app.put('/products/:id', (req, res) => {
    const products = readProductsFile();
    const id = req.params.id;
    const updatedProduct = req.body;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    writeProductsFile(products);
    res.send(`Producto actualizado: ${products[index].title}`);
    } else {
    res.status(404).send('Producto no encontrado');
    }
});
// Eliminar un producto mediante su ID
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
    res.status(404).send(`Product with ID ${productId} does not exist.`);
    return;
    }
    
    products.splice(index, 1);
    
    saveProductsToFile(products);
    
    res.send(`Product with ID ${productId} has been deleted.`);
    });

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
