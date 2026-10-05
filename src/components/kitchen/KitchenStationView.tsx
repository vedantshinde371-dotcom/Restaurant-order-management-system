import React, { useState } from 'react';
import type { KitchenStation, KitchenTicket } from '../../data/mockRestaurantData';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  FlameIcon,
  SearchIcon,
  UserIcon,
} from '../Icons';

interface KitchenStationViewProps {
  tickets: KitchenTicket[];
  onToggleItemDone: (ticketId: string, itemId: string) => void;
}

interface StationInfo {
  id: KitchenStation;
  name: string;
  leadChef: string;
  maxCapacity: number;
  description: string;
  color: string;
}

export const KitchenStationView: React.FC<KitchenStationViewProps> = ({
  tickets,
  onToggleItemDone,
}) => {
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('grill');
  const [searchQuery, setSearchQuery] = useState('');

  const stations: StationInfo[] = [
    {
      id: 'grill',
      name: 'Charcoal & Wood Grill',
      leadChef: 'Chef Marco Rossi (Demi Chef)',
      maxCapacity: 12,
      description: 'Prime dry-aged steaks, chops, broccolini & grilled seafood',
      color: 'from-red-600/30 to-amber-600/10 border-red-500/40 text-red-300',
    },
    {
      id: 'saute',
      name: 'Fish & Sauté Line',
      leadChef: 'Chef Claire Dupont (Sous Chef)',
      maxCapacity: 10,
      description: 'Pan-seared seafood, reductions, delicate glazes & butter sauces',
      color: 'from-amber-600/30 to-yellow-600/10 border-amber-500/40 text-amber-300',
    },
    {
      id: 'pasta',
      name: 'Pasta & Risotto',
      leadChef: 'Chef Matteo Conti',
      maxCapacity: 8,
      description: 'Handmade tagliolini, saffron risottos & ravioli al tartufo',
      color: 'from-yellow-600/30 to-amber-600/10 border-yellow-500/40 text-yellow-300',
    },
    {
      id: 'cold',
      name: 'Garde Manger & Raw Bar',
      leadChef: 'Chef Elena Rostova',
      maxCapacity: 14,
      description: 'Oysters on ice, king crab, tartares, burrata & artisanal salads',
      color: 'from-cyan-600/30 to-blue-600/10 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'pastry',
      name: 'Pastry & Soufflé',
      leadChef: 'Chef Yvaine Chen',
      maxCapacity: 8,
      description: 'Grand Marnier soufflés, dark chocolate ganache & plated desserts',
      color: 'from-purple-600/30 to-pink-600/10 border-purple-500/40 text-purple-300',
    },
  ];

  // Active cooking tickets
  const activeTickets = tickets.filter((t) => t.status !== 'completed');

  // Extract all items belonging to the selected station
  const stationItems: Array<{
    ticketId: string;
    orderNumber: string;
    tableNumber?: string;
    orderType: string;
    priority: string;
    elapsedMinutes: number;
    itemId: string;
    name: string;
    quantity: number;
    notes?: string;
    isCompleted?: boolean;
    allergies?: string[];
  }> = [];

  activeTickets.forEach((t) => {
    t.items.forEach((item) => {
      if (item.station === selectedStation) {
        stationItems.push({
          ticketId: t.id,
          orderNumber: t.orderNumber,
          tableNumber: t.tableNumber,
          orderType: t.orderType,
          priority: t.priority,
          elapsedMinutes: t.elapsedMinutes,
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          notes: item.notes || item.specialNotes,
          isCompleted:
            item.status === 'ready' ||
            item.isCompleted === true ||
            item.completed === true,
          allergies: t.allergies || t.allergyAlerts,
        });
      }
    });
  });

  const activeStation = stations.find((s) => s.id === selectedStation) || stations[0];
  const pendingStationItems = stationItems.filter((i) => !i.isCompleted);
  const totalPortions = pendingStationItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const loadPercentage = Math.min(100, Math.round((totalPortions / activeStation.maxCapacity) * 100));

  // Dish summary aggregation (e.g., "3x Tagliolini, 2x Risotto")
  const dishSummaryMap: Record<string, number> = {};
  pendingStationItems.forEach((i) => {
    dishSummaryMap[i.name] = (dishSummaryMap[i.name] || 0) + i.quantity;
  });

  const filteredItems = stationItems.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Station Selector Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stations.map((stn) => {
          // Count active items for this station
          let count = 0;
          activeTickets.forEach((t) => {
            t.items.forEach((item) => {
              if (item.station === stn.id && !(item.isCompleted ?? item.completed)) {
                count += item.quantity;
              }
            });
          });

          const isSelected = selectedStation === stn.id;
          const loadRatio = Math.min(100, Math.round((count / stn.maxCapacity) * 100));

          return (
            <button
              key={stn.id}
              onClick={() => setSelectedStation(stn.id)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? `bg-[#18110c] ${stn.color} shadow-lg ring-1 ring-amber-400/40`
                  : 'border-[#2d221b] bg-[#140f0c] text-[#8f7e73] hover:border-[#4d3a2e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                    {stn.name.split('&')[0]}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      count > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-[#221813] text-[#7a6a5f]'
                    }`}
                  >
                    {count} pans
                  </span>
                </div>
                <p className="text-[11px] line-clamp-1 text-[#8f7e73]">{stn.description}</p>
              </div>

              {/* Mini load bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-[#7a6a5f] mb-1">
                  <span>Load</span>
                  <span>{loadRatio}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#201712]">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      loadRatio > 80 ? 'bg-red-500' : loadRatio > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${loadRatio}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Station Banner */}
      <div className="rounded-2xl border border-[#2d221b] bg-[#140f0c] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#241a14] pb-5 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-serif font-bold text-amber-100">
                {activeStation.name}
              </h2>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-bold text-amber-300">
                {totalPortions} Portions to Fire
              </span>
            </div>
            <p className="text-xs text-[#b8a69b] mt-1 flex items-center gap-2">
              <UserIcon size={12} className="text-amber-400" />
              <span>Station Lead: <strong>{activeStation.leadChef}</strong></span>
              <span>•</span>
              <span>{activeStation.description}</span>
            </p>
          </div>

          {/* Station Capacity Gauge */}
          <div className="flex items-center gap-4 bg-[#19110d] border border-[#3d2f26] rounded-xl p-3">
            <div className="text-right">
              <div className="text-xs text-[#8f7e73]">Station Capacity</div>
              <div className="text-sm font-serif font-bold text-amber-200">
                {totalPortions} / {activeStation.maxCapacity} Max Line Load
              </div>
            </div>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#120d09] border border-amber-500/30">
              <span className="font-mono text-xs font-bold text-amber-300">{loadPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Aggregated Fire List ("All-Day") */}
        {Object.keys(dishSummaryMap).length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <FlameIcon size={14} /> Station All-Day Fire Summary
              </span>
              <span className="text-[11px] text-[#8f7e73]">Batch cooking efficiency total</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(dishSummaryMap).map(([dishName, count]) => (
                <div
                  key={dishName}
                  className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-[#1e1510] px-3 py-1.5 text-xs"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 font-mono font-bold text-[#0c0805] text-xs">
                    {count}
                  </span>
                  <span className="font-medium text-amber-100">{dishName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a5f]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station dishes or ticket #..."
              className="w-full rounded-xl border border-[#2d221b] bg-[#140f0c] pl-8 pr-3 py-2 text-xs text-amber-100 placeholder-[#7a6a5f] focus:border-amber-500/60 focus:outline-none"
            />
          </div>
          <span className="text-xs text-[#8f7e73]">
            Showing {filteredItems.length} active dish tickets
          </span>
        </div>

        {/* Station Dish Cards List */}
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-[#8f7e73] space-y-2">
            <CheckCircleIcon size={28} className="mx-auto text-emerald-400/60" />
            <p className="text-sm font-medium text-amber-100">Station Line is Clear</p>
            <p className="text-xs">No active orders waiting on this line right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={`${item.ticketId}-${item.itemId}`}
                onClick={() => onToggleItemDone(item.ticketId, item.itemId)}
                className={`flex items-start justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
                  item.isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-100/70 opacity-60'
                    : item.priority === 'urgent'
                    ? 'border-red-500/60 bg-red-950/20 text-red-100'
                    : 'border-[#2d221b] bg-[#17110d] text-amber-100 hover:border-[#4d3a2e]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!item.isCompleted}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleItemDone(item.ticketId, item.itemId);
                    }}
                    className="mt-0.5 h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {item.quantity}x {item.name}
                      </span>
                      {item.isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          DONE
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-amber-300 italic mt-0.5">
                        • {item.notes}
                      </p>
                    )}
                    {item.allergies && item.allergies.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-red-400 font-semibold mt-1">
                        <AlertTriangleIcon size={12} />
                        <span>Allergens: {item.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-bold text-amber-300">
                    #{item.orderNumber}
                  </div>
                  <div className="text-[11px] text-[#8f7e73]">
                    {item.orderType === 'dine-in' ? `T-${item.tableNumber}` : 'Delivery'}
                  </div>
                  <div className="text-[10px] text-[#7a6a5f] mt-1 font-mono">
                    {item.elapsedMinutes}m elapsed
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
