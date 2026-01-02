import React from 'react';

interface InputGroupProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, icon, children, badge }) => {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden group">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-15px] right-[-15px] w-12 h-12 border border-white rotate-45"></div>
      </div>
      
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/5 text-cyan-400 border border-cyan-500/10 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-lg shadow-cyan-500/5">
            {React.cloneElement(icon as React.ReactElement, { size: 14 })}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors leading-none">
              {label}
            </h3>
            {badge && (
              <span className="text-[7px] font-mono text-cyan-500/40 mt-1 uppercase tracking-widest">{badge}</span>
            )}
          </div>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-cyan-500 transition-all duration-300"></div>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  children: React.ReactNode;
  horizontal?: boolean;
  mono?: boolean;
}

export const Field: React.FC<FieldProps> = ({ label, children, horizontal = true, mono = false }) => {
  return (
    <div className={`flex ${horizontal ? 'items-center justify-between gap-3' : 'flex-col gap-1.5'}`}>
      <label className={`text-[8px] font-extrabold text-slate-500 uppercase tracking-[0.15em] ${mono ? 'font-mono' : ''}`}>
        {label}
      </label>
      <div className="flex-1 max-w-[140px]">
        {children}
      </div>
    </div>
  );
};