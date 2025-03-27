// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });
    const [editProduct, setEditProduct] = useState(null);

    const location = useLocation();
    const { username, password } = location.state || {}; // Default to an empty object if no state is passed

    // Create the basic auth header
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products', {
                headers: {
                    Authorization: authHeader
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`, {
                headers: {
                    Authorization: authHeader
                }
            });
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();



        try {
            // Include the authentication header in the request
            await axios.post('http://localhost:8080/api/products', newProduct, {
                headers: {
                    Authorization: authHeader,
                },
            });

            setNewProduct({ name: '', price: '' }); // Clear form
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/products/${editProduct.id}`, editProduct, {
                headers: {
                    Authorization: authHeader
                }
            });
            setEditProduct(null); // Close the edit form
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h2>Product Dashboard</h2>

            {/* Create Product Form */}
            <form onSubmit={handleCreate}>
                <h3>Create Product</h3>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Create Product</button>
            </form>

            {/* Edit Product Form */}
            {editProduct && (
                <form onSubmit={handleUpdate}>
                    <h3>Edit Product</h3>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
                </form>
            )}

            {/* Product List */}
            <h3>Product List</h3>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
