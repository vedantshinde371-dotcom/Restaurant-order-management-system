import React, { useState } from 'react';
import {
  FEATURED_DISHES,
  type Dish,
  type ManagerInventoryItem,
} from '../../data/mockRestaurantData';
import { SearchIcon, EditIcon, CheckIcon, XIcon, PlusIcon, TagIcon } from '../Icons';

export interface MenuManagementDish extends Dish {
  available: boolean;
}

interface MenuManagementViewProps {
  inventoryItems: ManagerInventoryItem[];
  onLogAudit: (action: string, module: 'Menu', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  inventoryItems,
  onLogAudit,
}) => {
  const [dishList, setDishList] = useState<MenuManagementDish[]>(() =>
    FEATURED_DISHES.map((d) => ({ ...d, available: true }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingDish, setEditingDish] = useState<MenuManagementDish | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDish, setNewDish] = useState<{
    name: string;
    category: Dish['category'];
    price: number;
    description: string;
    available: boolean;
  }>({
    name: '',
    category: 'mains',
    price: 950,
    description: '',
    available: true,
  });

  const categories = ['All', 'Starters', 'Mains', 'Pasta', 'Desserts', 'Beverages'];

  const filteredDishes = dishList.filter((d) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      d.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleAvailability = (dishId: string) => {
    setDishList((prev) =>
      prev.map((d) => {
        if (d.id === dishId) {
          const nextState = !d.available;
          onLogAudit(
            'Menu Availability Toggled',
            'Menu',
            `Item "${d.name}" marked as ${nextState ? 'Available' : '86 / Out of Stock'}.`,
            nextState ? 'info' : 'warning'
          );
          return { ...d, available: nextState };
        }
        return d;
      })
    );
  };

  const handleOpenEdit = (dish: MenuManagementDish) => {
    setEditingDish(dish);
    setEditPrice(dish.price);
    setEditName(dish.name);
    setEditDescription(dish.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    setDishList((prev) =>
      prev.map((d) =>
        d.id === editingDish.id
          ? { ...d, name: editName, price: Number(editPrice), description: editDescription }
          : d
      )
    );
    onLogAudit(
      'Dish Details Updated',
      'Menu',
      `Updated "${editingDish.name}" to ₹${editPrice} ("${editName}").`,
      'info'
    );
    setEditingDish(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    const created: MenuManagementDish = {
      id: `dish-custom-${dishList.length + 1}`,
      name: newDish.name,
      category: newDish.category,
      price: Number(newDish.price),
      description: newDish.description || 'Specialty chef preparation.',
      available: true,
      rating: 4.9,
      reviewsCount: 1,
      prepTimeMinutes: 18,
      ingredients: ['Chef Selection'],
      dietary: ['Signature'],
      allergens: [],
      portions: [],
      customizations: [],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    };
    setDishList((prev) => [created, ...prev]);
    onLogAudit(
      'New Dish Added',
      'Menu',
      `Chef added "${created.name}" (₹${created.price}) in category ${created.category}.`,
      'info'
    );
    setIsAddingNew(false);
    setNewDish({
      name: '',
      category: 'mains',
      price: 950,
      description: '',
      available: true,
    });
  };

  // Check if dish has low inventory
  const getInventoryWarning = (dishId: string) => {
    const linked = inventoryItems.find((inv) =>
      inv.linkedDishIds?.includes(dishId)
    );
    if (!linked) return null;
    if (linked.status === 'critical') {
      return `Critical Stock: ${linked.name} (${linked.currentStock} ${linked.unit})`;
    }
    if (linked.status === 'low') {
      return `Low Stock: ${linked.name} (${linked.currentStock} ${linked.unit})`;
    }
    return null;
  };

  return (
    <div className="mgr-menu-management">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Menu & Culinary Catalog Management</h2>
          <p className="mgr-section-subtitle">
            Configure dishes, dynamic pricing, and automatic 86 availability triggers linked to pantry inventory.
          </p>
        </div>
        <button
          className="mgr-primary-btn"
          onClick={() => setIsAddingNew(true)}
        >
          <PlusIcon /> Add New Dish
        </button>
      </div>

      {/* Control bar */}
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
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Dishes grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredDishes.map((dish) => {
          const invWarning = getInventoryWarning(dish.id);
          return (
            <div
              key={dish.id}
              className="mgr-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: !dish.available ? '4px solid #ef4444' : invWarning ? '4px solid #f59e0b' : '4px solid #10b981',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c9893d' }}>
                      {dish.category}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5efe6', marginTop: '0.15rem' }}>
                      {dish.name}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e5a962' }}>
                      ₹{dish.price.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a89c90' }}>
                      ★ {dish.rating}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: '#a89c90', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {dish.description}
                </p>

                {invWarning && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.75rem',
                      color: '#f59e0b',
                      marginBottom: '0.75rem',
                    }}
                  >
                    ⚠️ {invWarning}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(201, 137, 61, 0.15)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(dish.id)}
                  style={{
                    background: dish.available ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: dish.available ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: dish.available ? '#10b981' : '#ef4444',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {dish.available ? <CheckIcon /> : <XIcon />}
                  {dish.available ? 'Available' : "86'd (Unavailable)"}
                </button>

                <button
                  type="button"
                  className="mgr-secondary-btn"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => handleOpenEdit(dish)}
                >
                  <EditIcon /> Edit Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingDish && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Edit Dish: {editingDish.name}</h3>
              <button
                className="mgr-icon-btn"
                onClick={() => setEditingDish(null)}
              >
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Dish Name</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Price (INR ₹)</label>
                  <input
                    type="number"
                    className="mgr-form-input"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    required
                    min={1}
                  />
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Culinary Description</label>
                  <textarea
                    className="mgr-form-input"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button
                  type="button"
                  className="mgr-secondary-btn"
                  onClick={() => setEditingDish(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddingNew && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Add New Dish to Menu</h3>
              <button
                className="mgr-icon-btn"
                onClick={() => setIsAddingNew(false)}
              >
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleCreateDish}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Dish Name</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    placeholder="e.g. Pan-Roasted Duck Breast"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Category</label>
                    <select
                      className="mgr-form-select"
                      value={newDish.category}
                      onChange={(e) => setNewDish({ ...newDish, category: e.target.value as Dish['category'] })}
                    >
                      <option value="starters">Starters</option>
                      <option value="mains">Mains</option>
                      <option value="pasta">Pasta</option>
                      <option value="desserts">Desserts</option>
                      <option value="beverages">Beverages</option>
                      <option value="specials">Chef Specials</option>
                    </select>
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Price (INR ₹)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Description & Allergens</label>
                  <textarea
                    className="mgr-form-input"
                    rows={3}
                    placeholder="Describe textures, accompaniments and allergens..."
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button
                  type="button"
                  className="mgr-secondary-btn"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  <TagIcon /> Create Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
