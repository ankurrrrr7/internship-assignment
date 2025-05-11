const express = require('express')
const { checkAddProduct } = require('./type')
const { addProduct } = require('./db')
const app = express()
const path = require('path');

app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/addproduct', async (req, res) => {
    const parsed = checkAddProduct.safeParse(req.body);
    
    if(!parsed.success){
        return res.status(400).json({
            msg: "Invalid Inputs!!",
            errors: parsed.error.errors
        })
    }
    
    try{
        const newProduct = new addProduct({
            productname: req.body.productname,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            quantity: req.body.quantity,
            status: req.body.status,
            image: req.body.image
        })
        
        const savedProduct = await newProduct.save()
        
        res.status(201).json({
            msg: "New Product created",
            product: savedProduct
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({err: "Internal server error"})
    }
})




app.get('/search', async (req, res) => {
    const searched = req.query.q;
    
    try {
        const output = await addProduct.findOne({productname: searched})
        
        if(!output) {
            return res.json({ found: false, msg: "No product found" });
        }
        
        res.json({ found: true, product: output });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.get('/product', async(req, res) => {
    const find = await addProduct.find()
    res.json(find)
})
app.get('/product/:id', async(req, res)=>{
    const product = await addProduct.findById(req.params.id);
    res.json(product)
})
app.get('/addproduct', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'))
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})