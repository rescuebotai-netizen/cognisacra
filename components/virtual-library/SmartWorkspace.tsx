import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Mic, CheckSquare, Plus, Network, ListTodo, HelpCircle, Palette, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  date: string;
  body: string;
}

interface MindNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface KanbanCard {
  id: string;
  title: string;
  column: 'todo' | 'progress' | 'done';
}

export default function SmartWorkspace() {
  const [activeTab, setActiveTab] = useState<'notes' | 'mindmap' | 'canvas' | 'kanban'>('notes');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Circular Manufacturing Kenya', date: '2026-06-18', body: 'Exploring use of biological waste fibers in structural insulation boards around Kisumu County.' },
    { id: '2', title: 'Solar Sandbox Parameters', date: '2026-06-19', body: 'Voltage settings for high load hours: set standard resistance at 0.45 ohm, target peak current 12A.' }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [waveForms, setWaveForms] = useState<number[]>([]);

  // Canvas State & Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#10B981');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Mindmap State
  const [mindNodes, setMindNodes] = useState<MindNode[]>([
    { id: '1', label: 'My Research Topic', x: 200, y: 150, color: '#10B981' },
    { id: '2', label: 'Literature Gaps', x: 60, y: 70, color: '#06B6D4' },
    { id: '3', label: 'Methodology Study', x: 340, y: 70, color: '#3B82F6' },
    { id: '4', label: 'Pan-African Datasets', x: 60, y: 230, color: '#F59E0B' },
    { id: '5', label: 'Simulation Tests', x: 340, y: 230, color: '#8B5CF6' },
  ]);

  // Kanban State
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([
    { id: '1', title: 'Review circular economy certifications with supervisor', column: 'todo' },
    { id: '2', title: 'Run Chemistry Titration lab trials and report pH curves', column: 'progress' },
    { id: '3', title: 'Complete digital passport verification steps', column: 'done' }
  ]);
  const [newKanbanText, setNewKanbanText] = useState('');

  // Voice Recording Simulator
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveForms(Array.from({ length: 15 }, () => Math.floor(Math.random() * 24) + 4));
      }, 100);
    } else {
      setWaveForms([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setNewNoteBody(prev => prev ? prev + " [Voice Note Added: Reviewing sustainable structures with local authorities]" : "Reviewing sustainable structures with local authorities");
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const item: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      date: new Date().toISOString().split('T')[0],
      body: newNoteBody
    };
    setNotes([item, ...notes]);
    setNewNoteTitle('');
    setNewNoteBody('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Drawing Canvas logic
  useEffect(() => {
    if (activeTab === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      }
    }
  }, [activeTab, brushColor, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = isEraser ? '#0A0D14' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleRegenerateMindmap = () => {
    const topics = [
      "African Grid Integration", "Solar Cell Optimizers", "Thermal Energy Dissipation",
      "Socio-Economic Impacts", "Regulatory Approvals", "Microgrid Networks"
    ];
    const randomizedNodes = [
      { id: '1', label: 'Solar Sandbox Target', x: 200, y: 150, color: '#10B981' },
      ...topics.map((t, idx) => {
        const radius = 110;
        const angle = (idx * 2 * Math.PI) / topics.length;
        return {
          id: (idx + 2).toString(),
          label: t,
          x: Math.round(200 + radius * Math.cos(angle)),
          y: Math.round(150 + radius * Math.sin(angle)),
          color: ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899'][idx % 6]
        };
      })
    ];
    setMindNodes(randomizedNodes);
  };

  const handleAddKanbanCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKanbanText.trim()) return;
    const card: KanbanCard = {
      id: Date.now().toString(),
      title: newKanbanText.trim(),
      column: 'todo'
    };
    setKanbanCards([...kanbanCards, card]);
    setNewKanbanText('');
  };

  const moveKanbanCard = (id: string, targetCol: 'todo' | 'progress' | 'done') => {
    setKanbanCards(kanbanCards.map(c => c.id === id ? { ...c, column: targetCol } : c));
  };

  return (
    <div className="bg-[#0E131C] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-[#1E2536] pb-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
            CogniSacra Study Cockpit • Notebook & Board
          </span>
          <h2 className="text-xl font-bold font-serif text-white mt-1.5">Smart Study Workspace</h2>
          <p className="text-xs text-zinc-400 font-mono">An integrated private deck to manage homework, audio diaries, mindmaps, and kanban cards.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[#141B26] border border-[#1E2536] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'notes' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Pencil size={11} />
            <span>Diary Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'mindmap' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Network size={11} />
            <span>Mind Maps</span>
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'canvas' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette size={11} />
            <span>Doodle Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'kanban' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListTodo size={11} />
            <span>Kanban Boards</span>
          </button>
        </div>
      </div>

      <div className="min-h-[380px]">
        {/* TAB 1: Notebook & Voice logs */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddNote} className="lg:col-span-5 bg-[#141B26] border border-[#1E2536] p-5 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider">Write or Speak Study Note</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bioenergy structures project..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[#1E2536] bg-[#0E131C] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Note Details</label>
                  
                  {/* Speech Recorder */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase transition cursor-pointer ${
                      isRecording 
                        ? 'bg-emerald-500 text-black animate-pulse shadow-lg shadow-emerald-500/20' 
                        : 'bg-[#0E131C] hover:bg-[#1A2332] text-zinc-300 border border-[#1E2536]'
                    }`}
                  >
                    <Mic size={10} className={isRecording ? 'text-black' : 'text-emerald-400'} />
                    <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>

                {isRecording && (
                  <div className="flex items-end justify-center gap-0.5 h-6 bg-[#0E131C] px-3 rounded-lg border border-emerald-500/30 py-1.5">
                    {waveForms.map((val, idx) => (
                      <span key={idx} className="w-1 bg-emerald-400 rounded-full transition-all" style={{ height: `${val}px` }} />
                    ))}
                  </div>
                )}

                <textarea
                  placeholder="Draft your detailed formulas, summary notes, or bibliography links here..."
                  rows={4}
                  value={newNoteBody}
                  onChange={(e) => setNewNoteBody(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-[#1E2536] bg-[#0E131C] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Save to Workspace Vault
              </button>
            </form>

            <div className="lg:col-span-7 bg-[#141B26] rounded-2xl border border-[#1E2536] p-6 shadow-xl overflow-y-auto max-h-[385px] grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="border border-[#1E2536] bg-[#0E131C] p-4 rounded-xl shadow flex flex-col justify-between h-[140px] hover:border-emerald-500/30 transition">
                  <div>
                    <div className="flex justify-between items-start mb-1 text-[10px] text-zinc-500 font-mono">
                      <span className="font-bold text-emerald-400">{note.date}</span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-zinc-500 hover:text-red-400 transition cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="font-bold text-white text-xs font-mono">{note.title}</h4>
                    <p className="text-xs text-zinc-400 leading-normal mt-2 line-clamp-3 font-sans">{note.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Mind Map Builder */}
        {activeTab === 'mindmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-[#0A0D14] rounded-2xl border border-[#1E2536] p-4 shadow-xl flex items-center justify-center min-h-[320px] relative">
              <svg width="100%" height="300" className="max-w-[420px]">
                {mindNodes.map(node => {
                  if (node.id === '1') return null;
                  const centerNode = mindNodes[0];
                  return (
                    <line
                      key={`link-${node.id}`}
                      x1={centerNode.x}
                      y1={centerNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="#243046"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {mindNodes.map(node => (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                      r={node.id === '1' ? 24 : 16}
                      fill={node.color}
                      className="shadow-md"
                    />
                    <text
                      y={node.id === '1' ? 38 : 28}
                      textAnchor="middle"
                      fontSize="9px"
                      fontWeight="700"
                      className="fill-zinc-300 font-mono select-none whitespace-nowrap"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="lg:col-span-4 bg-[#141B26] border border-[#1E2536] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 pb-2.5 border-b border-[#1E2536]">
                  <Network size={12} className="text-emerald-400" />
                  <span>Interactive Mind Map Compiler</span>
                </h3>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed mt-3">
                  Instantly structure active learning trajectories by clustering your active notes and voice recordings into responsive topological structures.
                </p>
              </div>

              <button
                onClick={handleRegenerateMindmap}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer mt-4"
              >
                Regenerate Mind Map
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Canvas Board Sandbox */}
        {activeTab === 'canvas' && (
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Whiteboard Workspace -> Dark Digital Chalkboard Canvas */}
            <div className="flex-1 bg-[#0A0D14] rounded-2xl border border-[#1E2536] shadow-2xl overflow-hidden flex items-center justify-center p-2 min-h-[310px]">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[300px] bg-[#0A0D14] cursor-crosshair rounded-xl touch-none"
              />
            </div>

            {/* Canvas Customization Toolbar */}
            <div className="w-full lg:w-52 bg-[#141B26] border border-[#1E2536] p-4 rounded-2xl flex flex-row lg:flex-col justify-between lg:justify-start gap-4 shadow-xl">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 block tracking-widest">Brush Color</span>
                <div className="flex lg:grid lg:grid-cols-3 gap-2">
                  {['#10B981', '#06B6D4', '#3B82F6', '#F59E0B', '#A855F7', '#FFFFFF'].map(color => (
                    <button
                      key={color}
                      onClick={() => { setBrushColor(color); setIsEraser(false); }}
                      className="w-6 h-6 rounded-full border border-zinc-700 transition relative hover:scale-110 shrink-0 cursor-pointer"
                      style={{ backgroundColor: color }}
                    >
                      {brushColor === color && !isEraser && (
                        <Check size={11} className="text-black absolute inset-0 m-auto font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 font-mono">
                <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-widest">Brush Width ({brushSize}px)</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full cursor-pointer h-1.5 bg-[#0E131C] accent-emerald-500 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow justify-end font-mono">
                <button
                  onClick={() => setIsEraser(!isEraser)}
                  className={`w-full text-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition border cursor-pointer ${
                    isEraser 
                      ? 'bg-emerald-500 text-black border-emerald-500 shadow' 
                      : 'bg-[#0E131C] hover:bg-[#1A2332] text-zinc-300 border-[#1E2536]'
                  }`}
                >
                  {isEraser ? 'Active: Eraser' : 'Toggle Eraser'}
                </button>
                <button
                  onClick={clearCanvas}
                  className="w-full text-center py-2 bg-[#0E131C] text-zinc-300 hover:text-white border border-[#1E2536] rounded-lg text-[10px] font-bold uppercase tracking-wider transition hover:bg-[#1A2332] cursor-pointer"
                >
                  Wipe Doodle Board
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Agile study boards (Kanban) */}
        {activeTab === 'kanban' && (
          <div className="space-y-4">
            <form onSubmit={handleAddKanbanCard} className="flex gap-2 bg-[#141B26] border border-[#1E2536] p-2 rounded-xl max-w-lg">
              <input
                type="text"
                placeholder="Assign a localized thesis task or simulator study detail..."
                value={newKanbanText}
                onChange={(e) => setNewKanbanText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 rounded-lg flex items-center font-mono font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20">
                <Plus size={12} className="mr-1" /> Add Card
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['todo', 'progress', 'done'] as const).map(col => {
                const filtered = kanbanCards.filter(c => c.column === col);
                return (
                  <div key={col} className="bg-[#141B26] border border-[#1E2536] rounded-2xl p-4 min-h-[220px] flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#1E2536]">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400">
                          {col === 'todo' ? '🎯 Study Queue' : col === 'progress' ? '⚡ Active Operations' : '🏆 Completed Trials'}
                        </span>
                        <span className="bg-[#0E131C] border border-[#1E2536] text-emerald-400 text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-mono font-bold">
                          {filtered.length}
                        </span>
                      </div>

                      <div className="space-y-2 mt-3.5 pr-1 max-h-48 overflow-y-auto">
                        {filtered.map(card => (
                          <div key={card.id} className="bg-[#0E131C] border border-[#1E2536] p-3 rounded-xl shadow-sm text-xs text-zinc-200 hover:border-emerald-500/30 transition">
                            <p className="font-sans leading-relaxed">{card.title}</p>
                            
                            <div className="flex gap-1.5 justify-end mt-2 pt-2 border-t border-[#1E2536] font-mono">
                              {col !== 'todo' && (
                                <button
                                  onClick={() => moveKanbanCard(card.id, col === 'progress' ? 'todo' : 'progress')}
                                  className="text-[9px] font-bold text-zinc-400 hover:text-white bg-[#141B26] border border-[#1E2536] px-2 py-0.5 rounded text-center transition cursor-pointer"
                                >
                                  ← Back
                                </button>
                              )}
                              {col !== 'done' && (
                                <button
                                  onClick={() => moveKanbanCard(card.id, col === 'todo' ? 'progress' : 'done')}
                                  className="text-[9px] font-bold text-black hover:bg-emerald-400 bg-emerald-500 px-2 py-0.5 rounded text-center transition cursor-pointer shadow-sm shadow-emerald-500/20"
                                >
                                  Forward →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
