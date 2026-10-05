import React, { useState } from 'react';
import type { KitchenStockItem, KitchenTicket } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  PackageXIcon,
  SearchIcon,
  SendIcon,
  XIcon,
} from '../Icons';

interface StockIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: KitchenStockItem[];
  onToggleStock: (itemId: string, newStatus: 'in-stock' | 'low-stock' | '86-out-of-stock', remainingServings?: number) => void;
  activeTickets?: KitchenTicket[];
  onReportItemIssue?: (ticketId: string, itemId: string, issueType: string, proposedSub: string) => void;
  embedded?: boolean;
}

export const StockIssueModal: React.FC<StockIssueModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  onToggleStock,
  activeTickets = [],
  onReportItemIssue,
  embedded = false,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'ticket-issue'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('all');

  // Ticket issue state
  const [selectedTicketId, setSelectedTicketId] = useState<string>(activeTickets[0]?.id || '');
  const [selectedTicketItem, setSelectedTicketItem] = useState<string>('');
  const [issueReason, setIssueReason] = useState<string>('Out of Stock / Last Portion Spoiled');
  const [proposedSub, setProposedSub] = useState<string>('');
  const [issueSubmitted, setIssueSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTicket = activeTickets.find((t) => t.id === selectedTicketId) || activeTickets[0];

  const filteredStock = stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.station.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStation = selectedStation === 'all' || item.station === selectedStation;
    return matchesSearch && matchesStation;
  });

  const count86 = stockItems.filter((i) => i.status === '86-out-of-stock' || i.status === 'out-of-stock').length;
  const countLow = stockItems.filter((i) => i.status === 'low-stock').length;

  const handleTicketIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReportItemIssue && currentTicket && selectedTicketItem) {
      onReportItemIssue(currentTicket.id, selectedTicketItem, issueReason, proposedSub);
    }
    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      onClose();
    }, 1500);
  };

  const cardContent = (
    <div className={`kds-modal-card ${embedded ? 'max-w-none w-full border border-[#34271c] shadow-2xl rounded-2xl' : 'max-w-2xl max-h-[90vh]'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d221b] p-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <PackageXIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-amber-100">
                  Kitchen Inventory & 86'd Board
                </h2>
                {count86 > 0 && (
                  <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-300 uppercase tracking-wider">
                    {count86} Items 86'd
                  </span>
                )}
              </div>
              <p className="text-xs text-[#b8a69b]">
                Real-time out-of-stock flagging, line ingredient tracking & waiter notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-white"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#2d221b] bg-[#140f0c] px-5 py-2 shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-[#9f8d81] hover:text-amber-100 hover:bg-[#1f1712]'
            }`}
          >
            <span>Active 86'd & Stock Board</span>
            <span className="rounded bg-[#2a1e17] px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
              {stockItems.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ticket-issue')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ticket-issue'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                : 'text-[#9f8d81] hover:text-amber-100 hover:bg-[#1f1712]'
            }`}
          >
            <AlertTriangleIcon size={13} className="text-amber-400" />
            <span>Report Active Ticket Item Issue</span>
          </button>
        </div>

        {/* Tab 1: 86'd Board & Stock Manager */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Quick summary alert */}
            <div className="flex items-center justify-between rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-xs">
              <div className="flex items-center gap-2 text-[#c9b8ad]">
                <span className="flex h-2 w-2 rounded-full bg-red-400"></span>
                <span><strong>{count86}</strong> currently 86'd (Unavailable to Waitstaff)</span>
              </div>
              <div className="flex items-center gap-2 text-[#c9b8ad]">
                <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
                <span><strong>{countLow}</strong> low stock / critical countdown</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item or station..."
                  className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] pl-8 pr-3 py-2 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'grill', 'saute', 'pasta', 'cold', 'pastry'].map((stn) => (
                  <button
                    key={stn}
                    type="button"
                    onClick={() => setSelectedStation(stn)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                      selectedStation === stn
                        ? 'border border-amber-500/50 bg-amber-500/20 text-amber-200'
                        : 'border border-[#2d221b] bg-[#140f0c] text-[#8f7e73] hover:text-[#c9b8ad]'
                    }`}
                  >
                    {stn}
                  </button>
                ))}
              </div>
            </div>

            {/* Item list */}
            <div className="space-y-2">
              {filteredStock.map((item) => {
                const is86 = item.status === '86-out-of-stock' || item.status === 'out-of-stock';
                const isLow = item.status === 'low-stock';
                const servings = item.remainingServings ?? item.remainingPortions;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                      is86
                        ? 'border-red-500/40 bg-red-950/20 text-red-100'
                        : isLow
                        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
                        : 'border-[#2d221b] bg-[#140f0c] text-[#d6c4b8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1e1713] border border-[#3d2f26] text-[#b8a69b]">
                          {item.station}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#8f7e73] mt-0.5">
                        {servings !== undefined && (
                          <span>
                            {servings === 0
                              ? '0 servings left'
                              : `${servings} portions remaining`}
                          </span>
                        )}
                        <span>Updated {item.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Stock action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id, 'in-stock', 25)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          item.status === 'in-stock'
                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                            : 'bg-[#1a1410] border border-[#2d221b] text-[#8f7e73] hover:text-[#c9b8ad]'
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id, 'low-stock', servings || 5)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isLow
                            ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                            : 'bg-[#1a1410] border border-[#2d221b] text-[#8f7e73] hover:text-[#c9b8ad]'
                        }`}
                      >
                        Low Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id, '86-out-of-stock', 0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          is86
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                            : 'bg-[#1a1410] border border-red-500/40 text-red-400 hover:bg-red-950/40'
                        }`}
                      >
                        86 Item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Report Active Ticket Item Issue */}
        {activeTab === 'ticket-issue' && (
          <form onSubmit={handleTicketIssueSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {issueSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircleIcon size={32} />
                </div>
                <h3 className="text-base font-serif font-bold text-amber-100">
                  Item Issue Dispatched to Waiter & Host POS
                </h3>
                <p className="text-xs text-[#b8a69b]">
                  Service staff has been notified of the item issue and proposed guest substitution.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200">
                  <p>
                    Use this form when an ordered dish cannot be completed (e.g. dropped on pass, ingredient run out, allergen contamination) to immediately alert service staff with an alternative.
                  </p>
                </div>

                {/* Select Ticket */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
                    Select Active Ticket
                  </label>
                  <select
                    value={selectedTicketId}
                    onChange={(e) => {
                      setSelectedTicketId(e.target.value);
                      setSelectedTicketItem('');
                    }}
                    className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] px-3.5 py-2 text-xs text-amber-100 focus:border-amber-500/60 focus:outline-none"
                  >
                    {activeTickets.map((t) => (
                      <option key={t.id} value={t.id}>
                        Ticket #{t.orderNumber} — {t.orderType === 'dine-in' ? `Table ${t.tableNumber}` : 'Home Delivery'} ({t.items.length} items)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Item on Ticket */}
                {currentTicket && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
                      Select Impacted Dish / Item
                    </label>
                    <div className="space-y-2">
                      {currentTicket.items.map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedTicketItem === item.name
                              ? 'border-amber-500 bg-amber-500/10 text-amber-100'
                              : 'border-[#2d221b] bg-[#140f0c] text-[#c9b8ad] hover:border-[#4d3a2e]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="impactedItem"
                              value={item.name}
                              checked={selectedTicketItem === item.name}
                              onChange={(e) => setSelectedTicketItem(e.target.value)}
                              className="accent-amber-500"
                            />
                            <span className="font-semibold text-xs">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#8f7e73]">
                            Station: {item.station}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
                    Issue Description
                  </label>
                  <select
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                    className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] px-3.5 py-2 text-xs text-amber-100 focus:border-amber-500/60 focus:outline-none"
                  >
                    <option value="Out of Stock / Last Portion Spoiled">Out of Stock / Last Portion Spoiled</option>
                    <option value="Dropped / Plating Accident on Line">Dropped / Plating Accident on Line (Needs 12 min re-fire)</option>
                    <option value="Kitchen Ingredient Allergen Cross-Contact">Kitchen Ingredient Allergen Cross-Contact</option>
                    <option value="Grill Equipment Temperature Anomaly">Grill Equipment Temperature Anomaly</option>
                  </select>
                </div>

                {/* Proposed Substitution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
                    Proposed Guest Substitution / Solution
                  </label>
                  <input
                    type="text"
                    value={proposedSub}
                    onChange={(e) => setProposedSub(e.target.value)}
                    placeholder="e.g. Substitute with 8oz Black Angus Ribeye at no extra charge..."
                    className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] px-3.5 py-2.5 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedTicketItem || !proposedSub}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                >
                  <SendIcon size={14} />
                  Transmit Issue to Waiter Station
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2d221b] bg-[#120d0a] p-4 shrink-0">
          <span className="text-xs text-[#8c7b6d]">
            {embedded ? 'Real-time kitchen inventory sync active' : 'Changes notify waitstaff POS in real time'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
          >
            {embedded ? 'Reset Filters' : 'Close Board'}
          </button>
        </div>
      </div>
  );

  if (embedded) {
    return <div className="w-full">{cardContent}</div>;
  }

  return <div className="kds-modal-overlay">{cardContent}</div>;
};
