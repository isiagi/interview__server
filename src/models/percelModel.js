import mongoose, {Schema} from "mongoose";


const productSchema = new Schema({
    name: String,
    description: String,
    from: String,
    to: String,
    userId: String,
}, {timestamps: {createdAt: 'created_at'}})

const Product = mongoose.model('Product', productSchema)

export default Product;