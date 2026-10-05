import React, { useState } from 'react';
import type { ManagerInventoryItem } from '../../data/mockRestaurantData';
import { SearchIcon, PlusIcon, RotateCcwIcon, CheckIcon, XIcon, AlertTriangleIcon } from '../Icons';

interface InventoryManagementViewProps {
  inventory: ManagerInventoryItem[];
  onUpdateInventory: (updated: ManagerInventoryItem[]) => void;
  onLogAudit: (action: string, module: 'Inventory', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const InventoryManagementView: React.FC<InventoryManagementViewProps> = ({
  inventory,
  onUpdateInventory,
  onLogAudit,
}) => {
  const [items, setItems] = useState<ManagerInventoryItem[]>(inventory);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [restockModalItem, setRestockModalItem] = useState<ManagerInventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [poNotes, setPoNotes] = useState<string>('');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<ManagerInventoryItem>>({
    name: '',
    category: 'Produce',
    currentStock: 10,
    unit: 'kg',
    minThreshold: 5,
    optimalLevel: 25,
    unitCost: 200,
    supplier: 'Metro Fresh Wholesalers',
  });

  const categories = [
    'All',
    'Meat & Poultry',
    'Seafood',
    'Dairy & Cheese',
    'Produce',
    'Pantry & Spices',
    'Beverages',
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenRestock = (item: ManagerInventoryItem) => {
    setRestockModalItem(item);
    const deficit = Math.max(0, item.optimalLevel - item.currentStock);
    setRestockQty(deficit > 0 ? deficit : 10);
    setPoNotes(`Emergency purchase order for ${item.name} to maintain dinner service levels.`);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem) return;

    const newStock = restockModalItem.currentStock + Number(restockQty);
    let nextStatus: 'healthy' | 'low' | 'critical' = 'healthy';
    if (newStock < restockModalItem.minThreshold) {
      nextStatus = 'critical';
    } else if (newStock <= restockModalItem.minThreshold * 1.5) {
      nextStatus = 'low';
    }

    const updated = items.map((i) =>
      i.id === restockModalItem.id
        ? {
            ...i,
            currentStock: newStock,
            status: nextStatus,
            lastRestocked: 'Just now',
          }
        : i
    );

    setItems(updated);
    onUpdateInventory(updated);

    const cost = Number(restockQty) * restockModalItem.unitCost;
    onLogAudit(
      'Purchase Order Created',
      'Inventory',
      `Restocked ${restockQty} ${restockModalItem.unit} of "${restockModalItem.name}" via ${restockModalItem.supplier} (Est: ₹${cost.toLocaleString('en-IN')}).`,
      'info'
    );

    setRestockModalItem(null);
  };

  const handleCreateInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.currentStock) return;

    const stock = Number(newItem.currentStock);
    const min = Number(newItem.minThreshold || 5);
    const status: 'healthy' | 'low' | 'critical' =
      stock < min ? 'critical' : stock <= min * 1.5 ? 'low' : 'healthy';

    const created: ManagerInventoryItem = {
      id: `inv-${items.length + 1}`,
      name: newItem.name,
      category: newItem.category as any,
      currentStock: stock,
      unit: newItem.unit || 'kg',
      minThreshold: min,
      optimalLevel: Number(newItem.optimalLevel || 20),
      unitCost: Number(newItem.unitCost || 200),
      supplier: newItem.supplier || 'Standard Vendor',
      lastRestocked: 'Today',
      status,
      linkedDishIds: [],
    };

    const updated = [created, ...items];
    setItems(updated);
    onUpdateInventory(updated);

    onLogAudit(
      'New Inventory Item Created',
      'Inventory',
      `Created stock ledger entry for "${created.name}" (${created.category}).`,
      'info'
    );

    setIsAddingItem(false);
    setNewItem({
      name: '',
      category: 'Produce',
      currentStock: 10,
      unit: 'kg',
      minThreshold: 5,
      optimalLevel: 25,
      unitCost: 200,
      supplier: 'Metro Fresh Wholesalers',
    });
  };

  const totalValue = items.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
  const criticalCount = items.filter((i) => i.status === 'critical').length;
  const lowCount = items.filter((i) => i.status === 'low').length;

  return (
    <div className="mgr-inventory-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Ingredient Inventory & Supply Chain</h2>
          <p className="mgr-section-subtitle">
            Real-time stock audit, replenishment thresholds, and automated purchase orders for the culinary team.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="mgr-primary-btn" onClick={() => setIsAddingItem(true)}>
            <PlusIcon /> Add Stock Item
          </button>
        </div>
      </div>

      {/* KPI mini strip */}
      <div className="mgr-kpi-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Total Inventory Value</div>
          <div className="mgr-kpi-value" style={{ color: '#e5a962' }}>
            ₹{totalValue.toLocaleString('en-IN')}
          </div>
          <div className="mgr-kpi-subtext">Across {items.length} monitored SKUs</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Critical Shortages</div>
          <div className="mgr-kpi-value" style={{ color: criticalCount > 0 ? '#ef4444' : '#10b981' }}>
            {criticalCount} Items
          </div>
          <div className="mgr-kpi-subtext">Immediate reorder mandatory</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Low Stock Radar</div>
          <div className="mgr-kpi-value" style={{ color: '#f59e0b' }}>
            {lowCount} Items
          </div>
          <div className="mgr-kpi-subtext">Approaching safety buffer</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Healthy Buffer</div>
          <div className="mgr-kpi-value" style={{ color: '#10b981' }}>
            {items.length - criticalCount - lowCount} Items
          </div>
          <div className="mgr-kpi-subtext">Sufficient for 7+ days</div>
        </div>
      </div>

      {/* Category & Search filter */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`mgr-pill-filter ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mgr-search-box" style={{ width: '280px' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search ingredient or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table view */}
      <div className="mgr-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Ingredient & Category</th>
                <th>Current Stock</th>
                <th>Buffer Level</th>
                <th>Unit Cost</th>
                <th>Supplier / Vendor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const fillPercent = Math.min(100, Math.round((item.currentStock / item.optimalLevel) * 100));
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f5efe6' }}>{item.name}</div>
                      <span style={{ fontSize: '0.75rem', color: '#c9893d' }}>{item.category}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                        {item.currentStock} <span style={{ fontSize: '0.8rem', color: '#a89c90' }}>{item.unit}</span>
                      </div>
                      <div
                        style={{
                          height: '4px',
                          width: '100px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '2px',
                          marginTop: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${fillPercent}%`,
                            background:
                              item.status === 'critical' ? '#ef4444' : item.status === 'low' ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: '#a89c90' }}>
                        Min: <strong style={{ color: '#f5efe6' }}>{item.minThreshold} {item.unit}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6e6259' }}>
                        Optimal: {item.optimalLevel} {item.unit}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#e5a962' }}>₹{item.unitCost}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a89c90' }}>per {item.unit}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#f5efe6' }}>{item.supplier}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6e6259' }}>Restocked: {item.lastRestocked}</div>
                    </td>
                    <td>
                      <span
                        className={`mgr-badge ${
                          item.status === 'critical'
                            ? 'mgr-badge-critical'
                            : item.status === 'low'
                            ? 'mgr-badge-warning'
                            : 'mgr-badge-success'
                        }`}
                      >
                        {item.status === 'critical' && <AlertTriangleIcon />}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        className="mgr-secondary-btn"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => handleOpenRestock(item)}
                      >
                        <RotateCcwIcon /> Restock PO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock PO Modal */}
      {restockModalItem && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Create Purchase Order (PO)</h3>
              <button className="mgr-icon-btn" onClick={() => setRestockModalItem(null)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleConfirmRestock}>
              <div className="mgr-modal-body">
                <div style={{ background: 'rgba(201, 137, 61, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, color: '#f5efe6' }}>{restockModalItem.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a89c90' }}>
                    Supplier: {restockModalItem.supplier} • Unit Cost: ₹{restockModalItem.unitCost}/{restockModalItem.unit}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#e5a962', marginTop: '0.25rem' }}>
                    Current Stock: {restockModalItem.currentStock} {restockModalItem.unit} (Target: {restockModalItem.optimalLevel} {restockModalItem.unit})
                  </div>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Order Quantity ({restockModalItem.unit})</label>
                  <input
                    type="number"
                    className="mgr-form-input"
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#f5efe6', fontWeight: 600 }}>
                  <span>Estimated Total PO Cost:</span>
                  <span style={{ color: '#e5a962' }}>₹{(Number(restockQty) * restockModalItem.unitCost).toLocaleString('en-IN')}</span>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Vendor Notes & Delivery Instructions</label>
                  <textarea
                    className="mgr-form-input"
                    rows={3}
                    value={poNotes}
                    onChange={(e) => setPoNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setRestockModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  <CheckIcon /> Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Stock Item Modal */}
      {isAddingItem && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">New Ingredient Stock SKU</h3>
              <button className="mgr-icon-btn" onClick={() => setIsAddingItem(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleCreateInventoryItem}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Ingredient / Item Name</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    placeholder="e.g. San Marzano Tomatoes DOP"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Category</label>
                    <select
                      className="mgr-form-select"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    >
                      <option value="Meat & Poultry">Meat & Poultry</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Dairy & Cheese">Dairy & Cheese</option>
                      <option value="Produce">Produce</option>
                      <option value="Pantry & Spices">Pantry & Spices</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Unit of Measure</label>
                    <input
                      type="text"
                      className="mgr-form-input"
                      placeholder="kg, grams, bottles, etc."
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Initial Stock</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Unit Cost (₹)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Min Threshold</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newItem.minThreshold}
                      onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Optimal Level</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newItem.optimalLevel}
                      onChange={(e) => setNewItem({ ...newItem, optimalLevel: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Supplier / Distributor</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
