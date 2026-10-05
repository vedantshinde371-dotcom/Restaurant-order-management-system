import React from 'react';
import './WaiterDashboard.css';
import { XIcon, AwardIcon, StarIcon, DollarSignIcon, UsersIcon, ClockIcon, SparklesIcon } from '../Icons';
import { type WaiterStaffProfile } from '../../data/mockRestaurantData';

interface WaiterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WaiterStaffProfile;
  onSwitchToCustomerPortal?: () => void;
}

export const WaiterProfileModal: React.FC<WaiterProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSwitchToCustomerPortal: _onSwitchToCustomerPortal,
}) => {
  if (!isOpen) return null;

  const ratingVal = profile.rating || profile.serviceRating || 4.96;
  const shiftStartTime = profile.shiftStart || profile.shift || '17:00 PM';
  const tablesTurnedVal = profile.tablesTurned || profile.tablesServedToday || 14;
  const salesVal = profile.totalSalesToday || profile.shiftSales || 72400;
  const tipsVal = profile.tipsEarnedToday || profile.shiftTips || 8250;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8] flex flex-col">
        {/* Header with profile banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#2a1c12] via-[#20150d] to-[#16120e] border-b border-[#34271c]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#c9893d]/20 border-2 border-[#c9893d] flex items-center justify-center text-[#c9893d] font-serif text-2xl font-bold shadow-lg">
                MV
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#16120e]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#f5ede4]">{profile.name}</h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-[#c9893d]/20 text-[#e5a962] border border-[#c9893d]/30">
                  {profile.badge || profile.role}
                </span>
              </div>
              <p className="text-xs text-[#a89687] mt-0.5">
                Staff ID: {profile.id} • Section: <strong className="text-[#f5ede4]">{profile.station}</strong>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
                <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{ratingVal} / 5.0</span>
                <span className="text-[#8c7b6d]">(142 Guest reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shift Performance KPI Cards */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c9893d] mb-3">
              Tonight's Service Shift Metrics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c7b6d] mb-1">
                  <ClockIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                  <span>Shift Started</span>
                </div>
                <div className="font-serif text-base font-bold text-[#f5ede4]">{shiftStartTime}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Active on floor</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c7b6d] mb-1">
                  <UsersIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                  <span>Tables Closed</span>
                </div>
                <div className="font-serif text-base font-bold text-[#f5ede4]">
                  {tablesTurnedVal} tables
                </div>
                <div className="text-[10px] text-[#a89687] mt-0.5">Avg 48 min / turn</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c7b6d] mb-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                  <span>Station Turnover</span>
                </div>
                <div className="font-serif text-base font-bold text-[#f5ede4]">94% On-Time</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Exceeds pacing goal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c] sm:col-span-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#8c7b6d] mb-1">
                  <DollarSignIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                  <span>Gross Shift Sales</span>
                </div>
                <div className="font-serif text-lg font-bold text-[#f5ede4]">
                  ₹{salesVal.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#a89687] mt-0.5">Rank #1 Server tonight</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#c9893d]/40 sm:col-span-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#8c7b6d] mb-1">
                  <AwardIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[#e5a962] font-semibold">Personal Tips Logged</span>
                </div>
                <div className="font-serif text-lg font-bold text-amber-300">
                  ₹{tipsVal.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Settled to your staff payroll</div>
              </div>
            </div>
          </div>

          {/* Quick Staff Accreditations */}
          <div className="p-3.5 rounded-xl bg-[#1a140f] border border-[#34271c] space-y-2">
            <span className="text-xs font-semibold text-[#c9893d] uppercase tracking-wider block">
              Sommelier & Service Credentials
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#251b13] border border-[#3f2e21] text-[#e8dfd8]">
                🍷 WSET Level 2 Award in Wines
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#251b13] border border-[#3f2e21] text-[#e8dfd8]">
                ⭐ Forbes Hospitality Certified
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#251b13] border border-[#3f2e21] text-[#e8dfd8]">
                🔥 Fire & Allergy Safety Lead
              </span>
            </div>
          </div>
        </div>

        {/* Footer with dismiss */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140e] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c9893d] text-[#140f0c] text-xs font-bold hover:bg-[#e5a962] transition-colors"
          >
            Return to Floor
          </button>
        </div>
      </div>
    </div>
  );
};
