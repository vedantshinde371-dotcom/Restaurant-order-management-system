import React, { useState } from 'react';
import './WaiterDashboard.css';
import {
  XIcon,
  Share2Icon,
  UsersIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SplitIcon,
  PlusIcon,
  CheckCheckIcon,
} from '../Icons';
import {
  type WaiterFloorTable,
} from '../../data/mockRestaurantData';

export interface TransferExecutionParams {
  type: 'transfer' | 'merge' | 'split' | 'server';
  sourceTableNum: string;
  targetTableNum?: string | null;
  targetTableNums?: string[]; // for merge
  splitItems?: {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served';
  }[];
  splitGuestsCount?: number;
  targetServerName?: string | null;
  performedBy: string;
  reason: string;
}

interface TableTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: WaiterFloorTable | null;
  allTables: WaiterFloorTable[];
  currentStaffName?: string;
  onExecuteTransfer: (params: TransferExecutionParams) => void;
}

const AVAILABLE_SERVERS = [
  { name: 'Marco Valenti', station: 'Main Dining Hall', role: 'Captain Server' },
  { name: 'Elena Rostova', station: 'Terrace & Veranda', role: 'Senior Waiter' },
  { name: 'David Kim', station: 'Garden & Courtyard', role: 'Floor Server' },
  { name: 'Sofia Mendes', station: 'Indoor Dining Room', role: 'Head Server' },
  { name: 'Marcus Vance', station: 'Private Wine Vault', role: 'Sommelier Captain' },
];

export const TableTransferModal: React.FC<TableTransferModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  allTables,
  currentStaffName = 'Marco Valenti',
  onExecuteTransfer,
}) => {
  const [transferType, setTransferType] = useState<'transfer' | 'merge' | 'split' | 'server'>('transfer');
  
  // Selection states
  const [selectedTargetTable, setSelectedTargetTable] = useState<string | null>(null);
  const [selectedMergeTables, setSelectedMergeTables] = useState<string[]>([]);
  const [selectedSplitTable, setSelectedSplitTable] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>(AVAILABLE_SERVERS[1].name);
  const [performingStaff, setPerformingStaff] = useState<string>(currentStaffName);
  
  // Split items configuration
  const [splitItemsSelection, setSplitItemsSelection] = useState<Record<string, number>>({});
  const [splitGuests, setSplitGuests] = useState<number>(1);

  // Common reason field
  const [reason, setReason] = useState<string>('Guest requested window seating');

  // Confirmation view state (Show confirmation before completing a transfer)
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !currentTable) return null;

  // Filter available tables (available status, excluding current table)
  const availableTargetTables = allTables.filter(
    (t) => t.tableNumber !== currentTable.tableNumber && (t.status === 'available' || t.status === 'reserved')
  );

  const billVal = currentTable.currentBill || currentTable.currentBillTotal || 0;
  const currentItems = currentTable.activeOrderDetails?.items || [];
  const currentGuests = currentTable.guestsCount || currentTable.seatedGuests || 2;

  // Toggle merge table selection
  const handleToggleMergeTable = (tblNum: string) => {
    setSelectedMergeTables((prev) =>
      prev.includes(tblNum) ? prev.filter((t) => t !== tblNum) : [...prev, tblNum]
    );
  };

  // Toggle item quantity to split
  const handleSetSplitItemQty = (itemIndex: number, qty: number) => {
    setSplitItemsSelection((prev) => ({
      ...prev,
      [itemIndex]: qty,
    }));
  };

  // Calculate items and bill for split
  const splitItemsList: {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served';
  }[] = [];

  let splitSubtotal = 0;
  currentItems.forEach((item, idx) => {
    const qtyToMove = splitItemsSelection[idx] || 0;
    if (qtyToMove > 0) {
      splitItemsList.push({
        ...item,
        quantity: qtyToMove,
      });
      splitSubtotal += item.price * qtyToMove;
    }
  });

  const remainingSubtotal = Math.max(0, billVal - splitSubtotal);

  // Calculate combined capacity for merge
  const mergedCapacityTotal =
    currentTable.capacity +
    selectedMergeTables.reduce((sum, tblNum) => {
      const match = allTables.find((t) => t.tableNumber === tblNum);
      return sum + (match?.capacity || 0);
    }, 0);

  // Validation
  const canProceedToConfirmation = () => {
    if (transferType === 'transfer') {
      return Boolean(selectedTargetTable);
    }
    if (transferType === 'merge') {
      return selectedMergeTables.length > 0;
    }
    if (transferType === 'split') {
      return Boolean(selectedSplitTable) && splitItemsList.length > 0;
    }
    if (transferType === 'server') {
      return Boolean(selectedServer);
    }
    return false;
  };

  // Final Execution after Confirmation
  const handleExecuteConfirmedTransfer = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onExecuteTransfer({
        type: transferType,
        sourceTableNum: currentTable.tableNumber,
        targetTableNum: transferType === 'transfer' ? selectedTargetTable : transferType === 'split' ? selectedSplitTable : null,
        targetTableNums: transferType === 'merge' ? selectedMergeTables : undefined,
        splitItems: transferType === 'split' ? splitItemsList : undefined,
        splitGuestsCount: transferType === 'split' ? splitGuests : undefined,
        targetServerName: transferType === 'server' ? selectedServer : null,
        performedBy: performingStaff,
        reason,
      });
      setIsSuccess(false);
      setIsConfirming(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#34271c] bg-[#1c1611]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9893d]/15 border border-[#c9893d]/30 flex items-center justify-center text-[#c9893d]">
              <Share2Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wide text-[#f5ede4]">
                Table & Order Transfer Center
              </h3>
              <p className="text-xs text-[#a89687]">
                Relocate party, merge tables, split orders, or reassign server ownership for {currentTable.tableNumber}
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

        {/* Modal Body with internal scrolling */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* CONFIRMATION SCREEN (Shown before completing transfer) */}
          {isConfirming ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-3">
                <AlertCircleIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Review & Confirm Transfer
                  </h4>
                  <p className="text-xs text-[#e8dfd8] mt-0.5">
                    Please review all details before executing. The table status, orders, and guest counts will be updated immediately on the live floor map and KDS.
                  </p>
                </div>
              </div>

              {/* Action Summary Card */}
              <div className="p-4 rounded-xl bg-[#1b1510] border border-[#34271c] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#241a12]">
                  <span className="text-xs font-semibold text-[#8c7b6d] uppercase tracking-wider">
                    Action Type
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#c9893d]/20 text-[#e5a962] border border-[#c9893d]/40">
                    {transferType === 'transfer' && '🚚 Relocate Table / Move Order'}
                    {transferType === 'merge' && '🔗 Merge Tables for Large Group'}
                    {transferType === 'split' && '✂️ Split Table & Divide Items'}
                    {transferType === 'server' && '👤 Server Handover Reassignment'}
                  </span>
                </div>

                {/* Origin vs Target */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#201710] border border-[#2d2218]">
                    <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Origin</span>
                    <div className="font-serif font-bold text-sm text-[#f5ede4] mt-0.5">
                      {currentTable.tableNumber}
                    </div>
                    <div className="text-[11px] text-[#a89687]">
                      {currentTable.zone} • {currentGuests} Guests
                    </div>
                    <div className="text-[11px] text-[#c9893d] mt-1 font-semibold">
                      Running: ₹{billVal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#201710] border border-[#2d2218]">
                    <span className="text-[10px] uppercase font-bold text-[#8c7b6d]">Destination</span>
                    <div className="font-serif font-bold text-sm text-emerald-400 mt-0.5">
                      {transferType === 'transfer' && selectedTargetTable}
                      {transferType === 'merge' && `${currentTable.tableNumber} + ${selectedMergeTables.join(', ')}`}
                      {transferType === 'split' && selectedSplitTable}
                      {transferType === 'server' && selectedServer}
                    </div>
                    <div className="text-[11px] text-[#a89687]">
                      {transferType === 'transfer' && 'Active order & running check fully transferred'}
                      {transferType === 'merge' && `Combined Seating: ${mergedCapacityTotal} Seats`}
                      {transferType === 'split' && `Receives ${splitGuests} guests • ₹${splitSubtotal.toLocaleString('en-IN')}`}
                      {transferType === 'server' && 'Station Captain handover'}
                    </div>
                  </div>
                </div>

                {/* Items Transferred Details */}
                {transferType === 'split' && (
                  <div className="p-3 rounded-lg bg-[#140f0c] border border-[#241a12] text-xs">
                    <span className="font-bold text-[#e5a962] block mb-1.5">
                      Items Moving to {selectedSplitTable}:
                    </span>
                    <div className="space-y-1">
                      {splitItemsList.map((item, i) => (
                        <div key={i} className="flex justify-between text-[#e8dfd8]">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-[#a89687]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit & Staff Metadata */}
                <div className="pt-2 border-t border-[#241a12] space-y-1.5 text-xs text-[#8c7b6d]">
                  <div className="flex justify-between">
                    <span>Authorized By (Staff Member):</span>
                    <span className="font-semibold text-[#f5ede4]">{performingStaff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logged Audit Reason:</span>
                    <span className="italic text-[#e8dfd8]">"{reason}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order History Status:</span>
                    <span className="text-emerald-400 font-medium">Preserved & Appended</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Transfer Type Tab Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-[#1a140f] rounded-xl border border-[#34271c]">
                <button
                  onClick={() => setTransferType('transfer')}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'transfer'
                      ? 'bg-[#c9893d] text-[#140f0c] shadow'
                      : 'text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  <Share2Icon className="w-3.5 h-3.5" />
                  <span>Transfer Order</span>
                </button>

                <button
                  onClick={() => setTransferType('merge')}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'merge'
                      ? 'bg-[#c9893d] text-[#140f0c] shadow'
                      : 'text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Merge Tables</span>
                </button>

                <button
                  onClick={() => setTransferType('split')}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'split'
                      ? 'bg-[#c9893d] text-[#140f0c] shadow'
                      : 'text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  <SplitIcon className="w-3.5 h-3.5" />
                  <span>Split Table</span>
                </button>

                <button
                  onClick={() => setTransferType('server')}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                    transferType === 'server'
                      ? 'bg-[#c9893d] text-[#140f0c] shadow'
                      : 'text-[#a89687] hover:text-[#f5ede4]'
                  }`}
                >
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>Reassign Server</span>
                </button>
              </div>

              {/* Current Origin Table Information */}
              <div className="p-3.5 rounded-xl bg-[#1b1510] border border-[#34271c] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#c9893d] font-bold">
                      Current Table
                    </span>
                    {currentTable.isMerged && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c9893d]/20 text-[#e5a962]">
                        Merged
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-base text-[#f5ede4] font-medium">
                    {currentTable.tableNumber} • {currentTable.zone}
                  </div>
                  <div className="text-xs text-[#8c7b6d] mt-0.5">
                    {currentGuests} Guests • Running Bill: ₹{billVal.toLocaleString('en-IN')}
                    {currentTable.activeOrderId && ` • ${currentTable.activeOrderId}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#8c7b6d] block">Server</span>
                  <span className="text-xs font-semibold text-[#f5ede4]">
                    {currentTable.assignedServer || currentStaffName}
                  </span>
                </div>
              </div>

              {/* TAB 1: TRANSFER ORDER TO ANOTHER TABLE */}
              {transferType === 'transfer' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d]">
                      Select Vacant Destination Table
                    </label>
                    <span className="text-xs text-[#8c7b6d]">
                      {availableTargetTables.length} tables available
                    </span>
                  </div>

                  {availableTargetTables.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#a89687] bg-[#1a140f] rounded-xl border border-[#34271c]">
                      No vacant tables available right now.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {availableTargetTables.map((t) => {
                        const isSelected = selectedTargetTable === t.tableNumber;
                        return (
                          <button
                            key={t.tableNumber}
                            onClick={() => setSelectedTargetTable(t.tableNumber)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4]'
                                : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4] hover:border-[#c9893d]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-serif font-bold text-sm text-[#f5ede4]">
                                {t.tableNumber}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-emerald-400">
                                {t.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#8c7b6d] truncate">{t.zone}</div>
                            <div className="text-[10px] text-[#a89687] mt-1">{t.capacity} Seats</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MERGE TABLES FOR LARGE GROUPS */}
              {transferType === 'merge' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d]">
                        Merge with Adjacent / Available Tables
                      </label>
                      <p className="text-[11px] text-[#8c7b6d]">
                        Select tables to join with {currentTable.tableNumber} for banquet or large parties
                      </p>
                    </div>
                    {selectedMergeTables.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#c9893d]/20 text-[#e5a962]">
                        Combined: {mergedCapacityTotal} Seats
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {availableTargetTables.map((t) => {
                      const isSelected = selectedMergeTables.includes(t.tableNumber);
                      return (
                        <button
                          key={t.tableNumber}
                          onClick={() => handleToggleMergeTable(t.tableNumber)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4]'
                              : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-sm text-[#f5ede4]">
                              {t.tableNumber}
                            </span>
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected ? 'bg-[#c9893d] border-[#c9893d] text-[#140f0c]' : 'border-[#34271c]'
                            }`}>
                              {isSelected && <CheckCheckIcon className="w-3 h-3" />}
                            </div>
                          </div>
                          <div className="text-[11px] text-[#8c7b6d] truncate">{t.zone}</div>
                          <div className="text-[10px] text-[#e5a962] font-medium mt-1">+{t.capacity} seats</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SPLIT TABLES WHEN REQUIRED */}
              {transferType === 'split' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d] mb-1.5">
                      1. Select Destination Table for Split Party
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1">
                      {availableTargetTables.map((t) => {
                        const isSelected = selectedSplitTable === t.tableNumber;
                        return (
                          <button
                            key={t.tableNumber}
                            onClick={() => setSelectedSplitTable(t.tableNumber)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4]'
                                : 'bg-[#1b1510] border-[#34271c] text-[#a89687]'
                            }`}
                          >
                            <span className="font-serif font-bold text-xs text-[#f5ede4] block">
                              {t.tableNumber}
                            </span>
                            <span className="text-[10px] text-[#8c7b6d]">{t.capacity} seats</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Split Guest Count */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1510] border border-[#34271c]">
                    <span className="text-xs text-[#e8dfd8]">Guests Moving to New Table:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={splitGuests}
                        onChange={(e) => setSplitGuests(Number(e.target.value))}
                        className="bg-[#241a12] border border-[#3c2d20] text-[#f5ede4] text-xs px-2.5 py-1 rounded-lg outline-none"
                      >
                        {Array.from({ length: Math.max(1, currentGuests - 1) }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Items to Move Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d]">
                        2. Select Dishes to Move to New Table
                      </label>
                      <div className="text-right">
                        <span className="text-xs text-[#e5a962] font-semibold block">
                          Moving: ₹{splitSubtotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#8c7b6d]">
                          Remaining: ₹{remainingSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {currentItems.length === 0 ? (
                      <div className="p-3 text-xs text-center text-[#8c7b6d] bg-[#1a140f] rounded-xl border border-[#34271c]">
                        No active items on table to split.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {currentItems.map((item, idx) => {
                          const qtySelected = splitItemsSelection[idx] || 0;
                          return (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#1b1510] border border-[#34271c] flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-medium text-[#f5ede4] block">{item.name}</span>
                                <span className="text-[11px] text-[#8c7b6d]">
                                  Total: {item.quantity}x @ ₹{item.price}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#8c7b6d]">Move:</span>
                                <select
                                  value={qtySelected}
                                  onChange={(e) => handleSetSplitItemQty(idx, Number(e.target.value))}
                                  className="bg-[#241a12] border border-[#3c2d20] text-[#f5ede4] text-xs px-2 py-1 rounded-lg outline-none"
                                >
                                  {Array.from({ length: item.quantity + 1 }, (_, q) => q).map((q) => (
                                    <option key={q} value={q}>
                                      {q}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: REASSIGN TO ANOTHER SERVER */}
              {transferType === 'server' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#c9893d]">
                    Select Floor Server for Service Handover
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_SERVERS.map((server) => {
                      const isSelected = selectedServer === server.name;
                      return (
                        <button
                          key={server.name}
                          onClick={() => setSelectedServer(server.name)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#c9893d]/20 border-[#c9893d] text-[#f5ede4]'
                              : 'bg-[#1b1510] border-[#34271c] text-[#a89687] hover:text-[#f5ede4]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#2a1f16] border border-[#c9893d]/40 flex items-center justify-center text-[#c9893d]">
                              <UsersIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#f5ede4]">{server.name}</div>
                              <div className="text-[11px] text-[#8c7b6d]">{server.role} • {server.station}</div>
                            </div>
                          </div>
                          {isSelected && <span className="text-xs text-[#c9893d] font-bold">Selected</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Staff Member Performing Transfer (Record staff member requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2d2218]">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#c9893d] mb-1">
                    Staff Authorizing Transfer
                  </label>
                  <select
                    value={performingStaff}
                    onChange={(e) => setPerformingStaff(e.target.value)}
                    className="w-full bg-[#1b1510] text-xs px-3 py-2 rounded-xl border border-[#34271c] text-[#f5ede4] outline-none"
                  >
                    {AVAILABLE_SERVERS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#c9893d] mb-1">
                    Transfer Reason / Audit Note
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Guest preference, large group..."
                    className="w-full bg-[#1b1510] text-xs px-3 py-2 rounded-xl border border-[#34271c] text-[#f5ede4] outline-none placeholder-[#6d5b4e]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#34271c] bg-[#1a140e] flex items-center justify-between gap-3">
          {isConfirming ? (
            <>
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2.5 rounded-xl border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleExecuteConfirmedTransfer}
                disabled={isSuccess}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isSuccess ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-emerald-950" />
                    Executing Transfer...
                  </>
                ) : (
                  'Confirm & Execute Transfer'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#34271c] text-xs font-medium text-[#a89687] hover:text-[#f5ede4] hover:bg-[#251e17] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => setIsConfirming(true)}
                disabled={!canProceedToConfirmation()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c9893d] to-[#e5a962] text-[#140f0c] text-xs font-bold shadow-lg hover:shadow-[#c9893d]/20 transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <span>Review & Confirm Transfer →</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
