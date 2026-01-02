import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Globe, 
  Clock, 
  TrendingUp, 
  Download, 
  Activity, 
  Square,
  Compass,
  MoveHorizontal,
  Loader2,
  Cpu,
  BarChart3,
  Waves,
  Crosshair,
  Settings2,
  ShieldCheck,
  ChevronRight,
  Database,
  History,
  Terminal,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Radar,
  Fingerprint,
  Info
} from 'lucide-react';
import { 
  LocationState, 
  DateAndTimeState, 
  PriceMatrixState, 
  TimeMappingState, 
  ScanResult, 
  ScanStatus 
} from './types';
import { InputGroup, Field } from './components/InputGroup';
import { calculateMatrixData } from './services/geminiService';

const LOCATION_PRESETS: Record<string, { lat: number; lng: number; dir: 'E' | 'W'; tz: string }> = {
  'New York (NY)': { lat: 40.7128, lng: 74.006, dir: 'W', tz: 'America/New_York' },
  'London (UK)': { lat: 51.5074, lng: 0.1278, dir: 'W', tz: 'Europe/London' },
  'Tokyo (JP)': { lat: 35.6762, lng: 139.6503, dir: 'E', tz: 'Asia/Tokyo' },
  'Dubai (UAE)': { lat: 25.2048, lng: 55.2708, dir: 'E', tz: 'Asia/Dubai' },
  'Paris (FR)': { lat: 48.8566, lng: 2.3522, dir: 'E', tz: 'Europe/Paris' },
  'Sydney (AU)': { lat: -33.8688, lng: 151.2093, dir: 'E', tz: 'Australia/Sydney' },
};

const MODE_INSIGHTS: Record<string, { title: string; desc: string; tactic: string; color: string; bg: string; icon: any; border: string }> = {
  'Squared Minute': {
    title: 'Gann Parity',
    desc: 'Linear squaring.',
    tactic: '1 Unit = 1 Min.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    icon: Crosshair
  },
  'Asc@anchor': {
    title: 'Horizon Vector',
    desc: 'Ascendant momentum.',
    tactic: 'Trend Start Detection.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    icon: Waves
  },
  'Mc@anchor': {
    title: 'Zenith Engine',
    desc: 'Supply zone mapping.',
    tactic: 'Pivot Detection.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    icon: Compass
  },
  'Relative': {
    title: 'Velocity Delta',
    desc: 'Angular velocity.',
    tactic: 'Breakout Confirm.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/20',
    icon: MoveHorizontal
  }
};

const App: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>('IDLE');
  const [activeTab, setActiveTab] = useState('terminal');
  const [mounted, setMounted] = useState(false);
  
  const [location, setLocation] = useState<LocationState>({
    preset: 'New York (NY)',
    latitude: 40.7128,
    longitude: 74.006,
    direction: 'W',
    timezone: 'America/New_York'
  });

  const [dateTime, setDateTime] = useState<DateAndTimeState>({
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    scan: 1.0,
    step: 15,
    count: 32
  });

  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixState>({
    high: 102450.00,
    low: 98000.00,
    scale: 1.0,
    preview: 144.00
  });

  const [timeMapping, setTimeMapping] = useState<TimeMappingState>({
    mode: 'Squared Minute',
    minDeg: 4.0,
    tolerance: 0.5,
    requireBoth: true,
    lahiri: true,
    audioAlert: false
  });

  const [results, setResults] = useState<ScanResult[]>([]);
  const activeInsight = useMemo(() => MODE_INSIGHTS[timeMapping.mode] || MODE_INSIGHTS['Squared Minute'], [timeMapping.mode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPerfectSquare = (n: number) => {
    if (n < 0) return false;
    const rounded = Math.round(n);
    const sqrt = Math.sqrt(rounded);
    return Math.abs(sqrt - Math.round(sqrt)) < 0.01 && rounded > 0;
  };

  const executeScan = useCallback(async () => {
    if (status === 'SCANNING') return;
    setStatus('SCANNING');
    setResults([]);
    try {
      const ephemerisData = await calculateMatrixData(location, dateTime, priceMatrix, timeMapping);
      setResults(ephemerisData);
    } catch (err) {
      console.error("Matrix Calculation Failed:", err);
    } finally {
      setStatus('IDLE');
    }
  }, [location, dateTime, priceMatrix, timeMapping, status]);

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#020617] text-slate-200">
      {/* Optimized Header */}
      <header className="h-12 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl px-6 flex items-center justify-between z-[100] shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Radar className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[10px] font-black tracking-[0.2em] text-white uppercase leading-none">
                Futura <span className="text-cyan-400">Chron</span>
              </h1>
              <span className="text-[7px] font-mono text-slate-600 tracking-[0.2em] uppercase mt-1">V1.2 Temporal Matrix</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            {[
              { id: 'terminal', label: 'Console', icon: Terminal },
              { id: 'ephemeris', label: 'Matrix', icon: Database },
              { id: 'history', label: 'Logs', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon size={10} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[8px] font-mono">
             <div className="flex items-center gap-2">
                <span className="text-slate-600 uppercase font-black">Sync:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <button className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all">
            <Settings2 size={12} className="text-slate-500" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 relative">
        
        {/* Compact Sidebar Control Panel */}
        <aside className="w-[300px] flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar shrink-0">
          
          <InputGroup label="Spatial Anchoring" icon={<Globe />}>
            <Field label="Preset">
              <select 
                className="w-full h-8 px-2 rounded-lg text-[10px] font-bold text-slate-300" 
                value={location.preset} 
                onChange={(e) => {
                  const data = LOCATION_PRESETS[e.target.value];
                  if(data) setLocation({ preset: e.target.value, latitude: data.lat, longitude: data.lng, direction: data.dir, timezone: data.tz });
                }}
              >
                {Object.keys(LOCATION_PRESETS).map(name => <option key={name} value={name} className="bg-[#0f172a]">{name}</option>)}
              </select>
            </Field>
            
            <div className="grid grid-cols-2 gap-2">
              <Field label="Lat" horizontal={false}>
                <input type="number" step="0.0001" className="w-full h-8 px-3 rounded-lg text-[10px] font-mono text-cyan-400" value={location.latitude} onChange={(e) => setLocation({...location, latitude: parseFloat(e.target.value)})}/>
              </Field>
              <Field label="Lng" horizontal={false}>
                <div className="flex gap-1">
                  <input type="number" step="0.0001" className="flex-1 h-8 px-3 rounded-lg text-[10px] font-mono text-cyan-400" value={location.longitude} onChange={(e) => setLocation({...location, longitude: parseFloat(e.target.value)})}/>
                  <select className="w-10 h-8 rounded-lg text-[9px] font-black text-center text-slate-500" value={location.direction} onChange={(e) => setLocation({...location, direction: e.target.value as 'E' | 'W'})}>
                    <option className="bg-[#0f172a]">W</option>
                    <option className="bg-[#0f172a]">E</option>
                  </select>
                </div>
              </Field>
            </div>
          </InputGroup>

          <InputGroup label="Temporal Sync" icon={<Clock />}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Date" horizontal={false}>
                <input type="date" className="w-full h-8 px-2 rounded-lg text-[10px] text-slate-400 font-bold" value={dateTime.date} onChange={(e) => setDateTime({...dateTime, date: e.target.value})}/>
              </Field>
              <Field label="Time" horizontal={false}>
                <input type="time" className="w-full h-8 px-2 rounded-lg text-[10px] text-slate-400 font-bold" value={dateTime.time} onChange={(e) => setDateTime({...dateTime, time: e.target.value})}/>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <Field label="Step (m)" horizontal={false}>
                  <input type="number" className="w-full h-8 px-2 rounded-lg text-[10px] text-slate-300 font-mono" value={dateTime.step} onChange={(e) => setDateTime({...dateTime, step: parseInt(e.target.value)})}/>
               </Field>
               <Field label="Density" horizontal={false}>
                  <input type="number" className="w-full h-8 px-2 rounded-lg text-[10px] text-emerald-500 font-mono font-bold" value={dateTime.count} onChange={(e) => setDateTime({...dateTime, count: parseInt(e.target.value)})}/>
               </Field>
            </div>
          </InputGroup>

          <InputGroup label="Price Bounds" icon={<TrendingUp />}>
            <Field label="High ($)">
              <input type="number" className="w-full h-8 px-3 rounded-lg text-[10px] text-slate-200 font-mono text-right" value={priceMatrix.high} onChange={(e) => setPriceMatrix({...priceMatrix, high: parseFloat(e.target.value)})}/>
            </Field>
            <Field label="Low ($)">
              <input type="number" className="w-full h-8 px-3 rounded-lg text-[10px] text-slate-200 font-mono text-right" value={priceMatrix.low} onChange={(e) => setPriceMatrix({...priceMatrix, low: parseFloat(e.target.value)})}/>
            </Field>
          </InputGroup>

          <div className="mt-auto flex flex-col gap-2 pt-2">
             <button 
               onClick={executeScan} 
               disabled={status === 'SCANNING'} 
               className={`neo-button group relative w-full flex items-center justify-center gap-3 h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                 status === 'SCANNING' ? 'bg-slate-900/50 text-slate-600' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
               }`}
             >
                {status === 'SCANNING' ? <Loader2 size={16} className="animate-spin" /> : <Fingerprint size={16} />}
                {status === 'SCANNING' ? 'SCANNING...' : 'EXECUTE SCAN'}
             </button>
             <button className="w-full h-9 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all border border-white/[0.03] rounded-xl bg-white/[0.01]">
                <Download size={12} /> EXPORT CSV
             </button>
          </div>
        </aside>

        {/* HUD Center Workspace */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          
          {/* Condensed HUD Summary */}
          <div className={`glass-card p-4 rounded-2xl border ${activeInsight.border} ${activeInsight.bg} relative shrink-0`}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${activeInsight.color}`}>
                  <activeInsight.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    {activeInsight.title} <span className="text-[10px] text-slate-600 font-mono font-normal ml-1">v1.2</span>
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] text-slate-500 font-medium">{activeInsight.desc}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{activeInsight.tactic}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 pr-4">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Confidence</span>
                   <span className="text-lg font-mono text-cyan-400 font-black tracking-tighter leading-none">84.2%</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Harmonics</span>
                   <span className="text-lg font-mono text-amber-500 font-black tracking-tighter leading-none">{results.filter(r => r.isSquare).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Table Section */}
          <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col relative border border-white/[0.03]">
            
            {/* Status & Controller Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.03] bg-white/[0.01] shrink-0">
              <div className="flex items-center gap-3">
                <BarChart3 size={14} className="text-slate-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Stream Data Matrix</span>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <select 
                      className="h-8 pl-8 pr-4 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[9px] font-black uppercase tracking-widest text-slate-400 appearance-none cursor-pointer hover:bg-white/[0.05]"
                      value={timeMapping.mode}
                      onChange={(e) => setTimeMapping({...timeMapping, mode: e.target.value})}
                    >
                      <option className="bg-[#0f172a]" value="Squared Minute">Sq. Min</option>
                      <option className="bg-[#0f172a]" value="Asc@anchor">Asc@Anc</option>
                      <option className="bg-[#0f172a]" value="Mc@anchor">Mc@Anc</option>
                      <option className="bg-[#0f172a]" value="Relative">Velocity</option>
                    </select>
                    <ArrowRightLeft className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                 </div>
              </div>
            </div>

            {/* Matrix Data Table */}
            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="sticky top-0 z-10 bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5">
                  <tr>
                    <th className="pl-6 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest w-16">ID</th>
                    <th className="px-4 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">Node Path</th>
                    <th className="px-4 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Degree</th>
                    <th className="px-4 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Price Target</th>
                    <th className="px-4 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Error Δ</th>
                    <th className="px-4 py-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 pr-6 text-[8px] font-black text-slate-600 uppercase tracking-widest">Quantum Insight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {results.length > 0 ? results.map((row) => {
                    const hasSquare = row.isSquare || isPerfectSquare(row.deltaAscPrice) || isPerfectSquare(row.asc);
                    return (
                    <tr key={row.id} className={`group transition-colors ${hasSquare ? 'bg-amber-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                      <td className="pl-6 py-3">
                        <span className="text-[9px] font-mono text-slate-700">#{row.id.toString().padStart(3, '0')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-300">{row.dateTime.split(' ')[0]}</span>
                          <span className="text-[9px] font-mono text-slate-600">{row.dateTime.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-[12px] font-mono text-center font-black ${hasSquare ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {row.asc.toFixed(3)}°
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono text-slate-500 text-center opacity-50">
                        {row.timeTarget.toFixed(3)}°
                      </td>
                      <td className="px-4 py-3 text-center">
                         <div className="flex items-center justify-center gap-2">
                           <span className={`text-[12px] font-mono font-bold ${row.deltaAscPrice < 0.5 ? 'text-emerald-500' : 'text-slate-600'}`}>
                             {row.deltaAscPrice.toFixed(4)}
                           </span>
                           {hasSquare && <Square size={10} className="text-amber-500 fill-amber-500/30" />}
                         </div>
                      </td>
                      <td className="px-4 py-3">
                        {hasSquare ? (
                          <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">SQUARE H.</span>
                        ) : row.match === 'STRONG' ? (
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">STRONG</span>
                        ) : (
                          <span className="text-[8px] font-black text-slate-800 uppercase tracking-tighter">NEUTRAL</span>
                        )}
                      </td>
                      <td className="px-4 py-3 pr-6">
                        <p className="text-[10px] font-medium text-slate-500 italic max-w-sm truncate group-hover:text-slate-300">
                          {row.quantumNotes}
                        </p>
                      </td>
                    </tr>
                  )}) : (
                    <tr>
                      <td colSpan={7} className="py-40 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                           <Sparkles size={32} className="text-slate-600" />
                           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Engine Standby</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Optimized Footer */}
            <footer className="px-6 py-2.5 border-t border-white/[0.03] bg-black/20 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-8 text-[8px] font-mono text-slate-600 font-bold uppercase tracking-widest">
                  <span>Nodes: {results.length}</span>
                  <span>Density: {results.length ? ((results.filter(r => r.isSquare).length / results.length) * 100).toFixed(1) : '0.0'}%</span>
                  <span className="hidden md:inline">Window: {dateTime.step * dateTime.count} min</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Core Sync Active</span>
               </div>
            </footer>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.2); }
      `}</style>
    </div>
  );
};

export default App;