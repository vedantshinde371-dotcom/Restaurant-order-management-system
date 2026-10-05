import React, { useState, useMemo } from 'react';
import './WaiterDashboard.css';
import {
  CATEGORIES,
  FEATURED_DISHES,
  type Dish,
  type DishPortion,
  type SelectedCustomization,
  type WaiterFloorTable,
  type ActiveOrder,
} from '../../data/mockRestaurantData';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  UtensilsIcon,
  SearchIcon,
  CheckIcon,
  FlameIcon,
} from '../Icons';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: WaiterFloorTable[];
  selectedTableNumber?: string;
  onFireOrder: (order: ActiveOrder) => void;
}

interface OrderItemDraft {
  id: string;
  dish: Dish;
  quantity: number;
  selectedPortion: DishPortion;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions: string;
  unitPrice: number;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  tables,
  selectedTableNumber,
  onFireOrder,
}) => {
  const [tableNum, setTableNum] = useState<string>(
    selectedTableNumber || tables.find((t) => t.status === 'available')?.tableNumber || 'Table 01'
  );
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [itemsDraft, setItemsDraft] = useState<OrderItemDraft[]>([]);

  // Selected dish for customizer pane
  const [activeDish, setActiveDish] = useState<Dish | null>(FEATURED_DISHES[0]);
  const [selectedPortion, setSelectedPortion] = useState<DishPortion>(
    FEATURED_DISHES[0].portions[0]
  );
  const [customizationSelections, setCustomizationSelections] = useState<{
    [groupId: string]: string[];
  }>({});
  const [itemInstructions, setItemInstructions] = useState('');

  // Update active dish and reset selections
  const handleSelectDish = (dish: Dish) => {
    setActiveDish(dish);
    setSelectedPortion(dish.portions[0]);
    const defaultMap: { [groupId: string]: string[] } = {};
    dish.customizations.forEach((group) => {
      if (group.type === 'single' && group.options.length > 0) {
        defaultMap[group.id] = [group.options[0].name];
      } else {
        defaultMap[group.id] = [];
      }
    });
    setCustomizationSelections(defaultMap);
    setItemInstructions('');
  };

  const handleSingleSelect = (groupId: string, optionName: string) => {
    setCustomizationSelections((prev) => ({
      ...prev,
      [groupId]: [optionName],
    }));
  };

  const handleMultiToggle = (groupId: string, optionName: string) => {
    setCustomizationSelections((prev) => {
      const current = prev[groupId] || [];
      const exists = current.includes(optionName);
      return {
        ...prev,
        [groupId]: exists ? current.filter((i) => i !== optionName) : [...current, optionName],
      };
    });
  };

  // Unit price calculation for current customized dish
  const { unitPrice, formattedCustomizations } = useMemo(() => {
    if (!activeDish) return { unitPrice: 0, formattedCustomizations: [] };

    let extraPortion = selectedPortion ? selectedPortion.priceModifier : 0;
    let extraCustom = 0;
    const formatted: SelectedCustomization[] = [];

    activeDish.customizations.forEach((group) => {
      const selected = customizationSelections[group.id] || [];
      if (selected.length > 0) {
        let groupCost = 0;
        selected.forEach((optName) => {
          const opt = group.options.find((o) => o.name === optName);
          if (opt) groupCost += opt.price;
        });
        extraCustom += groupCost;
        formatted.push({
          groupName: group.name,
          optionNames: selected,
          additionalPrice: groupCost,
        });
      }
    });

    return {
      unitPrice: +(activeDish.price + extraPortion + extraCustom).toFixed(2),
      formattedCustomizations: formatted,
    };
  }, [activeDish, selectedPortion, customizationSelections]);

  const handleAddItemToDraft = () => {
    if (!activeDish) return;
    const newItem: OrderItemDraft = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dish: activeDish,
      quantity: 1,
      selectedPortion,
      selectedCustomizations: formattedCustomizations,
      specialInstructions: itemInstructions,
      unitPrice,
    };
    setItemsDraft((prev) => [...prev, newItem]);
    setItemInstructions('');
  };

  const handleUpdateDraftQuantity = (itemId: string, delta: number) => {
    setItemsDraft((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItemDraft[]
    );
  };

  const handleRemoveDraftItem = (itemId: string) => {
    setItemsDraft((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Totals calculations
  const subtotal = useMemo(() => {
    return itemsDraft.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [itemsDraft]);

  const serviceFee = +(subtotal * 0.1).toFixed(2);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + serviceFee + tax).toFixed(2);

  const filteredDishes = useMemo(() => {
    return FEATURED_DISHES.filter((dish) => {
      const matchCat = selectedCategory === 'all' || dish.category === selectedCategory;
      const matchSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleFireToKitchen = () => {
    if (itemsDraft.length === 0) return;

    const now = new Date();
    const timeFormatted = `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    const newOrderId = `SAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newActiveOrder: ActiveOrder = {
      id: newOrderId,
      orderType: 'dine-in',
      tableNumber: tableNum,
      placedTime: timeFormatted,
      estimatedMinutes: 20,
      currentStep: 1,
      statusText: kitchenNotes
        ? `Waiter notes: "${kitchenNotes}" • Transmitted to executive line.`
        : 'Order created at POS terminal. Kitchen firing Starters.',
      paymentMethod: 'Pending Tableside Settlement',
      paymentStatus: 'Pending Cash on Delivery',
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: itemsDraft.map((item) => ({
        dishId: item.dish.id,
        name: item.dish.name,
        quantity: item.quantity,
        price: item.unitPrice,
        portion: item.selectedPortion.name,
        customizations: item.selectedCustomizations.map(
          (c) => `${c.groupName}: ${c.optionNames.join(', ')}`
        ),
        specialInstructions: item.specialInstructions,
      })),
      subtotal,
      serviceFee,
      deliveryFee: 0,
      packagingFee: 0,
      tax,
      total,
    };

    onFireOrder(newActiveOrder);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="waiter-modal-container pos-terminal-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="New Table Order POS Terminal"
      >
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-header-title">
            <span className="terminal-tag">POS TERMINAL • SERVER MARCO</span>
            <h2 className="terminal-title">Create Table Dining Order</h2>
          </div>

          <div className="terminal-table-select-group">
            <div className="table-badge-select">
              <label htmlFor="pos-table-select">Table:</label>
              <select
                id="pos-table-select"
                className="pos-dropdown"
                value={tableNum}
                onChange={(e) => setTableNum(e.target.value)}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    {t.tableNumber} ({t.location} • {t.capacity}p) {t.status === 'occupied' ? '• Occupied' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="table-badge-select">
              <label htmlFor="pos-guest-count">Guests:</label>
              <select
                id="pos-guest-count"
                className="pos-dropdown"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((g) => (
                  <option key={g} value={g}>
                    {g} {g === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="terminal-close-btn"
              onClick={onClose}
              aria-label="Close terminal"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Terminal 3-Column Grid */}
        <div className="terminal-body-grid">
          {/* Column 1: Menu Dish Browser */}
          <div className="terminal-col-menu">
            {/* Search & Category Pills */}
            <div className="terminal-search-wrap">
              <SearchIcon size={15} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="terminal-search-input"
              />
            </div>

            <div className="terminal-cat-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`terminal-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes list */}
            <div className="terminal-dishes-list">
              {filteredDishes.map((dish) => {
                const isSelected = activeDish?.id === dish.id;
                return (
                  <div
                    key={dish.id}
                    className={`terminal-dish-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectDish(dish)}
                  >
                    <img src={dish.image} alt={dish.name} className="terminal-dish-thumb" />
                    <div className="terminal-dish-info">
                      <span className="terminal-dish-name">{dish.name}</span>
                      <span className="terminal-dish-price">${dish.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Selected Dish Customizer */}
          <div className="terminal-col-customizer">
            {activeDish ? (
              <div className="dish-customizer-panel">
                <div className="customizer-dish-header">
                  <img src={activeDish.image} alt={activeDish.name} className="customizer-hero-img" />
                  <div>
                    <h3 className="customizer-dish-title">{activeDish.name}</h3>
                    <p className="customizer-dish-desc">{activeDish.description}</p>
                    <span className="customizer-base-price">Base: ${activeDish.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Portions */}
                <div className="customizer-block">
                  <span className="customizer-label">Portion Size:</span>
                  <div className="customizer-portions-row">
                    {activeDish.portions.map((portion) => (
                      <button
                        key={portion.id}
                        type="button"
                        className={`portion-select-pill ${
                          selectedPortion?.id === portion.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedPortion(portion)}
                      >
                        <span>{portion.name}</span>
                        {portion.priceModifier > 0 && (
                          <small>+${portion.priceModifier.toFixed(2)}</small>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customizations */}
                {activeDish.customizations.map((group) => {
                  const currentSelected = customizationSelections[group.id] || [];
                  return (
                    <div key={group.id} className="customizer-block">
                      <span className="customizer-label">{group.name}:</span>
                      <div className="customizer-options-wrap">
                        {group.options.map((opt) => {
                          const isChecked = currentSelected.includes(opt.name);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              className={`custom-opt-pill ${isChecked ? 'active' : ''}`}
                              onClick={() => {
                                if (group.type === 'single') {
                                  handleSingleSelect(group.id, opt.name);
                                } else {
                                  handleMultiToggle(group.id, opt.name);
                                }
                              }}
                            >
                              <span>{opt.name}</span>
                              {opt.price > 0 && <small>+${opt.price.toFixed(2)}</small>}
                              {isChecked && <CheckIcon size={12} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Item special notes */}
                <div className="customizer-block">
                  <label htmlFor="dish-notes" className="customizer-label">Course / Kitchen Note:</label>
                  <input
                    id="dish-notes"
                    type="text"
                    className="customizer-notes-input"
                    placeholder="E.g., Starters first, dressing on side..."
                    value={itemInstructions}
                    onChange={(e) => setItemInstructions(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-cognac btn-block add-to-ticket-btn"
                  onClick={handleAddItemToDraft}
                >
                  <PlusIcon size={16} />
                  <span>Add To Ticket • ${unitPrice.toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <div className="customizer-empty">
                <UtensilsIcon size={32} />
                <p>Select a dish on the left to configure portions and doneness.</p>
              </div>
            )}
          </div>

          {/* Column 3: Current Ticket Basket & Bill Breakdown */}
          <div className="terminal-col-ticket">
            <div className="ticket-header">
              <span className="ticket-title">Active Ticket ({tableNum})</span>
              <span className="ticket-guest-badge">{guestCount} Guests</span>
            </div>

            {/* Items draft */}
            <div className="ticket-items-scroll">
              {itemsDraft.length === 0 ? (
                <div className="ticket-empty">
                  <p>Ticket is currently empty.</p>
                  <small>Add dishes from the center panel.</small>
                </div>
              ) : (
                itemsDraft.map((item) => (
                  <div key={item.id} className="ticket-item-card">
                    <div className="ticket-item-top">
                      <span className="ticket-item-name">{item.dish.name}</span>
                      <strong className="ticket-item-price">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </strong>
                    </div>

                    <div className="ticket-item-meta">
                      <span className="portion-tag">{item.selectedPortion.name}</span>
                      {item.selectedCustomizations.map((c, i) => (
                        <span key={i} className="custom-tag">{c.optionNames.join(', ')}</span>
                      ))}
                    </div>

                    {item.specialInstructions && (
                      <p className="ticket-item-note">"{item.specialInstructions}"</p>
                    )}

                    <div className="ticket-item-actions">
                      <div className="ticket-qty-group">
                        <button
                          type="button"
                          className="qty-mini-btn"
                          onClick={() => handleUpdateDraftQuantity(item.id, -1)}
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-mini-btn"
                          onClick={() => handleUpdateDraftQuantity(item.id, 1)}
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="ticket-remove-btn"
                        onClick={() => handleRemoveDraftItem(item.id)}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ticket Footer & Summary */}
            <div className="ticket-footer">
              <div className="ticket-notes-field">
                <label htmlFor="ticket-kitchen-notes">Overall Kitchen Notes:</label>
                <input
                  id="ticket-kitchen-notes"
                  type="text"
                  placeholder="VIP table, allergy cautions..."
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  className="ticket-notes-input"
                />
              </div>

              <div className="ticket-cost-rows">
                <div className="cost-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cost-line">
                  <span>Service Charge (10%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="cost-line">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="cost-line total-line">
                  <strong>Total Ticket Due</strong>
                  <strong className="gold-text">${total.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-cognac btn-block btn-lg fire-kitchen-btn"
                onClick={handleFireToKitchen}
                disabled={itemsDraft.length === 0}
              >
                <FlameIcon size={18} />
                <span>Fire Order to Kitchen Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
