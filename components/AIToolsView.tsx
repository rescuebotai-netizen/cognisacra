
import React, { useState, useCallback, useRef } from 'react';
import { generateImage, analyzeMedia, editImage, transcribeAudio } from '../services/geminiService';
import PhotoIcon from './icons/PhotoIcon';
import PencilIcon from './icons/PencilIcon';
import DocumentMagnifyingGlassIcon from './icons/DocumentMagnifyingGlassIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import SparklesIcon from './icons/SparklesIcon';
import UploadIcon from './icons/UploadIcon';
import XMarkIcon from './icons/XMarkIcon';

type AITool = 'image-gen' | 'image-edit' | 'media-analysis' | 'audio-transcribe';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const AIToolsView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AITool>('image-gen');

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">AI Tools Suite</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Your creative co-pilot for content generation and analysis.</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex flex-wrap -mb-px space-x-6">
                    <ToolTabButton isActive={activeTool === 'image-gen'} onClick={() => setActiveTool('image-gen')}><PhotoIcon className="w-5 h-5 mr-2" /> Image Generation</ToolTabButton>
                    <ToolTabButton isActive={activeTool === 'image-edit'} onClick={() => setActiveTool('image-edit')}><PencilIcon className="w-5 h-5 mr-2" /> Image Editing</ToolTabButton>
                    <ToolTabButton isActive={activeTool === 'media-analysis'} onClick={() => setActiveTool('media-analysis')}><DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" /> Media Analysis</ToolTabButton>
                    <ToolTabButton isActive={activeTool === 'audio-transcribe'} onClick={() => setActiveTool('audio-transcribe')}><MicrophoneIcon className="w-5 h-5 mr-2" /> Audio Transcription</ToolTabButton>
                </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 min-h-[60vh] border border-gray-200 dark:border-gray-700">
                {activeTool === 'image-gen' && <ImageGenerator />}
                {activeTool === 'image-edit' && <ImageEditor />}
                {activeTool === 'media-analysis' && <MediaAnalyzer />}
                {activeTool === 'audio-transcribe' && <AudioTranscriber />}
            </div>
        </div>
    );
};

const ToolTabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center py-3 px-1 border-b-2 font-semibold transition-colors ${
            isActive
                ? 'border-crimson text-crimson dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

// Individual Tool Components

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        try {
            const response = await generateImage(prompt, aspectRatio);
            const base64Image = response.generatedImages[0].image.imageBytes;
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Image Generation</h2>
                <div>
                    <label htmlFor="img-prompt" className="block text-sm font-medium">Prompt</label>
                    <textarea id="img-prompt" rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" placeholder="A futuristic university campus on Mars, digital art..." />
                </div>
                <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium">Aspect Ratio</label>
                    <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson">
                        <option>1:1</option><option>16:9</option><option>9:16</option><option>4:3</option><option>3:4</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full py-2 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-gray-400 flex justify-center items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center p-4 h-full min-h-[300px]">
                {isLoading && <div className="text-center"><SparklesIcon className="w-10 h-10 animate-spin mx-auto" /><p className="mt-2">Generating your image...</p></div>}
                {error && <p className="text-red-500">{error}</p>}
                {generatedImage && <img src={generatedImage} alt="Generated art" className="max-w-full max-h-full object-contain rounded-md" />}
                {!isLoading && !generatedImage && !error && <p className="text-gray-500">Your generated image will appear here</p>}
            </div>
        </div>
    );
};

const ImageEditor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setEditedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(f);
        }
    };

    const handleEdit = async () => {
        if (!file || !prompt) return;
        setIsLoading(true);
        setError('');
        setEditedImage(null);
        try {
            const base64Data = await fileToBase64(file);
            const response = await editImage(base64Data, file.type, prompt);
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (e) {
            console.error(e);
            setError('Failed to edit image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Image Editing</h2>
                <div>
                    <label className="block text-sm font-medium">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="mt-1 w-full py-2 font-semibold border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-center items-center">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        {file ? 'Change Image' : 'Select Image'}
                    </button>
                </div>
                 <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-medium">Editing Instruction</label>
                    <textarea id="edit-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-crimson focus:ring-crimson" placeholder="e.g., Add a retro filter to the image" />
                </div>
                <button onClick={handleEdit} disabled={isLoading || !prompt || !file} className="w-full py-2 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-gray-400 flex justify-center items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Editing...' : 'Apply Edit'}
                </button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-2 h-full min-h-[300px]">
                <div className="flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-2">
                    {filePreview ? <img src={filePreview} alt="Original" className="max-w-full max-h-full object-contain rounded-md" /> : <p className="text-gray-500 text-sm text-center">Original image</p>}
                </div>
                <div className="flex items-center justify-center p-2">
                    {isLoading && <div className="text-center"><SparklesIcon className="w-10 h-10 animate-spin mx-auto" /><p className="mt-2 text-sm">Applying edit...</p></div>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {editedImage && <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-md" />}
                    {!isLoading && !editedImage && !error && <p className="text-gray-500 text-sm text-center">Edited image will appear here</p>}
                </div>
            </div>
        </div>
    );
};

const MediaAnalyzer: React.FC = () => { /* ... Placeholder for MediaAnalyzer ... */ return <p>Media Analyzer Coming Soon</p>};
const AudioTranscriber: React.FC = () => { /* ... Placeholder for AudioTranscriber ... */ return <p>Audio Transcriber Coming Soon</p>};


export default AIToolsView;
