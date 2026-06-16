import Product from "../models/Product.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs"; //to delete temp files

export const getProducts = async (req, res) => {
  try {
    let query = {};
    let sort = { createdAt: -1 }; // Newest first

    // Filtering
    if (req.query.category) {
      const categories = req.query.category.split(',');
      query.category = { $in: categories };
    }
    if (req.query.region) query.region = req.query.region;
    if (req.query.featured) query.featured = req.query.featured === 'true';
    if (req.query.isBestseller) query.isBestseller = req.query.isBestseller === 'true';

    // Sorting
    if (req.query.sort === 'price-low') sort = { price: 1 };
    if (req.query.sort === 'price-high') sort = { price: -1 };
    if (req.query.sort === 'newest') sort = { createdAt: -1 };

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate({
        path: 'category',
        select: 'name slug parent section',
        populate: {
          path: 'parent',
          select: 'name'
        }
      })
      .sort(sort);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get single product by slug or ID
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let query = { slug };

    // If it looks like an ObjectId, try finding by ID first
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: slug }, { slug }] };
    }

    const product = await Product.findOne(query)
      .populate({
        path: 'category',
        select: 'name slug parent section',
        populate: {
          path: 'parent',
          select: 'name'
        }
      });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create product (admin only)
export const createProduct = async (req, res) => {
  const { title, description, price, salePrice, category, fabric, color, occasion, region, craftTechnique, stock, blouseIncluded, featured, isBestseller } = req.body;

  let images = [];

  try {
    if (req.files) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path);
        images.push(result.secure_url);
        fs.unlinkSync(file.path); // Delete temp file
      }
    }

    const product = new Product({
      title,
      description,
      price,
      salePrice,
      images,
      category,
      fabric,
      color: color ? color.split(',') : [],
      occasion: occasion ? occasion.split(',') : [],
      region,
      craftTechnique,
      stock,
      blouseIncluded: blouseIncluded === 'true' || blouseIncluded === true,
      featured: featured === 'true' || featured === true,
      isBestseller: isBestseller === 'true' || isBestseller === true
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update product (admin only)
export const updateProduct = async (req, res) => {
  const { title, description, price, salePrice, category, fabric, color, occasion, region, craftTechnique, stock, blouseIncluded, featured, isBestseller } = req.body;
  const { id } = req.params;
  let images = [];
  try {
    if (req.files) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path);
        images.push(result.secure_url);
        fs.unlinkSync(file.path); // Delete temp file
      }
    }

    let updateData = {
      title,
      description,
      price,
      salePrice,
      category,
      fabric,
      color: color ? color.split(',') : [],
      occasion: occasion ? occasion.split(',') : [],
      region,
      craftTechnique,
      stock,
      blouseIncluded: blouseIncluded === 'true' || blouseIncluded === true,
      featured: featured === 'true' || featured === true,
      isBestseller: isBestseller === 'true' || isBestseller === true
    };

    if (images.length > 0) {
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Optional: Delete images from Cloudinary
    // for (let img of product.images) {
    //   const publicId = img.split('/').pop().split('.')[0];
    //   await deleteFromCloudinary(`sarees/${publicId}`);
    // }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}