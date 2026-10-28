import React, { useState } from 'react';
import { Search, Compass, Network, Award, Milestone, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  description: string;
  connectedTo: string[];
}

const INITIAL_NODES: Node[] = [
  { id: 'center', label: 'Circular Economy', category: 'Sustainable Systems', x: 250, y: 250, description: 'An industrial system that is restorative or regenerative by intention and design. Focuses on Africa-wide localized closed loops.', connectedTo: ['energy', 'policy', 'agri', 'mfg', 'waste'] },
  { id: 'energy', label: 'Renewable Power Systems', category: 'Engineering & Technology', x: 100, y: 130, description: 'Decentralized microgrid layouts and modular clean wind/solar solutions for rural African grids.', connectedTo: ['center', 'agri'] },
  { id: 'policy', label: 'Environmental Law', category: 'Public Policy', x: 400, y: 130, description: 'Pan-African legal guidelines governing waste stream responsibilities and carbon sequestration targets.', connectedTo: ['center', 'waste'] },
  { id: 'agri', label: 'Agroecology Systems', category: 'Agriculture & Science', x: 100, y: 370, description: 'Integrating modern organic nutrient re-uptakes with indigenous African crop rotation standards.', connectedTo: ['center', 'energy'] },
  { id: 'mfg', label: 'Inclusive Eco-design', category: 'Economics & Industry', x: 400, y: 370, description: 'Micro-manufacturing techniques optimizing local materials (sisal, bamboo, hemp) in industrial designs.', connectedTo: ['center'] },
  { id: 'waste', label: 'Municipal Waste Recovery', category: 'Environmental Science', x: 250, y: 70, description: 'Advanced municipal upcycling centers converting bio-waste to high-value fertilizers in rapid urban zones.', connectedTo: ['center', 'policy'] }
];

export default function LibraryGraphUniverse() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('center');
  const [inputValue, setInputValue] = useState<string>('');
  const [isGeneratingPath, setIsGeneratingPath] = useState<boolean>(false);
  const [generatedPath, setGeneratedPath] = useState<string[] | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    const newNodes = [
      { id: 'center', label: query, category: 'Central Inquiry', x: 250, y: 250, description: `The primary node of ${query}. Dynamic clustering mapped elements based on deep repository metadata.`, connectedTo: ['node1', 'node2', 'node3', 'node4'] },
      { id: 'node1', label: `${query} Socio-Ethics`, category: 'Sociology & Public Good', x: 100, y: 150, description: `Exploring the human-centric and regulatory guidelines mapping to ${query}.`, connectedTo: ['center'] },
      { id: 'node2', label: `Advanced Applied ${query}`, category: 'Computational STEM', x: 400, y: 150, description: `High-fidelity modeling, sandbox simulations, and algorithm structures of ${query}.`, connectedTo: ['center'] },
      { id: 'node3', label: `Climate-Impact & ${query}`, category: 'Global Sustainability', x: 120, y: 350, description: `Ecological and long-term climate adjustments connected with ${query}.`, connectedTo: ['center'] },
      { id: 'node4', label: `${query} Economics`, category: 'African Market Systems', x: 380, y: 350, description: `Translating the technological core of ${query} into viable community markets.`, connectedTo: ['center'] },
    ];
    setNodes(newNodes);
    setSelectedNodeId('center');
    setGeneratedPath(null);
  };

  const triggerGeneratePath = () => {
    setIsGeneratingPath(true);
    setTimeout(() => {
      setIsGeneratingPath(false);
      setGeneratedPath([
        `Foundations of ${selectedNode.label}`,
        `Core Methodologies & Case Studies in Sub-Saharan regions`,
        `Advanced Architectural Integrations & Sandbox testing`,
        `Synthesized Thesis defense & Peer Review publications`
      ]);
    }, 1500);
  };

  return (
    <div className="bg-[#0E131C] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
            Intelligent Discovery Mode
          </span>
          <h2 className="text-xl font-bold font-serif text-white mt-1.5">AI Knowledge Universe</h2>
          <p className="text-xs text-zinc-400 font-mono">Discover multi-disciplinary intersections with dynamic clustering maps.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-96">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="e.g. Climate Change, Machine Learning..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-9 px-4 py-2 text-xs rounded-xl border border-[#1E2536] bg-[#141B26] text-zinc-100 font-mono placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none transition"
            />
          </div>
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs px-4 py-2 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/20 cursor-pointer">
            Cluster
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Screen Graph */}
        <div className="lg:col-span-7 bg-[#0A0D14] rounded-2xl border border-[#1A2230] shadow-xl overflow-hidden relative min-h-[420px] flex items-center justify-center">
          
          <div className="absolute top-4 left-4 flex gap-1.5 text-[10px] bg-[#141B26] border border-[#1E2536] px-2.5 py-1 rounded-lg text-emerald-400 font-mono font-bold">
            <Network size={12} className="text-emerald-400" />
            <span>Interactive Node Topology</span>
          </div>

          <svg width="100%" height="100%" viewBox="0 0 500 450" className="max-w-[450px]">
            {/* Draw Links */}
            {nodes.map(node => (
              node.connectedTo.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                const isHighlighted = selectedNodeId === node.id || selectedNodeId === targetId;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#10B981' : '#243046'}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeDasharray={isHighlighted ? '0' : '4 4'}
                    className="transition-all duration-300"
                  />
                );
              })
            ))}

            {/* Draw Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isCenter = node.id === 'center';
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isCenter ? 32 : 18}
                    fill={isSelected ? '#10B981' : (isCenter ? '#141B26' : '#0E131C')}
                    stroke={isSelected ? '#34D399' : (isCenter ? '#10B981' : '#1E2536')}
                    strokeWidth={isSelected ? 3.5 : (isCenter ? 2 : 1.5)}
                    className="transition-all duration-300 shadow group-hover:scale-110"
                  />
                  {/* Icon or symbol shorthand */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={isCenter ? '10px' : '9px'}
                    fontWeight="800"
                    fill={isSelected ? '#000000' : '#E2E8F0'}
                    className="select-none font-mono"
                  >
                    {isCenter ? 'ECO' : node.label.substring(0, 3).toUpperCase()}
                  </text>
                  {/* Tooltip labels within standard coordinates */}
                  <text
                    y={isCenter ? 46 : 28}
                    textAnchor="middle"
                    fontSize="10px"
                    fontWeight="700"
                    fill={isSelected ? '#10B981' : '#94A3B8'}
                    className="select-none drop-shadow pointer-events-none font-sans"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details side panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#141B26] border border-[#1E2536] rounded-2xl p-5 shadow-xl">
          <div>
            <div className="flex justify-between items-start gap-2 mb-3">
              <span className="bg-[#0E131C] text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                {selectedNode.category}
              </span>
              <Compass size={16} className="text-zinc-500" />
            </div>

            <h3 className="text-base font-bold text-white font-serif">{selectedNode.label}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed mt-2.5 font-sans">{selectedNode.description}</p>

            <div className="mt-5 pt-4 border-t border-[#1E2536]">
              <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 mb-2">Interdisciplinary Connections</h4>
              <div className="space-y-1.5">
                {selectedNode.connectedTo.map(cid => {
                  const sibling = nodes.find(n => n.id === cid);
                  if (!sibling) return null;
                  return (
                    <div 
                      key={cid}
                      onClick={() => setSelectedNodeId(cid)}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-emerald-400 cursor-pointer transition py-0.5 font-mono"
                    >
                      <ArrowRight size={11} className="text-emerald-400" />
                      <span>{sibling.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E2536]">
            <button
              onClick={triggerGeneratePath}
              disabled={isGeneratingPath}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition duration-300 cursor-pointer"
            >
              <Sparkles size={13} className={isGeneratingPath ? 'animate-spin' : ''} />
              <span>{isGeneratingPath ? 'Mapping AI Trail...' : 'Generate Learning Pathway'}</span>
            </button>

            {generatedPath && (
              <div className="mt-4 p-3 bg-[#0E131C] rounded-xl border border-emerald-500/20 space-y-2.5 animate-fade-in text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px] tracking-widest">
                  <Milestone size={12} />
                  <span>Custom Adaptive Trail Map</span>
                </div>
                <div className="space-y-2 relative border-l border-emerald-500/30 pl-3.5 ml-1">
                  {generatedPath.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute left-[-18.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0E131C]" />
                      <span className="font-bold text-zinc-200 block">{step}</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">Est. Study: {idx === 0 ? '2 hours' : '1.5 weeks'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
