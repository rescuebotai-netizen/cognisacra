import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, MapPin, Globe } from 'lucide-react';

const ContactView: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    return (
        <div className="w-full animate-fade-in bg-[#0E131C] p-6 sm:p-10 rounded-2xl shadow-xl text-zinc-200">
            <div className="text-center mb-8 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                    Sovereign Academic Network
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">Get in Touch</h1>
                <p className="text-xs sm:text-sm font-mono text-zinc-400">Direct inquiries to the CogniSacra Academic Operations Team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4 bg-[#141B26] p-6 rounded-2xl text-left">
                    <div>
                        <label htmlFor="name" className="block text-xs font-mono font-semibold text-zinc-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Dr. Sarah Chen"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E131C] text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition" 
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-mono font-semibold text-zinc-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="scholar@university.edu"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E131C] text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition" 
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-xs font-mono font-semibold text-zinc-300 mb-1">Message</label>
                        <textarea 
                            id="message" 
                            rows={4} 
                            required 
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your inquiry, curriculum partnership, or institutional integration requirement..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E131C] text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition"
                        ></textarea>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 bg-emerald-500 text-black font-mono font-bold text-xs rounded-xl hover:bg-emerald-400 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Send size={14} />
                            <span>{submitted ? 'Transmission Dispatched!' : 'Send Academic Transmission'}</span>
                        </button>
                    </div>
                    {submitted && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2 animate-fade-in">
                            <CheckCircle2 size={16} />
                            <span>Thank you. Your message has been received by our gateway nodes.</span>
                        </div>
                    )}
                </form>

                {/* Contact Info */}
                <div className="space-y-4 text-left">
                    <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                            <Mail size={14} />
                            <span>Institutional Inquiries</span>
                        </div>
                        <p className="text-xs text-zinc-300">academic@cognisacra.edu</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Response turnaround: &lt; 4 hours</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                            <Phone size={14} />
                            <span>Academic Dispatch Desk</span>
                        </div>
                        <p className="text-xs text-zinc-300">+1 (800) 840-COGNISACRA</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Mon–Fri, 08:00 – 18:00 UTC</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                            <Globe size={14} />
                            <span>Decentralized Node Mesh</span>
                        </div>
                        <p className="text-xs text-zinc-300">Global Academic Sovereign Ledger Network</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Nodes active across 42 partner universities</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactView;
