import React, { useState } from 'react';
import './WaiterDashboard.css';
import {
  UsersIcon,
  ClockIcon,
  PlusIcon,
  DollarSignIcon,
  Share2Icon,
  UtensilsCrossedIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '../Icons';
import { type WaiterFloorTable } from '../../data/mockRestaurantData';

interface TableManagementViewProps {
  tables: WaiterFloorTable[];
  onOpenNewOrder: (table: WaiterFloorTable) => void;
  onOpenModifyOrder: (table: WaiterFloorTable) => void;
  onOpenBillSettlement: (table: WaiterFloorTable) => void;
  onOpenTableTransfer: (table: WaiterFloorTable) => void;
  onMarkTableCleaned: (tableNumber: string) => void;
}

export const TableManagementView: React.FC<TableManagementViewProps> = ({
  tables,
  onOpenNewOrder,
  onOpenModifyOrder,
  onOpenBillSettlement,
  onOpenTableTransfer,
  onMarkTableCleaned,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const zones = ['All', 'Indoor Dining Room', 'Terrace & Veranda', 'Garden & Courtyard', 'Private Wine Vault'];
  const statusOptions = [
    { label: 'All Tables', value: 'All' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Awaiting Order', value: 'waiting-for-order' },
    { label: 'Turnover / Cleaning', value: 'cleaning' },
  ];

  const filteredTables = tables.filter((table) => {
    const matchZone = selectedZone === 'All' || table.zone.includes(selectedZone) || table.zone === selectedZone;
    const matchStatus =
      selectedStatus === 'All' ||
      table.status === selectedStatus ||
      (selectedStatus === 'waiting-for-order' && table.status === 'waiting');
    return matchZone && matchStatus;
  });

  const getStatusBadge = (status: WaiterFloorTable['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-700/50">
            Available
          </span>
        );
      case 'occupied':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#3a2213] text-[#e5a962] border border-[#c9893d]/50">
            Occupied
          </span>
        );
      case 'waiting':
      case 'waiting-for-order':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-950/70 text-amber-300 border border-amber-600/50 animate-pulse">
            Needs Order
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-950/70 text-blue-300 border border-blue-700/50">
            Reserved
          </span>
        );
      case 'cleaning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-950/70 text-purple-300 border border-purple-700/50">
            Bussing / Clean
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Filters & Status Quick Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18130e] p-4 rounded-2xl border border-[#34271c]">
        {/* Zone Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedZone === zone
                  ? 'bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] font-bold shadow-md'
                  : 'bg-[#1f1812] text-[#a89687] hover:text-[#f5ede4] hover:bg-[#281f17] border border-[#34271c]'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Status Dropdown/Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8c7b6d] whitespace-nowrap">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#1f1812] text-xs px-3 py-1.5 rounded-xl border border-[#34271c] text-[#f5ede4] focus:outline-none focus:border-[#c9893d]"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Floor Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const isOccupied = table.status === 'occupied';
          const isWaiting = table.status === 'waiting' || table.status === 'waiting-for-order';
          const isAvailable = table.status === 'available';
          const isReserved = table.status === 'reserved';
          const isCleaning = table.status === 'cleaning';
          const billValue = table.currentBill || table.currentBillTotal || 0;

          return (
            <div
              key={table.id}
              className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                isWaiting
                  ? 'bg-gradient-to-b from-[#24170d] to-[#1a120b] border-amber-600/60 shadow-lg shadow-amber-950/20'
                  : isOccupied
                  ? 'bg-gradient-to-b from-[#1e1712] to-[#15110d] border-[#c9893d]/40'
                  : isCleaning
                  ? 'bg-[#18111a] border-purple-800/40'
                  : isReserved
                  ? 'bg-[#121820] border-blue-800/40'
                  : 'bg-[#151310] border-[#2f241a] hover:border-[#c9893d]/40'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold text-[#f5ede4]">
                      {table.tableNumber}
                    </span>
                    <span className="text-xs text-[#a89687]">({table.capacity}p)</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {getStatusBadge(table.status)}
                    {table.isMerged && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#3a2213] text-[#e5a962] border border-[#c9893d]/50">
                        {table.mergedWith ? `🔗 Merged w/ ${table.mergedWith.join(', ')}` : `🔗 Linked to ${table.mergedParent}`}
                      </span>
                    )}
                    {table.splitFrom && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-950/70 text-purple-300 border border-purple-700/50">
                        ✂️ Split from {table.splitFrom}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#c9893d] font-medium mb-1">{table.zone}</div>

                {/* Table details based on state */}
                {isOccupied && (
                  <div className="mt-3 p-3 rounded-xl bg-[#140f0c] border border-[#2d2218] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8c7b6d]">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                        {table.guestsCount || table.seatedGuests || 2} Guests
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                        {table.seatedDuration || `${table.seatedMinutes || 15}m`} seated
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#241a12]">
                      <span className="text-[#a89687]">Active Ticket:</span>
                      <span className="font-bold text-[#f5ede4]">
                        ₹{billValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {table.activeOrderDetails && (
                      <div className="flex items-center justify-between text-[11px] text-[#8c7b6d]">
                        <span>{table.activeOrderDetails.items.length} dishes ordered</span>
                        <span className="text-[#e5a962] capitalize">
                          {table.courseProgress || table.activeOrderDetails.courseStage || 'Main Course'}
                        </span>
                      </div>
                    )}

                    {table.transferHistory && table.transferHistory.length > 0 && (
                      <div className="flex items-center justify-between text-[10px] text-[#8c7b6d] pt-1.5 border-t border-[#241a12]">
                        <span className="text-[#c9893d] font-semibold">
                          {table.transferHistory[0].type.toUpperCase()}: {table.transferHistory[0].fromTable}
                          {table.transferHistory[0].toTable ? ` → ${table.transferHistory[0].toTable}` : ''}
                        </span>
                        <span className="text-[#a89687]">
                          {table.transferHistory[0].performedBy} ({table.transferHistory[0].timestamp})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {isWaiting && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs">
                    <div className="text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      Guests Seated & Waiting
                    </div>
                    <p className="text-[11px] text-[#e8dfd8]">
                      {table.guestsCount || table.seatedGuests || 2} guests ready to place beverage & appetizer order.
                    </p>
                  </div>
                )}

                {isReserved && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs space-y-1">
                    <div className="text-blue-300 font-semibold">VIP Reservation</div>
                    <div className="text-[11px] text-[#a89687]">Arriving at 19:30 • Party of {table.capacity}</div>
                  </div>
                )}

                {isCleaning && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-1">
                    <div className="text-purple-300 font-semibold">Table Turnover Required</div>
                    <div className="text-[11px] text-[#a89687]">Bussing dishes and resetting silver cutlery</div>
                  </div>
                )}

                {isAvailable && (
                  <div className="mt-3 p-3 rounded-xl bg-[#140f0c] border border-[#2d2218] text-xs text-[#8c7b6d] text-center">
                    Clean, set, and ready for host seating
                  </div>
                )}
              </div>

              {/* Action Buttons depending on status */}
              <div className="mt-5 pt-3 border-t border-[#2d2218] flex flex-wrap gap-2">
                {isAvailable && (
                  <button
                    onClick={() => onOpenNewOrder(table)}
                    className="w-full py-2 rounded-xl bg-[#c9893d]/20 border border-[#c9893d]/50 text-[#f5ede4] hover:bg-[#c9893d] hover:text-[#140f0c] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Seat & Take Order
                  </button>
                )}

                {isWaiting && (
                  <button
                    onClick={() => onOpenNewOrder(table)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <UtensilsCrossedIcon className="w-3.5 h-3.5" />
                    Create Order Ticket
                  </button>
                )}

                {isOccupied && (
                  <>
                    <button
                      onClick={() => onOpenModifyOrder(table)}
                      className="flex-1 py-1.5 rounded-lg bg-[#221a13] border border-[#3c2d20] hover:border-[#c9893d] text-[#f5ede4] text-xs font-medium transition-colors"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => onOpenBillSettlement(table)}
                      className="flex-1 py-1.5 rounded-lg bg-[#c9893d]/20 border border-[#c9893d]/50 hover:bg-[#c9893d] hover:text-[#140f0c] text-[#f5ede4] text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <DollarSignIcon className="w-3.5 h-3.5" />
                      Bill
                    </button>
                    <button
                      onClick={() => onOpenTableTransfer(table)}
                      title="Transfer table or server"
                      className="p-1.5 rounded-lg bg-[#221a13] border border-[#3c2d20] text-[#a89687] hover:text-[#f5ede4] transition-colors"
                    >
                      <Share2Icon className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {isCleaning && (
                  <button
                    onClick={() => onMarkTableCleaned(table.tableNumber)}
                    className="w-full py-2 rounded-xl bg-purple-900/40 border border-purple-600/50 text-purple-200 hover:bg-purple-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Mark Table Ready & Clean
                  </button>
                )}

                {isReserved && (
                  <button
                    onClick={() => onOpenNewOrder(table)}
                    className="w-full py-2 rounded-xl bg-blue-900/40 border border-blue-600/50 text-blue-200 hover:bg-blue-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Check-in Party
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
