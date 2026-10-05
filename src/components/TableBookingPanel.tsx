import React, { useState, useMemo } from 'react';
import {
  UtensilsIcon,
  HomeDeliveryIcon,
  CheckCircleIcon,
  MapPinIcon,
  CloseIcon,
  UsersGroupIcon,
  SparklesIcon,
  ClockIcon,
} from './Icons';
import type { RestaurantTable, TableLocation, TableStatus } from '../data/mockRestaurantData';
import type { OrderType } from './CustomerNavbar';

interface TableBookingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  currentTable: string;
  onSelectTable: (table: RestaurantTable) => void;
  onReleaseTable?: () => void;
  tables: RestaurantTable[];
  onJoinWaitlist: (table: RestaurantTable) => void;
  joinedWaitlistIds?: string[];
  // Home Delivery Props to keep delivery functionality unchanged
  deliveryAddress: string;
  onChangeDeliveryAddress: (address: string) => void;
  presetAddresses?: string[];
}

export const TableBookingPanel: React.FC<TableBookingPanelProps> = ({
  isOpen,
  onClose,
  orderType,
  onChangeOrderType,
  currentTable,
  onSelectTable,
  onReleaseTable,
  tables,
  onJoinWaitlist,
  joinedWaitlistIds = [],
  deliveryAddress,
  onChangeDeliveryAddress,
  presetAddresses = [
    '742 Evergreen Terrace, Apt 4B',
    '100 Financial Tower, Fl 18',
    'Villa 9, Palm Bay Residences',
  ],
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | TableStatus>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<'all' | TableLocation>('all');
  const [capacityFilter, setCapacityFilter] = useState<'all' | '2' | '4' | '6+'>('all');
  const [customAddressInput, setCustomAddressInput] = useState('');

  // Counts for status tabs
  const availableCount = useMemo(() => tables.filter((t) => t.status === 'available').length, [tables]);
  const bookedCount = useMemo(() => tables.filter((t) => t.status === 'booked').length, [tables]);
  const waitingCount = useMemo(() => tables.filter((t) => t.status === 'waiting').length, [tables]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchStatus =
        selectedStatusFilter === 'all' ? true : t.status === selectedStatusFilter;
      const matchLocation =
        selectedLocationFilter === 'all' ? true : t.location === selectedLocationFilter;
      const matchCapacity =
        capacityFilter === 'all'
          ? true
          : capacityFilter === '2'
          ? t.capacity === 2
          : capacityFilter === '4'
          ? t.capacity === 4
          : t.capacity >= 6;

      return matchStatus && matchLocation && matchCapacity;
    });
  }, [tables, selectedStatusFilter, selectedLocationFilter, capacityFilter]);

  if (!isOpen) return null;

  const handleApplyCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddressInput.trim()) {
      onChangeDeliveryAddress(customAddressInput.trim());
      setCustomAddressInput('');
      onClose();
    }
  };

  const handleSelectDeliveryAddress = (addr: string) => {
    onChangeDeliveryAddress(addr);
    onClose();
  };

  const currentBookedTableObj = tables.find((t) => t.tableNumber === currentTable);

  return (
    <>
      {/* Invisible backdrop to dismiss panel on outside click */}
      <div className="table-panel-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="table-booking-panel-container" role="dialog" aria-modal="true" aria-label="Table Booking & Order Type">
        {/* Top Header */}
        <div className="table-panel-header">
          <div className="table-panel-header-title-row">
            <div>
              <h3 className="table-panel-title">
                {orderType === 'dine-in' ? 'Table Reservation & Floor Map' : 'Home Delivery Dispatch'}
              </h3>
              <p className="table-panel-subtitle">
                {orderType === 'dine-in'
                  ? 'Reserve premium tables or join live waitlists'
                  : 'Select your delivery destination'}
              </p>
            </div>
            <button
              type="button"
              className="table-panel-close-btn"
              onClick={onClose}
              aria-label="Close panel"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Segmented Mode Switcher (Dine-In / Delivery) */}
          <div className="order-mode-toggle-bar">
            <button
              type="button"
              className={`order-mode-pill ${orderType === 'dine-in' ? 'active' : ''}`}
              onClick={() => onChangeOrderType('dine-in')}
            >
              <UtensilsIcon size={14} />
              <span>Dine-In</span>
            </button>
            <button
              type="button"
              className={`order-mode-pill ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => onChangeOrderType('delivery')}
            >
              <HomeDeliveryIcon size={14} />
              <span>Home Delivery</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {orderType === 'delivery' ? (
          /* ================= Home Delivery Section (Preserved) ================= */
          <div className="table-panel-body delivery-mode-body">
            <div className="dropdown-section-title">
              <span>Select Delivery Address</span>
              <span className="section-note">Est. 30 - 40 mins</span>
            </div>

            <div className="location-options-list">
              {presetAddresses.map((addr) => (
                <button
                  key={addr}
                  type="button"
                  className={`location-option-row ${deliveryAddress === addr ? 'selected' : ''}`}
                  onClick={() => handleSelectDeliveryAddress(addr)}
                >
                  <div className="location-row-left">
                    <MapPinIcon size={15} className="map-pin-icon" />
                    <span className="location-label">{addr}</span>
                  </div>
                  {deliveryAddress === addr && (
                    <CheckCircleIcon size={16} className="check-active-icon" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Address Input */}
            <form onSubmit={handleApplyCustomAddress} className="custom-address-form">
              <input
                type="text"
                className="custom-address-input"
                placeholder="Or enter new delivery address..."
                value={customAddressInput}
                onChange={(e) => setCustomAddressInput(e.target.value)}
              />
              <button type="submit" className="custom-address-apply-btn">
                Set Address
              </button>
            </form>
          </div>
        ) : (
          /* ================= Dine-In Table Booking Section ================= */
          <div className="table-panel-body dinein-mode-body">
            {/* Active Reservation Banner if customer currently has a table booked */}
            {currentTable && currentBookedTableObj && (
              <div className="current-reservation-banner">
                <div className="current-reservation-info">
                  <div className="current-res-icon-wrap">
                    <UtensilsIcon size={15} />
                  </div>
                  <div>
                    <div className="current-res-badge">Active Table Reservation</div>
                    <div className="current-res-table-name">
                      {currentBookedTableObj.tableNumber} • {currentBookedTableObj.location} ({currentBookedTableObj.capacity} Guests)
                    </div>
                    <div className="current-res-zone">{currentBookedTableObj.zone}</div>
                  </div>
                </div>
                {onReleaseTable && (
                  <button
                    type="button"
                    className="release-table-btn"
                    onClick={onReleaseTable}
                    title="Release this table reservation"
                  >
                    Release Table
                  </button>
                )}
              </div>
            )}

            {/* Status Summary & Quick Tabs */}
            <div className="table-filter-section">
              <div className="table-status-tabs">
                <button
                  type="button"
                  className={`table-filter-tab ${selectedStatusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedStatusFilter('all')}
                >
                  <span>All Tables</span>
                  <span className="tab-pill-count">{tables.length}</span>
                </button>
                <button
                  type="button"
                  className={`table-filter-tab status-available ${selectedStatusFilter === 'available' ? 'active' : ''}`}
                  onClick={() => setSelectedStatusFilter('available')}
                >
                  <span className="status-dot dot-available" />
                  <span>Available</span>
                  <span className="tab-pill-count count-available">{availableCount}</span>
                </button>
                <button
                  type="button"
                  className={`table-filter-tab status-booked ${selectedStatusFilter === 'booked' ? 'active' : ''}`}
                  onClick={() => setSelectedStatusFilter('booked')}
                >
                  <span className="status-dot dot-booked" />
                  <span>Booked</span>
                  <span className="tab-pill-count count-booked">{bookedCount}</span>
                </button>
                <button
                  type="button"
                  className={`table-filter-tab status-waiting ${selectedStatusFilter === 'waiting' ? 'active' : ''}`}
                  onClick={() => setSelectedStatusFilter('waiting')}
                >
                  <span className="status-dot dot-waiting" />
                  <span>Waiting List</span>
                  <span className="tab-pill-count count-waiting">{waitingCount}</span>
                </button>
              </div>

              {/* Sub-Filters: Location & Capacity */}
              <div className="table-subfilter-row">
                {/* Location Filter */}
                <div className="subfilter-group">
                  <span className="subfilter-label">Location:</span>
                  {(['all', 'Indoor', 'Outdoor', 'Private'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className={`subfilter-pill ${selectedLocationFilter === loc ? 'active' : ''}`}
                      onClick={() => setSelectedLocationFilter(loc)}
                    >
                      {loc === 'all' ? 'All' : loc}
                    </button>
                  ))}
                </div>

                {/* Capacity Filter */}
                <div className="subfilter-group">
                  <span className="subfilter-label">Party Size:</span>
                  {(['all', '2', '4', '6+'] as const).map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      className={`subfilter-pill ${capacityFilter === cap ? 'active' : ''}`}
                      onClick={() => setCapacityFilter(cap)}
                    >
                      {cap === 'all' ? 'Any' : `${cap} seats`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables Cards Grid */}
            <div className="tables-cards-list">
              {filteredTables.length === 0 ? (
                <div className="tables-empty-state">
                  <p>No tables match your selected filters.</p>
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={() => {
                      setSelectedStatusFilter('all');
                      setSelectedLocationFilter('all');
                      setCapacityFilter('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTables.map((table) => {
                  const isCurrent = currentTable === table.tableNumber;
                  const isWaitlistJoined = joinedWaitlistIds.includes(table.id);

                  return (
                    <div
                      key={table.id}
                      className={`table-item-card status-${table.status} ${isCurrent ? 'is-current-table' : ''}`}
                    >
                      {/* Left: Table details */}
                      <div className="table-card-main">
                        <div className="table-card-top-row">
                          <span className="table-card-number">{table.tableNumber}</span>
                          <span className={`table-location-badge loc-${table.location.toLowerCase()}`}>
                            {table.location === 'Indoor' && '🏛️ Indoor'}
                            {table.location === 'Outdoor' && '🌿 Outdoor'}
                            {table.location === 'Private' && '👑 Private'}
                          </span>
                          <span className="table-capacity-tag">
                            <UsersGroupIcon size={13} />
                            <span>{table.capacity} Guests</span>
                          </span>
                        </div>

                        <div className="table-card-zone">{table.zone}</div>

                        {/* Status text row */}
                        <div className="table-card-status-info">
                          {table.status === 'available' && (
                            <span className="table-status-pill available">
                              <span className="status-dot dot-available" />
                              <span>Available for Immediate Seating</span>
                            </span>
                          )}

                          {table.status === 'booked' && (
                            <span className="table-status-pill booked">
                              <span className="status-dot dot-booked" />
                              <span>{isCurrent ? 'Reserved by You' : 'Currently Occupied / Booked'}</span>
                            </span>
                          )}

                          {table.status === 'waiting' && (
                            <span className="table-status-pill waiting">
                              <span className="status-dot dot-waiting" />
                              <span>
                                Waiting List active ({table.waitingCount ?? 1} in queue • ~{table.estWaitMinutes ?? 15}m wait)
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Action button with clear status labels as required:
                          Available -> Book Table
                          Booked -> Unavailable
                          Waiting -> Join Waiting List */}
                      <div className="table-card-actions">
                        {isCurrent ? (
                          <div className="table-action-confirmed-badge">
                            <CheckCircleIcon size={14} />
                            <span>Current Table</span>
                          </div>
                        ) : table.status === 'available' ? (
                          <button
                            type="button"
                            className="table-action-btn book-table-btn"
                            onClick={() => {
                              onSelectTable(table);
                              onClose();
                            }}
                          >
                            <SparklesIcon size={13} />
                            <span>Book Table</span>
                          </button>
                        ) : table.status === 'booked' ? (
                          <span className="table-action-badge-unavailable">
                            Unavailable
                          </span>
                        ) : (
                          /* table.status === 'waiting' */
                          <button
                            type="button"
                            className={`table-action-btn join-waitlist-btn ${isWaitlistJoined ? 'joined' : ''}`}
                            onClick={() => onJoinWaitlist(table)}
                            disabled={isWaitlistJoined}
                          >
                            <ClockIcon size={13} />
                            <span>{isWaitlistJoined ? 'Waitlist Joined ✓' : 'Join Waiting List'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Tip */}
            <div className="table-panel-footer">
              <span className="table-panel-footer-note">
                Need customized private banquet arrangements? Speak with our Maître d' in the Lounge.
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
