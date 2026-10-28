import React, { useState, useEffect } from 'react';
import { Microscope, Beaker, Play, RotateCcw, AlertTriangle, Activity, Heart, Thermometer } from 'lucide-react';

export default function VirtualResearchLab() {
  const [activeLab, setActiveLab] = useState<'chemistry' | 'physics' | 'cardiac'>('chemistry');

  // Chemistry Titration Lab state
  const [volumeBase, setVolumeBase] = useState<number>(0);
  const [phVal, setPhVal] = useState<number>(1.2);
  const [indicatorColor, setIndicatorColor] = useState<string>('#1e293b');

  // Physics Pendulum Lab calculations
  const [lengthSlider, setLengthSlider] = useState<number>(120);
  const [gravitySlider, setGravitySlider] = useState<number>(9.8);
  const [angle, setAngle] = useState<number>(0);
  const [isPlayingPhysics, setIsPlayingPhysics] = useState<boolean>(true);

  // Medical Cardiac diagnostics states
  const [pulseOx, setPulseOx] = useState<number>(98);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [cardiacState, setCardiacState] = useState<'normal' | 'arrhythmia' | 'tachy' | 'brady'>('normal');
  const [ecgPath, setEcgPath] = useState<string>('M 0 50 L 10 50 L 20 50 L 25 30 L 30 70 L 35 50 L 45 50 L 50 50 L 60 50');

  // React on Titration volumes
  useEffect(() => {
    let computedPh = 1.2;
    if (volumeBase < 24) {
      computedPh = 1.2 + (volumeBase * 0.1);
    } else if (volumeBase >= 24 && volumeBase <= 26) {
      computedPh = 3.6 + (volumeBase - 24) * 3.7;
    } else {
      computedPh = 11.0 + (volumeBase - 26) * 0.08;
    }

    computedPh = Math.min(Math.max(parseFloat(computedPh.toFixed(2)), 1.2), 12.8);
    setPhVal(computedPh);

    if (computedPh < 8.2) {
      setIndicatorColor('bg-[#1E2536] border-[#2A3446]');
    } else if (computedPh >= 8.2 && computedPh <= 9.6) {
      setIndicatorColor('bg-emerald-600/60 border-emerald-400');
    } else {
      setIndicatorColor('bg-emerald-500 border-emerald-300 animate-pulse');
    }
  }, [volumeBase]);

  // Dynamic Pendulum Physics oscillation tick
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;

    const tick = () => {
      if (isPlayingPhysics) {
        t += 0.05;
        const period = 2 * Math.PI * Math.sqrt(lengthSlider / (gravitySlider * 10));
        const theta = 35 * Math.sin((2 * Math.PI * t) / period);
        setAngle(theta);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlayingPhysics, lengthSlider, gravitySlider]);

  // Cardiac Diagnoses effects
  useEffect(() => {
    let heartTimer: any;
    if (cardiacState === 'normal') {
      setHeartRate(72);
      setPulseOx(98);
      setEcgPath('M 0 50 Q 8 50 12 42 T 16 50 L 22 50 L 25 25 L 29 75 L 32 50 L 38 50 Q 42 50 46 54 T 50 50 L 60 50');
    } else if (cardiacState === 'arrhythmia') {
      setHeartRate(58);
      setPulseOx(95);
      setEcgPath('M 0 50 L 8 45 L 12 55 L 18 50 L 21 28 L 25 72 L 28 50 L 36 50 L 40 46 L 43 54 L 50 50 L 60 50');
    } else if (cardiacState === 'tachy') {
      setHeartRate(124);
      setPulseOx(96);
      setEcgPath('M 0 50 L 5 45 T 10 50 L 13 20 L 16 80 L 19 50 L 23 50 T 28 50 Q 32 50 36 40 T 40 50 L 43 20 L 46 80 L 50 50');
    } else {
      setHeartRate(48);
      setPulseOx(92);
      setEcgPath('M 0 50 L 15 50 Q 22 50 26 42 T 30 50 L 40 50 L 43 28 L 47 72 L 50 50 L 60 50');
    }

    return () => clearInterval(heartTimer);
  }, [cardiacState]);

  return (
    <div className="bg-[#0E131C] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-[#1E2536] pb-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
            CogniSacra STEM • Multi-Subject Simulation Sandbox
          </span>
          <h2 className="text-xl font-bold font-serif text-white mt-1.5">Virtual Research Lab</h2>
          <p className="text-xs text-zinc-400 font-mono">Perform experiments digitally under safe, fully parameters-driven academic sandboxes.</p>
        </div>

        {/* Lab select */}
        <div className="flex bg-[#141B26] border border-[#1E2536] p-1 rounded-xl">
          <button
            onClick={() => setActiveLab('chemistry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeLab === 'chemistry' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Beaker size={12} />
            <span>Chemistry Titration</span>
          </button>
          <button
            onClick={() => setActiveLab('physics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeLab === 'physics' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Microscope size={12} />
            <span>Physics Pendulum</span>
          </button>
          <button
            onClick={() => setActiveLab('cardiac')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeLab === 'cardiac' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart size={12} />
            <span>Cardiac Diagnostics</span>
          </button>
        </div>
      </div>

      <div className="min-h-[360px]">
        {/* CHEMISTRY TITRATION */}
        {activeLab === 'chemistry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Live Beaker and Barette Graphics */}
            <div className="lg:col-span-7 bg-[#0A0D14] rounded-2xl border border-[#1E2536] shadow-xl p-6 flex gap-12 items-center justify-center min-h-[310px] relative">
              
              {/* Barette container */}
              <div className="flex flex-col items-center relative">
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 mb-1">NaOH Burette</span>
                <div className="w-5 h-36 bg-[#141B26] border border-[#1E2536] rounded-md relative flex flex-col justify-end overflow-hidden shadow-inner">
                  <div className="bg-emerald-500/40 w-full transition-all" style={{ height: `${100 - (volumeBase * 2)}%` }} />
                  <div className="absolute inset-0 flex flex-col justify-between text-[7px] text-zinc-500 px-1 font-mono">
                    <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                  </div>
                </div>
                {/* Valve node */}
                <div className="h-4 w-4 bg-[#1E2536] rounded-full my-1 border border-zinc-700 relative" />
                {/* Drip point */}
                <div className={`h-2.5 w-1 rounded bg-emerald-400/60 ${volumeBase > 0 ? 'animate-bounce' : ''}`} />
              </div>

              {/* Erlenmeyer beaker container */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 mb-1">HCl + Indicator</span>
                <div className="relative w-28 h-32 flex items-end justify-center">
                  <div className="absolute inset-0 border-4 border-zinc-700/60 rounded-t-[50px] rounded-b-[20px] bg-zinc-900/30" />
                  <div className={`w-24 h-11 rounded-b-[16px] transition-colors duration-500 border ${indicatorColor}`} />
                  <div className="absolute bottom-16 bg-[#0E131C] border border-[#1E2536] text-white px-2.5 py-1 rounded shadow-lg text-[10px] font-mono flex items-center gap-1.5">
                    <Activity size={10} className="text-emerald-400 animate-pulse" />
                    <span>pH: {phVal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter sliders and Chemical Formulas */}
            <div className="lg:col-span-5 bg-[#141B26] border border-[#1E2536] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-[#1E2536]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Titration Parameters</h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Adjust sodium hydroxide volume to neutralize hydrochloric acid.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-zinc-300">Volume Added</span>
                    <span className="font-bold text-emerald-400">{volumeBase} ml</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.1"
                    value={volumeBase}
                    onChange={(e) => setVolumeBase(parseFloat(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-[#0E131C] accent-emerald-500 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase font-bold pr-1">
                    <span>0 ml (Acidic)</span>
                    <span>25 ml (Equivalence)</span>
                    <span>50 ml (Basic)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0E131C] rounded-xl border border-[#1E2536] text-xs font-mono text-zinc-300 space-y-1">
                  <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider block">Chemical Reaction</span>
                  <p className="font-bold text-white">HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)</p>
                  <p className="text-[10px] text-zinc-400 font-sans">Neutral solution forms at equivalence point pH 7.00 with zero toxic residue.</p>
                </div>
              </div>

              <button
                onClick={() => setVolumeBase(0)}
                className="w-full bg-[#0E131C] hover:bg-[#1A2332] text-zinc-200 border border-[#1E2536] font-mono font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <RotateCcw size={12} className="text-emerald-400" />
                <span>Reset Titration Trial</span>
              </button>
            </div>
          </div>
        )}

        {/* PHYSICS PENDULUM OSCILLATOR */}
        {activeLab === 'physics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Animated Canvas */}
            <div className="lg:col-span-7 bg-[#0A0D14] rounded-2xl border border-[#1E2536] shadow-xl p-6 flex flex-col justify-between items-center min-h-[310px]">
              
              {/* Stand and Bob */}
              <div className="relative w-full h-[220px] flex justify-center bg-[#0E131C] rounded-xl overflow-hidden border border-[#1E2536]">
                <div className="absolute top-4 w-28 h-2 bg-[#1E2536] rounded" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500" />

                <div 
                  className="absolute top-6 left-1/2 transition-transform duration-75 origin-top"
                  style={{ 
                    transform: `translateX(-50%) rotate(${angle}deg)`, 
                    height: `${lengthSlider}px` 
                  }}
                >
                  <div className="w-0.5 bg-zinc-500 h-full mx-auto" />
                  <div className="w-6 h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-white absolute bottom-0 left-1/2 -translate-x-1/2" />
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 font-bold tracking-wide uppercase flex items-center gap-1.5 mt-3">
                <Activity size={12} className="text-emerald-400 animate-pulse" />
                <span>Pendulum Arc Angle: {angle.toFixed(1)}°</span>
              </div>
            </div>

            {/* Sliders and data reports */}
            <div className="lg:col-span-5 bg-[#141B26] border border-[#1E2536] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-[#1E2536]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Oscillator Parameters</h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Toggle pendulum thread dimension and gravitational environment.</p>
                </div>

                {/* Slider string size */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-300">Thread Length</span>
                    <span className="font-bold text-emerald-400">{lengthSlider} mm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={lengthSlider}
                    onChange={(e) => setLengthSlider(parseInt(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-[#0E131C] accent-emerald-500 rounded-lg"
                  />
                </div>

                {/* Slider gravity */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-300">Gravitational Acceleration (g)</span>
                    <span className="font-bold text-emerald-400">{gravitySlider} m/s²</span>
                  </div>
                  <input
                    type="range"
                    min="1.6"
                    max="24.8"
                    step="0.1"
                    value={gravitySlider}
                    onChange={(e) => setGravitySlider(parseFloat(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-[#0E131C] accent-emerald-500 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase font-bold">
                    <span>Moon (1.6)</span>
                    <span>Earth (9.8)</span>
                    <span>Jupiter (24.8)</span>
                  </div>
                </div>

                {/* Period math formula */}
                <div className="p-3 bg-[#0E131C] rounded-xl border border-[#1E2536] font-mono text-zinc-300 text-[10.5px]">
                  Formula: <span className="font-bold text-emerald-400">T = 2π × √(L / g)</span>
                  <p className="mt-1">Computed Period: <strong className="text-white font-mono">{(2 * Math.PI * Math.sqrt(lengthSlider / (gravitySlider * 10))).toFixed(3)}s</strong></p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsPlayingPhysics(!isPlayingPhysics)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play size={12} />
                  <span>{isPlayingPhysics ? 'Pause Swing' : 'Resume Oscillation'}</span>
                </button>
                <button
                  onClick={() => { setLengthSlider(120); setGravitySlider(9.8); setAngle(0); }}
                  className="bg-[#0E131C] hover:bg-[#1A2332] text-zinc-300 border border-[#1E2536] p-2.5 rounded-xl transition cursor-pointer"
                  title="Reset Parameters"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARDIAC ECG DIAGNOSTICS */}
        {activeLab === 'cardiac' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Animated Oscilloscope monitor */}
            <div className="lg:col-span-7 bg-[#0A0D14] rounded-2xl border border-[#1E2536] shadow-2xl p-5 flex flex-col justify-between items-center min-h-[310px] text-emerald-400 font-mono">
              <div className="w-full flex justify-between items-center text-[10px] pb-2 border-b border-[#1E2536] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Activity size={12} className="text-emerald-400 animate-pulse" />
                  <span className="text-zinc-200">VITAL SIGNS OSCILLOSCOPE MONITOR v2.04</span>
                </span>
                <span className="font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LIVE SIGNAL</span>
              </div>

              {/* Heart and ECG grid graphs */}
              <div className="w-full h-36 border border-[#1E2536] rounded-xl bg-[#08090A] relative flex items-center justify-center my-3">
                <svg className="w-full h-full absolute inset-0 text-emerald-400">
                  <path
                    d={ecgPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                    transform="scale(8.33, 1.4) translate(0, 0)"
                  />
                </svg>

                <div className="absolute right-3.5 top-3.5 bg-[#0E131C]/90 p-2.5 rounded-lg border border-[#1E2536] space-y-1.5 text-right font-mono min-w-[80px]">
                  <div className="leading-none">
                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 block font-bold">Pulse Rate</span>
                    <span className="text-base font-bold text-emerald-400">{heartRate} <span className="text-[10px] font-normal">bpm</span></span>
                  </div>
                  <div className="leading-none pt-1 border-t border-[#1E2536]">
                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 block font-bold">SPO₂ Ox</span>
                    <span className="text-sm font-bold text-emerald-400">{pulseOx}%</span>
                  </div>
                </div>
              </div>

              <div className="w-full text-left text-[11px] border-t border-[#1E2536] pt-2 flex items-center justify-between text-zinc-300 font-mono">
                <span>Diagnostic Category: <strong className="text-white uppercase font-sans text-xs">{cardiacState} Sinus Track</strong></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Parameters, diagnostics trigger buttons */}
            <div className="lg:col-span-5 bg-[#141B26] border border-[#1E2536] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-[#1E2536]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Trigger ECG Signatures</h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Toggle dynamic cardiac parameters of healthy vs compromised hearts.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', label: 'Sinus Normal', desc: 'Typical healthy rate (60-100 bpm)' },
                    { id: 'arrhythmia', label: 'Sinus Arrhythmia', desc: 'Irregular rhythm intervals' },
                    { id: 'tachy', label: 'Sinus Tachycardia', desc: 'Accelerated sinus beats' },
                    { id: 'brady', label: 'Sinus Bradycardia', desc: 'Slowed pace bradycard' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCardiacState(item.id as any)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer font-mono ${
                        cardiacState === item.id 
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm' 
                          : 'bg-[#0E131C] border-[#1E2536] text-zinc-400 hover:text-white hover:bg-[#161F2E]'
                      }`}
                    >
                      <h4 className="text-[11px] font-bold text-white leading-none">{item.label}</h4>
                      <p className="text-[9px] text-zinc-500 leading-normal mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-[#0E131C] border border-amber-500/20 rounded-xl flex gap-2 items-start text-[10px] leading-relaxed text-zinc-300 font-mono">
                  <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase text-amber-400 block mb-0.5">Emergency Diagnostics Guide</span>
                    <span className="text-zinc-400 font-sans">An extreme Tachycardia waveform (rate &gt; 120 bpm) suggests stress tests or anti-arrhythmic agents depending on patient age limits.</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 text-center italic mt-6">
                💡 ECG graphics are mathematically simulated using SVG path wave calculations.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
