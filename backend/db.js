require('dotenv').config();
const mongoose = require('mongoose');

const db = process.env.DATABASE_URL 

mongoose.connect(db)
.then(()=> console.log("Working"))
.catch((err)=> console.log('Error', err))

//Add product schema 
const addProductSchema = new mongoose.Schema({
    productname: { type: String, required: true},
    price : {type: Number, required: true},
    category: {type : String, required: true},
    description : {type:String, required: true},
    quantity: {type: Number, required: true},
    status: {type: String, required: true},
    image: {type: String, required:true}
})

const addProduct = mongoose.model('AddProduct', addProductSchema)

module.exports = {
    addProduct
}