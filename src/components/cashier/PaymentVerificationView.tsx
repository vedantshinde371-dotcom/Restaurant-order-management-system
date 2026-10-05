import React, { useState } from 'react';
import type { CashierBill } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  CreditCardIcon,
  QrCodeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from '../Icons';

interface VerificationTransaction {
  id: string;
  billNumber: string;
  orderNumber: string;
  tableNumber: string;
  amount: number;
  payerName: string;
  vpaOrCard: string;
  referenceId: string;
  method: 'UPI' | 'Card';
  status: 'pending' | 'verified' | 'flagged';
  timestamp: string;
}

const INITIAL_QUEUE: VerificationTransaction[] = [
  {
    id: 'tx-01',
    billNumber: 'BILL-8902',
    orderNumber: 'SAV-1084',
    tableNumber: 'Table 07',
    amount: 5778,
    payerName: 'Ananya Deshmukh',
    vpaOrCard: 'ananya@hdfcbank',
    referenceId: 'UPI/984210492811',
    method: 'UPI',
    status: 'verified',
    timestamp: '20:10',
  },
  {
    id: 'tx-02',
    billNumber: 'BILL-8901',
    orderNumber: 'SAV-4190',
    tableNumber: 'Table 04',
    amount: 9328,
    payerName: 'Vikramaditya Roy',
    vpaOrCard: 'vroy@icici',
    referenceId: 'UPI/392019482910',
    method: 'UPI',
    status: 'pending',
    timestamp: '20:16',
  },
  {
    id: 'tx-03',
    billNumber: 'BILL-8899',
    orderNumber: 'SAV-8401',
    tableNumber: 'Table 02',
    amount: 12296,
    payerName: 'Dr. Siddharth Mehta',
    vpaOrCard: 'Visa ****4829',
    referenceId: 'AUTH-99214',
    method: 'Card',
    status: 'verified',
    timestamp: '20:05',
  },
  {
    id: 'tx-04',
    billNumber: 'BILL-8903',
    orderNumber: 'SAV-7080',
    tableNumber: 'Online Delivery',
    amount: 3162,
    payerName: 'Kavita Patel',
    vpaOrCard: 'kpatel@okaxis',
    referenceId: 'UPI/772910394012',
    method: 'UPI',
    status: 'pending',
    timestamp: '20:31',
  },
];

interface PaymentVerificationViewProps {
  bills: CashierBill[];
  onConfirmVerification?: (billNumber: string) => void;
}

export const PaymentVerificationView: React.FC<PaymentVerificationViewProps> = ({
  bills: _bills,
  onConfirmVerification,
}) => {
  const [queue, setQueue] = useState<VerificationTransaction[]>(INITIAL_QUEUE);
  const [pollingId, setPollingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleQueryGateway = (txId: string) => {
    setPollingId(txId);
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: 'verified' } : t))
      );
      setPollingId(null);
      const target = queue.find((t) => t.id === txId);
      if (target) {
        setNotification(`Gateway response 200 OK: ${target.referenceId} confirmed verified.`);
        if (onConfirmVerification) onConfirmVerification(target.billNumber);
      }
      setTimeout(() => setNotification(null), 3000);
    }, 1000);
  };

  const handleFlagDiscrepancy = (txId: string) => {
    setQueue((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'flagged' } : t))
    );
    setNotification('Transaction flagged for manual cashier & waiter verification.');
    setTimeout(() => setNotification(null), 3000);
  };

  const pendingCount = queue.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <QrCodeIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Electronic Payment Verification Queue</span>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-[#0c0805]">
                  {pendingCount} Pending Gateway Confirmation
                </span>
              )}
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Real-time UPI dynamic webhooks, UTR ref inquiries, and card EDC terminal reconciliation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <ShieldCheckIcon size={15} />
          <span>Gateway Webhook: Online & Syncing</span>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
          <CheckCircleIcon size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Queue Cards */}
      <div className="space-y-3">
        {queue.map((tx) => {
          const isPending = tx.status === 'pending';
          const isVerified = tx.status === 'verified';
          const isFlagged = tx.status === 'flagged';
          const isQuerying = pollingId === tx.id;

          return (
            <div
              key={tx.id}
              className={`csh-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isPending
                  ? 'border-amber-500/40 bg-gradient-to-r from-[#1c1510] to-[#140f0c]'
                  : isFlagged
                  ? 'border-red-500/50 bg-red-950/10'
                  : 'border-[#2d221b]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    tx.method === 'UPI'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {tx.method === 'UPI' ? <QrCodeIcon size={20} /> : <CreditCardIcon size={20} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-amber-100">{tx.tableNumber}</span>
                    <span className="font-mono text-xs text-amber-300">({tx.billNumber})</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#c9b8ad]">
                    Payer: <strong className="text-white">{tx.payerName}</strong> • {tx.vpaOrCard}
                  </div>

                  <div className="text-[11px] font-mono text-[#8c7b6d]">
                    Gateway Reference (UTR): <span className="text-amber-200">{tx.referenceId}</span> • {tx.timestamp}
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#241a12]">
                <div className="text-right">
                  <div className="font-mono text-xl font-black text-amber-300">
                    ₹{tx.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#8c7b6d] uppercase font-bold">{tx.method} Settlement</span>
                </div>

                <div className="flex items-center gap-2">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        disabled={isQuerying}
                        onClick={() => handleQueryGateway(tx.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-3.5 py-2 text-xs font-bold text-[#0c0805] shadow-md hover:brightness-110 active:scale-95 transition-all"
                      >
                        <RefreshCwIcon size={13} className={isQuerying ? 'animate-spin' : ''} />
                        <span>{isQuerying ? 'Polling...' : 'Re-Query Gateway'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFlagDiscrepancy(tx.id)}
                        className="rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/40 transition-all"
                        title="Flag discrepancy"
                      >
                        Flag Issue
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
                      <CheckCircleIcon size={15} />
                      <span>Verified & Settled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
