import Category from "../models/Category.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getCategories = async (req, res) => {
    try {
        const { isFeatured } = req.query;
        let query = {};
        if (isFeatured) query.isFeatured = isFeatured === 'true';

        const categories = await Category.find(query).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createCategory = async (req, res) => {

    const { name, description, isFeatured, parent, section } = req.body;
    let image = '';
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            image = result.secure_url;
        }
        const category = new Category({
            name,
            description,
            image,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            parent: parent || null,
            section: section || 'saree'
        });
        await category.save();
        res.status(201).json({ message: "Category created successfully", category });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isFeatured, parent, section } = req.body;

        let updateData = {
            name,
            description,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            parent: parent || null,
            section: section || 'saree'
        };

        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            updateData.image = result.secure_url;
        }

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has children before deleting
        const children = await Category.find({ parent: id });
        if (children.length > 0) {
            return res.status(400).json({ message: "Cannot delete category with sub-categories. Please move or delete sub-categories first." });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
