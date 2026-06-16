import axios from "axios";

// 1. Create an Axios Instance
// This centralizes our configuration (base URL, credentials, etc.)
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // Crucial for sending/receiving JWT cookies
});

/**
 * AUTHENTICATION APIs
 */
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

/**
 * PRODUCT APIs
 */
// Fetch all products (supports query params for filtering/search)
export const getProducts = (params) => api.get("/product", { params });
// Fetch a single product details (used by Admin with ID or Public with Slug)
export const getProduct = (idOrSlug) => api.get(`/product/${idOrSlug}`);
export const getProductBySlug = (slug) => api.get(`/product/${slug}`);
// Admin only: Management routes
export const createProduct = (formData) => api.post("/product", formData);
export const updateProduct = (id, formData) => api.put(`/product/${id}`, formData);
export const deleteProduct = (id) => api.delete(`/product/${id}`);

/**
 * CATEGORY APIs
 */
export const getCategories = (params) => api.get("/category", { params });
export const createCategory = (formData) => api.post("/category", formData);
export const updateCategory = (id, formData) => api.put(`/category/${id}`, formData);
export const deleteCategory = (id) => api.delete(`/category/${id}`);

/**
 * CART APIs (Requires Authentication)
 */
export const getCart = () => api.get("/cart");
export const addToCart = (productId, quantity = 1) => api.post("/cart/add", { productId, quantity });
export const updateCartItem = (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);

/**
 * ORDER & PAYMENT APIs (Requires Authentication)
 */
// Initiates a Razorpay order
export const createOrder = (shippingAddress) => api.post("/order/create", { shippingAddress });
// Verifies payment signature and triggers stock update
export const verifyPayment = (paymentData) => api.post("/order/verify", paymentData);
// Fetches user's purchase history
export const getOrders = () => api.get("/order");
// Admin: Fetches ALL orders
export const getAllOrders = () => api.get("/order/all");

export default api;
