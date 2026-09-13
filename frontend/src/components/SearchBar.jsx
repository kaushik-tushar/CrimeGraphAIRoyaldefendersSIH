import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Phone,
  User,
  FileCheck2,
  CreditCard,
  Radio,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

/**
 * SearchBar Props
 * @param {Object} props
 * @param {string} [props.placeholder="Search Suspect Name, Burner Phone, FIR Case, or AADHAAR..."]
 * @param {Function} [props.onSearch] - Callback when search form is submitted
 * @param {string} [props.className=""] - Custom wrapper styling
 */
export default function SearchBar({
  placeholder = 'Search Suspect Name, Burner Phone, FIR Case, or AADHAAR...',
  onSearch,
  className = ''
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL'); // 'ALL' | 'SUSPECT' | 'PHONE' | 'FIR' | 'FINANCIAL'
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Quick Auto-complete Suggestions (Simulated live database queries)
  const suggestions = [
    { type: 'SUSPECT', id: 'ENT-801', title: 'Vikram "Raja" Malhotra', meta: 'AADHAAR: XXXX-XXXX-9012' },
    { type: 'PHONE', id: 'SIM-902', title: '+91 98210-XXXXX', meta: 'Burner SIM • Sector 62 Noida' },
    { type: 'FIR', id: '26189-042', title: 'FIR-2026-NCRB-9021', meta: 'Cyber Wire Hijack & Money Laundering' },
    { type: 'FINANCIAL', id: 'TXN-401', title: 'Axis Bank Acct #9041', meta: 'Mule Account • ₹45,00,000 Volume' }
  ];

  // Filter suggestions based on query input
  const filteredSuggestions = suggestions.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.meta.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase());

    if (category === 'ALL') return matchesQuery;
    return matchesQuery && item.type === category;
  });

  // Handle outside click to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query, category);
    } else {
      navigate(`/entities?search=${encodeURIComponent(query)}&type=${category}`);
    }
    setIsOpen(false);
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'SUSPECT':
        return <User size={14} className="text-red-400" />;
      case 'PHONE':
        return <Phone size={14} className="text-amber-400" />;
      case 'FIR':
        return <FileCheck2 size={14} className="text-cyan-400" />;
      case 'FINANCIAL':
        return <CreditCard size={14} className="text-purple-400" />;
      default:
        return <Search size={14} className="text-slate-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      
      {/* Primary Search Input Field Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus-within:border-cyan-500/80 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden"
      >
        
        {/* Category Scope Selector */}
        <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 px-3 bg-slate-950/60 h-12 text-xs">
          <Filter size={13} className="text-cyan-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-slate-300 font-mono font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">ALL TARGETS</option>
            <option value="SUSPECT" className="bg-slate-900 text-slate-200">SUSPECTS</option>
            <option value="PHONE" className="bg-slate-900 text-slate-200">PHONE / CDR</option>
            <option value="FIR" className="bg-slate-900 text-slate-200">FIR CASES</option>
            <option value="FINANCIAL" className="bg-slate-900 text-slate-200">MULE ACCOUNTS</option>
          </select>
        </div>

        {/* Search Icon */}
        <div className="pl-4 text-slate-500">
          <Search size={18} className="text-slate-400" />
        </div>

        {/* Main Text Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-slate-500 hover:text-slate-300 mr-1 transition"
          >
            <X size={16} />
          </button>
        )}

        {/* Submit Execution Button */}
        <button
          type="submit"
          className="m-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-500/20"
        >
          <span>Query</span>
          <ArrowRight size={14} />
        </button>

      </form>

      {/* Auto-complete Intelligence Suggestions Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 animate-fade-in">
          <div className="p-2.5 bg-slate-950/80 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Matched Intelligence Entities</span>
            <span>{filteredSuggestions.length} Results</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuery(item.title);
                    setIsOpen(false);
                    if (item.type === 'FIR') {
                      navigate(`/cases/${item.id}`);
                    } else {
                      navigate(`/entities/${item.id}`);
                    }
                  }}
                  className="p-3 hover:bg-slate-800/60 cursor-pointer transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl shrink-0 group-hover:border-slate-700">
                      {getItemIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">{item.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-mono">
                          {item.type}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 truncate max-w-[150px]">
                    {item.meta}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching criminal records or entities found for "<span className="text-slate-300 font-mono">{query}</span>".
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}