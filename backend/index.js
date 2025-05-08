const express = require('express')
const { checkAddProduct } = require('./type')
const { addProduct } = require('./db')
const app = express()

//File storing middleware base64
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

app.use(express.json())

app.post('/addproduct',upload.single('image'),async (req, res)=>{
    const parsed = checkAddProduct.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({
            msg:"Invalid Inputs!!",
            errors: parsed.error.erros
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
                data:req.file.buffer,
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
app.listen(3000)