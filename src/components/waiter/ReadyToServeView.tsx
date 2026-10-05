import React from 'react';
import './WaiterDashboard.css';
import { CheckCheckIcon, ClockIcon, CheckCircleIcon } from '../Icons';
import { type ReadyToServeDish } from '../../data/mockRestaurantData';

interface ReadyToServeViewProps {
  dishes: ReadyToServeDish[];
  onMarkDishServed: (id: string) => void;
  onMarkAllTableDishesServed: (tableNumber: string) => void;
}

export const ReadyToServeView: React.FC<ReadyToServeViewProps> = ({
  dishes,
  onMarkDishServed,
  onMarkAllTableDishesServed,
}) => {
  // Group dishes by table number for easy tray loading
  const tablesMap = dishes.reduce((acc, dish) => {
    if (!acc[dish.tableNumber]) {
      acc[dish.tableNumber] = [];
    }
    acc[dish.tableNumber].push(dish);
    return acc;
  }, {} as Record<string, ReadyToServeDish[]>);

  const tableKeys = Object.keys(tablesMap);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18130e] p-5 rounded-2xl border border-[#34271c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#f5ede4]">
              Expediter Pickup Pass & Heat Lamps
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 animate-pulse">
              {dishes.length} Dishes Plated & Hot
            </span>
          </div>
          <p className="text-xs text-[#a89687] mt-0.5">
            Plates ready on the kitchen pass. Inspect presentation, check table numbers, and run dishes immediately.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#201710] px-3 py-1.5 rounded-xl border border-[#3c2c1f] text-xs text-[#e5a962]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Heat Lamp Station #1: 65°C Optimal</span>
          </div>
        </div>
      </div>

      {/* Dishes Grouped by Table */}
      {dishes.length === 0 ? (
        <div className="py-20 text-center bg-[#15120e] rounded-2xl border border-dashed border-[#34271c]">
          <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-70" />
          <h4 className="font-serif text-lg text-[#f5ede4]">Pass Window Clear</h4>
          <p className="text-xs text-[#8c7b6d] mt-1">
            All plated dishes have been served to guests. No items waiting on the heating pass.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tableKeys.map((tableNum) => {
            const tableDishes = tablesMap[tableNum];
            const firstDish = tableDishes[0];

            return (
              <div
                key={tableNum}
                className="bg-[#18130e] border border-amber-600/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Table Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#2d2218]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/50 flex items-center justify-center font-serif text-base font-bold text-amber-300">
                        {tableNum.replace('Table ', 'T-')}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#f5ede4]">
                          {tableNum}
                        </div>
                        <div className="text-[11px] text-[#8c7b6d]">
                          {firstDish.zone || 'Dining Floor'} • Runner: {firstDish.waiterName || firstDish.serverAssigned}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onMarkAllTableDishesServed(tableNum)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-600 hover:text-emerald-950 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCheckIcon className="w-3.5 h-3.5" />
                      Serve Entire Tray
                    </button>
                  </div>

                  {/* List of plated dishes */}
                  <div className="space-y-3 my-4">
                    {tableDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-3 rounded-xl bg-[#1d1611] border border-[#34271c] hover:border-amber-600/50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs text-[#f5ede4]">
                              {dish.quantity}x {dish.dishName}
                            </span>
                            {dish.course && (
                              <span className="text-[10px] text-amber-400 capitalize px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                                {dish.course}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[#8c7b6d] mt-1">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 text-[#c9893d]" />
                              Plated {dish.platedTime}
                            </span>
                            {dish.specialNotes && (
                              <span className="text-amber-300 italic">
                                • {dish.specialNotes}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onMarkDishServed(dish.id)}
                          className="px-2.5 py-1 rounded bg-[#c9893d]/20 text-[#c9893d] hover:bg-[#c9893d] hover:text-[#140f0c] text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                        >
                          <CheckCheckIcon className="w-3.5 h-3.5" />
                          Served
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-[#8c7b6d]">
                  Verify table runner coaster before placing dish
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
