import mongoose from "mongoose";
import slugify from "slugify";
const categorySchema = new mongoose.Schema({
    name: {
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
    },
    image: {
        type: String,
        default: ''
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    section: {
        type: String,
        enum: ['saree', 'artisanal'],
        default: 'saree'
    }
}, {
    timestamps: true,

});

categorySchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
});

export default mongoose.model('Category', categorySchema);
