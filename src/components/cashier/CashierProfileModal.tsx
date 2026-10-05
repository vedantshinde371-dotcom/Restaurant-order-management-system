import React, { useState } from 'react';
import type { CashierProfile } from '../../data/mockRestaurantData';
import {
  CashierIcon,
  CheckCircleIcon,
  ClockIcon,
  SettingsIcon,
  XIcon,
} from '../Icons';

interface CashierProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CashierProfile;
  onUpdateProfile: (newProfile: CashierProfile) => void;
  onNavigateToView?: (view: string) => void;
  embedded?: boolean;
}

export const CashierProfileModal: React.FC<CashierProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onNavigateToView: _onNavigateToView,
  embedded = false,
}) => {
  const [formData, setFormData] = useState<CashierProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (!embedded) onClose();
    }, 800);
  };

  const cardContent = (
    <div className={`csh-modal-card ${embedded ? 'max-w-4xl mx-auto w-full' : 'max-w-xl max-h-[90vh]'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d221b] p-4 sm:p-5 shrink-0 bg-[#16100c]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <CashierIcon size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100">
              Cashier Profile & POS Settings
            </h2>
            <p className="text-xs text-[#a89689]">
              Shift credentials, cash drawer float, tax configurations, and receipt header customization
            </p>
          </div>
        </div>
        {!embedded && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#a89689] hover:text-white"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0e0a08]">
        {/* Cashier Badge */}
        <div className="flex items-center gap-4 rounded-xl border border-[#3d2f26] bg-gradient-to-r from-[#1c140e] to-[#140f0c] p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif text-xl font-bold">
            PS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-amber-100 truncate">{formData.name}</h3>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider shrink-0">
                Staff #{formData.staffCode}
              </span>
            </div>
            <p className="text-xs text-[#a89689]">{formData.role}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#8f7e73] mt-1">
              <span className="flex items-center gap-1">
                <ClockIcon size={12} /> {formData.shift}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Terminal: {formData.posTerminalId}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Cash Drawer Float */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
            Cash Drawer Configuration
          </label>
          <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#140f0c] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-100">Opening Cash Float</span>
                <p className="text-[11px] text-[#8f7e73]">Cash balance placed in drawer at shift start for giving change</p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-300">
                <span>₹</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.drawerOpeningFloat}
                  onChange={(e) =>
                    setFormData({ ...formData, drawerOpeningFloat: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-28 rounded-lg border border-[#3d2f26] bg-[#1a1410] px-2.5 py-1 text-right text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Tax & Billing Rules */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
            Tax & Service Charge Settings
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#140f0c] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-100">Default Service Charge</span>
                <span className="font-mono text-xs text-amber-300 font-bold">{formData.serviceChargePercent}%</span>
              </div>
              <p className="text-[11px] text-[#8f7e73]">Applied to dine-in orders (can be waived on checkout)</p>
              <div className="pt-2 flex gap-1.5">
                {[0, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceChargePercent: pct })}
                    className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all ${
                      formData.serviceChargePercent === pct
                        ? 'bg-amber-500 text-[#0c0805]'
                        : 'bg-[#1a1410] text-[#a89689] border border-[#34271c] hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#140f0c] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-100">GST Breakdown Rate</span>
                <span className="font-mono text-xs text-amber-300 font-bold">5% (2.5% CGST + 2.5% SGST)</span>
              </div>
              <p className="text-[11px] text-[#8f7e73]">Statutory restaurant tax compliance</p>
              <div className="pt-2 flex items-center justify-between text-xs text-[#c9b8ad]">
                <span>Enable Bill Round-off to Nearest ₹</span>
                <input
                  type="checkbox"
                  checked={formData.enableRoundOff}
                  onChange={(e) => setFormData({ ...formData, enableRoundOff: e.target.checked })}
                  className="rounded accent-amber-500 h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Receipt Branding & Print Preferences */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
            Thermal Receipt Customization
          </label>
          <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#140f0c] space-y-3">
            <div>
              <label className="text-[11px] text-[#8f7e73]">Restaurant Name on Receipt</label>
              <input
                type="text"
                value={formData.receiptRestaurantName}
                onChange={(e) => setFormData({ ...formData, receiptRestaurantName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-[#8f7e73]">GSTIN Number</label>
                <input
                  type="text"
                  value={formData.receiptGstin}
                  onChange={(e) => setFormData({ ...formData, receiptGstin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8f7e73]">FSSAI License</label>
                <input
                  type="text"
                  value={formData.receiptFssai}
                  onChange={(e) => setFormData({ ...formData, receiptFssai: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[#8f7e73]">Footer Greeting Message</label>
              <input
                type="text"
                value={formData.receiptFooterMessage}
                onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>


        {/* Footer Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 text-xs font-bold text-[#0c0805] shadow-lg shadow-amber-900/30 hover:brightness-110 active:scale-95 transition-all"
          >
            {saveSuccess ? (
              <>
                <CheckCircleIcon size={14} /> Saved
              </>
            ) : (
              <>
                <SettingsIcon size={14} /> Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (embedded) {
    return <div className="w-full">{cardContent}</div>;
  }

  return <div className="csh-modal-overlay">{cardContent}</div>;
};
