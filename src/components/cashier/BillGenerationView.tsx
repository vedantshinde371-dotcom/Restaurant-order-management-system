import React, { useState } from 'react';
import type { CashierBill, CashierBillItem, CashierProfile } from '../../data/mockRestaurantData';
import {
  CheckCircleIcon,
  DollarSignIcon,
  FileTextIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  TrashIcon,
} from '../Icons';

interface BillGenerationViewProps {
  bills: CashierBill[];
  selectedBill: CashierBill | null;
  profile: CashierProfile;
  onSaveBill: (updatedBill: CashierBill) => void;
  onProceedToPayment: (bill: CashierBill) => void;
  onProceedToSplit: (bill: CashierBill) => void;
  onOpenReceipt: (bill: CashierBill) => void;
}

interface BillEditorContentProps {
  activeBill: CashierBill;
  bills: CashierBill[];
  currentBillId: string;
  onSelectBillId: (id: string) => void;
  profile: CashierProfile;
  onSaveBill: (updatedBill: CashierBill) => void;
  onProceedToPayment: (bill: CashierBill) => void;
  onProceedToSplit: (bill: CashierBill) => void;
  onOpenReceipt: (bill: CashierBill) => void;
}

const BillEditorContent: React.FC<BillEditorContentProps> = ({
  activeBill,
  bills,
  currentBillId,
  onSelectBillId,
  profile,
  onSaveBill,
  onProceedToPayment,
  onProceedToSplit,
  onOpenReceipt,
}) => {
  // Editable bill state initialized directly from activeBill
  const [items, setItems] = useState<CashierBillItem[]>(activeBill.items);
  const [discountPercent, setDiscountPercent] = useState<number>(activeBill.discountPercent);
  const [customDiscountAmount, setCustomDiscountAmount] = useState<string>(
    activeBill.discountAmount ? activeBill.discountAmount.toString() : ''
  );
  const [discountCoupon, setDiscountCoupon] = useState<string>(activeBill.discountCoupon || '');
  const [discountReason, setDiscountReason] = useState<string>(activeBill.discountReason || '');
  const [isServiceChargeWaived, setIsServiceChargeWaived] = useState<boolean>(activeBill.isServiceChargeWaived);
  const serviceChargeRate = activeBill.serviceChargePercent || profile.serviceChargePercent;
  const [tipInput, setTipInput] = useState<string>(
    activeBill.tipAmount ? activeBill.tipAmount.toString() : ''
  );
  const [billNotes, setBillNotes] = useState<string>(activeBill.notes || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Live Calculations
  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);

  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = Math.round((subtotal * discountPercent) / 100);
  } else if (customDiscountAmount !== '') {
    discountAmount = Math.min(subtotal, Math.max(0, parseFloat(customDiscountAmount) || 0));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const serviceChargeAmount = isServiceChargeWaived ? 0 : Math.round((taxableAmount * serviceChargeRate) / 100);
  const cgstAmount = Math.round((taxableAmount * (profile.defaultGstPercent / 2)) / 100);
  const sgstAmount = Math.round((taxableAmount * (profile.defaultGstPercent / 2)) / 100);

  const rawTotal = taxableAmount + serviceChargeAmount + cgstAmount + sgstAmount;
  const roundOff = profile.enableRoundOff ? Math.round(rawTotal) - rawTotal : 0;
  const grandTotal = Math.round(rawTotal + roundOff);

  const tipAmount = Math.max(0, parseFloat(tipInput) || 0);
  const finalPayable = grandTotal + tipAmount;
  const remainingBalance = Math.max(0, finalPayable - activeBill.paidAmount);

  // Quantity helpers
  const handleUpdateItemQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CashierBillItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const constructUpdatedBill = (): CashierBill => ({
    ...activeBill,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    discountReason,
    discountCoupon,
    serviceChargePercent: serviceChargeRate,
    serviceChargeAmount,
    isServiceChargeWaived,
    cgstPercent: profile.defaultGstPercent / 2,
    cgstAmount,
    sgstPercent: profile.defaultGstPercent / 2,
    sgstAmount,
    roundOff,
    grandTotal,
    tipAmount,
    finalPayable,
    remainingBalance,
    status: activeBill.status === 'unbilled' ? 'generated' : activeBill.status,
    notes: billNotes,
  });

  const handleSave = () => {
    const updated = constructUpdatedBill();
    onSaveBill(updated);
    setSaveSuccessMsg(`Bill ${updated.billNumber} modified and saved successfully.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handlePay = () => {
    const updated = constructUpdatedBill();
    onSaveBill(updated);
    onProceedToPayment(updated);
  };

  const handleSplit = () => {
    const updated = constructUpdatedBill();
    onSaveBill(updated);
    onProceedToSplit(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Bill Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#34271c] bg-[#140f0c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <FileTextIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>Bill Generation & Modification Studio</span>
              <span className="font-mono text-xs rounded bg-amber-500/20 px-2 py-0.5 text-amber-300">
                {activeBill.billNumber}
              </span>
            </h2>
            <p className="text-xs text-[#8c7b6d]">
              Review line items, adjust discounts, waive service fees, and compute statutory taxes
            </p>
          </div>
        </div>

        {/* Bill Quick Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#8c7b6d] shrink-0 font-medium">Switch Order:</label>
          <select
            value={currentBillId}
            onChange={(e) => onSelectBillId(e.target.value)}
            className="rounded-xl border border-[#3d2f26] bg-[#1a1410] px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            {bills.map((b) => (
              <option key={b.id} value={b.id}>
                {b.tableNumber || b.orderType} • #{b.billNumber} (₹{b.finalPayable})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
          <CheckCircleIcon size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main 2-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Itemized Check Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="csh-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d221b] pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-100">
                  Itemized Order Lines
                </h3>
                <p className="text-xs text-[#8c7b6d]">
                  Table: <strong className="text-amber-200">{activeBill.tableNumber || activeBill.orderType}</strong> • Server: {activeBill.serverName}
                </p>
              </div>
              <span className="text-xs font-mono text-[#a89689]">
                {items.length} items recorded
              </span>
            </div>

            {/* Table of items */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="p-8 text-center text-[#8c7b6d] text-xs">
                  No items on this check. Add dishes or recall from waiter POS.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#261c16] bg-[#1a1410] hover:border-[#3d2f26] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-amber-100 truncate">{item.name}</div>
                      <div className="text-[11px] text-[#8c7b6d]">
                        ₹{item.unitPrice} each {item.notes ? `• ${item.notes}` : ''}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#221812] text-[#c9b8ad] hover:text-white hover:border-amber-500/40"
                      >
                        <MinusIcon size={12} />
                      </button>
                      <span className="font-mono text-xs font-bold text-amber-300 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3d2f26] bg-[#221812] text-[#c9b8ad] hover:text-white hover:border-amber-500/40"
                      >
                        <PlusIcon size={12} />
                      </button>
                    </div>

                    <div className="font-mono text-xs font-bold text-amber-200 w-16 text-right shrink-0">
                      ₹{item.totalPrice}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-[#8c7b6d] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                      title="Remove item"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bill Special Notes */}
            <div className="pt-2 border-t border-[#2d221b]">
              <label className="text-[11px] font-semibold text-[#8c7b6d] uppercase tracking-wider">
                Special Cashier / Bill Notes
              </label>
              <input
                type="text"
                value={billNotes}
                onChange={(e) => setBillNotes(e.target.value)}
                placeholder="e.g. VIP guest seated by manager, complimentary coffee offered..."
                className="mt-1 w-full rounded-xl border border-[#3d2f26] bg-[#140f0c] px-3 py-2 text-xs text-[#c9b8ad] focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Discounts, Taxes & Final Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="csh-card p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-amber-100 border-b border-[#2d221b] pb-2.5">
              Discounts, Taxes & Charges
            </h3>

            {/* Feature 3: Bill Modification - Discounts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#c9b8ad] flex items-center justify-between">
                <span>Discount / Promotion</span>
                {discountAmount > 0 && (
                  <span className="text-emerald-400 font-mono font-bold">-₹{discountAmount}</span>
                )}
              </label>

              {/* Preset discount buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setDiscountPercent(pct);
                      setCustomDiscountAmount('');
                      setDiscountReason(pct > 0 ? `${pct}% Loyalty Discount` : '');
                    }}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                      discountPercent === pct && customDiscountAmount === ''
                        ? 'bg-amber-500 text-[#0c0805]'
                        : 'bg-[#1a1410] border border-[#34271c] text-[#a89689] hover:text-white'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>

              {/* Custom Coupon / Reason inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <input
                    type="text"
                    value={discountCoupon}
                    onChange={(e) => setDiscountCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon Code"
                    className="w-full rounded-lg border border-[#3d2f26] bg-[#16100c] px-2.5 py-1.5 text-xs text-amber-200 placeholder:text-[#6e5d52] focus:outline-none focus:border-amber-500 uppercase font-mono"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    value={customDiscountAmount}
                    onChange={(e) => {
                      setCustomDiscountAmount(e.target.value);
                      setDiscountPercent(0);
                    }}
                    placeholder="Flat ₹ Discount"
                    className="w-full rounded-lg border border-[#3d2f26] bg-[#16100c] px-2.5 py-1.5 text-xs text-amber-200 placeholder:text-[#6e5d52] focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Service Charge & Taxes */}
            <div className="space-y-2 pt-2 border-t border-[#241a12]">
              {/* Service Charge Waiver Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#2d221b] bg-[#16100c]">
                <div>
                  <div className="text-xs font-medium text-amber-100">Service Charge ({serviceChargeRate}%)</div>
                  <div className="text-[10px] text-[#8c7b6d]">Discretionary guest service fee</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsServiceChargeWaived(!isServiceChargeWaived)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    isServiceChargeWaived
                      ? 'bg-red-950/40 text-red-300 border border-red-500/40'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isServiceChargeWaived ? 'Waived (₹0)' : 'Applied'}
                </button>
              </div>

              {/* Tip / Gratuity */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#2d221b] bg-[#16100c]">
                <div>
                  <div className="text-xs font-medium text-amber-100">Tip / Gratuity</div>
                  <div className="text-[10px] text-[#8c7b6d]">Staff reward</div>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300">
                  <span>₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={tipInput}
                    onChange={(e) => setTipInput(e.target.value)}
                    placeholder="0"
                    className="w-20 rounded border border-[#3d2f26] bg-[#1a1410] px-2 py-1 text-right text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="rounded-xl border border-[#34271c] bg-[#120d0a] p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-[#c9b8ad]">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              {!isServiceChargeWaived && (
                <div className="flex justify-between text-[#c9b8ad]">
                  <span>Service Charge ({serviceChargeRate}%)</span>
                  <span className="font-mono">₹{serviceChargeAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-[#8c7b6d]">
                <span>CGST ({profile.defaultGstPercent / 2}%)</span>
                <span className="font-mono">₹{cgstAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-[#8c7b6d]">
                <span>SGST ({profile.defaultGstPercent / 2}%)</span>
                <span className="font-mono">₹{sgstAmount.toLocaleString()}</span>
              </div>

              {roundOff !== 0 && (
                <div className="flex justify-between text-[#8c7b6d]">
                  <span>Round Off</span>
                  <span className="font-mono">{roundOff > 0 ? `+₹${roundOff}` : `-₹${Math.abs(roundOff)}`}</span>
                </div>
              )}

              <div className="border-t border-[#2d221b] pt-2 flex justify-between items-baseline">
                <span className="font-serif font-bold text-sm text-amber-100">Grand Total</span>
                <span className="font-mono font-black text-lg text-amber-300">₹{finalPayable.toLocaleString()}</span>
              </div>

              {activeBill.paidAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400 pt-1">
                  <span>Paid: ₹{activeBill.paidAmount.toLocaleString()}</span>
                  <span className="font-bold text-amber-300">Due: ₹{remainingBalance.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePay}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 text-xs font-bold text-[#0c0805] shadow-lg shadow-amber-950/40 hover:brightness-110 active:scale-95 transition-all"
              >
                <DollarSignIcon size={16} />
                <span>Process Payment (₹{remainingBalance.toLocaleString()})</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl border border-[#3d2f26] bg-[#1a1410] py-2 text-center text-xs font-semibold text-[#c9b8ad] hover:text-white hover:border-amber-500/40 transition-all"
                >
                  Save Bill
                </button>

                <button
                  type="button"
                  onClick={handleSplit}
                  className="rounded-xl border border-purple-500/40 bg-purple-950/20 py-2 text-center text-xs font-semibold text-purple-300 hover:bg-purple-950/40 transition-all"
                >
                  Split Check
                </button>

                <button
                  type="button"
                  onClick={() => onOpenReceipt(activeBill)}
                  className="rounded-xl border border-[#3d2f26] bg-[#1a1410] py-2 text-center text-xs font-semibold text-[#c9b8ad] hover:text-amber-200 transition-all flex items-center justify-center gap-1"
                >
                  <PrinterIcon size={13} />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BillGenerationView: React.FC<BillGenerationViewProps> = ({
  bills,
  selectedBill,
  profile,
  onSaveBill,
  onProceedToPayment,
  onProceedToSplit,
  onOpenReceipt,
}) => {
  const [currentBillId, setCurrentBillId] = useState<string>(selectedBill?.id || bills[0]?.id || '');
  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(selectedBill?.id || null);

  if (selectedBill && selectedBill.id !== prevSelectedId) {
    setPrevSelectedId(selectedBill.id);
    setCurrentBillId(selectedBill.id);
  }

  const activeBill = bills.find((b) => b.id === currentBillId) || bills[0];

  if (!activeBill) {
    return (
      <div className="p-12 text-center text-[#8c7b6d]">
        No bill selected. Please select a table from the dashboard.
      </div>
    );
  }

  return (
    <BillEditorContent
      key={activeBill.id}
      activeBill={activeBill}
      bills={bills}
      currentBillId={currentBillId}
      onSelectBillId={(id) => setCurrentBillId(id)}
      profile={profile}
      onSaveBill={onSaveBill}
      onProceedToPayment={onProceedToPayment}
      onProceedToSplit={onProceedToSplit}
      onOpenReceipt={onOpenReceipt}
    />
  );
};
