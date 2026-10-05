import React from 'react';
import type { CashierBill, CashierShiftSummary } from '../../data/mockRestaurantData';
import {
  BanknoteIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  PrinterIcon,
  QrCodeIcon,
  ReceiptIcon,
  SearchIcon,
  SplitIcon,
  UsersIcon,
} from '../Icons';

interface CashierOverviewViewProps {
  bills: CashierBill[];
  shiftSummary: CashierShiftSummary;
  onSelectBill: (bill: CashierBill) => void;
  onNavigateTab: (tab: string) => void;
  onOpenReceipt: (bill: CashierBill) => void;
  onOpenPayment: (bill: CashierBill) => void;
  onOpenSplit: (bill: CashierBill) => void;
}

export const CashierOverviewView: React.FC<CashierOverviewViewProps> = ({
  bills,
  shiftSummary,
  onSelectBill,
  onNavigateTab,
  onOpenReceipt,
  onOpenPayment,
  onOpenSplit,
}) => {
  const pendingBills = bills.filter((b) => b.status === 'generated' || b.status === 'unbilled');
  const partialBills = bills.filter((b) => b.status === 'partially-paid');

  const pendingAmount = pendingBills.reduce((acc, b) => acc + b.remainingBalance, 0);

  return (
    <div className="space-y-6">
      {/* 5 Executive KPI Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* KPI 1: Gross Sales */}
        <div className="csh-kpi-card col-span-2 lg:col-span-1 border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">Gross Sales</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
              <DollarSignIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-serif font-black text-amber-200">
            ₹{shiftSummary.grossSales.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>{shiftSummary.billsSettledCount} checks closed</span>
          </div>
        </div>

        {/* KPI 2: Cash in Drawer */}
        <div className="csh-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">Cash Drawer</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
              <BanknoteIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-serif font-black text-emerald-300">
            ₹{shiftSummary.cashInDrawerExpected.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#8c7b6d]">
            Float: ₹{shiftSummary.openingFloat.toLocaleString()} • In: ₹{shiftSummary.cashSales.toLocaleString()}
          </div>
        </div>

        {/* KPI 3: UPI / Digital */}
        <div className="csh-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">UPI Collections</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
              <QrCodeIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-serif font-black text-blue-300">
            ₹{shiftSummary.upiSales.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircleIcon size={12} /> Real-time settled
          </div>
        </div>

        {/* KPI 4: Card POS */}
        <div className="csh-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">Card Terminal</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
              <CreditCardIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-serif font-black text-purple-300">
            ₹{shiftSummary.cardSales.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#8c7b6d]">
            Visa / Master / RuPay
          </div>
        </div>

        {/* KPI 5: Pending Check Dues */}
        <div className="csh-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">Open Balances</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
              <ClockIcon size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-serif font-black text-amber-300">
            ₹{pendingAmount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-amber-400/90 font-medium">
            {pendingBills.length + partialBills.length} active tables waiting
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#34271c] bg-[#140f0c] shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ReceiptIcon size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-100 uppercase tracking-wide">
              Cashier Quick Workflows
            </h3>
            <p className="text-[11px] text-[#8c7b6d]">
              Shift: {shiftSummary.shiftName} • Register #{shiftSummary.shiftId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('billing')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2 text-xs font-bold text-[#0c0805] shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <FileTextIcon size={14} />
            <span>Generate / Modify Bill</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('search')}
            className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/40 transition-all"
          >
            <SearchIcon size={14} />
            <span>Search Archive</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('verification')}
            className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/40 transition-all"
          >
            <QrCodeIcon size={14} />
            <span>Verify UPI Webhooks</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('shift')}
            className="flex items-center gap-1.5 rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/40 transition-all"
          >
            <BanknoteIcon size={14} />
            <span>Drawer Float & Z-Report</span>
          </button>
        </div>
      </div>

      {/* Main Section: Active Tables & Orders Needing Settlement */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Active Billing Rail</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                {bills.filter((b) => b.status !== 'voided').length} Orders
              </span>
            </h3>
            <p className="text-xs text-[#8c7b6d]">
              Live tables and takeaway orders ready for check generation, split settlement, or receipt printing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#a89689]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              POS Online
            </span>
          </div>
        </div>

        {/* Bills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bills.map((bill) => {
            const isUnbilled = bill.status === 'unbilled';
            const isGenerated = bill.status === 'generated';
            const isPartial = bill.status === 'partially-paid';
            const isPaid = bill.status === 'paid';
            const isVoided = bill.status === 'voided';

            return (
              <div
                key={bill.id}
                className={`csh-card p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isGenerated ? 'border-amber-500/50 shadow-amber-950/30 shadow-lg' : ''
                } ${isPartial ? 'border-purple-500/50' : ''}`}
              >
                <div>
                  {/* Top Bar with Table and Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#2d221b] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-amber-100">
                          {bill.tableNumber || (bill.orderType === 'delivery' ? 'Online Delivery' : 'Takeaway')}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isUnbilled
                              ? 'csh-status-unbilled'
                              : isGenerated
                              ? 'csh-status-generated'
                              : isPartial
                              ? 'csh-status-partial'
                              : isPaid
                              ? 'csh-status-paid'
                              : 'csh-status-voided'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8c7b6d] mt-1">
                        <span className="font-mono text-amber-300 font-bold">{bill.billNumber}</span>
                        <span>•</span>
                        <span>Server: {bill.serverName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-base font-black text-amber-300">
                        ₹{bill.finalPayable.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-[#8c7b6d] font-mono">{bill.createdAt}</span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  {bill.customerName && (
                    <div className="py-2 flex items-center justify-between text-xs text-[#c9b8ad]">
                      <span className="flex items-center gap-1.5 truncate">
                        <UsersIcon size={12} className="text-[#8c7b6d]" /> {bill.customerName}
                      </span>
                      <span className="text-[#8c7b6d] text-[11px]">{bill.customerPhone}</span>
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="space-y-1.5 py-2.5 text-xs text-[#c9b8ad] border-t border-[#241a12]">
                    <div className="text-[10px] uppercase font-bold text-[#8c7b6d] tracking-wider mb-1">
                      Check Summary ({bill.items.length} items)
                    </div>
                    {bill.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                        <span className="font-mono text-[#e5a962] shrink-0">₹{item.totalPrice}</span>
                      </div>
                    ))}
                    {bill.items.length > 3 && (
                      <div className="text-[11px] text-[#8c7b6d] italic pt-0.5">
                        +{bill.items.length - 3} more dishes...
                      </div>
                    )}
                  </div>

                  {/* Balance / Settlement Progress */}
                  <div className="rounded-xl border border-[#2d221b] bg-[#16100c] p-2.5 mt-2 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#8c7b6d]">Paid: ₹{bill.paidAmount.toLocaleString()}</span>
                      <span className={bill.remainingBalance > 0 ? 'text-amber-300 font-mono font-bold' : 'text-emerald-400 font-bold'}>
                        {bill.remainingBalance > 0 ? `Due: ₹${bill.remainingBalance.toLocaleString()}` : 'Fully Settled'}
                      </span>
                    </div>
                    {bill.isSplit && (
                      <div className="text-[11px] text-purple-300 flex items-center gap-1">
                        <SplitIcon size={12} /> Split Bill Active ({bill.splitShares?.filter(s => s.paymentStatus === 'paid').length} of {bill.splitShares?.length} paid)
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#241a12]">
                  {/* Bill Action */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectBill(bill);
                      onNavigateTab('billing');
                    }}
                    className="rounded-lg border border-[#3d2f26] bg-[#1a1410] py-2 text-center text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/50 transition-all"
                  >
                    {isUnbilled ? 'Generate' : 'Modify'}
                  </button>

                  {/* Payment Action */}
                  <button
                    type="button"
                    disabled={isPaid || isVoided}
                    onClick={() => onOpenPayment(bill)}
                    className={`rounded-lg py-2 text-center text-xs font-bold transition-all ${
                      isPaid || isVoided
                        ? 'opacity-30 bg-[#1a1410] text-[#8c7b6d] cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 text-[#0c0805] shadow-md hover:brightness-110 active:scale-95'
                    }`}
                  >
                    Pay
                  </button>

                  {/* Split Action */}
                  <button
                    type="button"
                    disabled={isPaid || isVoided}
                    onClick={() => onOpenSplit(bill)}
                    className={`rounded-lg border border-[#3d2f26] py-2 text-center text-xs font-semibold transition-all ${
                      isPaid || isVoided
                        ? 'opacity-30 text-[#8c7b6d] cursor-not-allowed bg-[#1a1410]'
                        : 'bg-[#1a1410] text-purple-300 hover:border-purple-500/50 hover:bg-purple-950/20'
                    }`}
                  >
                    Split
                  </button>

                  {/* Receipt Action */}
                  <button
                    type="button"
                    onClick={() => onOpenReceipt(bill)}
                    className="rounded-lg border border-[#3d2f26] bg-[#1a1410] py-2 text-center text-xs font-semibold text-[#c9b8ad] hover:text-amber-300 hover:border-amber-500/50 transition-all flex items-center justify-center gap-1"
                  >
                    <PrinterIcon size={12} />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
