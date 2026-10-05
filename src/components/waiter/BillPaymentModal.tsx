import React, { useState } from 'react';
import './WaiterDashboard.css';
import { XIcon, CreditCardIcon, CheckCircleIcon, PrinterIcon, SplitIcon, SparklesIcon, DollarSignIcon } from '../Icons';
import { type WaiterFloorTable } from '../../data/mockRestaurantData';

interface BillPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: WaiterFloorTable | null;
  onSettleBill: (tableNumber: string, paymentMethod: string, tipAmount: number, totalPaid: number) => void;
}

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  isOpen,
  onClose,
  table,
  onSettleBill,
}) => {
  const [splitCount, setSplitCount] = useState<number>(1);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi' | 'nfc'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [printedReceipt, setPrintedReceipt] = useState(false);

  if (!isOpen || !table) return null;

  const orderItems = table.activeOrderDetails?.items || [];
  const baseSubtotal =
    table.currentBill ||
    table.currentBillTotal ||
    (orderItems.length > 0 ? orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0) : 2850);
  const serviceCharge = Math.round(baseSubtotal * 0.1);
  const gstTax = Math.round(baseSubtotal * 0.05);

  const tipAmount = customTip !== '' ? Math.max(0, parseInt(customTip, 10) || 0) : Math.round((baseSubtotal * tipPercent) / 100);
  const grandTotal = baseSubtotal + serviceCharge + gstTax + tipAmount;
  const perPersonAmount = Math.ceil(grandTotal / splitCount);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSettleBill(table.tableNumber, paymentMethod, tipAmount, grandTotal);
        onClose();
      }, 1400);
    }, 1000);
  };

  const handlePrintReceipt = () => {
    setPrintedReceipt(true);
    setTimeout(() => setPrintedReceipt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1c1611]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center text-[#c9893d]">
              <DollarSignIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-wide text-[#f5ede4]">
                  Bill Settlement — {table.tableNumber}
                </h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#c9893d]/15 text-[#e5a962] border border-[#c9893d]/30 font-medium">
                  {table.zone}
                </span>
              </div>
              <p className="text-xs text-[#a89687]">
                Ticket #{table.activeOrderDetails?.orderId || table.activeOrderId || 'Active Order'} • Guest party: {table.guestsCount || table.seatedGuests || 2} persons
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Bill Items Summary */}
          <div className="bg-[#1b1510] rounded-xl p-4 border border-[#34271c]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#c9893d] mb-3">
              Itemized Table Check
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs divide-y divide-[#2a1e15]">
              {orderItems.length > 0 ? (
                orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pt-2">
                    <span className="text-[#e8dfd8]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-[#f5ede4]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#e8dfd8]">Tasting Menu & Wine Pairing</span>
                  <span className="font-medium text-[#f5ede4]">₹{baseSubtotal.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-[#34271c] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#a89687]">
                <span>Food & Beverage Subtotal</span>
                <span>₹{baseSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#a89687]">
                <span>Service Charge (10%)</span>
                <span>₹{serviceCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#a89687]">
                <span>GST Tax (5%)</span>
                <span>₹{gstTax.toLocaleString('en-IN')}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-[#e5a962]">
                  <span>Server Gratuity (Tip)</span>
                  <span>+₹{tipAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-[#f5ede4] pt-2 border-t border-[#34271c]">
                <span>Final Total Payable</span>
                <span className="font-serif text-[#c9893d] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Gratuity / Tip Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d] mb-2">
              Staff Gratuity / Tip
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 10, 15, 18, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    tipPercent === pct && customTip === ''
                      ? 'bg-[#c9893d] border-[#c9893d] text-[#140f0c] font-bold'
                      : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  {pct === 0 ? 'No Tip' : `${pct}%`}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-[#8c7b6d]">Or custom tip:</span>
              <input
                type="number"
                placeholder="₹ Amount"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setTipPercent(0);
                }}
                className="bg-[#1b1510] text-xs px-3 py-1.5 rounded-lg border border-[#34271c] w-28 text-[#f5ede4] focus:outline-none focus:border-[#c9893d]"
              />
            </div>
          </div>

          {/* Split Bill Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#c9893d] flex items-center gap-1.5">
                <SplitIcon className="w-3.5 h-3.5" />
                Split Check Between Guests
              </label>
              {splitCount > 1 && (
                <span className="text-xs font-medium text-emerald-400">
                  ₹{perPersonAmount.toLocaleString('en-IN')} / guest
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setSplitCount(count)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    splitCount === count
                      ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#e5a962] font-semibold'
                      : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  {count === 1 ? 'Single Payer' : `Split in ${count}`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d] mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4] font-semibold'
                    : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                }`}
              >
                <CreditCardIcon className="w-5 h-5 text-[#c9893d]" />
                <span>Card (POS Swipe)</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-colors ${
                  paymentMethod === 'cash'
                    ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4] font-semibold'
                    : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                }`}
              >
                <DollarSignIcon className="w-5 h-5 text-[#c9893d]" />
                <span>Cash Payment</span>
              </button>

              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-colors ${
                  paymentMethod === 'upi'
                    ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4] font-semibold'
                    : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                }`}
              >
                <SparklesIcon className="w-5 h-5 text-[#c9893d]" />
                <span>UPI / QR Code</span>
              </button>

              <button
                onClick={() => setPaymentMethod('nfc')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-colors ${
                  paymentMethod === 'nfc'
                    ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4] font-semibold'
                    : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                }`}
              >
                <CreditCardIcon className="w-5 h-5 text-[#c9893d]" />
                <span>Tap & Pay (NFC)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140e] flex items-center justify-between gap-3">
          <button
            onClick={handlePrintReceipt}
            className="px-4 py-2.5 rounded-xl border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4 text-[#c9893d]" />
            {printedReceipt ? 'Printing Ticket...' : 'Print Table Check'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing || isSuccess}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow-lg hover:shadow-[#c9893d]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSuccess ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-emerald-950" />
                  Settled! Closing Table...
                </>
              ) : isProcessing ? (
                'Processing Settlement...'
              ) : (
                `Settle ₹${grandTotal.toLocaleString('en-IN')} & Close Table`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
