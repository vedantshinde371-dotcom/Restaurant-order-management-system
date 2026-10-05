import React, { useState } from 'react';
import type { ManagerStaffMember } from '../../data/mockRestaurantData';
import { SearchIcon, PlusIcon, CheckIcon, XIcon } from '../Icons';

interface StaffManagementViewProps {
  staff: ManagerStaffMember[];
  onUpdateStaff: (updated: ManagerStaffMember[]) => void;
  onLogAudit: (action: string, module: 'Staff', details: string, severity?: 'info' | 'warning' | 'critical') => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staff,
  onUpdateStaff,
  onLogAudit,
}) => {
  const [staffList, setStaffList] = useState<ManagerStaffMember[]>(staff);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingStaff, setIsAddingStaff] = useState<boolean>(false);
  const [newStaff, setNewStaff] = useState<Partial<ManagerStaffMember>>({
    name: '',
    role: 'Senior Waiter',
    department: 'Service',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 ',
    email: '',
    hourlyRate: 300,
  });

  const departments = ['All', 'Management', 'Kitchen', 'Service', 'Billing', 'Bar'];

  const filteredStaff = staffList.filter((member) => {
    const matchesDept = selectedDept === 'All' || member.department === selectedDept;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleToggleDuty = (id: string) => {
    const updated = staffList.map((m) => {
      if (m.id === id) {
        const nextStatus = m.status === 'on-duty' ? 'off-duty' : 'on-duty';
        onLogAudit(
          'Staff Duty Status Shift',
          'Staff',
          `Changed ${m.name} (${m.code}) to ${nextStatus.toUpperCase()}.`,
          'info'
        );
        return { ...m, status: nextStatus as 'on-duty' | 'off-duty' };
      }
      return m;
    });
    setStaffList(updated);
    onUpdateStaff(updated);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name) return;

    const prefix =
      newStaff.department === 'Kitchen'
        ? 'CHF'
        : newStaff.department === 'Service'
        ? 'WTR'
        : newStaff.department === 'Billing'
        ? 'CSH'
        : newStaff.department === 'Bar'
        ? 'BAR'
        : 'MGR';

    const created: ManagerStaffMember = {
      id: `st-${staffList.length + 1}`,
      name: newStaff.name,
      code: `${prefix}-${400 + staffList.length}`,
      role: newStaff.role as any,
      department: newStaff.department as any,
      shift: newStaff.shift as any,
      phone: newStaff.phone || '+91 98201 00000',
      email: newStaff.email || `${newStaff.name.toLowerCase().replace(/\s+/g, '.')}@savoria.com`,
      status: 'on-duty',
      hourlyRate: Number(newStaff.hourlyRate || 300),
      joiningDate: 'Today',
      ratingScore: 4.8,
      tablesHandledToday: 0,
    };

    const updated = [created, ...staffList];
    setStaffList(updated);
    onUpdateStaff(updated);
    onLogAudit(
      'New Employee Onboarded',
      'Staff',
      `Registered ${created.name} as ${created.role} (${created.code}) in ${created.department}.`,
      'info'
    );
    setIsAddingStaff(false);
  };

  const onDutyCount = staffList.filter((s) => s.status === 'on-duty').length;
  const totalHourlyCost = staffList
    .filter((s) => s.status === 'on-duty')
    .reduce((sum, s) => sum + s.hourlyRate, 0);

  return (
    <div className="mgr-staff-view">
      <div className="mgr-section-header">
        <div>
          <h2 className="mgr-section-title">Staff Operations & Human Resources</h2>
          <p className="mgr-section-subtitle">
            Shift roistering, live on-duty roll calls, hourly wage rates, and dining floor service ratings.
          </p>
        </div>
        <button className="mgr-primary-btn" onClick={() => setIsAddingStaff(true)}>
          <PlusIcon /> Add Staff Member
        </button>
      </div>

      {/* KPI Stats */}
      <div className="mgr-kpi-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">On-Duty Personnel</div>
          <div className="mgr-kpi-value" style={{ color: '#10b981' }}>
            {onDutyCount} / {staffList.length}
          </div>
          <div className="mgr-kpi-subtext">Active on restaurant floor</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Current Payroll Run Rate</div>
          <div className="mgr-kpi-value" style={{ color: '#e5a962' }}>
            ₹{totalHourlyCost.toLocaleString('en-IN')}/hr
          </div>
          <div className="mgr-kpi-subtext">Cumulative active hourly wage</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Kitchen Line Staff</div>
          <div className="mgr-kpi-value" style={{ color: '#f59e0b' }}>
            {staffList.filter((s) => s.department === 'Kitchen' && s.status === 'on-duty').length} Chefs
          </div>
          <div className="mgr-kpi-subtext">Executive, Sous & Line stations</div>
        </div>
        <div className="mgr-kpi-card">
          <div className="mgr-kpi-label">Average Service Rating</div>
          <div className="mgr-kpi-value" style={{ color: '#c9893d' }}>
            ★ 4.88
          </div>
          <div className="mgr-kpi-subtext">Guest review feedback average</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mgr-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                className={`mgr-pill-filter ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="mgr-search-box" style={{ width: '280px' }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, role or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="mgr-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Employee & Code</th>
                <th>Role & Department</th>
                <th>Assigned Shift</th>
                <th>Contact</th>
                <th>Hourly Wage</th>
                <th>Rating</th>
                <th>Duty Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5efe6' }}>{member.name}</div>
                    <span style={{ fontSize: '0.75rem', color: '#c9893d', fontFamily: 'monospace' }}>
                      {member.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ color: '#fff', fontSize: '0.9rem' }}>{member.role}</div>
                    <span style={{ fontSize: '0.75rem', color: '#a89c90' }}>{member.department}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: '#f5efe6' }}>{member.shift}</div>
                    <span style={{ fontSize: '0.75rem', color: '#6e6259' }}>Joined: {member.joiningDate}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#a89c90' }}>{member.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6e6259' }}>{member.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e5a962' }}>₹{member.hourlyRate}</div>
                    <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>/ hour</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f59e0b' }}>★ {member.ratingScore}</div>
                    {member.tablesHandledToday !== undefined && (
                      <span style={{ fontSize: '0.72rem', color: '#a89c90' }}>
                        {member.tablesHandledToday} tables today
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`mgr-badge ${
                        member.status === 'on-duty'
                          ? 'mgr-badge-success'
                          : member.status === 'break'
                          ? 'mgr-badge-warning'
                          : 'mgr-badge-neutral'
                      }`}
                    >
                      {member.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background:
                          member.status === 'on-duty' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border:
                          member.status === 'on-duty'
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(16, 185, 129, 0.3)',
                        color: member.status === 'on-duty' ? '#ef4444' : '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                      onClick={() => handleToggleDuty(member.id)}
                    >
                      {member.status === 'on-duty' ? <XIcon /> : <CheckIcon />}
                      {member.status === 'on-duty' ? 'Clock Out' : 'Clock In'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddingStaff && (
        <div className="mgr-modal-backdrop">
          <div className="mgr-modal">
            <div className="mgr-modal-header">
              <h3 className="mgr-modal-title">Register New Restaurant Staff</h3>
              <button className="mgr-icon-btn" onClick={() => setIsAddingStaff(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleAddStaff}>
              <div className="mgr-modal-body">
                <div className="mgr-form-group">
                  <label className="mgr-form-label">Full Name</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Department</label>
                    <select
                      className="mgr-form-select"
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })}
                    >
                      <option value="Service">Service (Front of House)</option>
                      <option value="Kitchen">Kitchen (Back of House)</option>
                      <option value="Billing">Billing & Cashier</option>
                      <option value="Bar">Bar & Cellar</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Role Designation</label>
                    <input
                      type="text"
                      className="mgr-form-input"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                      required
                    />
                  </div>
                </div>

                <div className="mgr-form-row">
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Assigned Shift</label>
                    <select
                      className="mgr-form-select"
                      value={newStaff.shift}
                      onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value as any })}
                    >
                      <option value="Morning (09:00 - 17:00)">Morning (09:00 - 17:00)</option>
                      <option value="Evening (16:00 - 00:00)">Evening (16:00 - 00:00)</option>
                      <option value="All Day (11:00 - 23:00)">All Day (11:00 - 23:00)</option>
                    </select>
                  </div>
                  <div className="mgr-form-group">
                    <label className="mgr-form-label">Hourly Pay Rate (₹)</label>
                    <input
                      type="number"
                      className="mgr-form-input"
                      value={newStaff.hourlyRate}
                      onChange={(e) => setNewStaff({ ...newStaff, hourlyRate: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="mgr-form-group">
                  <label className="mgr-form-label">Phone Contact</label>
                  <input
                    type="text"
                    className="mgr-form-input"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button type="button" className="mgr-secondary-btn" onClick={() => setIsAddingStaff(false)}>
                  Cancel
                </button>
                <button type="submit" className="mgr-primary-btn">
                  Onboard Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
