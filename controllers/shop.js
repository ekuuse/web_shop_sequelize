const Product = require("../models/product")
const Cart = require("../models/cart")
const CartItem = require("../models/cart-item")

class shopController {
    async getAllProducts(req,res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }

    async getCart(req,res) {
        const userCart = await req.user.getCart()
        console.log(userCart)
        const cartProducts = await userCart.getProducts()
        res.status(201).json({
            products: cartProducts
        })
    }

    async addItemToCart(req,res) {
        const { productId, quantity }= req.body

        if (!productId || !quantity ) {
            return res.status(400).json({ error: "Product ID or quantity missing"})
        }
        const userCart = await req.user.getCart()
        const cartProducts = await userCart.getProducts({where: {id: productId}})
        
        if (cartProducts.length > 0) {
            const existingProduct = cartProducts[0]
            existingProduct.quantity += quantity
            await existingProduct.save()
            return res.status(200).json({ message: "updated quantity", cartItem: existingProduct})
        } else {
            const newProduct = await Product.findByPk(productId)
            const newCartItem = await userCart.addProduct(newProduct, {through: {quantity: quantity}})
            return res.status(201).json({message: "item added to cart", cartItem: newCartItem})
        }
    }
    async removeItemFromCart(req,res) {
        const { productId }= req.body

        if (!productId) {
            return res.status(400).json({ error: "Product ID missing"})
        }
        const userCart = await req.user.getCart()
        const cartProducts = await userCart.getProducts({where: {id: productId}})
        
        if (cartProducts.length > 0) {
            const existingProduct = cartProducts[0]
            await userCart.removeProduct(existingProduct)

            return res.status(200).json({ message: "removed from cart"})
        } else {
            return res.status(400).json({message: "product not in cart"})
        }
    }
}

module.exports = new shopController()