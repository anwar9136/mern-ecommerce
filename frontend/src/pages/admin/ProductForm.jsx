import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    X,
    Save,
    AlertCircle,
    Loader2,
    ChevronDown as FiChevronDown
} from 'lucide-react';
import { getCategories, createProduct, updateProduct, getProduct } from '../../services/api';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        stock: '',
        category: '',
        fabric: '',
        color: '',
        occasion: '',
        region: '',
        craftTechnique: '',
        status: 'active',
        blouseIncluded: true,
        featured: false,
        isBestseller: false
    });

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await getCategories();
                setCategories(catRes.data);

                if (isEdit) {
                    const prodRes = await getProduct(id);
                    const product = prodRes.data;
                    setFormData({
                        title: product.title || '',
                        description: product.description || '',
                        price: product.price || '',
                        salePrice: product.salePrice || '',
                        stock: product.stock || '',
                        category: product.category?._id || product.category || '',
                        fabric: product.fabric || '',
                        color: product.color?.join(', ') || '',
                        occasion: product.occasion?.join(', ') || '',
                        region: product.region || '',
                        craftTechnique: product.craftTechnique || '',
                        status: product.status || 'active',
                        blouseIncluded: product.blouseIncluded ?? true,
                        featured: product.featured ?? false,
                        isBestseller: product.isBestseller ?? false
                    });
                    setPreviewImages(product.images || []);
                }
            } catch (error) {
                toast.error("Error loading data");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '' && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        images.forEach(image => data.append('images', image));

        try {
            if (isEdit) {
                await updateProduct(id, data);
                toast.success('Product updated successfully');
            } else {
                await createProduct(data);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Product Title</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Enter product title"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Write product details..."
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                            <input
                                required
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Sale Price (₹)</label>
                            <input
                                name="salePrice"
                                value={formData.salePrice}
                                onChange={handleInputChange}
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Optional"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-widest text-[11px]">Category</label>
                            <div className="relative">
                                <select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none bg-white font-bold text-[13px] text-gray-900"
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(c => !c.parent).map(parent => (
                                        <optgroup key={parent._id} label={parent.name.toUpperCase()} className="font-black text-indigo-600 bg-gray-50">
                                            {categories.filter(c => (c.parent?._id || c.parent) === parent._id).map(child => (
                                                <option key={child._id} value={child._id} className="text-gray-700 font-bold bg-white ml-4">
                                                    {child.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                    {/* Handle categories without parents if any */}
                                    {categories.filter(c => !c.parent && !categories.some(child => (child.parent?._id || child.parent) === c._id)).length > 0 && (
                                        <optgroup label="OTHER" className="font-black text-gray-400">
                                            {categories.filter(c => !c.parent && !categories.some(child => (child.parent?._id || child.parent) === c._id)).map(cat => (
                                                <option key={cat._id} value={cat._id} className="font-bold">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <FiChevronDown />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Fabric</label>
                            <input
                                required
                                name="fabric"
                                value={formData.fabric}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Silk, Cotton"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Color(s)</label>
                            <input
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Comma separated, e.g. Red, Blue"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Default 10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Region</label>
                            <input
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Banaras"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Craft Technique</label>
                            <input
                                name="craftTechnique"
                                value={formData.craftTechnique}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Handloom"
                            />
                        </div>

                        <div className="flex items-center gap-6 md:col-span-2 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="blouseIncluded"
                                    checked={formData.blouseIncluded}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest text-[11px]">Blouse Included</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest text-[11px]">Feature in "Watch & Buy"</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isBestseller"
                                    checked={formData.isBestseller}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest text-[11px]">Mark as Bestseller</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Product Images
                        <span className="text-gray-400 font-normal">(Max 8 images)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {previewImages.map((url, index) => (
                            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {previewImages.length < 8 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 gap-2">
                                <Upload size={24} />
                                <span className="text-xs font-medium">Upload</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle size={14} />
                        Uploading high-quality images improves customer engagement.
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all uppercase tracking-widest text-[12px]"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        type="submit"
                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[12px]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isEdit ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
