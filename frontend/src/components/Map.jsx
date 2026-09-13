import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Radio,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation,
  ShieldAlert,
  Compass,
  Filter
} from 'lucide-react';

/**
 * Map Component - Interactive Tactical Geospatial & Cell Tower Visualizer
 * Supports custom coordinate overlays, suspect geo-ping markers, and tower coverage heat zones.
 * 
 * @param {Object} props
 * @param {Array} [props.markers=[]] - List of location points [{ id, lat, lng, label, type, riskScore }]
 * @param {Object} [props.center={ lat: 28.627, lng: 77.372 }] - Initial map focus (default: Sector 62, Noida)
 * @param {number} [props.zoom=13] - Zoom level (1-18)
 * @param {Function} [props.onMarkerClick] - Callback when an officer selects a pin
 * @param {string} [props.className=""] - Extra Tailwind CSS classes
 */
export default function Map({
  markers = [
    {
      id: 'LOC-101',
      title: 'Sector 62 CDR Cell Tower Dump Node',
      lat: 28.627,
      lng: 77.372,
      type: 'TOWER',
      riskScore: 92,
      details: 'Peak density: 412 calls in 10-minute window'
    },
    {
      id: 'LOC-102',
      title: 'Primary Suspect Geo-Ping (Burner SIM)',
      lat: 28.631,
      lng: 77.378,
      type: 'SUSPECT',
      riskScore: 88,
      details: '+91 98210-XXXXX active near ATM Kiosk'
    },
    {
      id: 'LOC-103',
      title: 'Mule Account Cash Withdrawal Node',
      lat: 28.621,
      lng: 77.365,
      type: 'ATM',
      riskScore: 65,
      details: 'Axis Bank ATM #4012 - ₹4,50,000 withdrawn'
    }
  ],
  center = { lat: 28.627, lng: 77.372 },
  zoom = 13,
  onMarkerClick,
  className = ''
}) {
  const [selectedMarker, setSelectedMarker] = useState(markers[0] || null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [layerMode, setLayerMode] = useState('DARK_TACTICAL'); // 'DARK_TACTICAL' | 'HEATMAP' | 'SATELLITE'

  const handleZoomIn = () => setCurrentZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setCurrentZoom((prev) => Math.max(prev - 1, 3));

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'TOWER':
        return <Radio size={16} className="text-amber-400" />;
      case 'SUSPECT':
        return <ShieldAlert size={16} className="text-red-400 animate-pulse" />;
      case 'ATM':
        return <MapPin size={16} className="text-cyan-400" />;
      default:
        return <MapPin size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className={`relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px] w-full font-sans ${className}`}>
      
      {/* Top Map Tactical Control Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Layer Mode Selectors */}
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-md rounded-xl p-1.5 flex items-center gap-1 shadow-lg pointer-events-auto">
          <button
            onClick={() => setLayerMode('DARK_TACTICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              layerMode === 'DARK_TACTICAL'
                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Vector
          </button>
          <button
            onClick={() => setLayerMode('HEATMAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              layerMode === 'HEATMAP'
                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CDR Heat Density
          </button>
        </div>

        {/* GPS Coordinates Readout */}
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg pointer-events-auto">
          <Compass size={13} className="text-cyan-400 animate-spin-slow" />
          <span>LAT: {center.lat.toFixed(4)}° N</span>
          <span className="text-slate-600">|</span>
          <span>LNG: {center.lng.toFixed(4)}° E</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">ZOOM: {currentZoom}x</span>
        </div>

      </div>

      {/* Map Interactive Canvas Container */}
      <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
        
        {/* Simulated Grid Overlay Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#0f172a 1px, #020617 1px)`,
            backgroundSize: `${20 * (currentZoom / 10)}px ${20 * (currentZoom / 10)}px`
          }}
        />

        {/* Dynamic Simulated Map Markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          {markers.map((marker, idx) => {
            const isSelected = selectedMarker?.id === marker.id;
            // Offsets for demo placement relative to map center
            const offsetX = (marker.lng - center.lng) * 8000 * (currentZoom / 13);
            const offsetY = (center.lat - marker.lat) * 8000 * (currentZoom / 13);

            return (
              <div
                key={marker.id || idx}
                onClick={() => {
                  setSelectedMarker(marker);
                  if (onMarkerClick) onMarkerClick(marker);
                }}
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px)`
                }}
                className="absolute cursor-pointer group transition-transform duration-300 hover:scale-125 z-10"
              >
                {/* Radar Ring for Active Pins */}
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <div className="absolute -inset-3 rounded-full bg-cyan-500/20 animate-ping border border-cyan-400/40" />
                  )}
                  <div
                    className={`p-2.5 rounded-xl border shadow-xl flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 text-cyan-400 shadow-cyan-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 group-hover:border-slate-600'
                    }`}
                  >
                    {getMarkerIcon(marker.type)}
                  </div>
                </div>

                {/* Hover Label Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono text-slate-200 whitespace-nowrap shadow-2xl">
                    {marker.title}
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 border-r border-b border-slate-800 rotate-45 -mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Marker Intelligence Card Overlay (Bottom Left) */}
        {selectedMarker && (
          <div className="absolute bottom-3 left-3 z-20 max-w-sm w-full bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl space-y-2.5">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
                  {getMarkerIcon(selectedMarker.type)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                    {selectedMarker.id}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {selectedMarker.title}
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono font-black text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">
                SCORE: {selectedMarker.riskScore}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {selectedMarker.details}
            </p>

            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1">
              <span>LAT: {selectedMarker.lat}° N</span>
              <span>LNG: {selectedMarker.lng}° E</span>
            </div>
          </div>
        )}

      </div>

      {/* Map Control Tools Sidebar (Right Side) */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800/90 backdrop-blur-md p-1.5 rounded-xl shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-950 rounded-lg transition"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-950 rounded-lg transition"
        >
          <ZoomOut size={16} />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={() => {
            setCurrentZoom(zoom);
            setSelectedMarker(markers[0] || null);
          }}
          title="Reset Map Focus"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-950 rounded-lg transition"
        >
          <Navigation size={16} />
        </button>
      </div>

    </div>
  );
}