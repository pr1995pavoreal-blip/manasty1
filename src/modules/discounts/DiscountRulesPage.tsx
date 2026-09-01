import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { DiscountRule, Product, Category } from '../../types';
import { Percent, Plus, Package, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DiscountRulesPage: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [merchantId, setMerchantId] = useState<string | undefined>(user?.merchantId);

  // Search & Filter state for Smart Product Picker
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minPurchaseAmount: 50,
    maxDiscountAmount: 100,
    usageLimit: 1000,
    categoryId: '',
    productId: '',
  });

  useEffect(() => {
    initMerchantAndFetch();
  }, [user]);

  const initMerchantAndFetch = async () => {
    try {
      setLoading(true);
      let targetMerchantId = user?.merchantId;

      if (!targetMerchantId) {
        const res = await api.get('/merchants');
        const merchants = res.data.data.merchants;
        if (merchants && merchants.length > 0) {
          targetMerchantId = merchants[0].id;
        }
      }

      if (targetMerchantId) {
        setMerchantId(targetMerchantId);
        const [rulesRes, merchDetails] = await Promise.all([
          api.get(`/discounts/merchant/${targetMerchantId}`),
          api.get(`/merchants/${targetMerchantId}`),
        ]);
        setRules(rulesRes.data.data);
        if (merchDetails.data.data.products) {
          setProducts(merchDetails.data.data.products);
        }
        if (merchDetails.data.data.categories) {
          setCategories(merchDetails.data.data.categories);
        }
      }
    } catch (error) {
      console.error('Failed to load rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(productSearch));
      const matchCat = !selectedCategoryFilter || p.categoryId === selectedCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, selectedCategoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) {
      alert('Merchant ID is missing. Please check store setup.');
      return;
    }

    try {
      const payload = {
        ...formData,
        merchantId,
        categoryId: formData.categoryId ? formData.categoryId : undefined,
        productId: formData.productId ? formData.productId : undefined,
      };

      await api.post('/discounts', payload);
      setShowModal(false);
      initMerchantAndFetch();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create discount rule');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold d-flex align-items-center gap-2 mb-0">
            <Percent className="text-warning" size={28} />
            <span>Dynamic Discount Engine Rules</span>
          </h3>
          <p className="text-muted small mb-0">Create flexible business rules (Percentage, Fixed Amount, Product Target, Usage Caps)</p>
        </div>
        <button className="btn btn-warning d-flex align-items-center gap-2 fw-bold text-dark" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Create Business Rule</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {rules.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              No custom discount rules defined for this merchant yet.
            </div>
          ) : (
            rules.map((rule: any) => (
              <div key={rule.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark mb-0">{rule.titleAr || rule.title}</h5>
                    <span className="badge bg-warning text-dark">
                      {rule.discountType === 'PERCENTAGE' ? `${rule.discountValue}% OFF` : `${rule.discountValue} SAR OFF`}
                    </span>
                  </div>

                  {rule.category && (
                    <div className="bg-info bg-opacity-10 p-2 rounded-3 small text-info fw-bold mb-2">
                      📁 Target Category: {rule.category.nameAr || rule.category.name}
                    </div>
                  )}

                  {rule.product && (
                    <div className="bg-light p-2 rounded-3 small text-primary fw-bold mb-2 d-flex align-items-center gap-1">
                      <Package size={14} />
                      <span>Target Product: {rule.product.nameAr || rule.product.name}</span>
                    </div>
                  )}

                  <div className="bg-light p-3 rounded-3 small mb-3">
                    <div><strong>Min Spend:</strong> {rule.minPurchaseAmount} SAR</div>
                    <div><strong>Max Discount Cap:</strong> {rule.maxDiscountAmount || 'Unlimited'} SAR</div>
                    <div><strong>Usage Count:</strong> {rule.usageCount} / {rule.usageLimit || '∞'}</div>
                  </div>
                  <span className="badge bg-success w-100 py-2">ACTIVE RULE</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Define Dynamic Business Discount Rule</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Rule Title (English)</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Gold Member 20% Discount"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Rule Title (Arabic)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="خصم 20% لحاملي الفئة الذهبية"
                        value={formData.titleAr}
                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Target Category Dropdown */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Target Entire Category (Optional)</label>
                    <select
                      className="form-select"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="">-- Apply to All Categories (or Select Specific Product Below) --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          📁 {c.nameAr || c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Smart Product Picker Box */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Target Specific Product (Optional)</label>
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="row g-2 mb-2">
                        <div className="col-md-7">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white">
                              <Search size={14} className="text-muted" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search products by name..."
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-5">
                          <select
                            className="form-select form-select-sm"
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          >
                            <option value="">Filter by Category (All)</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nameAr || c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <select
                        className="form-select"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      >
                        <option value="">-- Apply to Entire Cart / Purchase --</option>
                        {filteredProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameAr || p.name} ({p.price} SAR)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Discount Type</label>
                      <select
                        className="form-select"
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (SAR)</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Discount Value</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Min Purchase Amount (SAR)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.minPurchaseAmount}
                        onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Max Discount Cap (SAR)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning btn-sm fw-bold">
                    Save Discount Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
