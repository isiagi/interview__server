import Product from "../models/percelModel";

const productController = {
  getAll: async (req, res) => {
    try {
      const all = await Product.find({userId: req.user.id});
      if (all) {
        return res.status(200).json({ data: all });
      }
      return res.status(404).json({ message: "No Percels" });
    } catch (error) {}
  },
  postProduct: async (req, res) => {
    const { name, description, from, to,userId } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      from,
      to,
      userId: req.user.id
    });
    try {
      const product = await newProduct.save();
      return res.status(200).json({ data: product });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
 
    try {
      const deleteProduct = await Product.findByIdAndDelete(id);
      if (!deleteProduct) {
        return res.status(400).json({ message: "No Products Available" });
      }
      return res.status(200).json({ message: 'Percel Successful Removed' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

export default productController;
