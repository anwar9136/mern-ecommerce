import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Upload,
    Loader2,
    X,
    Image as ImageIcon
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import toast from 'react-hot-toast';

const CategoryList = () => {
    const [searchParams] = useSearchParams();
    const currentSection = searchParams.get('section') || 'saree';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', parent: '', isFeatured: false, section: 'saree' });
    const [editingId, setEditingId] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(c => (c.section || 'saree') === currentSection);

    useEffect(() => {
        setNewCategory(prev => ({
            ...prev,
            section: currentSection
        }));
    }, [currentSection, showModal]);



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This will also remove its associated sub-categories if any (backend check applied).")) {
            try {
                await deleteCategory(id);
                toast.success("Category deleted");
                fetchCategories();
            } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
            }
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setNewCategory({
            name: category.name,
            description: category.description || '',
            parent: category.parent?._id || category.parent || '',
            isFeatured: category.isFeatured || false,
            section: category.section || 'saree'
        });
        setPreview(category.image);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setNewCategory({ name: '', description: '', parent: '', isFeatured: false, section: 'saree' });
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', newCategory.name);
        formData.append('description', newCategory.description);
        formData.append('isFeatured', newCategory.isFeatured);
        formData.append('section', newCategory.section);
        if (newCategory.parent) formData.append('parent', newCategory.parent);
        if (image) formData.append('image', image);

        try {
            if (editingId) {
                await updateCategory(editingId, formData);
                toast.success('Category updated successfully');
            } else {
                await createCategory(formData);
                toast.success('Category created successfully');
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || (editingId ? 'Failed to update' : 'Failed to create'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {currentSection === 'artisanal' ? 'Artisanal Categories' : 'Saree Categories'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your {currentSection} collection categories</p>
                </div>
                <button
                    onClick={() => {
                        setNewCategory(prev => ({ ...prev, section: currentSection }));
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} />
                    New {currentSection === 'artisanal' ? 'Artisanal' : 'Saree'} Category
                </button>
            </div>

            <div className="space-y-8">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-50 rounded-xl animate-pulse"></div>
                    ))
                ) : filteredCategories.length === 0 ? (
                    <div className="py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-400 font-medium text-sm">No {currentSection} categories found. Create your first one.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {filteredCategories.filter(c => !c.parent).map((parent) => (
                            <div key={parent._id} className="space-y-4">
                                {/* Parent Row: Section Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 p-4 rounded-xl border border-gray-200 flex items-center justify-between group hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
                                            <ImageIcon size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-gray-900 text-base">{parent.name}</h3>
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${(parent.section || 'saree') === 'artisanal' ? 'bg-amber-100 text-amber-800' : 'bg-gray-900 text-white'
                                                    }`}>
                                                    {parent.section || 'Saree'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {filteredCategories.filter(c => (c.parent?._id || c.parent) === parent._id).length} subcategories
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleEdit(parent)}
                                            className="p-2 bg-white text-gray-400 hover:text-gray-900 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(parent._id)}
                                            className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Children Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-8 border-l-2 border-gray-100 ml-6">
                                    {filteredCategories.filter(c => (c.parent?._id || c.parent) === parent._id).map(child => (
                                        <div key={child._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    {child.image ? (
                                                        <img src={child.image} alt={child.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon size={28} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{child.name}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{child.description || 'No description'}</p>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">/{child.slug}</span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(child)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors rounded"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(child._id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Child Button */}
                                    <button
                                        onClick={() => {
                                            setNewCategory(prev => ({ ...prev, parent: parent._id }));
                                            setShowModal(true);
                                        }}
                                        className="h-full min-h-[120px] rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                                    >
                                        <Plus size={20} />
                                        <span className="text-xs font-medium">Add to {parent.name}</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Orphans: No Parent */}
                        {filteredCategories.filter(c => !c.parent && !filteredCategories.some(child => (child.parent?._id || child.parent) === c._id)).length > 0 && (
                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Standalone Categories</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredCategories.filter(c => !c.parent && !filteredCategories.some(child => (child.parent?._id || child.parent) === c._id)).map(cat => (
                                        <div key={cat._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 group flex items-center justify-between hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <h4 className="font-bold text-gray-600 text-sm">{cat.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={closeModal} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Category Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
                                    placeholder="e.g. Silk Sarees"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all resize-none"
                                    placeholder="Write a short description..."
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Parent Category</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all bg-white font-medium"
                                    value={newCategory.parent}
                                    onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.filter(c => !c.parent).map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Hidden Section Input */}
                            <input type="hidden" value={newCategory.section} />
                            <div className="flex items-center gap-3 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                    checked={newCategory.isFeatured}
                                    onChange={(e) => setNewCategory({ ...newCategory, isFeatured: e.target.checked })}
                                />
                                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Featured (Show in Our Collection on Home)
                                </label>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Category Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-grow flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer text-gray-400 hover:text-gray-600">
                                        <Upload size={20} />
                                        <span className="font-medium text-sm">Choose Image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    {preview && (
                                        <div className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold transition-all shadow-sm disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
