    const z = require('zod')

    const checkAddProduct = z.object({
        productname: z.string(),
        price: z.coerce.number(),
        category: z.string(),
        description: z.string(),
        quantity: z.coerce.number(),
        status : z.string()
    })

    module.exports = {
        checkAddProduct
    }