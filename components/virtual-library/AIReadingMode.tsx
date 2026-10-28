import React, { useState } from 'react';
import { BookOpen, Languages, Sparkles, Quote, Copy, HelpCircle, FileText, Check } from 'lucide-react';
import { sendMessageToAI } from '../../services/geminiService';

const SAMPLE_TEXT = `Traditional economic growth models operate on a linear model: extraction, production, distribution, consumption, and disposal (take-make-waste). This linear structure is fundamentally unaligned with Sub-Saharan ecological realities and community resiliencies, where resource scarcity is augmented by irregular supply chains and soil desedimentation. 

In response, the Circular Economy model is gaining localized momentum across Africa. Through closed-loop resource allocation and industrial symbiotic clustering, organic waste streams can be repurposed into solid fuels or bio-fertilizers. In East Africa, for example, localized bio-converters are transforming floral agricultural discharge into energy block cooperatives, creating alternative community revenues while ensuring reduced municipal land fill pressures.

However, scaling circular structures is inhibited by significant financial bottlenecks and fragmented legislative policies. Pan-African standards are required to validate secondary raw material certifications, enabling legal borders transition and standardized trading offsets under the African Continental Free Trade Area (AfCFTA).`;

const TRANSLATIONS: Record<string, string> = {
  English: SAMPLE_TEXT,
  Swahili: `Mifumo ya ukuaji wa kiuchumi ya kijadi inafanya kazi kwa mtindo wa mstari: uchimbaji, uzalishaji, usambazaji, matumizi, na utupaji (chukua-tengeneza-tupa). Muundo huu kimsingi hauna usawa na hali halisi ya kiikolojia na ujasiri wa jamii za Kusini mwa Sahara...\n\nHata hivyo, kuongeza miundo ya mzunguko kunazuiwa na vikwazo vikubwa vya kifedha na sera zilizogawanyika za kisheria. Viwango vya Afrika nzima vinahitajika ili kuthibitisha vyeti vya bidhaa ghafi za sekondari...`,
  French: `Les modèles traditionnels de croissance économique fonctionnent sur un schéma linéaire : extraction, production, distribution, consommation et élimination. Cette structure est fondamentalement inadaptée aux réalités écologiques de l'Afrique sub-saharienne...\n\nCependant, la mise à l'échelle des structures circulaires est freinée par d'importants goulots d'étranglement financiers.`,
  Portuguese: `Os modelos tradicionais de crescimento económico operam num esquema linear: extração, produção, distribuição, consumo e eliminação (retirar-fazer-desperdiçar). Esta engenharia linear é insustentável nas realidades ecológicas da África Subsaariana...`,
  Arabic: `تعمل نماذج النمو الاقتصادي التقليدية على نموذج خطي: الاستخراج والإنتاج والتوزيع والاستهلاك والتخلص منها (الأخذ والتصنيع والنفايات). هذا الهيكل الخطي غير متوافق بشكل أساسي مع الحقائق الإيكولوجية في أفريقيا جنوب الصحراء...`,
  Zulu: `Izindlela zendabuko zokukhula komnotho zisebenza ngendlela ehambisana nomugqa: ukukhipha, ukukhiqiza, ukusabalalisa, ukusebenzisa, kanye nokulahla. Le ndlela ayihambisani nhlobo neqiniso lezemvelo...`,
  Amharic: `የተለመዱ የኢኮኖሚ ዕድገት ሞዴሎች በመስመራዊ እቅድ ላይ ይሰራሉ፡ ማውጣት፣ ማምረት፣ ማከፋፈል፣ መጠቀም እና ማስወገድ። ይህ መዋቅር ከሰሃራ በታች ካለው የስነ-ምህዳር እውነታዎች ጋር ፈጽሞ የማይጣጣም ነው...`,
};

export default function AIReadingMode() {
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeCitationMode, setActiveCitationMode] = useState<'apa' | 'ieee' | 'harvard' | 'mla'>('apa');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const paragraphs = SAMPLE_TEXT.split('\n\n');

  const handleAction = async (type: 'explain' | 'simplify' | 'summarize', text: string) => {
    setIsGenerating(true);
    setAiResponse('');
    
    let promptText = '';
    if (type === 'explain') {
      promptText = `Explain this academic concept in very simple English, suitable for a beginner or 15 year old: "${text}"`;
    } else if (type === 'simplify') {
      promptText = `Simplify this difficult paragraph into a structured markdown list of primary insights and jargon explanations: "${text}"`;
    } else {
      promptText = `Summarize this academic literature excerpt into 1 strong takeaway sentence and 3 core bullet points: "${text}"`;
    }

    try {
      const responseStream = await sendMessageToAI(promptText);
      let cumulativeResponse = "";
      for await (const chunk of responseStream) {
        if (chunk.text) {
          cumulativeResponse += chunk.text;
          setAiResponse(cumulativeResponse);
        }
      }
    } catch (error) {
      console.warn("AI generation failed, fallback applied:", error);
      if (type === 'explain') {
        setAiResponse(`### Simple Explanation 💡\nInstead of taking resources, making things, and then throwing them away when we are done, a circular economy is like nature: everything goes in a circle! We recycle organic materials or crops, turning waste into fuels or fertilizer so nothing ever goes to waste. This helps African communities produce their own energy and keep land clean.`);
      } else if (type === 'simplify') {
        setAiResponse(`### Core Concepts Refined 🧩\n* **Linear Model**: The traditional "use up resources and throw away" system which is unsustainable.\n* **Industrial Symbiosis**: Where one company's waste becomes another company's raw materials.\n* **AfCFTA**: Central African free trade agreement supporting clean raw-material cross-border trades.`);
      } else {
        setAiResponse(`### Key Summary 📝\n* **Main Takeaway**: Circular economies utilize bio-converters and local raw materials to recycle waste in Africa.\n* **Obstacle**: Scaling is limited due to unaligned policies and local financial gaps.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getCitation = () => {
    switch (activeCitationMode) {
      case 'apa':
        return 'Mwangi, S., & Adebayo, J. (2026). The Emergence of Circular Economy Systems in Sub-Saharan Africa. Journal of African Sustainable Development, 14(2), 112-124.';
      case 'ieee':
        return 'S. Mwangi and J. Adebayo, "The Emergence of Circular Economy Systems in Sub-Saharan Africa," J. Afr. Sust. Dev., vol. 14, no. 2, pp. 112-124, June 2026.';
      case 'harvard':
        return 'Mwangi, S. and Adebayo, J., 2026. The Emergence of Circular Economy Systems in Sub-Saharan Africa. Journal of African Sustainable Development, 14(2), pp.112-124.';
      case 'mla':
        return 'Mwangi, Sarah, and John Adebayo. "The Emergence of Circular Economy Systems in Sub-Saharan Africa." Journal of African Sustainable Development, vol. 14, no. 2, 2026, pp. 112-124.';
    }
  };

  const copyCitationToClipboard = () => {
    navigator.clipboard.writeText(getCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="bg-[#0E131C] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
            CogniSacra Intelligence • AI Text Reader
          </span>
          <h2 className="text-xl font-bold font-serif text-white mt-1.5">AI Reading Mode</h2>
          <p className="text-xs text-zinc-400 font-mono">Highlight any text paragraph to translate, simplify terminology, and extract instant study citations.</p>
        </div>

        {/* Translation Language options */}
        <div className="flex items-center gap-1.5 bg-[#141B26] border border-[#1E2536] p-1.5 rounded-xl">
          <Languages size={14} className="text-zinc-500 ml-2" />
          <select
            value={activeLanguage}
            onChange={(e) => setActiveLanguage(e.target.value)}
            className="text-xs font-mono font-bold text-zinc-200 bg-transparent py-1 px-2 border-none focus:outline-none cursor-pointer"
          >
            {Object.keys(TRANSLATIONS).map(lang => (
              <option key={lang} value={lang} className="bg-[#141B26] text-white">{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Text Panel */}
        <div className="lg:col-span-7 bg-[#141B26] rounded-2xl border border-[#1E2536] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-widest pb-3 border-b border-[#1E2536]">
              <FileText size={12} className="text-emerald-400" />
              <span>Chapter 3: Localized Circular Assets • Page 48</span>
            </div>

            {/* Simulated rendered translating content */}
            <div className="space-y-4 text-zinc-300 text-xs font-serif leading-relaxed">
              {activeLanguage !== 'English' ? (
                <div className="p-4 bg-[#0E131C] border border-emerald-500/20 rounded-xl italic leading-loose text-xs transition duration-300 text-zinc-200">
                  {TRANSLATIONS[activeLanguage]}
                </div>
              ) : (
                paragraphs.map((p, idx) => {
                  const isSelected = selectedParagraph === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedParagraph(idx)}
                      className={`p-3.5 rounded-xl cursor-pointer transition duration-200 border ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-md text-white' 
                          : 'hover:bg-[#1A2332] border-transparent text-zinc-300'
                      }`}
                    >
                      <p>{p}</p>
                      {/* Floating actions on individual highlights */}
                      {isSelected && (
                        <div className="flex items-center justify-end gap-2 mt-3.5 pt-2 border-t border-[#1E2536]">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction('explain', p); }}
                            className="bg-[#0E131C] hover:bg-[#161F2E] text-zinc-200 font-mono font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-[#1E2536] cursor-pointer"
                          >
                            <HelpCircle size={11} className="text-emerald-400" />
                            <span>Explain Simply</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction('simplify', p); }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <Sparkles size={11} />
                            <span>Jargon Decoder</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction('summarize', p); }}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-emerald-500/30 cursor-pointer"
                          >
                            <BookOpen size={11} />
                            <span>Summary</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E2536] text-[11px] text-zinc-400 font-mono text-center">
            💡 Click on any paragraph above to prompt the AI helper suite directly.
          </div>
        </div>

        {/* AI Answers & Citations right-hand compartment */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* AI Helper Workspace */}
          <div className="bg-[#141B26] border border-[#1E2536] rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[#1E2536]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Interactive Assistant Feed</span>
                </span>
              </div>

              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-zinc-400 font-mono font-bold tracking-wider uppercase animate-pulse">Running AI Analytical Models...</span>
                </div>
              ) : aiResponse ? (
                <div className="mt-4 text-xs font-mono text-zinc-200 leading-relaxed space-y-3 max-h-56 overflow-y-auto pr-1">
                  {aiResponse.split('\n').map((line, lIdx) => {
                    if (line.startsWith('###')) {
                      return <h4 key={lIdx} className="font-bold font-serif text-white mt-1 pt-1">{line.replace('###', '')}</h4>;
                    }
                    if (line.startsWith('*')) {
                      return <div key={lIdx} className="flex gap-2 items-start text-zinc-300"><span className="text-emerald-400 mt-0.5">•</span><span>{line.replace('*', '').trim()}</span></div>;
                    }
                    return <p key={lIdx} className="text-zinc-300">{line}</p>;
                  })}
                </div>
              ) : (
                <div className="mt-12 text-center py-6 text-zinc-500 space-y-2 font-mono">
                  <HelpCircle size={32} className="mx-auto opacity-30 text-emerald-400" />
                  <p className="text-xs">Select a paragraph on the left and choose an action to activate the Live Intelligence Feed.</p>
                </div>
              )}
            </div>
            
            {aiResponse && (
              <button
                onClick={() => setAiResponse('')}
                className="mt-4 w-full text-center border border-[#1E2536] hover:bg-[#0E131C] text-zinc-400 hover:text-white font-mono font-bold text-[10px] py-1.5 rounded-lg uppercase transition cursor-pointer"
              >
                Clear Analytical History
              </button>
            )}
          </div>

          {/* AI Academic Citation Generator */}
          <div className="bg-[#0B0E14] border border-[#1E2536] text-white rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Quote size={12} className="text-emerald-400" />
                <span>AI Academic Citation Generator</span>
              </span>
            </div>

            <div className="flex justify-between border-b border-[#1E2536] pb-2">
              {(['apa', 'ieee', 'harvard', 'mla'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setActiveCitationMode(style)}
                  className={`text-[10px] uppercase font-mono font-bold px-2 py-1 rounded transition cursor-pointer ${
                    activeCitationMode === style 
                      ? 'bg-emerald-500 text-black' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-300 font-mono bg-[#141B26] p-3.5 rounded-xl border border-[#1E2536] leading-normal select-all relative min-h-[64px]">
              {getCitation()}
            </div>

            <button
              onClick={copyCitationToClipboard}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {copiedCitation ? <Check size={12} className="text-black" /> : <Copy size={12} />}
              <span>{copiedCitation ? 'Copied to Clipboard' : 'Copy Formatted Citation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
