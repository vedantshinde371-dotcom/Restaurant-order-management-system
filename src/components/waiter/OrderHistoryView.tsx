import React, { useState } from 'react';
import './WaiterDashboard.css';
import { ClockIcon, PrinterIcon, SearchIcon, EyeIcon, XIcon } from '../Icons';

interface ClosedTicket {
  id: string;
  tableNumber: number;
  zone: string;
  closedAt: string;
  guestsCount: number;
  serverName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  serviceCharge: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: string;
}

const INITIAL_CLOSED_TICKETS: ClosedTicket[] = [
  {
    id: 'SAV-8801',
    tableNumber: 2,
    zone: 'Indoor Dining Room',
    closedAt: '18:15',
    guestsCount: 2,
    serverName: 'Marco Valenti',
    items: [
      { name: 'Pan-Seared Scallops', quantity: 2, price: 1250 },
      { name: 'Truffle Risotto', quantity: 2, price: 1450 },
      { name: 'Chianti Classico Riserva', quantity: 1, price: 3400 },
    ],
    subtotal: 8800,
    serviceCharge: 880,
    tax: 440,
    tip: 1000,
    total: 11120,
    paymentMethod: 'Credit Card (POS)',
  },
  {
    id: 'SAV-8798',
    tableNumber: 15,
    zone: 'Garden & Courtyard',
    closedAt: '17:40',
    guestsCount: 4,
    serverName: 'Elena Rostova',
    items: [
      { name: 'Artisan Burrata', quantity: 2, price: 950 },
      { name: 'Wood-Fired Ribeye', quantity: 3, price: 2850 },
      { name: 'Tiramisu Tradizionale', quantity: 4, price: 650 },
    ],
    subtotal: 13050,
    serviceCharge: 1305,
    tax: 652,
    tip: 1500,
    total: 16507,
    paymentMethod: 'UPI / QR Code',
  },
  {
    id: 'SAV-8792',
    tableNumber: 22,
    zone: 'Private Wine Vault',
    closedAt: '17:10',
    guestsCount: 6,
    serverName: 'Marco Valenti',
    items: [
      { name: "Chef's Tasting Degustation (6 Courses)", quantity: 6, price: 4200 },
      { name: 'Grand Cru Sommelier Flight', quantity: 6, price: 3100 },
    ],
    subtotal: 43800,
    serviceCharge: 4380,
    tax: 2190,
    tip: 5000,
    total: 55370,
    paymentMethod: 'Credit Card (POS)',
  },
  {
    id: 'SAV-8785',
    tableNumber: 6,
    zone: 'Indoor Dining Room',
    closedAt: '16:30',
    guestsCount: 2,
    serverName: 'David Kim',
    items: [
      { name: 'Heirloom Tomato Gazpacho', quantity: 2, price: 650 },
      { name: 'Handcrafted Tagliolini al Tartufo', quantity: 2, price: 1650 },
    ],
    subtotal: 4600,
    serviceCharge: 460,
    tax: 230,
    tip: 500,
    total: 5790,
    paymentMethod: 'Cash',
  },
];

export const OrderHistoryView: React.FC = () => {
  const [tickets] = useState<ClosedTicket[]>(INITIAL_CLOSED_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<ClosedTicket | null>(null);
  const [printed, setPrinted] = useState(false);

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tableNumber.toString().includes(searchTerm) ||
      t.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalShiftSales = filteredTickets.reduce((sum, t) => sum + t.total, 0);
  const totalShiftTips = filteredTickets.reduce((sum, t) => sum + t.tip, 0);

  const handlePrintReceipt = () => {
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI summary */}
      <div className="bg-[#18130e] p-5 rounded-2xl border border-[#34271c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#f5ede4]">
              Shift Order Archive & Closed Checks
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#c9893d]/20 text-[#e5a962] border border-[#c9893d]/40">
              {filteredTickets.length} Closed Tickets
            </span>
          </div>
          <p className="text-xs text-[#a89687] mt-0.5">
            Audit settled dining checks, verify guest payment modes, and inspect gratuity distribution.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="bg-[#1d1611] px-3.5 py-2 rounded-xl border border-[#34271c]">
            <span className="text-[#8c7b6d] block">Closed Shift Revenue</span>
            <span className="font-serif text-base font-bold text-[#f5ede4]">
              ₹{totalShiftSales.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#1d1611] px-3.5 py-2 rounded-xl border border-[#c9893d]/40">
            <span className="text-[#8c7b6d] block">Total Server Tips</span>
            <span className="font-serif text-base font-bold text-amber-300">
              ₹{totalShiftTips.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="w-4 h-4 text-[#8c7b6d] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Ticket # (e.g. SAV-8801), Table Number, or Server..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#18130e] text-xs pl-10 pr-4 py-3 rounded-xl border border-[#34271c] text-[#f5ede4] focus:outline-none focus:border-[#c9893d] placeholder-[#6d5b4e]"
        />
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#8c7b6d] bg-[#18130e] rounded-xl border border-[#34271c]">
            No matching closed tickets found.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 rounded-xl bg-[#18130e] border border-[#34271c] hover:border-[#c9893d]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#241a12] border border-[#3c2a1c] flex items-center justify-center font-serif text-base font-bold text-[#c9893d]">
                  T-{ticket.tableNumber < 10 ? `0${ticket.tableNumber}` : ticket.tableNumber}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#f5ede4]">
                      Check {ticket.id}
                    </span>
                    <span className="text-xs text-[#a89687]">({ticket.zone})</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                      Settled
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#8c7b6d] mt-1">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3 text-[#c9893d]" />
                      Closed at {ticket.closedAt}
                    </span>
                    <span>•</span>
                    <span>{ticket.guestsCount} Guests</span>
                    <span>•</span>
                    <span>Server: {ticket.serverName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-[#2d2218]">
                <div className="text-right">
                  <span className="text-xs text-[#8c7b6d] block">{ticket.paymentMethod}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300 font-medium">
                      +₹{ticket.tip} tip
                    </span>
                    <span className="font-serif font-bold text-base text-[#f5ede4]">
                      ₹{ticket.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="px-3.5 py-2 rounded-xl bg-[#241a12] border border-[#3c2a1c] hover:border-[#c9893d] text-xs font-semibold text-[#f5ede4] flex items-center gap-1.5 transition-colors"
                >
                  <EyeIcon className="w-3.5 h-3.5 text-[#c9893d]" />
                  Receipt
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Modal Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#16120e] border border-[#c9893d]/30 rounded-2xl shadow-2xl overflow-hidden text-[#e8dfd8] p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#34271c] font-sans">
              <h4 className="font-serif text-base font-bold text-[#f5ede4]">
                Digital Folio Receipt
              </h4>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-[#a89687] hover:text-[#f5ede4]"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center font-sans space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#c9893d] tracking-widest uppercase">
                SAVOIR DINING
              </h3>
              <p className="text-[11px] text-[#8c7b6d]">Fine Dining & Grand Cru Cellar</p>
              <p className="text-[10px] text-[#6d5b4e]">
                Ticket #{selectedTicket.id} • Table {selectedTicket.tableNumber} • {selectedTicket.closedAt}
              </p>
            </div>

            <div className="border-t border-dashed border-[#34271c] pt-3 space-y-1.5">
              {selectedTicket.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.name}
                  </span>
                  <span>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-[#34271c] pt-2 space-y-1 text-[#a89687]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedTicket.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (10%):</span>
                <span>₹{selectedTicket.serviceCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%):</span>
                <span>₹{selectedTicket.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Gratuity / Tip:</span>
                <span>₹{selectedTicket.tip.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f5ede4] pt-2 border-t border-[#34271c]">
                <span>Total Settled:</span>
                <span className="text-[#c9893d]">₹{selectedTicket.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#1a140f] border border-[#2d2218] text-center text-[10px] text-[#8c7b6d] font-sans">
              Method: {selectedTicket.paymentMethod} • Server: {selectedTicket.serverName}
            </div>

            <div className="flex gap-2 pt-2 font-sans">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2 rounded-xl bg-[#c9893d] text-[#140f0c] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                {printed ? 'Ticket Sent to Printer!' : 'Reprint Slip'}
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl border border-[#34271c] text-xs text-[#a89687] hover:text-[#f5ede4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
