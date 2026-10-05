import React, { useState } from 'react';
import type { CashierBill, CashierRefundRecord } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  LockIcon,
  RotateCcwIcon,
} from '../Icons';

interface RefundManagementViewProps {
  bills: CashierBill[];
  selectedBillForRefund: CashierBill | null;
  onExecuteRefund: (billId: string, refund: CashierRefundRecord) => void;
  onNavigateTab: (tab: string) => void;
}

export const RefundManagementView: React.FC<RefundManagementViewProps> = ({
  bills,
  selectedBillForRefund,
  onExecuteRefund,
  onNavigateTab,
}) => {
  const eligibleBills = bills.filter((b) => b.status !== 'voided');

  const [selectedBillId, setSelectedBillId] = useState<string>(
    selectedBillForRefund?.id || eligibleBills[0]?.id || ''
  );

  const activeBill = bills.find((b) => b.id === selectedBillId) || eligibleBills[0];

  const [refundType, setRefundType] = useState<'full' | 'partial' | 'void'>('full');
  const [partialAmount, setPartialAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('Customer Dissatisfaction / Food Quality Issue');
  const [managerPin, setManagerPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [refundMethod, setRefundMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [refundSuccess, setRefundSuccess] = useState<CashierRefundRecord | null>(null);

  if (!activeBill) {
    return (
      <div className="csh-card p-12 text-center text-[#8c7b6d] space-y-3">
        <RotateCcwIcon size={40} className="mx-auto text-red-500/40" />
        <h3 className="font-serif text-lg font-bold text-amber-100">No Eligible Bills to Refund</h3>
        <p className="text-xs">All existing bills are either already voided or none are available.</p>
      </div>
    );
  }

  const billTotal = activeBill.finalPayable;
  const maxRefundable = activeBill.paidAmount > 0 ? activeBill.paidAmount : billTotal;
  const targetRefundAmount =
    refundType === 'full' || refundType === 'void'
      ? maxRefundable
      : Math.min(maxRefundable, Math.max(0, parseFloat(partialAmount) || 0));

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    // Validate Manager PIN (Mock: allow 1234, 0000, 9999 or any 4 digit pin for demo)
    if (managerPin.length !== 4) {
      setPinError('Please enter a valid 4-digit Manager Override PIN (Demo PIN: 1234).');
      return;
    }

    const creditNoteNum = `CR-NOTE-${activeBill.billNumber.replace('BILL-', '') || '9012'}`;

    const record: CashierRefundRecord = {
      id: `ref-${activeBill.id}-${activeBill.refunds ? activeBill.refunds.length + 1 : 1}`,
      billId: activeBill.id,
      billNumber: activeBill.billNumber,
      tableNumber: activeBill.tableNumber,
      refundType,
      refundAmount: targetRefundAmount,
      reason,
      managerApprovedBy: `Manager Arjun Khanna (PIN: ${managerPin} Verified)`,
      timestamp: activeBill.closedAt || '19:45 PM',
      refundMethod,
      creditNoteNumber: creditNoteNum,
    };

    onExecuteRefund(activeBill.id, record);
    setRefundSuccess(record);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
            <RotateCcwIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Refund & Cancellation Management</span>
              <span className="font-mono text-xs rounded bg-red-500/20 text-red-300 px-2 py-0.5">
                Authorized Override
              </span>
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Issue partial/full customer refunds, void unpaid checks, and generate audited credit note vouchers
            </p>
          </div>
        </div>

        {/* Bill Switcher */}
        <select
          value={selectedBillId}
          onChange={(e) => {
            setSelectedBillId(e.target.value);
            setRefundSuccess(null);
          }}
          className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500 font-medium"
        >
          {eligibleBills.map((b) => (
            <option key={b.id} value={b.id}>
              {b.tableNumber || b.orderType} • #{b.billNumber} (₹{b.finalPayable})
            </option>
          ))}
        </select>
      </div>

      {refundSuccess ? (
        /* Refund Voucher Confirmation Card */
        <div className="csh-card p-6 sm:p-8 text-center space-y-5 border-emerald-500/50 bg-[#121612]">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <CheckCircleIcon size={36} />
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-emerald-200">
              Refund & Credit Note Approved
            </h3>
            <p className="font-mono text-sm text-amber-300 mt-1">
              Voucher #{refundSuccess.creditNoteNumber}
            </p>
            <p className="text-xs text-[#a89689] mt-1">
              {refundSuccess.refundType.toUpperCase()} Refund of ₹{refundSuccess.refundAmount.toLocaleString()} processed via {refundSuccess.refundMethod.toUpperCase()} for Bill #{refundSuccess.billNumber}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl border border-[#3d2f26] bg-[#1a1410] text-xs text-left space-y-1.5 text-[#c9b8ad]">
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Reason:</span>
              <span className="font-semibold text-white">{refundSuccess.reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Authorization:</span>
              <span className="text-emerald-400 font-mono">{refundSuccess.managerApprovedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c7b6d]">Timestamp:</span>
              <span>{refundSuccess.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="rounded-xl bg-amber-500 text-[#0c0805] px-5 py-2.5 text-xs font-bold hover:brightness-110"
            >
              Return to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setRefundSuccess(null)}
              className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2.5 text-xs font-semibold text-[#c9b8ad] hover:text-white"
            >
              Process Another
            </button>
          </div>
        </div>
      ) : (
        /* Refund Form */
        <form onSubmit={handleProcessRefund} className="csh-card p-5 sm:p-6 space-y-5">
          {/* Active Bill Snapshot */}
          <div className="p-4 rounded-xl border border-[#2d221b] bg-[#120d0a] flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-100">
                Target: {activeBill.tableNumber || activeBill.orderType} (#{activeBill.billNumber})
              </span>
              <p className="text-xs text-[#8c7b6d] mt-0.5">
                Customer: {activeBill.customerName || 'Walk-in'} • Server: {activeBill.serverName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#8c7b6d]">Bill Payable / Paid</div>
              <div className="font-mono text-lg font-black text-amber-300">
                ₹{activeBill.finalPayable.toLocaleString()} / ₹{activeBill.paidAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Refund Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
              Action Type
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRefundType('full')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  refundType === 'full'
                    ? 'border-red-500/60 bg-red-950/30 text-red-200'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white'
                }`}
              >
                Full Refund (100%)
              </button>

              <button
                type="button"
                onClick={() => setRefundType('partial')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  refundType === 'partial'
                    ? 'border-amber-500/60 bg-amber-950/30 text-amber-200'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white'
                }`}
              >
                Partial Refund
              </button>

              <button
                type="button"
                onClick={() => setRefundType('void')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  refundType === 'void'
                    ? 'border-purple-500/60 bg-purple-950/30 text-purple-200'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white'
                }`}
              >
                Void Unpaid Check
              </button>
            </div>
          </div>

          {/* Partial Amount Input if selected */}
          {refundType === 'partial' && (
            <div className="p-3.5 rounded-xl border border-[#2d221b] bg-[#16100c] space-y-1">
              <label className="text-xs text-[#c9b8ad]">Enter Custom Partial Refund Amount (Max: ₹{maxRefundable})</label>
              <div className="flex items-center gap-2 font-mono text-base font-bold text-amber-300">
                <span>₹</span>
                <input
                  type="number"
                  min="1"
                  max={maxRefundable}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="0"
                  className="w-40 rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Refund Reason Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#c9b8ad]">Required Cancellation Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Customer Dissatisfaction / Food Quality Issue">Customer Dissatisfaction / Food Quality Issue</option>
              <option value="Wrong Item Prepared by Kitchen">Wrong Item Prepared by Kitchen</option>
              <option value="Server Punching Error / Duplicate Dish">Server Punching Error / Duplicate Dish</option>
              <option value="Emergency Guest Departure / Untouched Order">Emergency Guest Departure / Untouched Order</option>
              <option value="Manager Courtesy Override / Goodwill Waiver">Manager Courtesy Override / Goodwill Waiver</option>
            </select>
          </div>

          {/* Refund Mode Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#c9b8ad]">Refund Payout Method</label>
            <div className="flex gap-2">
              {(['cash', 'upi', 'card'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setRefundMethod(m)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase transition-all border ${
                    refundMethod === m
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                      : 'border-[#34271c] bg-[#1a1410] text-[#a89689]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Manager Security PIN Authorization */}
          <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <LockIcon size={14} />
              <span>Manager Authorization Required</span>
            </div>
            <p className="text-[11px] text-[#b8a69b]">
              All void and refund transactions require manager PIN override to be recorded in the audit log.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="password"
                maxLength={4}
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit PIN (e.g. 1234)"
                className="w-44 rounded-lg border border-red-500/50 bg-[#120d0a] px-3 py-1.5 text-center text-xs font-mono font-bold tracking-widest text-white focus:outline-none focus:border-red-400"
              />
              <span className="text-[11px] text-[#8c7b6d]">(Demo PIN: 1234)</span>
            </div>
            {pinError && <p className="text-xs text-red-400 font-semibold">{pinError}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:brightness-110 active:scale-95 transition-all"
            >
              <RotateCcwIcon size={16} />
              <span>
                Authorize & Process Refund (₹{targetRefundAmount.toLocaleString()})
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
