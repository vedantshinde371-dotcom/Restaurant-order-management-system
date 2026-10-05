import React, { useState } from 'react';
import type { CashierBill, CashierProfile } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  DownloadIcon,
  PrinterIcon,
  QrCodeIcon,
  Share2Icon,
  XIcon,
} from '../Icons';

interface ReceiptManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: CashierBill | null;
  profile: CashierProfile;
  onPrintSuccess?: () => void;
}

export const ReceiptManagerModal: React.FC<ReceiptManagerModalProps> = ({
  isOpen,
  onClose,
  bill,
  profile,
  onPrintSuccess,
}) => {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setDispatchStatus('Receipt sent to POS Thermal Printer (80mm EPSON-TM20).');
      if (onPrintSuccess) onPrintSuccess();
      setTimeout(() => setDispatchStatus(null), 3000);
    }, 800);
  };

  const handleDispatchDigital = (type: 'SMS' | 'WhatsApp' | 'Email') => {
    setDispatchStatus(`Digital receipt dispatched via ${type} to ${bill.customerPhone || 'customer mobile'}.`);
    setTimeout(() => setDispatchStatus(null), 3000);
  };

  const primaryPayment = bill.payments[0];

  return (
    <div className="csh-modal-overlay">
      <div className="csh-modal-card max-w-2xl max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2d221b] p-4 sm:p-5 shrink-0 bg-[#16100c]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <PrinterIcon size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                <span>Receipt Management</span>
                <span className="font-mono text-xs rounded bg-amber-500/20 px-2 py-0.5 text-amber-300">
                  {bill.billNumber}
                </span>
              </h2>
              <p className="text-xs text-[#a89689]">
                Tax Invoice & Thermal 80mm POS slip generation for {bill.tableNumber || bill.orderType}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0e0a08] space-y-6">
          {/* Dispatch Notice if any */}
          {dispatchStatus && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
              <CheckCircleIcon size={16} />
              <span>{dispatchStatus}</span>
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl border border-[#34271c] bg-[#140f0c]">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-[#c9b8ad] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDuplicate}
                  onChange={(e) => setIsDuplicate(e.target.checked)}
                  className="rounded accent-amber-500 h-3.5 w-3.5"
                />
                <span>Watermark Duplicate Copy</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDispatchDigital('SMS')}
                className="flex items-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1b1510] px-2.5 py-1.5 text-xs text-[#c9b8ad] hover:text-white hover:border-amber-500/40"
              >
                <Share2Icon size={13} />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => handleDispatchDigital('WhatsApp')}
                className="flex items-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1b1510] px-2.5 py-1.5 text-xs text-[#c9b8ad] hover:text-white hover:border-amber-500/40"
              >
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => handleDispatchDigital('Email')}
                className="flex items-center gap-1.5 rounded-lg border border-[#3d2f26] bg-[#1b1510] px-2.5 py-1.5 text-xs text-[#c9b8ad] hover:text-white hover:border-amber-500/40"
              >
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Authentic 80mm Thermal Receipt Preview Card */}
          <div className="relative py-2">
            <div className="thermal-receipt-paper select-none">
              {/* Duplicate Watermark */}
              {isDuplicate && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-[-25deg]">
                  <span className="text-4xl font-black border-4 border-red-700 text-red-700 px-6 py-2 uppercase tracking-widest">
                    DUPLICATE COPY
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="font-bold text-base tracking-wider uppercase font-serif text-black">
                  {profile.receiptRestaurantName}
                </h3>
                <p className="text-[11px] text-gray-700">{profile.receiptTagline}</p>
                <p className="text-[10px] text-gray-600">GSTIN: {profile.receiptGstin} • FSSAI: {profile.receiptFssai}</p>
                <p className="text-[10px] text-gray-600">14 Boulevard de l'Artisan, Heritage Quarter</p>
                <p className="text-[10px] text-gray-600">Tel: +91 22 2490 8800 • help@savoria.dine</p>
              </div>

              <div className="thermal-double-divider my-2.5" />

              {/* Tax Invoice Details */}
              <div className="text-[11px] space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>TAX INVOICE: {bill.billNumber}</span>
                  <span>{bill.orderType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Table: {bill.tableNumber || 'Takeaway/Online'}</span>
                  <span>Date: {new Date().toLocaleDateString()} {bill.createdAt}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Server: {bill.serverName}</span>
                  <span>Cashier: {bill.cashierName}</span>
                </div>
                {bill.customerName && (
                  <div className="flex justify-between text-gray-700">
                    <span>Guest: {bill.customerName}</span>
                    <span>{bill.customerPhone || ''}</span>
                  </div>
                )}
              </div>

              <div className="thermal-divider my-2" />

              {/* Itemized Check */}
              <div className="text-[11px] space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] uppercase text-gray-800 border-b border-gray-300 pb-1">
                  <span className="w-1/2">Item Description</span>
                  <span className="w-1/6 text-center">Qty</span>
                  <span className="w-1/6 text-right">Rate</span>
                  <span className="w-1/6 text-right">Amount</span>
                </div>

                {bill.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[11px] leading-tight">
                    <span className="w-1/2 font-medium truncate">{item.name}</span>
                    <span className="w-1/6 text-center">{item.quantity}</span>
                    <span className="w-1/6 text-right">₹{item.unitPrice}</span>
                    <span className="w-1/6 text-right font-bold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="thermal-divider my-2" />

              {/* Calculations */}
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal.toFixed(2)}</span>
                </div>

                {bill.discountAmount > 0 && (
                  <div className="flex justify-between text-green-800 font-semibold">
                    <span>Discount ({bill.discountPercent}% {bill.discountCoupon ? `[${bill.discountCoupon}]` : ''})</span>
                    <span>-₹{bill.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {!bill.isServiceChargeWaived && bill.serviceChargeAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Service Charge ({bill.serviceChargePercent}%)</span>
                    <span>₹{bill.serviceChargeAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>CGST ({bill.cgstPercent}%)</span>
                  <span>₹{bill.cgstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>SGST ({bill.sgstPercent}%)</span>
                  <span>₹{bill.sgstAmount.toFixed(2)}</span>
                </div>

                {bill.roundOff !== 0 && (
                  <div className="flex justify-between text-gray-600 text-[10px]">
                    <span>Round Off</span>
                    <span>{bill.roundOff > 0 ? `+₹${bill.roundOff.toFixed(2)}` : `-₹${Math.abs(bill.roundOff).toFixed(2)}`}</span>
                  </div>
                )}

                <div className="thermal-double-divider my-2" />

                <div className="flex justify-between text-sm font-black tracking-wide text-black">
                  <span>GRAND TOTAL</span>
                  <span>₹{bill.grandTotal.toFixed(2)}</span>
                </div>

                {bill.tipAmount > 0 && (
                  <div className="flex justify-between text-gray-800 font-semibold">
                    <span>Gratuity / Tip</span>
                    <span>₹{bill.tipAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs font-bold text-gray-900 pt-1">
                  <span>NET PAYABLE</span>
                  <span>₹{bill.finalPayable.toFixed(2)}</span>
                </div>
              </div>

              <div className="thermal-divider my-2" />

              {/* Payment Settlement Information */}
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between font-bold">
                  <span>STATUS: {bill.status.toUpperCase()}</span>
                  <span>Paid: ₹{bill.paidAmount.toFixed(2)}</span>
                </div>

                {bill.remainingBalance > 0 && (
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>REMAINING BALANCE</span>
                    <span>₹{bill.remainingBalance.toFixed(2)}</span>
                  </div>
                )}

                {primaryPayment && (
                  <div className="text-[10px] text-gray-700 pt-0.5 space-y-0.5">
                    <p>Method: {primaryPayment.method.toUpperCase()} • Time: {primaryPayment.timestamp}</p>
                    {primaryPayment.method === 'cash' && primaryPayment.tenderedAmount && (
                      <p>Tendered: ₹{primaryPayment.tenderedAmount} | Change Due: ₹{primaryPayment.changeReturned}</p>
                    )}
                    {primaryPayment.method === 'upi' && primaryPayment.utrNumber && (
                      <p>UPI Ref (UTR): {primaryPayment.utrNumber}</p>
                    )}
                    {primaryPayment.method === 'card' && (
                      <p>Card: {primaryPayment.cardType} ****{primaryPayment.cardLast4} (Auth: {primaryPayment.authCode})</p>
                    )}
                  </div>
                )}
              </div>

              <div className="thermal-divider my-2.5" />

              {/* Barcode & Footer Greeting */}
              <div className="text-center space-y-2 pt-1">
                <div className="flex justify-center text-gray-700">
                  <QrCodeIcon size={38} />
                </div>
                <p className="font-mono text-[10px] tracking-widest text-gray-600">
                  *{bill.billNumber}*
                </p>
                <p className="text-[10px] text-gray-800 font-serif italic">
                  "{profile.receiptFooterMessage}"
                </p>
                <p className="text-[9px] text-gray-500">
                  Powered by Savoria RMS Cloud POS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-[#2d221b] bg-[#120d0a] p-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-4 py-2 text-xs font-semibold text-[#a89689] hover:bg-[#251b14] hover:text-white"
          >
            Close Preview
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const text = `Bill ${bill.billNumber} Total: ₹${bill.finalPayable}. Verified at Le Bistro de l'Artisan.`;
                navigator.clipboard?.writeText(text);
                setDispatchStatus('Receipt text copied to clipboard.');
                setTimeout(() => setDispatchStatus(null), 3000);
              }}
              className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3.5 py-2 text-xs font-semibold text-[#c9b8ad] hover:text-white"
            >
              <DownloadIcon size={14} className="inline mr-1" />
              Copy Info
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 text-xs font-bold text-[#0c0805] shadow-lg shadow-amber-900/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <PrinterIcon size={14} />
              <span>{isPrinting ? 'Printing Slip...' : 'Print Thermal Receipt (80mm)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
