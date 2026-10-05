import React from 'react';
import './WaiterDashboard.css';
import { ChefHatIcon, ClockIcon, SparklesIcon, CheckCircleIcon, ArrowRightIcon } from '../Icons';
import { type WaiterFloorTable } from '../../data/mockRestaurantData';

interface KitchenOrderTrackingViewProps {
  tables: WaiterFloorTable[];
  onFireNextCourse: (tableNumber: string, nextCourse: 'mains' | 'desserts') => void;
  onOpenModifyOrder: (table: WaiterFloorTable) => void;
}

export const KitchenOrderTrackingView: React.FC<KitchenOrderTrackingViewProps> = ({
  tables,
  onFireNextCourse,
  onOpenModifyOrder,
}) => {
  // Only display tables that have active orders
  const activeOrderTables = tables.filter(
    (t) => (t.status === 'occupied' || t.status === 'waiting' || t.status === 'waiting-for-order') && t.activeOrderDetails
  );

  return (
    <div className="space-y-6">
      {/* KDS Header info */}
      <div className="bg-[#18130e] p-5 rounded-2xl border border-[#34271c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#f5ede4]">
              Kitchen Display System (KDS) Live Monitor
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-700/50">
              {activeOrderTables.length} Tickets on Fire
            </span>
          </div>
          <p className="text-xs text-[#a89687] mt-0.5">
            Monitor real-time hot-line preparation, course sequencing, and kitchen expediter timing.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#a89687]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Queued</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
            <span>Cooking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Plating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Ready at Pass</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {activeOrderTables.length === 0 ? (
        <div className="py-20 text-center bg-[#15120e] rounded-2xl border border-dashed border-[#34271c]">
          <ChefHatIcon className="w-12 h-12 text-[#c9893d] mx-auto mb-3 opacity-60" />
          <h4 className="font-serif text-lg text-[#f5ede4]">All Kitchen Passes Clear</h4>
          <p className="text-xs text-[#8c7b6d] mt-1">
            No active kitchen tickets currently cooking on the pass.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {activeOrderTables.map((table) => {
            const order = table.activeOrderDetails!;
            const stage = (order.courseStage || table.courseProgress || 'mains').toLowerCase();
            const isAppetizers = stage.includes('appetizer') || stage.includes('starter');
            const isMains = stage.includes('main') || stage.includes('entr');
            const isDesserts = stage.includes('dessert');

            return (
              <div
                key={table.id}
                className="bg-[#18130e] border border-[#34271c] hover:border-[#c9893d]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#2d2218]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center font-serif text-base font-bold text-[#c9893d]">
                        {table.tableNumber.replace('Table ', 'T-')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#f5ede4]">
                            Ticket {order.orderId}
                          </span>
                          <span className="text-xs text-[#a89687]">({table.zone})</span>
                        </div>
                        <span className="text-[11px] text-[#8c7b6d]">
                          {table.guestsCount || table.seatedGuests || 2} guests • Server: {table.serverName || table.assignedServer}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#f5ede4] flex items-center gap-1 justify-end">
                        <ClockIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                        {order.elapsedMinutes || 12}m elapsed
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9893d]">
                        Active: {order.courseStage || table.courseProgress || 'Mains'}
                      </span>
                    </div>
                  </div>

                  {/* Course Progress Pipeline */}
                  <div className="py-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#8c7b6d] mb-2 uppercase tracking-wider">
                      <span className={isAppetizers ? 'text-[#c9893d]' : ''}>1. Appetizers</span>
                      <ArrowRightIcon className="w-3 h-3 text-[#443324]" />
                      <span className={isMains ? 'text-[#c9893d]' : ''}>2. Entrées & Mains</span>
                      <ArrowRightIcon className="w-3 h-3 text-[#443324]" />
                      <span className={isDesserts ? 'text-[#c9893d]' : ''}>3. Desserts</span>
                    </div>

                    <div className="w-full h-2 bg-[#251c14] rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isAppetizers
                            ? 'w-1/3 bg-[#c9893d]'
                            : isMains
                            ? 'w-2/3 bg-gradient-to-r from-[#c9893d] to-orange-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Dishes On This Ticket */}
                  <div className="space-y-2 mt-2">
                    <span className="text-xs font-semibold text-[#c9893d] uppercase tracking-wider">
                      Dishes on Line ({order.items.length})
                    </span>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 divide-y divide-[#241a12]">
                      {order.items.map((item, idx) => {
                        const statusColors = {
                          queued: 'bg-blue-400',
                          cooking: 'bg-orange-400 animate-pulse',
                          plating: 'bg-amber-400',
                          ready: 'bg-emerald-400',
                          served: 'bg-zinc-500',
                        };

                        return (
                          <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
                              <span className="text-[#f5ede4] font-medium">
                                {item.quantity}x {item.name}
                              </span>
                              {item.notes && (
                                <span className="text-[10px] text-amber-300 italic bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                                  {item.notes}
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] uppercase font-bold text-[#8c7b6d]">
                              {item.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Firing Controls */}
                <div className="mt-5 pt-3 border-t border-[#2d2218] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenModifyOrder(table)}
                    className="px-3 py-1.5 rounded-lg bg-[#221a13] border border-[#3c2d20] text-xs text-[#a89687] hover:text-[#f5ede4] hover:border-[#c9893d] transition-colors"
                  >
                    Modify Dishes
                  </button>

                  <div className="flex items-center gap-2">
                    {isAppetizers && (
                      <button
                        onClick={() => onFireNextCourse(table.tableNumber, 'mains')}
                        className="px-4 py-1.5 rounded-lg bg-orange-950/60 border border-orange-700/60 text-orange-200 hover:bg-orange-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Fire Entrées to Line
                      </button>
                    )}

                    {isMains && (
                      <button
                        onClick={() => onFireNextCourse(table.tableNumber, 'desserts')}
                        className="px-4 py-1.5 rounded-lg bg-amber-950/60 border border-amber-700/60 text-amber-200 hover:bg-amber-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Fire Desserts & Digestifs
                      </button>
                    )}

                    {isDesserts && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" /> Final Course Fired
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
