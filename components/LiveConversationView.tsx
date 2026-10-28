
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import SignalIcon from './icons/SignalIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

const API_KEY = process.env.API_KEY;

// Base64 and Audio Decoding/Encoding Functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const LiveConversationView: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [transcripts, setTranscripts] = useState<{ user: string, model: string }[]>([]);
    const [currentInterimTranscript, setCurrentInterimTranscript] = useState('');

    const sessionRef = useRef<any>(null); // Using `any` for session promise result
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);

    const stopSession = useCallback(() => {
        if (sessionRef.current) {
            sessionRef.current.close();
            sessionRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
         if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
             inputAudioContextRef.current.close();
        }
        setIsSessionActive(false);
        setStatus('Idle');
    }, []);

    const startSession = async () => {
        if (!API_KEY) {
            setStatus('Error: API_KEY not configured.');
            return;
        }
        if (isSessionActive) return;

        setIsSessionActive(true);
        setStatus('Initializing...');
        setTranscripts([]);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            // FIX: Cast window to `any` to allow checking for vendor-prefixed webkitAudioContext for broader browser support.
            inputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to `any` to allow checking for vendor-prefixed webkitAudioContext for broader browser support.
            outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            
            let currentInput = '';
            let currentOutput = '';

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('Connected. Listening...');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio output
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current) {
                            const ctx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }

                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription?.text) {
                            currentInput += message.serverContent.inputTranscription.text;
                            setCurrentInterimTranscript(currentInput);
                        }
                        if (message.serverContent?.outputTranscription?.text) {
                            currentOutput += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            if (currentInput || currentOutput) {
                                setTranscripts(prev => [...prev, { user: currentInput, model: currentOutput }]);
                                currentInput = '';
                                currentOutput = '';
                                setCurrentInterimTranscript('');
                            }
                        }

                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session Error:', e);
                        setStatus(`Error: ${e.message}`);
                        stopSession();
                    },
                    onclose: () => {
                        console.log('Session closed.');
                        setStatus('Session ended.');
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                },
            });
            
            sessionRef.current = await sessionPromise;

        } catch (error) {
            console.error('Failed to start session:', error);
            setStatus(`Error: Could not start session. Check microphone permissions.`);
            setIsSessionActive(false);
        }
    };
    
    useEffect(() => {
        return () => stopSession();
    }, [stopSession]);


    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="text-center z-10 w-full max-w-2xl">
                <SignalIcon className="w-16 h-16 text-crimson mx-auto mb-4" />
                <h1 className="text-3xl font-extrabold font-serif">Live AI Conversation</h1>
                <p className="mt-2 text-lg text-gray-400">Speak directly with Gemini in real-time.</p>
                <p className="mt-4 font-mono px-4 py-2 bg-gray-800 rounded-md">Status: {status}</p>

                <div className="mt-8 text-left bg-black/30 p-4 rounded-lg h-64 overflow-y-auto space-y-4">
                    {transcripts.map((t, i) => (
                        <div key={i}>
                            <p><strong className="text-blue-400">You:</strong> {t.user}</p>
                            <p><strong className="text-green-400">Gemini:</strong> {t.model}</p>
                        </div>
                    ))}
                    {currentInterimTranscript && (
                         <div>
                            <p><strong className="text-blue-400">You:</strong> <span className="text-gray-400 italic">{currentInterimTranscript}</span></p>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    {!isSessionActive ? (
                        <button 
                            onClick={startSession}
                            className="px-12 py-4 font-bold text-lg text-white bg-crimson rounded-full shadow-lg shadow-crimson/50 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                        >
                            <MicrophoneIcon className="w-6 h-6 inline-block mr-3" />
                            Start Conversation
                        </button>
                    ) : (
                        <button 
                            onClick={stopSession}
                            className="px-12 py-4 font-bold text-lg text-white bg-gray-600 rounded-full shadow-lg hover:bg-gray-500 transition-all duration-300"
                        >
                            End Conversation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveConversationView;
