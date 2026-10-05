import React, { useState } from 'react';
import type { CashierBill, CashierPaymentRecord } from '../../data/mockRestaurantData';
import {
  BanknoteIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DollarSignIcon,
  PrinterIcon,
  QrCodeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from '../Icons';

interface PaymentProcessingViewProps {
  bill: CashierBill | null;
  cashierName: string;
  onRecordPayment: (billId: string, payment: CashierPaymentRecord) => void;
  onOpenReceipt: (bill: CashierBill) => void;
  onNavigateTab: (tab: string) => void;
}

export const PaymentProcessingView: React.FC<PaymentProcessingViewProps> = ({
  bill,
  cashierName,
  onRecordPayment,
  onOpenReceipt,
  onNavigateTab,
}) => {
  const [method, setMethod] = useState<'cash' | 'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Cash tender state
  const remaining = bill ? bill.remainingBalance : 0;
  const [cashTendered, setCashTendered] = useState<number>(remaining);

  // UPI state
  const [utrNumber, setUtrNumber] = useState<string>('UPI/984271892019');

  // Card state
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'Amex' | 'RuPay'>('Visa');
  const [cardLast4, setCardLast4] = useState<string>('4829');
  const [authCode, setAuthCode] = useState<string>('AUTH-48291');

  if (!bill) {
    return (
      <div className="csh-card p-12 text-center text-[#8c7b6d] space-y-3">
        <DollarSignIcon size={40} className="mx-auto text-amber-500/40" />
        <h3 className="font-serif text-lg font-bold text-amber-100">No Check Selected for Payment</h3>
        <p className="text-xs">
          Please select an active table or order from the Cashier Dashboard to initiate checkout.
        </p>
        <button
          type="button"
          onClick={() => onNavigateTab('dashboard')}
          className="rounded-xl bg-amber-500 text-[#0c0805] px-4 py-2 text-xs font-bold hover:brightness-110"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const changeReturned = Math.max(0, cashTendered - remaining);

  const handleSettlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      const record: CashierPaymentRecord = {
        id: `pay-${Date.now()}`,
        method,
        amount: remaining,
        totalPaid: method === 'cash' ? cashTendered : remaining,
        tenderedAmount: method === 'cash' ? cashTendered : undefined,
        changeReturned: method === 'cash' ? changeReturned : undefined,
        upiId: method === 'upi' ? `${bill.customerName?.toLowerCase().replace(/\s+/g, '') || 'guest'}@upi` : undefined,
        utrNumber: method === 'upi' ? utrNumber : undefined,
        verificationStatus: 'verified',
        cardType: method === 'card' ? cardType : undefined,
        cardLast4: method === 'card' ? cardLast4 : undefined,
        authCode: method === 'card' ? authCode : undefined,
        terminalRef: method === 'card' ? `POS-T1-${Date.now().toString().slice(-6)}` : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recordedBy: cashierName,
      };

      onRecordPayment(bill.id, record);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Check Summary Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-lg text-amber-100">
              Payment Checkout — {bill.tableNumber || bill.orderType}
            </span>
            <span className="font-mono text-xs rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 font-bold">
              #{bill.billNumber}
            </span>
          </div>
          <p className="text-xs text-[#8c7b6d] mt-1">
            Guest: {bill.customerName || 'Walk-in'} • Server: {bill.serverName} • Total Items: {bill.items.length}
          </p>
        </div>

        <div className="flex items-baseline gap-3 text-right">
          <div>
            <div className="text-[11px] uppercase font-bold text-[#8c7b6d]">Payable Amount</div>
            <div className="font-mono text-2xl font-black text-amber-300">
              ₹{remaining.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {paymentSuccess ? (
        /* Success State */
        <div className="csh-card p-8 text-center space-y-4 border-emerald-500/50 bg-gradient-to-b from-[#141b14] to-[#120f0c] shadow-2xl">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <CheckCircleIcon size={36} />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-emerald-200">
              Payment Settled Successfully!
            </h3>
            <p className="text-xs text-[#a89689]">
              Bill #{bill.billNumber} settled via {method.toUpperCase()} for ₹{remaining.toLocaleString()}
            </p>
            {method === 'cash' && changeReturned > 0 && (
              <p className="font-mono text-sm font-bold text-amber-300 pt-1">
                Cash Change Returned: ₹{changeReturned.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenReceipt(bill)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-[#0c0805] shadow-lg hover:brightness-110 transition-all"
            >
              <PrinterIcon size={15} />
              <span>Print Thermal Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2.5 text-xs font-semibold text-[#c9b8ad] hover:text-white"
            >
              Next Transaction
            </button>
          </div>
        </div>
      ) : (
        /* Main Payment Terminal */
        <div className="csh-card p-5 sm:p-6 space-y-6">
          {/* Method Selector Tabs */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9f8d81] mb-2 block">
              Select Settlement Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Cash Tab */}
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'cash'
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300 shadow-lg shadow-emerald-950/30'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white hover:border-[#4d3a2b]'
                }`}
              >
                <BanknoteIcon size={24} className={method === 'cash' ? 'text-emerald-400' : 'text-[#8c7b6d]'} />
                <span>Cash Tender</span>
              </button>

              {/* UPI Tab */}
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'upi'
                    ? 'border-blue-500/60 bg-blue-950/20 text-blue-300 shadow-lg shadow-blue-950/30'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white hover:border-[#4d3a2b]'
                }`}
              >
                <QrCodeIcon size={24} className={method === 'upi' ? 'text-blue-400' : 'text-[#8c7b6d]'} />
                <span>UPI / QR Payment</span>
              </button>

              {/* Card Tab */}
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  method === 'card'
                    ? 'border-purple-500/60 bg-purple-950/20 text-purple-300 shadow-lg shadow-purple-950/30'
                    : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white hover:border-[#4d3a2b]'
                }`}
              >
                <CreditCardIcon size={24} className={method === 'card' ? 'text-purple-400' : 'text-[#8c7b6d]'} />
                <span>Card (POS EDC)</span>
              </button>
            </div>
          </div>

          {/* Method 1: Cash Interface */}
          {method === 'cash' && (
            <div className="space-y-4 p-4 rounded-xl border border-[#2d221b] bg-[#120d0a] animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-100">Cash Settlement & Change Calculator</h4>
                  <p className="text-xs text-[#8c7b6d]">Enter amount received from guest to calculate change due</p>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  Bill Due: ₹{remaining.toLocaleString()}
                </span>
              </div>

              {/* Tender input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs text-[#c9b8ad]">Amount Received from Customer</label>
                  <div className="mt-1 flex items-center gap-2 font-mono text-lg font-bold text-amber-200 bg-[#1a1410] border border-[#3d2f26] rounded-xl px-3 py-2">
                    <span>₹</span>
                    <input
                      type="number"
                      min={remaining}
                      value={cashTendered}
                      onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-amber-200 focus:outline-none"
                    />
                  </div>

                  {/* Quick Denominations */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setCashTendered(remaining)}
                      className="rounded bg-[#241a12] border border-[#3d2f26] px-2.5 py-1 text-[11px] font-semibold text-[#c9b8ad] hover:text-white"
                    >
                      Exact (₹{remaining})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(Math.ceil(remaining / 500) * 500)}
                      className="rounded bg-[#241a12] border border-[#3d2f26] px-2.5 py-1 text-[11px] font-semibold text-[#c9b8ad] hover:text-white"
                    >
                      Round 500
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(cashTendered + 500)}
                      className="rounded bg-[#241a12] border border-[#3d2f26] px-2.5 py-1 text-[11px] font-semibold text-[#c9b8ad] hover:text-white"
                    >
                      +₹500
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashTendered(cashTendered + 2000)}
                      className="rounded bg-[#241a12] border border-[#3d2f26] px-2.5 py-1 text-[11px] font-semibold text-[#c9b8ad] hover:text-white"
                    >
                      +₹2000
                    </button>
                  </div>
                </div>

                {/* Change Due Card */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col justify-between">
                  <span className="text-xs uppercase font-bold text-emerald-400">Change Due to Return</span>
                  <div className="font-mono text-3xl font-black text-emerald-300 my-2">
                    ₹{changeReturned.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#8c7b6d]">
                    Cash drawer will automatically trigger kick upon confirmation
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Method 2: UPI / Dynamic QR Interface */}
          {method === 'upi' && (
            <div className="space-y-4 p-4 rounded-xl border border-[#2d221b] bg-[#120d0a] animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Simulated QR Code Canvas */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-black shrink-0 shadow-xl">
                  <div className="relative flex items-center justify-center w-36 h-36 border-4 border-black p-2">
                    <QrCodeIcon size={120} className="text-black" />
                  </div>
                  <span className="font-mono text-[10px] font-black text-black mt-2 tracking-wider">
                    SCAN & PAY ₹{remaining.toLocaleString()}
                  </span>
                </div>

                {/* UPI Details & UTR Input */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <h4 className="text-sm font-bold text-amber-100 flex items-center gap-2">
                      <span>Dynamic UPI Gateway (BHIM, GPay, Paytm, PhonePe)</span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                        Ready
                      </span>
                    </h4>
                    <p className="text-xs text-[#8c7b6d]">VPA: <strong className="text-amber-300">savoria.dine@icici</strong></p>
                  </div>

                  <div>
                    <label className="text-xs text-[#c9b8ad]">UPI Transaction Reference (UTR / 12-digit Ref)</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="flex-1 rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setUtrNumber(`UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`)
                        }
                        className="p-2 rounded-lg border border-[#3d2f26] bg-[#1b1510] text-[#c9b8ad] hover:text-white"
                        title="Generate mock UTR"
                      >
                        <RefreshCwIcon size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">
                    <ShieldCheckIcon size={15} />
                    <span>Real-time webhook auto-verification listener active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Method 3: Card EDC Interface */}
          {method === 'card' && (
            <div className="space-y-4 p-4 rounded-xl border border-[#2d221b] bg-[#120d0a] animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-100">Card Payment Terminal (PineLabs / EDC)</h4>
                  <p className="text-xs text-[#8c7b6d]">Tap, Chip & PIN or Contactless Card swipe</p>
                </div>
                <span className="font-mono text-xs text-purple-300 font-bold bg-purple-950/30 border border-purple-500/30 px-2 py-0.5 rounded">
                  Terminal #POS-01
                </span>
              </div>

              {/* Card Network Selector */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {(['Visa', 'MasterCard', 'Amex', 'RuPay'] as const).map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setCardType(net)}
                    className={`rounded-xl py-2 text-xs font-bold transition-all border ${
                      cardType === net
                        ? 'border-purple-500 bg-purple-950/30 text-purple-200'
                        : 'border-[#34271c] bg-[#1a1410] text-[#a89689] hover:text-white'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-[#c9b8ad]">Card Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                    className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#c9b8ad]">EDC Auth / Approval Code</label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Settle Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSettlePayment}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3.5 text-sm font-bold text-[#0c0805] shadow-xl shadow-amber-950/50 hover:brightness-110 active:scale-95 transition-all"
            >
              <CheckCircleIcon size={18} />
              <span>
                {isProcessing
                  ? 'Verifying & Settling Payment...'
                  : `Confirm & Settle ₹${remaining.toLocaleString()} via ${method.toUpperCase()}`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
