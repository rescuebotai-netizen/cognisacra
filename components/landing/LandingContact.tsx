import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, Terminal } from 'lucide-react';

const HolographicMap = () => (
    <div className="relative w-full h-full bg-[#080B10] overflow-hidden rounded-xl group border border-[#1A2230]">
        {/* Animated Grid with Perspective (Emerald) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', 
                 backgroundSize: '36px 36px',
                 transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-10%)',
                 transformOrigin: 'bottom center'
             }}>
        </div>
        
        {/* Radar/Pulse Effect at Center (Emerald) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 border border-emerald-500/40 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute w-40 h-40 border border-emerald-500/20 rounded-full animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                
                {/* Center Dot */}
                <div className="relative w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] z-10 animate-pulse">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Target Reticle */}
                <div className="absolute -top-10 -left-10 w-6 h-6 border-t-2 border-l-2 border-emerald-400/70 rounded-tl"></div>
                <div className="absolute -top-10 -right-10 w-6 h-6 border-t-2 border-r-2 border-emerald-400/70 rounded-tr"></div>
                <div className="absolute -bottom-10 -left-10 w-6 h-6 border-b-2 border-l-2 border-emerald-400/70 rounded-bl"></div>
                <div className="absolute -bottom-10 -right-10 w-6 h-6 border-b-2 border-r-2 border-emerald-400/70 rounded-br"></div>
            </div>
        </div>

        {/* Data HUD Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#0B0E14]/90 backdrop-blur-md p-3.5 rounded-lg border border-[#1A2230] shadow-2xl max-w-[220px] font-mono">
            <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-400">TELEMETRY: ACTIVE</span>
            </div>
            <div className="text-[10px] text-zinc-400 leading-tight">
                <span className="text-white">NODE:</span> COGNISACRA_GATEWAY<br/>
                <span className="text-zinc-500">REGION:</span> GLOBAL_MESH<br/>
                <span className="text-zinc-500">STATUS:</span> 100% OPERATIONAL
            </div>
        </div>
    </div>
);

const LandingContact: React.FC = () => {
    const [isSent, setIsSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        institution: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSent(true);
    };

    return (
        <div className="bg-[#08090A] text-zinc-100 font-sans antialiased pt-24 min-h-screen">
            <section className="py-20 bg-[#090C11] border-b border-[#1A2230]">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// DIRECT UPLINK &amp; SUPPORT</span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                        Connect With Engineering
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base font-mono max-w-2xl mx-auto">
                        Inquire about enterprise cluster deployment, curriculum publishing, or API integration tokens.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-[#08090A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Left column: Contact info & Holographic Map */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div className="space-y-4 font-mono">
                                <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl flex items-center space-x-4 shadow-xl">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500">Inquiries Gateway</p>
                                        <p className="text-xs font-bold text-white">terminal@cognisacra.ai</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl flex items-center space-x-4 shadow-xl">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500">Command Line Hotline</p>
                                        <p className="text-xs font-bold text-white">+1 (800) 263-4929</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-[#0B0E14] border border-[#1A2230] rounded-xl flex items-center space-x-4 shadow-xl">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500">Network Headquarters</p>
                                        <p className="text-xs font-bold text-white">Silicon Savannah // Cloud Mesh</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-64 rounded-xl overflow-hidden shadow-2xl">
                                <HolographicMap />
                            </div>
                        </div>

                        {/* Right column: Form */}
                        <div className="lg:col-span-7 bg-[#0B0E14] border border-[#1A2230] rounded-xl p-8 sm:p-10 shadow-2xl font-mono">
                            {isSent ? (
                                <div className="text-center py-16 space-y-4">
                                    <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Transmission Received</h3>
                                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                        Your dispatch has been queued in our registry. An engineering lead will acknowledge within 4 UTC hours.
                                    </p>
                                    <button 
                                        onClick={() => setIsSent(false)} 
                                        className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg cursor-pointer"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Your Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="Dr. Ada Lovelace"
                                            className="w-full text-xs font-mono px-4 py-3 rounded-lg border border-[#1A2230] bg-[#08090A] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="developer@institution.edu"
                                            className="w-full text-xs font-mono px-4 py-3 rounded-lg border border-[#1A2230] bg-[#08090A] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Institution / Organization</label>
                                        <input
                                            type="text"
                                            value={formData.institution}
                                            onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                            placeholder="Imperial STEM Institute"
                                            className="w-full text-xs font-mono px-4 py-3 rounded-lg border border-[#1A2230] bg-[#08090A] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Message Payload</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            placeholder="Specify deployment parameters, curriculum size, or integration requirements..."
                                            className="w-full text-xs font-mono px-4 py-3 rounded-lg border border-[#1A2230] bg-[#08090A] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <Send size={14} />
                                        <span>&gt; TRANSMIT MESSAGE</span>
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingContact;
