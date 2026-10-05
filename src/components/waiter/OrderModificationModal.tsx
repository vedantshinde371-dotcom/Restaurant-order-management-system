import React, { useState } from 'react';
import './WaiterDashboard.css';
import { XIcon, PlusIcon, MinusIcon, Trash2Icon, SendIcon, UtensilsCrossedIcon } from '../Icons';
import { type MenuItem, type WaiterFloorTable } from '../../data/mockRestaurantData';

interface OrderModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: WaiterFloorTable | null;
  menuItems: MenuItem[];
  onSaveOrderModification: (
    tableNumber: string,
    updatedItems: { id: string; name: string; quantity: number; price: number; notes?: string; status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served' }[],
    newSubtotal: number
  ) => void;
}

export const OrderModificationModal: React.FC<OrderModificationModalProps> = ({
  isOpen,
  onClose,
  table,
  menuItems,
  onSaveOrderModification,
}) => {
  const [prevTableId, setPrevTableId] = useState<string | null>(null);
  const [items, setItems] = useState<{ id: string; name: string; quantity: number; price: number; notes?: string; status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served' }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDishDrawer, setShowAddDishDrawer] = useState(false);
  const [modificationReason, setModificationReason] = useState('Guest requested addition');

  const currentTableId = table?.id || null;
  if (currentTableId !== prevTableId) {
    setPrevTableId(currentTableId);
    setItems(
      table?.activeOrderDetails?.items
        ? table.activeOrderDetails.items.map((i, idx) => ({
            id: i.id || `mod-${table.id}-${idx}`,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            notes: i.notes,
            status: i.status || 'cooking',
          }))
        : []
    );
  }

  if (!isOpen || !table) return null;

  const categories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category)))];

  const filteredDishes = menuItems.filter((dish) => {
    const matchCat = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleQuantityChange = (index: number, delta: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...item, quantity: newQty };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNotes = (index: number, notes: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], notes };
      return updated;
    });
  };

  const handleAddNewDish = (dish: MenuItem) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === dish.name);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `mod-${Date.now()}-${dish.id}`,
          name: dish.name,
          quantity: 1,
          price: dish.price,
          status: 'queued',
          notes: '',
        },
      ];
    });
  };

  const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceCharge = Math.round(currentSubtotal * 0.1);
  const tax = Math.round(currentSubtotal * 0.05);
  const currentTotal = currentSubtotal + serviceCharge + tax;

  const handleSaveChanges = () => {
    onSaveOrderModification(table.tableNumber, items, currentSubtotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8dfd8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1c1611]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center text-[#c9893d]">
              <UtensilsCrossedIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-wide text-[#f5ede4]">
                  Modify Order — {table.tableNumber}
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#c9893d]/15 text-[#e5a962] border border-[#c9893d]/30 font-medium">
                  {table.zone}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  {table.activeOrderDetails?.orderId || table.activeOrderId || 'Active Order'}
                </span>
              </div>
              <p className="text-xs text-[#a89687]">
                Guests: {table.guestsCount || table.seatedGuests || 2} • Seated for {table.seatedDuration || `${table.seatedMinutes || 25}m`} • Server: {table.serverName || table.assignedServer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDishDrawer(!showAddDishDrawer)}
              className="px-3 py-1.5 rounded-lg bg-[#c9893d]/20 border border-[#c9893d]/40 text-[#f5ede4] hover:bg-[#c9893d]/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5 text-[#c9893d]" />
              {showAddDishDrawer ? 'Hide Menu' : '+ Add More Dishes'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#34271c]">
          {/* Left Column: Active Order Items */}
          <div className={`p-6 ${showAddDishDrawer ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-4 overflow-y-auto`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#c9893d]">
                Current Order Tickets ({items.length} items)
              </span>
              <span className="text-xs text-[#8c7b6d]">
                Kitchen status reflects in-progress cooking
              </span>
            </div>

            {items.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#8c7b6d] bg-[#1a140f] rounded-xl border border-dashed border-[#34271c]">
                No items on this table ticket. Click "+ Add More Dishes" to append from the menu.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const itemTotal = item.price * item.quantity;
                  const isReadyOrServed = item.status === 'ready' || item.status === 'served';

                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c] hover:border-[#c9893d]/40 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.status === 'served'
                                ? 'bg-emerald-400'
                                : item.status === 'ready'
                                ? 'bg-amber-400 animate-pulse'
                                : item.status === 'cooking'
                                ? 'bg-orange-400'
                                : 'bg-blue-400'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-[#f5ede4]">{item.name}</span>
                              <span className="text-xs text-[#a89687]">₹{item.price} each</span>
                            </div>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8c7b6d]">
                              Status: {item.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#f5ede4]">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-1 bg-[#140f0c] p-1 rounded-lg border border-[#34271c]">
                            <button
                              onClick={() => handleQuantityChange(idx, -1)}
                              disabled={isReadyOrServed}
                              className="p-1 text-[#a89687] hover:text-[#f5ede4] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <MinusIcon className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#f5ede4]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(idx, 1)}
                              className="p-1 text-[#a89687] hover:text-[#f5ede4]"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(idx)}
                            disabled={isReadyOrServed}
                            title={isReadyOrServed ? 'Cannot cancel dish already plated or served' : 'Remove from order'}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customization & kitchen notes */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[#2a1e15]">
                        <span className="text-[11px] text-[#8c7b6d] whitespace-nowrap">Chef Note:</span>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateNotes(idx, e.target.value)}
                          placeholder="e.g., extra spicy, no nuts, dressing on side..."
                          className="flex-1 bg-[#140f0c] text-xs px-2.5 py-1 rounded border border-[#34271c] focus:outline-none focus:border-[#c9893d] text-[#e8dfd8] placeholder-[#665446]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modification Reason Note */}
            <div className="mt-2 pt-3 border-t border-[#2a1e15]">
              <label className="block text-xs font-semibold text-[#c9893d] mb-1">
                Reason for Kitchen Ticket Amendment:
              </label>
              <select
                value={modificationReason}
                onChange={(e) => setModificationReason(e.target.value)}
                className="w-full bg-[#1b1510] text-xs px-3 py-2 rounded-lg border border-[#34271c] focus:outline-none focus:border-[#c9893d] text-[#f5ede4]"
              >
                <option value="Guest requested addition">Guest requested addition / extra courses</option>
                <option value="Guest dietary allergy adjustment">Guest dietary allergy adjustment</option>
                <option value="Incorrect dish entered">Incorrect dish entered (Manager void)</option>
                <option value="Spill or re-cook replacement">Kitchen pass re-fire / replacement</option>
              </select>
            </div>
          </div>

          {/* Right Column: Menu Picker (when drawer opened) */}
          {showAddDishDrawer && (
            <div className="lg:col-span-5 p-5 bg-[#17120d] flex flex-col gap-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#2e2117]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c9893d]">
                  Add Dishes to Ticket
                </h4>
                <span className="text-[11px] text-[#8c7b6d]">{filteredDishes.length} available</span>
              </div>

              {/* Search & categories */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search food item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1b1510] text-xs px-3 py-2 rounded-lg border border-[#34271c] focus:outline-none focus:border-[#c9893d] text-[#e8dfd8] placeholder-[#736052]"
                />

                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#c9893d] text-[#140f0c] font-semibold'
                          : 'bg-[#1f1812] text-[#a89687] hover:text-[#f5ede4]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dishes list */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-2.5 rounded-lg bg-[#1b1510] border border-[#34271c] hover:border-[#c9893d]/50 flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dish.isVegetarian ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className="text-xs font-medium text-[#f5ede4] truncate">{dish.name}</span>
                      </div>
                      <p className="text-[11px] text-[#8c7b6d]">₹{dish.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddNewDish(dish)}
                      className="px-2.5 py-1 rounded bg-[#c9893d]/20 text-[#c9893d] hover:bg-[#c9893d] hover:text-[#140f0c] text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Calculations & Firing Action */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-[#a89687]">
            <div>
              <span>Subtotal: </span>
              <strong className="text-[#f5ede4]">₹{currentSubtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span>Service (10%): </span>
              <strong className="text-[#f5ede4]">₹{serviceCharge.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span>GST (5%): </span>
              <strong className="text-[#f5ede4]">₹{tax.toLocaleString('en-IN')}</strong>
            </div>
            <div className="pl-3 border-l border-[#34271c]">
              <span className="text-[#c9893d] font-semibold">Total: </span>
              <strong className="text-base text-[#f5ede4] font-serif">₹{currentTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow-lg hover:shadow-[#c9893d]/20 transition-all flex items-center justify-center gap-2"
            >
              <SendIcon className="w-4 h-4" />
              Re-Fire Updates to Kitchen Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
