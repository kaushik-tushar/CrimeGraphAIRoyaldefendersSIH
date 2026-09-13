import React, { useState } from 'react';

export default function UserManagement() {
  // --- User Dataset State ---
  const [users, setUsers] = useState([
    { id: 'USR-001', name: 'Tushar Kaushik', email: 'tushar@crimegraph.ai', role: 'Super Admin', precinct: 'Headquarters', status: 'Active', lastActive: 'Just now', password: 'EncryptedPassword@1' },
    { id: 'USR-002', name: 'Vikram Singh', email: 'vikram.s@police.gov.in', role: 'Lead Analyst', precinct: 'North Precinct', status: 'Active', lastActive: '12 mins ago', password: 'EncryptedPassword@2' },
    { id: 'USR-003', name: 'Priya Sharma', email: 'priya.sharma@crimegraph.ai', role: 'Field Agent', precinct: 'East Precinct', status: 'Active', lastActive: '1 hour ago', password: 'EncryptedPassword@3' },
    { id: 'USR-004', name: 'Ankit Verma', email: 'ankit.v@police.gov.in', role: 'Investigator', precinct: 'North Precinct', status: 'Suspended', lastActive: '3 days ago', password: 'EncryptedPassword@4' },
    { id: 'USR-005', name: 'Neha Gupta', email: 'neha.g@crimegraph.ai', role: 'Viewer / Auditor', precinct: 'Headquarters', status: 'Active', lastActive: 'Yesterday', password: 'EncryptedPassword@5' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // --- Form States for New User ---
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Field Agent');
  const [newPrecinct, setNewPrecinct] = useState('North Precinct');

  // --- States for Password Reset Modal ---
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedPassword, setUpdatedPassword] = useState('');

  // Handlers
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    const newUser = {
      id: `USR-00${users.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      precinct: newPrecinct,
      status: 'Active',
      lastActive: 'Never',
      password: newPassword
    };

    setUsers([...users, newUser]);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setIsModalOpen(false);
    showToast(`User ${newName} successfully added with secure credentials.`);
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User ${u.name} status changed to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id) => {
    const targetUser = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    showToast(`User ${targetUser ? targetUser.name : id} revoked from system.`);
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    setUpdatedPassword('');
    setIsResetModalOpen(true);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!updatedPassword.trim()) return;

    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return { ...u, password: updatedPassword };
      }
      return u;
    }));

    setIsResetModalOpen(false);
    showToast(`Password successfully reset for ${selectedUser.name}.`);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 font-sans flex flex-col select-none text-xs">
      
      {/* 1. Top Navigation Bar */}
      <div className="bg-[#0b101c] border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-cyan-400">CrimeGraph AI</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">User & Access Management</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#121826] border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <span>Total Personnel <strong className="text-cyan-400">{users.length}</strong></span>
            <span>|</span>
            <span>Active <strong className="text-emerald-400">{users.filter(u => u.status === 'Active').length}</strong></span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-xs transition font-semibold shadow flex items-center gap-1.5 cursor-pointer"
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="flex-1 p-3 bg-[#04060a] flex flex-col space-y-3 overflow-hidden">
        
        {/* Filter & Search Bar */}
        <div className="bg-[#0b101c] border border-slate-800 rounded p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Personnel Directory</span>
            <span className="text-slate-500 text-[11px]">Manage system clearances, access control levels, and precinct nodes.</span>
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white w-64 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-[#0b101c] border border-slate-800 rounded shadow-md flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121826] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="p-3">ID / Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role / Clearance</th>
                  <th className="p-3">Precinct</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{user.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{user.id}</div>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{user.email}</td>
                    <td className="p-3">
                      <span className="bg-slate-900 border border-slate-700 text-cyan-300 px-2 py-0.5 rounded font-medium text-[11px]">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{user.precinct}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${user.status === 'Active' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-red-950/80 text-red-400 border-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{user.lastActive}</td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => openResetModal(user)}
                        className="bg-amber-950/60 hover:bg-amber-900 text-amber-300 px-2.5 py-1 rounded transition font-medium border border-amber-900 cursor-pointer"
                      >
                        Reset Pwd
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition font-medium border border-slate-700 cursor-pointer"
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-950/60 hover:bg-red-900 text-red-300 px-2.5 py-1 rounded transition font-medium border border-red-900 cursor-pointer"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">No personnel match your search criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- Modal: Add New User --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs">Provision New System User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Inspector Rajesh Kumar" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Official Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="rajesh.k@police.gov.in" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Initial Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="Set secure temporary password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Access Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Lead Analyst">Lead Analyst</option>
                    <option value="Field Agent">Field Agent</option>
                    <option value="Investigator">Investigator</option>
                    <option value="Viewer / Auditor">Viewer / Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Precinct</label>
                  <select 
                    value={newPrecinct}
                    onChange={(e) => setNewPrecinct(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="North Precinct">North Precinct</option>
                    <option value="East Precinct">East Precinct</option>
                    <option value="South Zone">South Zone</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded font-medium cursor-pointer">Provision User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal: Reset Password --- */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs">Reset Password for {selectedUser.name}</h3>
              <button onClick={() => setIsResetModalOpen(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">New Secure Password</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter new password" 
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsResetModalOpen(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded font-medium cursor-pointer">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded shadow-2xl text-xs font-semibold animate-bounce z-50">
          ✔ {notification}
        </div>
      )}

    </div>
  );
}