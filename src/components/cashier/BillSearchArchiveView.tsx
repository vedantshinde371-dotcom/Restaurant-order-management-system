import React, { useState } from 'react';
import type { CashierBill } from '../../data/mockRestaurantData';
import {
  PrinterIcon,
  SearchIcon,
  XIcon,
} from '../Icons';

interface BillSearchArchiveViewProps {
  bills: CashierBill[];
  onOpenReceipt: (bill: CashierBill) => void;
  onSelectBillForEdit: (bill: CashierBill) => void;
  onInitiateRefund: (bill: CashierBill) => void;
}

export const BillSearchArchiveView: React.FC<BillSearchArchiveViewProps> = ({
  bills,
  onOpenReceipt,
  onSelectBillForEdit,
  onInitiateRefund,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'generated' | 'partially-paid' | 'voided'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredBills = bills.filter((bill) => {
    // Search matching
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      bill.billNumber.toLowerCase().includes(q) ||
      bill.orderId.toLowerCase().includes(q) ||
      (bill.tableNumber && bill.tableNumber.toLowerCase().includes(q)) ||
      (bill.customerName && bill.customerName.toLowerCase().includes(q)) ||
      (bill.customerPhone && bill.customerPhone.includes(q)) ||
      bill.serverName.toLowerCase().includes(q);

    // Status matching
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;

    // Method matching
    const matchesMethod =
      methodFilter === 'all' ||
      bill.payments.some((p) => p.method === methodFilter) ||
      (methodFilter === 'split' && bill.isSplit);

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <SearchIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100">
              Order & Bill Search Archive
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Search across historical checks by Bill #, Order ID, Table, Customer Phone or Payment Mode
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#8c7b6d]">
          Total Database Records: <strong className="text-amber-300">{bills.length} Bills</strong>
        </div>
      </div>

      {/* Search & Filters Controls Bar */}
      <div className="csh-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-3.5 top-3 text-[#8c7b6d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bill # (e.g. BILL-8901), Order #, Table 04, Customer Name or Phone..."
              className="w-full rounded-xl border border-[#3d2f26] bg-[#120d0a] pl-10 pr-4 py-2.5 text-xs text-amber-200 placeholder:text-[#6e5d52] focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8c7b6d] hover:text-white"
              >
                <XIcon size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Settled / Paid</option>
            <option value="generated">Open / Generated</option>
            <option value="partially-paid">Partially Paid</option>
            <option value="voided">Voided / Refunded</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Payment Modes</option>
            <option value="upi">UPI / Dynamic QR</option>
            <option value="cash">Cash Tender</option>
            <option value="card">Card Terminal</option>
            <option value="split">Split Payments</option>
          </select>
        </div>
      </div>

      {/* Results Table / Cards */}
      <div className="csh-card overflow-hidden">
        <div className="p-4 border-b border-[#2d221b] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81]">
            Search Results ({filteredBills.length} Matching Checks)
          </span>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-12 text-center text-[#8c7b6d] space-y-2">
            <SearchIcon size={32} className="mx-auto text-amber-500/40" />
            <p className="text-xs">No bills matched your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#2d221b] bg-[#16100c] text-[10px] font-bold uppercase text-[#8c7b6d] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bill & Order #</th>
                  <th className="py-3 px-4">Table / Destination</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Time & Server</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Settlement Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#241a12]">
                {filteredBills.map((b) => {
                  const isVoid = b.status === 'voided';

                  return (
                    <tr key={b.id} className="hover:bg-[#1a130e] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-amber-300">{b.billNumber}</div>
                        <div className="text-[11px] text-[#8c7b6d]">Order: {b.orderId}</div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-amber-100">
                        {b.tableNumber || b.orderType}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[#c9b8ad]">{b.customerName || 'Walk-in'}</div>
                        <div className="text-[10px] text-[#8c7b6d]">{b.customerPhone || ''}</div>
                      </td>

                      <td className="py-3 px-4 text-[#8c7b6d]">
                        <div>{b.createdAt} {b.closedAt ? `(Closed: ${b.closedAt})` : ''}</div>
                        <div className="text-[11px] text-[#a89689]">Server: {b.serverName}</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-200">
                        ₹{b.finalPayable.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'paid'
                              ? 'csh-status-paid'
                              : b.status === 'voided'
                              ? 'csh-status-voided'
                              : b.status === 'partially-paid'
                              ? 'csh-status-partial'
                              : 'csh-status-generated'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenReceipt(b)}
                            className="p-1.5 rounded-lg border border-[#3d2f26] bg-[#1a1410] text-[#c9b8ad] hover:text-amber-300 hover:border-amber-500/40"
                            title="Print Thermal Receipt"
                          >
                            <PrinterIcon size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectBillForEdit(b)}
                            className="px-2.5 py-1 rounded-lg border border-[#3d2f26] bg-[#1a1410] text-xs font-semibold text-[#c9b8ad] hover:text-white"
                          >
                            View
                          </button>

                          {!isVoid && (
                            <button
                              type="button"
                              onClick={() => onInitiateRefund(b)}
                              className="px-2 py-1 rounded-lg border border-red-500/30 bg-red-950/20 text-xs font-semibold text-red-300 hover:bg-red-950/40"
                              title="Void or Refund Check"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
