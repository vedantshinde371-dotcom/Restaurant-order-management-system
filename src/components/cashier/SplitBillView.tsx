import React, { useState } from 'react';
import type { CashierBill, CashierSplitShare } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  SplitIcon,
  UsersIcon,
} from '../Icons';

interface SplitBillViewProps {
  bill: CashierBill | null;
  onUpdateSplitBill: (updatedBill: CashierBill) => void;
  onNavigateTab: (tab: string) => void;
  onOpenReceipt: (bill: CashierBill) => void;
}

interface SplitBillEditorContentProps {
  bill: CashierBill;
  onUpdateSplitBill: (updatedBill: CashierBill) => void;
  onNavigateTab: (tab: string) => void;
  onOpenReceipt: (bill: CashierBill) => void;
}

const SplitBillEditorContent: React.FC<SplitBillEditorContentProps> = ({
  bill,
  onUpdateSplitBill,
  onNavigateTab,
  onOpenReceipt,
}) => {
  const [guestCount, setGuestCount] = useState<number>(2);

  // Generate split shares based on guestCount
  const total = bill.finalPayable;
  const equalAmount = Math.ceil(total / guestCount);

  // Initialize or use existing split shares
  const initialShares: CashierSplitShare[] = bill.splitShares && bill.splitShares.length > 0
    ? bill.splitShares
    : Array.from({ length: guestCount }, (_, i) => ({
        id: `split-${i + 1}`,
        personLabel: `Guest ${i + 1}`,
        subtotal: Math.round(bill.subtotal / guestCount),
        discount: Math.round(bill.discountAmount / guestCount),
        serviceCharge: Math.round(bill.serviceChargeAmount / guestCount),
        tax: Math.round((bill.cgstAmount + bill.sgstAmount) / guestCount),
        amount: equalAmount,
        paymentStatus: 'pending',
      }));

  const [shares, setShares] = useState<CashierSplitShare[]>(initialShares);

  const handleUpdateGuestCount = (delta: number) => {
    const newCount = Math.max(2, Math.min(8, guestCount + delta));
    setGuestCount(newCount);
    const newEq = Math.ceil(total / newCount);

    setShares(
      Array.from({ length: newCount }, (_, i) => ({
        id: `split-${i + 1}`,
        personLabel: `Guest ${i + 1}`,
        subtotal: Math.round(bill.subtotal / newCount),
        discount: Math.round(bill.discountAmount / newCount),
        serviceCharge: Math.round(bill.serviceChargeAmount / newCount),
        tax: Math.round((bill.cgstAmount + bill.sgstAmount) / newCount),
        amount: newEq,
        paymentStatus: 'pending',
      }))
    );
  };

  const handleMarkSharePaid = (shareId: string, payMethod: 'cash' | 'upi' | 'card') => {
    const updatedShares = shares.map((s) => {
      if (s.id === shareId) {
        return {
          ...s,
          paymentStatus: 'paid' as const,
          paymentMethod: payMethod,
          paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentRef: `${payMethod.toUpperCase()}/SPLIT-${Math.floor(1000 + Math.random() * 9000)}`,
        };
      }
      return s;
    });

    setShares(updatedShares);

    const paidTotal = updatedShares
      .filter((s) => s.paymentStatus === 'paid')
      .reduce((acc, s) => acc + s.amount, 0);

    const remainingBal = Math.max(0, total - paidTotal);

    const updatedBill: CashierBill = {
      ...bill,
      isSplit: true,
      splitType: 'equal',
      splitShares: updatedShares,
      paidAmount: paidTotal,
      remainingBalance: remainingBal,
      status: remainingBal === 0 ? 'paid' : 'partially-paid',
    };

    onUpdateSplitBill(updatedBill);
  };

  const paidSharesCount = shares.filter((s) => s.paymentStatus === 'paid').length;
  const totalPaid = shares.filter((s) => s.paymentStatus === 'paid').reduce((acc, s) => acc + s.amount, 0);
  const remainingDue = Math.max(0, total - totalPaid);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <SplitIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Split Bill Studio</span>
              <span className="font-mono text-xs rounded bg-purple-500/20 text-purple-300 px-2 py-0.5 font-bold">
                {bill.tableNumber || bill.orderType}
              </span>
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Divide check equally or customize guest shares with independent multi-tender settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#8c7b6d]">Total Check Value</div>
            <div className="font-mono text-2xl font-black text-amber-300">
              ₹{total.toLocaleString()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('billing')}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white transition-all"
          >
            Back to Bill
          </button>
        </div>
      </div>

      {/* Split Mode Selector & Party Counter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Guest Count Card */}
        <div className="md:col-span-4 csh-card p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-amber-100 border-b border-[#2d221b] pb-2">
            Split Settings
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-[#c9b8ad]">Number of Guests in Party</label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#2d221b] bg-[#16100c]">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-100">
                <UsersIcon size={16} className="text-amber-400" />
                <span>{guestCount} Persons</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateGuestCount(-1)}
                  disabled={guestCount <= 2}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#221812] text-[#c9b8ad] disabled:opacity-30 hover:text-white"
                >
                  <MinusIcon size={14} />
                </button>
                <span className="font-mono text-sm font-bold text-amber-300 w-6 text-center">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateGuestCount(1)}
                  disabled={guestCount >= 8}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#221812] text-[#c9b8ad] disabled:opacity-30 hover:text-white"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Equal amount calculation */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-center space-y-1">
            <span className="text-[11px] uppercase font-bold text-purple-300">Each Person's Share</span>
            <div className="font-mono text-2xl font-black text-purple-200">
              ₹{equalAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#8c7b6d]">Taxes & service charge pro-rated</span>
          </div>

          {/* Overall Settlement Progress */}
          <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#120d0a] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Settled Shares:</span>
              <span className="font-bold text-emerald-400">{paidSharesCount} of {shares.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Total Collected:</span>
              <span className="font-mono font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Remaining Due:</span>
              <span className="font-mono font-bold text-amber-300">₹{remainingDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Guest Shares List (8 cols) */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-amber-100">
              Individual Guest Portions ({shares.length} Shares)
            </h3>
            <span className="text-xs text-[#8c7b6d]">Settle each share independently</span>
          </div>

          <div className="space-y-3">
            {shares.map((share) => {
              const isPaid = share.paymentStatus === 'paid';

              return (
                <div
                  key={share.id}
                  className={`csh-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isPaid ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-[#2d221b]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-amber-100">{share.personLabel}</span>
                      <span
                        className={`rounded px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                          isPaid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isPaid ? 'Settled' : 'Pending'}
                      </span>
                    </div>

                    <div className="text-xs text-[#8c7b6d]">
                      Subtotal: ₹{share.subtotal} • Tax & Service: ₹{share.tax + share.serviceCharge}
                    </div>

                    {isPaid && share.paymentRef && (
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Ref: {share.paymentRef} ({share.paymentMethod?.toUpperCase()}) at {share.paidAt}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#241a12]">
                    <div className="font-mono text-lg font-bold text-amber-300">
                      ₹{share.amount.toLocaleString()}
                    </div>

                    {!isPaid ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMarkSharePaid(share.id, 'upi')}
                          className="rounded-lg border border-blue-500/40 bg-blue-950/30 px-2.5 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-950/50"
                        >
                          UPI
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkSharePaid(share.id, 'cash')}
                          className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-950/50"
                        >
                          Cash
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkSharePaid(share.id, 'card')}
                          className="rounded-lg border border-purple-500/40 bg-purple-950/30 px-2.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-950/50"
                        >
                          Card
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
                        <CheckCircleIcon size={14} /> Paid
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {remainingDue === 0 && (
            <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/30 flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <CheckCircleIcon size={16} />
                <span>All {shares.length} split shares have been fully settled!</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenReceipt(bill)}
                className="rounded-xl bg-amber-500 text-[#0c0805] px-4 py-2 text-xs font-bold hover:brightness-110"
              >
                Print Final Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SplitBillView: React.FC<SplitBillViewProps> = ({
  bill,
  onUpdateSplitBill,
  onNavigateTab,
  onOpenReceipt,
}) => {
  if (!bill) {
    return (
      <div className="csh-card p-12 text-center text-[#8c7b6d] space-y-3">
        <SplitIcon size={40} className="mx-auto text-purple-500/40" />
        <h3 className="font-serif text-lg font-bold text-amber-100">No Bill Selected for Splitting</h3>
        <p className="text-xs">Select an active table or check from the dashboard to configure split payments.</p>
        <button
          type="button"
          onClick={() => onNavigateTab('dashboard')}
          className="rounded-xl bg-amber-500 text-[#0c0805] px-4 py-2 text-xs font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <SplitBillEditorContent
      key={bill.id}
      bill={bill}
      onUpdateSplitBill={onUpdateSplitBill}
      onNavigateTab={onNavigateTab}
      onOpenReceipt={onOpenReceipt}
    />
  );
};
