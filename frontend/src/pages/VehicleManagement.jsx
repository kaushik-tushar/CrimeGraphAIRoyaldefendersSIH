import React, { useState } from 'react';
import { Car, Search, Plus, FileText, Calendar, User, Tag, Edit2, Trash2, X } from 'lucide-react';

export default function VehicleManagement() {
  // 20 Initial vehicle records for robust tactical testing
  const [vehicles, setVehicles] = useState([
    { id: 'V-001', rcNumber: 'MP09AB1234', date: '2026-06-10', ownerName: 'Rajesh Sharma', associatedCase: 'FIR #412/2026 (Cyber Heist)', chasisNumber: 'MA3EY6S100012345', color: 'Matte Black', vehicleType: 'SUV' },
    { id: 'V-002', rcNumber: 'DL4CXY9876', date: '2026-05-22', ownerName: 'Vikram Singh', associatedCase: 'FIR #389/2026 (Extortion)', chasisNumber: 'MALC8F5KH98129384', color: 'Pearl White', vehicleType: 'Sedan' },
    { id: 'V-003', rcNumber: 'MH02EE5544', date: '2026-04-15', ownerName: 'Amit Verma', associatedCase: 'FIR #210/2026 (Smuggling)', chasisNumber: 'MZ7FB2C110098234', color: 'Midnight Blue', vehicleType: 'Motorcycle' },
    { id: 'V-004', rcNumber: 'UP32ZZ7788', date: '2026-06-01', ownerName: 'Manoj Tiwari', associatedCase: 'FIR #115/2026 (Arms Act)', chasisNumber: 'MBH5541200987654', color: 'Army Green', vehicleType: 'Commercial' },
    { id: 'V-005', rcNumber: 'KA01HH9900', date: '2026-03-12', ownerName: 'Sanjay Kumar', associatedCase: 'FIR #092/2026 (Fraud)', chasisNumber: 'MA3ER2S188834211', color: 'Silver Grey', vehicleType: 'Hatchback' },
    { id: 'V-006', rcNumber: 'GJ01XY4433', date: '2026-05-18', ownerName: 'Jignesh Patel', associatedCase: 'FIR #304/2026 (Hawala)', chasisNumber: 'MALC7F4JJ55123908', color: 'Glossy Red', vehicleType: 'SUV' },
    { id: 'V-007', rcNumber: 'RJ14CP1122', date: '2026-02-28', ownerName: 'Kuldeep Rathore', associatedCase: 'FIR #045/2026 (Narcotics)', chasisNumber: 'MZ8FB9K332211009', color: 'Desert Sand', vehicleType: 'SUV' },
    { id: 'V-008', rcNumber: 'HR26DK5566', date: '2026-06-05', ownerName: 'Rohit Ahlawat', associatedCase: 'FIR #401/2026 (Kidnapping)', chasisNumber: 'MA3EW8L100099887', color: 'Graphite Grey', vehicleType: 'Sedan' },
    { id: 'V-009', rcNumber: 'WB02QW3344', date: '2026-04-10', ownerName: 'Subrata Sen', associatedCase: 'FIR #188/2026 (Extortion)', chasisNumber: 'MALC1A2BB33445566', color: 'Midnight Blue', vehicleType: 'Hatchback' },
    { id: 'V-010', rcNumber: 'TN07AC7788', date: '2026-01-19', ownerName: 'Karthik Raja', associatedCase: 'FIR #012/2026 (Cyber Crime)', chasisNumber: 'MZ5CC4D5566778899', color: 'Pearl White', vehicleType: 'Sedan' },
    { id: 'V-011', rcNumber: 'PB08EF1234', date: '2026-05-11', ownerName: 'Gurpreet Singh', associatedCase: 'FIR #275/2026 (Arms Act)', chasisNumber: 'MA3EE9X1122334455', color: 'Matte Black', vehicleType: 'SUV' },
    { id: 'V-012', rcNumber: 'AP31GH5678', date: '2026-03-30', ownerName: 'Ramesh Naidu', associatedCase: 'FIR #150/2026 (Smuggling)', chasisNumber: 'MALC4Y8ZZ99887766', color: 'Wine Red', vehicleType: 'Commercial' },
    { id: 'V-013', rcNumber: 'TS08JK9012', date: '2026-06-08', ownerName: 'Sumanth Reddy', associatedCase: 'FIR #410/2026 (Fraud)', chasisNumber: 'MZ2AA1B2233445566', color: 'Silver Grey', vehicleType: 'Hatchback' },
    { id: 'V-014', rcNumber: 'KL07LM3456', date: '2026-02-14', ownerName: 'Anish Joseph', associatedCase: 'FIR #067/2026 (Financial Scam)', chasisNumber: 'MA3FF3C4455667788', color: 'Forest Green', vehicleType: 'Sedan' },
    { id: 'V-015', rcNumber: 'BR01NP7890', date: '2026-04-25', ownerName: 'Alok Kumar Jha', associatedCase: 'FIR #230/2026 (Murder Investigation)', chasisNumber: 'MALC9D8EE11223344', color: 'Dark Blue', vehicleType: 'SUV' },
    { id: 'V-016', rcNumber: 'JH01QR1122', date: '2026-05-02', ownerName: 'Deepak Munda', associatedCase: 'FIR #290/2026 (Illegal Mining)', chasisNumber: 'MZ9GG7H8899001122', color: 'Yellow', vehicleType: 'Commercial' },
    { id: 'V-017', rcNumber: 'CG04ST3344', date: '2026-01-05', ownerName: 'Pawan Sahu', associatedCase: 'FIR #004/2026 (Naxal Link)', chasisNumber: 'MA3JJ1K2233445566', color: 'Olive Green', vehicleType: 'Motorcycle' },
    { id: 'V-018', rcNumber: 'UK07UV5566', date: '2026-03-21', ownerName: 'Navneet Rawat', associatedCase: 'FIR #145/2026 (Land Grab)', chasisNumber: 'MALC5L6MM77889900', color: 'Sky Blue', vehicleType: 'SUV' },
    { id: 'V-019', rcNumber: 'OD02WX7788', date: '2026-06-03', ownerName: 'Bikash Mohanty', associatedCase: 'FIR #395/2026 (Corruption)', chasisNumber: 'MZ3NN2P4455667788', color: 'Grey', vehicleType: 'Sedan' },
    { id: 'V-020', rcNumber: 'CH01YZ9012', date: '2026-05-29', ownerName: 'Harshvardhan', associatedCase: 'FIR #360/2026 (Cyber Heist)', chasisNumber: 'MA3QQ9R1122334455', color: 'Matte Black', vehicleType: 'SUV' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing record

  // Form state
  const [formData, setFormData] = useState({
    rcNumber: '',
    date: new Date().toISOString().split('T')[0],
    ownerName: '',
    associatedCase: '',
    chasisNumber: '',
    color: '',
    vehicleType: 'Sedan'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      rcNumber: '',
      date: new Date().toISOString().split('T')[0],
      ownerName: '',
      associatedCase: '',
      chasisNumber: '',
      color: '',
      vehicleType: 'Sedan'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      rcNumber: vehicle.rcNumber,
      date: vehicle.date,
      ownerName: vehicle.ownerName,
      associatedCase: vehicle.associatedCase,
      chasisNumber: vehicle.chasisNumber,
      color: vehicle.color,
      vehicleType: vehicle.vehicleType
    });
    setIsModalOpen(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!formData.rcNumber || !formData.chasisNumber) return;

    if (editingId) {
      // Update existing record
      setVehicles(vehicles.map(v => v.id === editingId ? { ...v, ...formData } : v));
    } else {
      // Add new record
      const newEntry = {
        id: `V-0${vehicles.length + 1}`,
        ...formData
      };
      setVehicles([newEntry, ...vehicles]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle tactical record?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  // Search filter logic
  const filteredVehicles = vehicles.filter(v => 
    v.rcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.chasisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.associatedCase.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-wider text-slate-100">VEHICLE INTELLIGENCE & REGISTRY</h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage suspect vehicles, RC numbers, associated cases, chassis numbers, and color profiles.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 rounded bg-cyan-600 px-4 py-2 text-xs font-mono font-semibold text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/40"
        >
          <Plus className="h-4 w-4" />
          <span>ADD NEW VEHICLE RECORD</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by RC Number, Owner, Chassis or Case..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Total Records: <span className="text-cyan-400 font-bold">{filteredVehicles.length}</span>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="p-3">RC Number</th>
                <th className="p-3">Vehicle Type & Color</th>
                <th className="p-3">Chassis Number</th>
                <th className="p-3">Registered Owner</th>
                <th className="p-3">Associated Case</th>
                <th className="p-3">Log Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-cyan-400">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-3.5 w-3.5 text-cyan-500" />
                        <span>{vehicle.rcNumber}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <span className="font-semibold text-slate-200">{vehicle.vehicleType}</span>
                      <span className="text-slate-500 block text-[10px]">{vehicle.color}</span>
                    </td>
                    <td className="p-3 text-slate-400 tracking-wider">
                      {vehicle.chasisNumber}
                    </td>
                    <td className="p-3 text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{vehicle.ownerName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-amber-300">
                        <FileText className="h-3 w-3 text-amber-400" />
                        <span>{vehicle.associatedCase}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{vehicle.date}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="rounded p-1 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No vehicle records found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <Car className="h-4 w-4 text-cyan-400" />
                <span>{editingId ? 'Edit Vehicle Record' : 'Register Suspect Vehicle Entry'}</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">RC Number *</label>
                  <input
                    type="text"
                    name="rcNumber"
                    required
                    placeholder="e.g. MP09XY1234"
                    value={formData.rcNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Chassis Number *</label>
                  <input
                    type="text"
                    name="chasisNumber"
                    required
                    placeholder="17-digit Chassis No."
                    value={formData.chasisNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Full legal name"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Associated Case / FIR</label>
                  <input
                    type="text"
                    name="associatedCase"
                    placeholder="e.g. FIR #412/2026"
                    value={formData.associatedCase}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    placeholder="e.g. Matte Black"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Date Logged</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 text-xs font-mono text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-cyan-600 px-4 py-2 text-xs font-mono font-semibold text-white hover:bg-cyan-500 transition-colors"
                >
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}