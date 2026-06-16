import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number
    },
    images: [{
        type: String // Array of Cloudinary URLs
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    fabric: {
        type: String,
        required: true
    },
    color: [{
        type: String
    }],
    occasion: [{
        type: String
    }],
    region: {
        type: String
    },
    craftTechnique: {
        type: String
    },
    stock: {
        type: Number,
        default: 10
    },
    blouseIncluded: {
        type: Boolean,
        default: true
    },
    sareeLength: {
        type: Number, // in meters, e.g., 5.5
        default: 5.5
    },
    blouseLength: {
        type: Number, // in meters
        default: 0.8
    },
    featured: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create slug from title
productSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

// Index for fast filtering
productSchema.index({ category: 1 });
productSchema.index({ fabric: 1 });
productSchema.index({ color: 1 });
productSchema.index({ price: 1 });
productSchema.index({ region: 1 });
productSchema.index({ craftTechnique: 1 });

export default mongoose.model('Product', productSchema);