import React, { useState } from 'react';
import type { CashierShiftSummary } from '../../data/mockRestaurantData';
import {
  BanknoteIcon,
  CheckCircleIcon,
  CreditCardIcon,
  PrinterIcon,
  QrCodeIcon,
} from '../Icons';

interface DailyShiftSummaryViewProps {
  shiftSummary: CashierShiftSummary;
  onUpdateShiftSummary?: (updated: CashierShiftSummary) => void;
}

export const DailyShiftSummaryView: React.FC<DailyShiftSummaryViewProps> = ({
  shiftSummary,
  onUpdateShiftSummary,
}) => {
  const [actualCashCount, setActualCashCount] = useState<number>(shiftSummary.cashInDrawerActual);
  const [isShiftClosed, setIsShiftClosed] = useState(shiftSummary.status === 'closed');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const variance = actualCashCount - shiftSummary.cashInDrawerExpected;

  const handleReconcile = () => {
    if (onUpdateShiftSummary) {
      onUpdateShiftSummary({
        ...shiftSummary,
        cashInDrawerActual: actualCashCount,
        drawerVariance: variance,
      });
    }
    setToastMsg('Cash drawer balance reconciled and saved in shift log.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCloseShift = () => {
    setIsShiftClosed(true);
    if (onUpdateShiftSummary) {
      onUpdateShiftSummary({
        ...shiftSummary,
        status: 'closed',
        closingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cashInDrawerActual: actualCashCount,
        drawerVariance: variance,
      });
    }
    setToastMsg('Shift closed. Z-Report generated and drawer locked for handover.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePrintZReport = () => {
    setToastMsg('Z-Report dispatched to thermal register printer.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <BanknoteIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Daily Sales & Shift Z-Report</span>
              <span className={`font-mono text-xs rounded px-2 py-0.5 font-bold ${
                isShiftClosed ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isShiftClosed ? 'Shift Closed' : 'Shift Active'}
              </span>
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Shift #{shiftSummary.shiftId} • Cashier: {shiftSummary.cashierName} ({shiftSummary.cashierCode}) • Opened at {shiftSummary.openedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintZReport}
            className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/40 transition-all"
          >
            <PrinterIcon size={14} />
            <span>Print Z-Report</span>
          </button>

          {!isShiftClosed && (
            <button
              type="button"
              onClick={handleCloseShift}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Close Shift & Handover</span>
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
          <CheckCircleIcon size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Cash Drawer Reconciliation Studio */}
      <div className="csh-card p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#2d221b] pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-amber-100">
              Cash Drawer Physical Reconciliation
            </h3>
            <p className="text-xs text-[#8c7b6d]">
              Verify physical currency count against expected register drawer math
            </p>
          </div>
          <div className="text-xs text-[#8c7b6d]">
            Float at open: <strong className="text-amber-200">₹{shiftSummary.openingFloat.toLocaleString()}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. Opening Float */}
          <div className="rounded-xl border border-[#2d221b] bg-[#120d0a] p-4 text-center">
            <span className="text-[11px] font-semibold text-[#8c7b6d] uppercase">Opening Float</span>
            <div className="font-mono text-xl font-bold text-amber-200 mt-1">
              ₹{shiftSummary.openingFloat.toLocaleString()}
            </div>
          </div>

          {/* 2. Cash Collected */}
          <div className="rounded-xl border border-[#2d221b] bg-[#120d0a] p-4 text-center">
            <span className="text-[11px] font-semibold text-[#8c7b6d] uppercase">Cash Sales Collected</span>
            <div className="font-mono text-xl font-bold text-emerald-400 mt-1">
              +₹{shiftSummary.cashSales.toLocaleString()}
            </div>
          </div>

          {/* 3. Expected in Drawer */}
          <div className="rounded-xl border border-[#2d221b] bg-[#120d0a] p-4 text-center">
            <span className="text-[11px] font-semibold text-[#8c7b6d] uppercase">Expected in Drawer</span>
            <div className="font-mono text-xl font-bold text-amber-300 mt-1">
              ₹{shiftSummary.cashInDrawerExpected.toLocaleString()}
            </div>
          </div>

          {/* 4. Physical Count Input */}
          <div className="rounded-xl border border-amber-500/40 bg-[#16100c] p-4 text-center">
            <span className="text-[11px] font-semibold text-amber-300 uppercase">Actual Cash Counted</span>
            <div className="mt-1 flex items-center justify-center gap-1 font-mono text-xl font-bold text-white">
              <span>₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={actualCashCount}
                onChange={(e) => setActualCashCount(parseFloat(e.target.value) || 0)}
                className="w-28 bg-transparent text-center text-white border-b border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Variance Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-[#2d221b] bg-[#16120e]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#c9b8ad]">Reconciliation Variance:</span>
            <span
              className={`font-mono text-sm font-black px-2 py-0.5 rounded ${
                variance === 0
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : variance > 0
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {variance === 0 ? 'Balanced (₹0.00)' : variance > 0 ? `+₹${variance} (Overage)` : `-₹${Math.abs(variance)} (Shortage)`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReconcile}
            className="rounded-xl bg-amber-500 text-[#0c0805] px-4 py-1.5 text-xs font-bold hover:brightness-110"
          >
            Save Reconciliation
          </button>
        </div>
      </div>

      {/* Revenue Breakdown by Tender & Tax Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tender Breakdown */}
        <div className="csh-card p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-amber-100 border-b border-[#2d221b] pb-2">
            Sales by Settlement Channel
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#241a12] bg-[#140f0c]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                  <BanknoteIcon size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-100">Physical Cash</span>
                  <p className="text-[10px] text-[#8c7b6d]">Tendered at register</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-300">
                ₹{shiftSummary.cashSales.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[#241a12] bg-[#140f0c]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                  <QrCodeIcon size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-100">UPI / QR Dynamic</span>
                  <p className="text-[10px] text-[#8c7b6d]">Verified gateway webhooks</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-blue-300">
                ₹{shiftSummary.upiSales.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[#241a12] bg-[#140f0c]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                  <CreditCardIcon size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-100">Card EDC Terminal</span>
                  <p className="text-[10px] text-[#8c7b6d]">Visa, MasterCard, RuPay</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-purple-300">
                ₹{shiftSummary.cardSales.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-amber-500/30 bg-[#16100c] flex justify-between items-baseline">
            <span className="text-xs font-bold text-amber-100 uppercase">Gross Channel Revenue</span>
            <span className="font-mono text-base font-black text-amber-300">₹{shiftSummary.grossSales.toLocaleString()}</span>
          </div>
        </div>

        {/* Tax, Gratuity & Discount Audit */}
        <div className="csh-card p-5 space-y-4">
          <h3 className="font-serif font-bold text-sm text-amber-100 border-b border-[#2d221b] pb-2">
            Tax, Gratuity & Promo Summary
          </h3>

          <div className="space-y-2.5 text-xs text-[#c9b8ad]">
            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>CGST (2.5%) Collected</span>
              <span className="font-mono font-bold text-amber-200">
                ₹{(shiftSummary.totalTaxCollected / 2).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>SGST (2.5%) Collected</span>
              <span className="font-mono font-bold text-amber-200">
                ₹{(shiftSummary.totalTaxCollected / 2).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>Total Service Charge Collected</span>
              <span className="font-mono font-bold text-amber-200">
                ₹{shiftSummary.totalServiceCharge.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>Total Promos & Discounts Absorbed</span>
              <span className="font-mono font-bold text-red-400">
                -₹{shiftSummary.totalDiscountsGiven.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>Total Staff Tips Collected</span>
              <span className="font-mono font-bold text-emerald-400">
                ₹{shiftSummary.totalTipsCollected.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2 rounded-lg bg-[#140f0c]">
              <span>Settled Checks / Voids</span>
              <span className="font-bold text-white">
                {shiftSummary.billsSettledCount} Settled / {shiftSummary.billsVoidedCount} Voided
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
