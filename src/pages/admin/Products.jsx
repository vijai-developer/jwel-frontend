import React, { useState } from 'react';
import { useShop, useCart } from '../../context/CartContext';
import { CATEGORIES } from '../../data/initialProducts';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ShieldCheck,
  X,
  Crown,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Temple Haram Necklace', value: '/images/temple_haram.png' },
  { label: 'Kundan CZ Choker', value: '/images/kundan_cz.png' },
  { label: 'Gold Jhumka Earrings', value: '/images/gold_jhumka.png' },
  { label: 'Temple Gold Bangles', value: '/images/temple_bangles.png' },
  { label: 'CZ Diamond Choker', value: '/images/cz_choker.png' },
  { label: 'Gold Mangalsutra', value: '/images/gold_mangalsutra.png' },
  { label: 'Solitaire Ring Preset', value: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Royal Heritage Set', value: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' }
];

export const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, showToast, formatPrice } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Items');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pendingStock, setPendingStock] = useState({});

  const initialFormState = {
    name: '',
    category: 'Necklaces & Harams',
    price: '',
    originalPrice: '',
    platingGuarantee: '1-Year 24K Micro Gold Guarantee',
    metalFinish: '24K Micro Gold Plated',
    baseMetal: 'High-grade Copper & Brass Alloy',
    stones: 'Synthetic Rubies & South Sea Pearls',
    stockQty: 15,
    image: '/images/temple_haram.png',
    description: 'Authentic 24K micro gold plated covering jewellery with anti-tarnish protective lacquer coat.'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);

  const filteredProducts = products.filter(p => {
    const matchCat = filterCategory === 'All Items' || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handle local file upload with FileReader
  const handleFileUpload = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, image: base64Url }));
        } else {
          setFormData(prev => ({ ...prev, image: base64Url }));
        }
        showToast('Image uploaded successfully.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please enter Product Name and Price.');
      return;
    }
    addProduct({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.4,
      stockQty: Number(formData.stockQty || 10)
    });
    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      category: product.category || 'Necklaces & Harams',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      platingGuarantee: product.platingGuarantee || '1-Year 24K Micro Gold Guarantee',
      metalFinish: product.metalFinish || '24K Micro Gold Plated',
      baseMetal: product.baseMetal || 'High-grade Copper & Brass Alloy',
      stones: product.stones || 'Synthetic Rubies & South Sea Pearls',
      stockQty: product.stockQty ?? 10,
      image: product.image || '/images/temple_haram.png',
      description: product.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editFormData.name || !editFormData.price) {
      showToast('Please enter Product Name and Price.');
      return;
    }
    updateProduct(editingProduct.id, {
      ...editFormData,
      price: Number(editFormData.price),
      originalPrice: editFormData.originalPrice ? Number(editFormData.originalPrice) : undefined,
      stockQty: Number(editFormData.stockQty)
    });
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 text-[#2C2E2B]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#E8DFD1]">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#C5A059]" />
            <h1 className="text-2xl font-bold font-royal gold-text-gradient">
              Jewellery Inventory & Product Manager
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage catalog items, micro-plating guarantee specs, prices, stock levels, and custom imagery.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW JEWELLERY ITEM</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFD1] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search SKU or Jewellery Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
          />
          <Search className="w-3.5 h-3.5 text-[#C5A059] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-xs text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <span className="text-xs text-[#8C6D31] font-bold whitespace-nowrap">
            Total: {filteredProducts.length} Items
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF6F0] text-[#8C6D31] border-b border-[#E8DFD1]">
                <th className="py-3 px-4 font-bold">Item Details</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Plating Guarantee</th>
                <th className="py-3 px-4 font-bold">Selling Price</th>
                <th className="py-3 px-4 font-bold">Stock Qty</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD1]/60">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={product.image} alt="" className="w-12 h-12 object-cover rounded-xl border border-[#E8DFD1] flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#2C2E2B] line-clamp-1">{product.name}</h4>
                      <span className="text-[10px] text-[#8C6D31] font-mono font-semibold">SKU: {product.sku || `SJ-${product.id}`}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold">{product.category}</td>

                  <td className="py-3 px-4">
                    <span className="text-[11px] text-[#8C6D31] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      {product.platingGuarantee || '1-Year 24K Micro Gold Guarantee'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-extrabold text-sm text-[#2C2E2B]">
                      {formatPrice ? formatPrice(product.price) : `₹${product.price.toLocaleString('en-IN')}`}
                    </div>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPrice ? formatPrice(product.originalPrice) : `₹${product.originalPrice.toLocaleString('en-IN')}`}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={pendingStock[product.id] ?? product.stockQty}
                        onChange={(e) =>
                          setPendingStock(prev => ({
                            ...prev,
                            [product.id]: e.target.value
                          }))
                        }
                        className="w-16 bg-[#FAF6F0] border border-[#E8DFD1] rounded px-2 py-1 text-xs text-center font-bold text-[#8C6D31]"
                      />

                      {pendingStock[product.id] !== undefined &&
                        Number(pendingStock[product.id]) !== Number(product.stockQty) && (
                          <button
                            onClick={() => {
                              updateProduct(product.id, {
                                stockQty: Number(pendingStock[product.id])
                              });

                              setPendingStock(prev => {
                                const updated = { ...prev };
                                delete updated[product.id];
                                return updated;
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-[#C5A059] text-white text-[10px] font-bold hover:bg-[#8C6D31] transition-colors"
                          >
                            Save
                          </button>
                        )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${product.inStock && product.stockQty > 0
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-rose-50 border-rose-300 text-rose-800'
                        }`}
                    >
                      {product.inStock && product.stockQty > 0 ? '● In Stock' : '✕ Out of Stock'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-[#C5A059] hover:bg-[#FAF6F0] rounded-lg transition-colors"
                      title="Edit Item Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8DFD1] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 text-[#2C2E2B] shadow-2xl relative my-4 sm:my-8 max-h-[88vh] overflow-y-auto">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-royal text-[#8C6D31] mb-4">Add New Jewellery Item to Catalog</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Jewellery Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 24K Micro Gold Kundan Choker Set"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  >
                    {CATEGORIES.filter(c => c !== 'All Items').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional original price"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Initial Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Plating Guarantee Term</label>
                  <input
                    type="text"
                    value={formData.platingGuarantee}
                    onChange={(e) => setFormData({ ...formData, platingGuarantee: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Metal Finish</label>
                  <input
                    type="text"
                    value={formData.metalFinish}
                    onChange={(e) => setFormData({ ...formData, metalFinish: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Enhanced Image Section: Preset, Custom URL, and File Upload */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DFD1] space-y-3">
                <label className="block text-gray-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                  <span>Product Imagery & Atelier Photo</span>
                </label>

                <div className="flex gap-4 items-start">
                  {/* Preview Box */}
                  <div className="w-24 h-24 bg-white rounded-xl border border-[#E8DFD1] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Choose from Atelier Presets</span>
                      <select
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-white border border-[#E8DFD1] rounded-lg px-2.5 py-1.5 text-xs text-[#2C2E2B]"
                      >
                        {PRESET_IMAGES.map((p, idx) => (
                          <option key={idx} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Or Upload Custom Image</span>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#C5A059] rounded-lg text-xs font-semibold text-[#8C6D31] cursor-pointer hover:bg-[#FAF6F0] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E8DFD1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button px-6 py-2 rounded-xl text-xs font-bold"
                >
                  Save & Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8DFD1] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 text-[#2C2E2B] shadow-2xl relative my-4 sm:my-8 max-h-[88vh] overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-royal text-[#8C6D31] mb-4">Edit Jewellery Item</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Jewellery Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  >
                    {CATEGORIES.filter(c => c !== 'All Items').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={editFormData.originalPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Stock Quantity</label>
                  <input
                    type="number"
                    value={editFormData.stockQty}
                    onChange={(e) => setEditFormData({ ...editFormData, stockQty: Number(e.target.value) })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Plating Guarantee Term</label>
                  <input
                    type="text"
                    value={editFormData.platingGuarantee}
                    onChange={(e) => setEditFormData({ ...editFormData, platingGuarantee: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Metal Finish</label>
                  <input
                    type="text"
                    value={editFormData.metalFinish}
                    onChange={(e) => setEditFormData({ ...editFormData, metalFinish: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Edit Image Section */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DFD1] space-y-3">
                <label className="block text-gray-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                  <span>Product Imagery</span>
                </label>

                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 bg-white rounded-xl border border-[#E8DFD1] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                    {editFormData.image ? (
                      <img src={editFormData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Preset Options</span>
                      <select
                        value={editFormData.image}
                        onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                        className="w-full bg-white border border-[#E8DFD1] rounded-lg px-2.5 py-1.5 text-xs text-[#2C2E2B]"
                      >
                        {PRESET_IMAGES.map((p, idx) => (
                          <option key={idx} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Upload New Picture</span>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#C5A059] rounded-lg text-xs font-semibold text-[#8C6D31] cursor-pointer hover:bg-[#FAF6F0] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select New File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#E8DFD1] rounded-xl px-3 py-2 text-[#2C2E2B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E8DFD1]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button px-6 py-2 rounded-xl text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
