import React, { useState } from 'react';
import type { KitchenStaffProfile } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  ChefHatIcon,
  ClockIcon,
  LayersIcon,
  SettingsIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from '../Icons';

interface KitchenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: KitchenStaffProfile;
  onUpdateProfile: (newProfile: KitchenStaffProfile) => void;
  onNavigateToView?: (view: string) => void;
  embedded?: boolean;
}

export const KitchenProfileModal: React.FC<KitchenProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onNavigateToView: _onNavigateToView,
  embedded = false,
}) => {
  const [formData, setFormData] = useState<KitchenStaffProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (!embedded) {
        onClose();
      }
    }, 800);
  };

  const modalBody = (
    <div className={`kds-modal-card ${embedded ? 'max-w-4xl mx-auto w-full' : 'max-w-xl max-h-[90vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d221b] p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ChefHatIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">
                Kitchen Staff & KDS Preferences
              </h2>
              <p className="text-xs text-[#b8a69b]">
                Active shift credentials, kitchen pass settings and performance telemetry
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

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Chef Badge Card */}
          <div className="flex items-center gap-4 rounded-xl border border-[#3d2f26] bg-gradient-to-r from-[#1c140f] to-[#140f0c] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif text-xl font-bold">
              AL
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-amber-100">{formData.name}</h3>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  {formData.role}
                </span>
              </div>
              <p className="text-xs text-[#a89689]">
                Station Pass: <span className="text-amber-200 capitalize font-medium">{formData.station}</span> • Staff Code: #{formData.staffCode}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#8f7e73] mt-1">
                <span className="flex items-center gap-1">
                  <ClockIcon size={12} /> Shift: {formData.shift}
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Active on Pass
                </span>
              </div>
            </div>
          </div>

          {/* Shift Telemetry KPIs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
              Live Shift Performance (Today)
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-center">
                <div className="text-lg font-serif font-bold text-amber-200">{formData.metrics.completedToday}</div>
                <div className="text-[10px] text-[#8f7e73] uppercase tracking-wider mt-0.5">Tickets Cleared</div>
              </div>
              <div className="rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-center">
                <div className="text-lg font-serif font-bold text-emerald-400">{formData.metrics.avgPrepTimeMinutes}m</div>
                <div className="text-[10px] text-[#8f7e73] uppercase tracking-wider mt-0.5">Avg Ticket Pace</div>
              </div>
              <div className="rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-center">
                <div className="text-lg font-serif font-bold text-amber-300">{formData.metrics.onTimeRate}%</div>
                <div className="text-[10px] text-[#8f7e73] uppercase tracking-wider mt-0.5">On-Time Line Rate</div>
              </div>
              <div className="rounded-xl border border-[#2d221b] bg-[#140f0c] p-3 text-center">
                <div className="text-lg font-serif font-bold text-cyan-400">{formData.metrics.rushHandled}</div>
                <div className="text-[10px] text-[#8f7e73] uppercase tracking-wider mt-0.5">VIP Rushes Fire</div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
              KDS Display & Sound Settings
            </label>

            {/* Sound chime toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#2d221b] bg-[#140f0c]">
              <div className="flex items-center gap-3">
                {formData.soundAlerts ? (
                  <Volume2Icon size={18} className="text-amber-400" />
                ) : (
                  <VolumeXIcon size={18} className="text-[#7a6a5f]" />
                )}
                <div>
                  <span className="text-xs font-medium text-amber-100">Audible New Ticket Chime</span>
                  <p className="text-[11px] text-[#8f7e73]">Play alert sound when POS sends new order or urgent bump</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.soundAlerts}
                onChange={(e) => setFormData({ ...formData, soundAlerts: e.target.checked })}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Auto bump urgent toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#2d221b] bg-[#140f0c]">
              <div className="flex items-center gap-3">
                <LayersIcon size={18} className="text-amber-400" />
                <div>
                  <span className="text-xs font-medium text-amber-100">Auto-Highlight Urgent & VIP Tickets</span>
                  <p className="text-[11px] text-[#8f7e73]">Pin rush orders with pulsing amber border at head of queue</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoBumpUrgent}
                onChange={(e) => setFormData({ ...formData, autoBumpUrgent: e.target.checked })}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Display mode */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#2d221b] bg-[#140f0c]">
              <div>
                <span className="text-xs font-medium text-amber-100">Default Display Board Layout</span>
                <p className="text-[11px] text-[#8f7e73]">Choose default visual ticket matrix</p>
              </div>
              <select
                value={formData.displayMode}
                onChange={(e) => setFormData({ ...formData, displayMode: e.target.value as 'kanban' | 'grid' | 'compact' })}
                className="rounded-lg border border-[#3d2f26] bg-[#1a1410] px-2.5 py-1 text-xs text-amber-200 focus:outline-none"
              >
                <option value="kanban">Kanban Workflow</option>
                <option value="grid">Grid Rails</option>
                <option value="compact">Compact Pass Line</option>
              </select>
            </div>
          </div>


          {/* Footer Save button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
            >
              Cancel
            </button>
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
    return <div className="w-full">{modalBody}</div>;
  }

  return <div className="kds-modal-overlay">{modalBody}</div>;
};
