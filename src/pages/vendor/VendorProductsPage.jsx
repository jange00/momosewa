import { useState, useMemo } from "react";
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiX, FiSave, FiGrid, FiList, FiEye, FiEyeOff, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
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
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "menu"
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Momo",
    stock: "",
    image: "🥟",
  });

  // Group products by category for menu view
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

  // Calculate menu visibility stats
  const menuStats = useMemo(() => {
    const visibleInMenu = products.filter(
      (p) => p.isAvailable && p.stock > 0
    ).length;
    const hiddenFromMenu = products.filter(
      (p) => !p.isAvailable || p.stock === 0
    ).length;
    return { visibleInMenu, hiddenFromMenu, total: products.length };
  }, [products]);

  // Check if product is visible in menu
  const isVisibleInMenu = (product) => {
    return product.isAvailable && product.stock > 0;
  };

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
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-charcoal-grey/5 border border-charcoal-grey/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-deep-maroon text-white shadow-md"
                    : "text-charcoal-grey/60 hover:text-charcoal-grey hover:bg-charcoal-grey/5"
                }`}
                title="Grid View"
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("menu")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "menu"
                    ? "bg-deep-maroon text-white shadow-md"
                    : "text-charcoal-grey/60 hover:text-charcoal-grey hover:bg-charcoal-grey/5"
                }`}
                title="Menu View"
              >
                <FiList className="w-5 h-5" />
              </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-deep-maroon" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Total Products</p>
                <p className="text-2xl font-black text-charcoal-grey">
                  {menuStats.total}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-2 border-green-200/50 bg-green-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-500/10 flex items-center justify-center">
                <FiEye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Visible in Menu</p>
                <p className="text-2xl font-black text-green-600">
                  {menuStats.visibleInMenu}
                </p>
                <p className="text-xs text-charcoal-grey/60 mt-1">
                  Customers can see these
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-500/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-blue-600" />
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
                <FiEyeOff className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-charcoal-grey/60 text-sm">Hidden from Menu</p>
                <p className="text-2xl font-black text-charcoal-grey">
                  {menuStats.hiddenFromMenu}
                </p>
                <p className="text-xs text-charcoal-grey/60 mt-1">
                  Not visible to customers
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Menu Preview Link */}
        <Card className="p-4 bg-gradient-to-r from-deep-maroon/5 via-golden-amber/5 to-deep-maroon/5 border-2 border-deep-maroon/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiExternalLink className="w-5 h-5 text-deep-maroon" />
              </div>
              <div>
                <p className="font-bold text-charcoal-grey">Preview Your Menu</p>
                <p className="text-sm text-charcoal-grey/60">
                  See how your products appear to customers ({menuStats.visibleInMenu} products visible)
                </p>
              </div>
            </div>
            <Link to="/menu">
              <Button variant="secondary" size="md">
                <FiExternalLink className="w-4 h-4" />
                View Menu
              </Button>
            </Link>
          </div>
        </Card>

        {/* Menu Visibility Info */}
        <Card className="p-6 bg-blue-50/50 border border-blue-200/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FiEye className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-charcoal-grey mb-2">Menu Visibility Rules</h3>
              <p className="text-sm text-charcoal-grey/70 mb-3">
                Products are visible to customers in the menu when:
              </p>
              <ul className="space-y-1.5 text-sm text-charcoal-grey/70">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Product is <strong>Available</strong> (enabled)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Product has <strong>Stock &gt; 0</strong>
                </li>
              </ul>
              <p className="text-xs text-charcoal-grey/60 mt-3 pt-3 border-t border-blue-200/50">
                💡 Tip: Disable a product or set stock to 0 to hide it from customers without deleting it.
              </p>
            </div>
          </div>
        </Card>

        {/* Products Grid View */}
        {viewMode === "grid" && (
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
                <div className="flex items-center gap-2">
                  {isVisibleInMenu(product) ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <FiEye className="w-3 h-3" />
                      In Menu
                    </Badge>
                  ) : (
                    <Badge variant="error" className="flex items-center gap-1">
                      <FiEyeOff className="w-3 h-3" />
                      Hidden
                    </Badge>
                  )}
                  {!product.isAvailable && (
                    <Badge variant="error">Unavailable</Badge>
                  )}
                </div>
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
                  <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-charcoal-grey'}`}>
                    {product.stock} units
                  </p>
                  {product.stock === 0 && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Hidden from menu</p>
                  )}
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
        )}

        {/* Menu View */}
        {viewMode === "menu" && (
          <div className="space-y-8">
            {Object.keys(productsByCategory).map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-black text-charcoal-grey mb-6 pb-2 border-b-2 border-deep-maroon/20">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsByCategory[category].map((product) => (
                    <Card key={product.id} className="p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-5xl flex-shrink-0">{product.image}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-charcoal-grey text-lg leading-tight">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isVisibleInMenu(product) ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <FiEye className="w-3 h-3" />
                                  In Menu
                                </Badge>
                              ) : (
                                <Badge variant="error" className="flex items-center gap-1">
                                  <FiEyeOff className="w-3 h-3" />
                                  Hidden
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-charcoal-grey/70 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-black text-deep-maroon">
                                Rs. {product.price}
                              </p>
                              <p className="text-xs text-charcoal-grey/60">
                                Stock: {product.stock} units
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-charcoal-grey/10">
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
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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

