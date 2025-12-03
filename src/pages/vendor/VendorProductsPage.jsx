import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiX, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import Badge from "../../ui/badges/Badge";
import Input from "../../ui/inputs/Input";

// Mock products - replace with actual API call
const mockProducts = [
  {
    id: 1,
    name: "Steam Momo (10 pcs)",
    description: "Delicious steamed momos with your choice of filling",
    price: 250,
    category: "Momo",
    stock: 50,
    isAvailable: true,
    image: "🥟",
  },
  {
    id: 2,
    name: "Fried Momo (8 pcs)",
    description: "Crispy fried momos served hot",
    price: 280,
    category: "Momo",
    stock: 30,
    isAvailable: true,
    image: "🥟",
  },
  {
    id: 3,
    name: "Jhol Momo (10 pcs)",
    description: "Momos served in spicy soup",
    price: 300,
    category: "Momo",
    stock: 0,
    isAvailable: false,
    image: "🥟",
  },
  {
    id: 4,
    name: "C-Momo (1 plate)",
    description: "Spicy chili momo with mayonnaise",
    price: 320,
    category: "Momo",
    stock: 25,
    isAvailable: true,
    image: "🥟",
  },
];

const VendorProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Momo",
    stock: "",
    image: "🥟",
  });

  const handleToggleAvailability = (id) => {
    const product = products.find((p) => p.id === id);
    const newStatus = !product.isAvailable;
    
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, isAvailable: newStatus }
          : product
      )
    );
    
    toast.success(newStatus ? "Product enabled" : "Product disabled");
  };

  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id);
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      setProducts(products.filter((product) => product.id !== id));
      toast.success(`"${product.name}" deleted successfully`);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description || "Delicious momos",
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      isAvailable: true,
      image: newProduct.image,
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "Momo",
      stock: "",
      image: "🥟",
    });
    setIsAdding(false);
    toast.success(`"${product.name}" added successfully`);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setEditingId(id);
    setEditingProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
    });
  };

  const handleEditChange = (field, value) => {
    setEditingProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = (id) => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              name: editingProduct.name,
              description: editingProduct.description,
              price: parseFloat(editingProduct.price),
              category: editingProduct.category,
              stock: parseInt(editingProduct.stock),
              image: editingProduct.image,
            }
          : product
      )
    );
    setEditingId(null);
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "Momo",
      stock: "",
      image: "🥟",
    });
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
              Products & Menu
            </h1>
            <p className="text-charcoal-grey/70">
              Manage your menu items and products
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAdding(!isAdding)}
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </Button>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <Card className="p-6 border-2 border-deep-maroon/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-charcoal-grey">Add New Product</h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-charcoal-grey/5 text-charcoal-grey/60"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g., Steam Momo (10 pcs)"
              />
              <Input
                label="Price (Rs.) *"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="250"
              />
              <Input
                label="Description"
                type="text"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product description"
              />
              <Input
                label="Stock Quantity *"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="50"
              />
              <Input
                label="Category"
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Momo"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={handleAddProduct}>
                <FiSave className="w-4 h-4" />
                Save Product
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-deep-maroon" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Total Products</p>
                <p className="text-2xl font-black text-charcoal-grey">
                  {products.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-500/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Available</p>
                <p className="text-2xl font-black text-charcoal-grey">
                  {products.filter((p) => p.isAvailable).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 via-red-400/5 to-red-500/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Out of Stock</p>
                <p className="text-2xl font-black text-charcoal-grey">
                  {products.filter((p) => !p.isAvailable || p.stock === 0).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{product.image}</div>
                  <div>
                    <h3 className="font-bold text-charcoal-grey text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-charcoal-grey/60">{product.category}</p>
                  </div>
                </div>
                <Badge
                  variant={product.isAvailable ? "success" : "error"}
                >
                  {product.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>

              {editingId !== product.id && (
                <p className="text-charcoal-grey/70 text-sm mb-4">
                  {product.description}
                </p>
              )}

              {editingId !== product.id && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-charcoal-grey/10">
                  <div>
                    <p className="text-sm text-charcoal-grey/60">Price</p>
                    <p className="font-bold text-deep-maroon text-lg">
                      Rs. {product.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-grey/60">Stock</p>
                    <p className="font-bold text-charcoal-grey">
                      {product.stock} units
                    </p>
                  </div>
                </div>
              )}

              {editingId === product.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Product Name *"
                      type="text"
                      value={editingProduct?.name || ""}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      placeholder="Product name"
                    />
                    <Input
                      label="Price (Rs.) *"
                      type="number"
                      value={editingProduct?.price || ""}
                      onChange={(e) => handleEditChange("price", e.target.value)}
                      placeholder="250"
                    />
                    <Input
                      label="Description"
                      type="text"
                      value={editingProduct?.description || ""}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      placeholder="Description"
                    />
                    <Input
                      label="Stock *"
                      type="number"
                      value={editingProduct?.stock || ""}
                      onChange={(e) => handleEditChange("stock", e.target.value)}
                      placeholder="50"
                    />
                    <Input
                      label="Category"
                      type="text"
                      value={editingProduct?.category || ""}
                      onChange={(e) => handleEditChange("category", e.target.value)}
                      placeholder="Momo"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSaveEdit(product.id)}
                    >
                      <FiSave className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <FiX className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(product.id)}
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant={product.isAvailable ? "ghost" : "secondary"}
                    size="sm"
                    onClick={() => handleToggleAvailability(product.id)}
                  >
                    {product.isAvailable ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">
                No products yet
              </h3>
              <p className="text-charcoal-grey/60 mb-6">
                Add your first product to start selling
              </p>
              <Button variant="primary" size="md" onClick={() => setIsAdding(true)}>
                <FiPlus className="w-5 h-5" />
                Add Product
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorProductsPage;

