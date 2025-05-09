const express = require('express')
const { checkAddProduct } = require('./type')
const { addProduct } = require('./db')
const app = express()
const path = require('path');

//File storing middleware base64
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')));
app.post('/addproduct',upload.single('image'),async (req, res)=>{
    const parsed = checkAddProduct.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({
            msg:"Invalid Inputs!!",
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
            image:{
                data:req.file.buffer.toString('base64'),
                type:req.file.mimetype
            }
        })
        const savedProduct = await newProduct.save()
        
        res.status(201).json({
            msg: "New Product created",
            product: savedProduct
        })
    }catch(err){
        console.log(err)
        res.status(500).json({err :"Internal server error"})
    }
})
app.get('/product',async(req, res)=>{
    const find= await addProduct.find()
    res.json(find)
})
app.get('/addproduct', (req, res)=>{
    res.sendFile(path.join(__dirname,'../frontend','index.html'))
})

app.listen(3000)