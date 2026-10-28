
// FIX: Add missing imports for Modality and GenerateContentResponse
import { GoogleGenAI, Chat, Type, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || (typeof window !== 'undefined' && (window as any).__GEMINI_KEY__) || '';

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set; Gemini features will prompt or use fallback responses.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'AIzaSyDemoKeyFallback0000000000000000' });

let tutorChat: Chat | null = null;
let architectChat: Chat | null = null;

export const startTutorChat = (): Chat => {
  if (tutorChat) {
    return tutorChat;
  }
  tutorChat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are CogniSacra AI, a friendly and expert educational tutor. Your goal is to help users understand complex topics by providing clear, concise explanations, step-by-step examples, and encouraging feedback. Always be patient and supportive. Break down difficult concepts into smaller, easy-to-digest parts. Ask clarifying questions to better understand the user\'s needs.',
    },
  });
  return tutorChat;
};

export const startArchitectChat = (): Chat => {
  if (architectChat) {
    return architectChat;
  }
  architectChat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
        systemInstruction: `You are the AI Architect for the CogniSacra Academy platform, a specialized AI assistant for course instructors. Your primary function is to provide expert, data-driven coaching to help them create world-class courses.

        You have access to simulated platform analytics data. When an instructor asks for help, you MUST use this data to inform your suggestions. Frame your responses as an expert instructional designer. Be encouraging and strategic.

        **Simulated Platform Data:**
        - **Trending Learner Skills:** "Data Analysis with Python", "Advanced State Management (React)", "UI/UX for AI Products", "Cloud Security Fundamentals", "Sustainable Business Practices".
        - **Most Requested Course Topics:** "Introduction to Machine Learning", "Mobile App Development with React Native", "Digital Marketing Analytics", "Ethical Hacking & Cybersecurity".
        - **Common Learner Pain Points:** "Understanding asynchronous JavaScript", "Practical application of design theories", "Setting up a proper cloud development environment".

        **Your Tasks:**
        1.  **Brainstorming & Validation:** When an instructor suggests a course idea, validate it against the trending data. Suggest angles that align with what learners are looking for.
        2.  **Curriculum Design:** Help instructors structure their courses. Suggest modules, lesson plans, and project ideas. Recommend formats (video, quiz, project) that fit the topic.
        3.  **Content Generation:** Generate drafts for course descriptions, learning outcomes, quiz questions, and project assignments based on the instructor's needs and platform data.
        4.  **Engagement Strategy:** Provide ideas for making courses more engaging, referencing common learner pain points.

        **Example Interaction:**
        - **Instructor:** "I want to make a course about JavaScript."
        - **You:** "That's a great idea, JavaScript is a foundational skill! Platform data shows learners often struggle with asynchronous concepts like Promises and async/await. We could build a fantastic, project-based module around that. We could even design a project where they build a small application that fetches data from an API to solidify their understanding. How does that sound as a starting point?"
        `
    },
  });
  return architectChat;
};

export const sendMessageToTutor = async (message: string) => {
  const chatInstance = startTutorChat();
  return chatInstance.sendMessageStream({ message });
};

export const sendMessageToArchitect = async (message: string) => {
  const chatInstance = startArchitectChat();
  return chatInstance.sendMessageStream({ message });
};

// FIX: Add missing sendMessageToAI function for one-off streaming content generation.
export const sendMessageToAI = async (prompt: string) => {
  return ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
};

// FIX: Implement and export getQuickAnswer for the dashboard widget.
export const getQuickAnswer = async (question: string): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
    });
    return response;
};

// FIX: Implement and export generateImage for the AI Tools view.
export const generateImage = async (prompt: string, aspectRatio: string) => {
    return ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });
};

// FIX: Implement and export editImage for the AI Tools view.
export const editImage = async (base64Data: string, mimeType: string, prompt: string) => {
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    return ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
};

// FIX: Add placeholder for analyzeMedia to resolve import error.
export const analyzeMedia = async () => {
    console.warn("analyzeMedia is not implemented");
    return Promise.resolve(null);
};

// FIX: Add placeholder for transcribeAudio to resolve import error.
export const transcribeAudio = async () => {
    console.warn("transcribeAudio is not implemented");
    return Promise.resolve(null);
};

// FIX: Implement and export sendMessageToBot for the chatbot with grounding capabilities.
export const sendMessageToBot = async (
    message: string, 
    location: { latitude: number; longitude: number } | null
) => {
    const tools: any[] = [{ googleSearch: {} }];
    let toolConfig: any = {};

    if (location) {
        // Maps grounding is only supported in Gemini 2.5 series models.
        tools.push({ googleMaps: {} });
        toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
            }
        };
    }

    return ai.models.generateContentStream({
        model: 'gemini-2.5-flash', // Must keep 2.5 for Maps support
        contents: message,
        config: {
            tools: tools,
            ...(Object.keys(toolConfig).length > 0 && { toolConfig: toolConfig }),
        },
    });
};


const languageNames: { [key: string]: string } = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    sw: 'Swahili',
    zh: 'Chinese',
};

export const translateText = async (text: string, targetLanguageCode: string): Promise<string> => {
    if (!text || !targetLanguageCode || targetLanguageCode === 'en') {
        return text;
    }

    const targetLanguage = languageNames[targetLanguageCode] || 'the target language';
    
    try {
        const prompt = `Translate the following English text to ${targetLanguage}. Do not translate proper nouns like names of people (e.g., Alex), companies, or specific technologies (e.g., React). Respond only with the translated text, without any additional explanation or quotation marks.\n\nText: "${text}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        return response.text.trim();
    } catch (error) {
        console.error(`Translation error for "${text}" to ${targetLanguage}:`, error);
        return text; // Fallback to original text on error
    }
};

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: 'The question text.' },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of exactly 4 possible answers.'
    },
    answer: { type: Type.STRING, description: 'The correct answer, which must be one of the provided options.' },
    explanation: { type: Type.STRING, description: 'A brief explanation for why the answer is correct.' },
  },
  required: ['question', 'options', 'answer', 'explanation'],
};

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export const generateAdaptiveQuestion = async (
    topic: string,
    history: { question: string; userAnswer: string; isCorrect: boolean }[]
): Promise<QuizQuestion> => {
    
    let prompt = `You are an expert quizmaster creating an adaptive quiz on the topic: "${topic}".
    The user's performance history is provided below (most recent answer first). Analyze the history to generate a new, unique multiple-choice question.
    
    Quiz History: ${JSON.stringify(history, null, 2)}
    
    Instructions:
    1.  If the user's last answer was correct, create a new question that is slightly more difficult or covers a related, more advanced concept.
    2.  If the user's last answer was incorrect, create a new question that is slightly easier, reinforces the same concept, or covers a foundational prerequisite.
    3.  The new question must be different from all previous questions in the history.
    4.  Provide exactly 4 options.
    5.  The 'answer' field must exactly match one of the strings in the 'options' array.
    6.  Provide a concise explanation for the correct answer.
    
    Generate the next question based on this history.`;

    if (history.length === 0) {
        prompt = `You are an expert quizmaster creating an adaptive quiz on the topic: "${topic}". 
        Generate an initial, medium-difficulty multiple-choice question about this topic.
        
        Instructions:
        1.  Provide exactly 4 options.
        2.  The 'answer' field must exactly match one of the strings in the 'options' array.
        3.  Provide a concise explanation for the correct answer.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });

        const jsonText = response.text.trim();
        const questionData = JSON.parse(jsonText);
        
        if (!questionData.question || !Array.isArray(questionData.options) || questionData.options.length !== 4 || !questionData.answer) {
             throw new Error("Generated question has an invalid format.");
        }

        return questionData as QuizQuestion;
    } catch (error) {
        console.error("Error generating adaptive question:", error);
        throw new Error("Failed to generate a new question from the AI model.");
    }
};

export const getReviewSuggestions = async (
    incorrectQuestions: { question: string; userAnswer: string; }[],
    transcripts: { lessonTitle: string; transcript: string }[]
): Promise<string> => {
    
    const incorrectAnswersString = incorrectQuestions.map(q => `- Question: "${q.question}"\n  Your Answer: "${q.userAnswer}"`).join('\n');
    const transcriptsString = transcripts.map(t => `--- TRANSCRIPT from lesson "${t.lessonTitle}" ---\n${t.transcript}`).join('\n\n');

    const prompt = `
        A user has just failed a quiz and needs help understanding their mistakes. Below are the questions they answered incorrectly and the transcripts from relevant course lessons. 
        Your task is to:
        1. For each incorrect question, identify the most relevant section from the provided transcripts that explains the correct concept.
        2. Provide a brief, encouraging explanation of why their answer was wrong and what the correct concept is.
        3. Quote the small, most relevant snippet of the transcript (2-3 sentences max).
        4. Format your response clearly using Markdown for readability. Use headings for each question.

        Here are the incorrect answers:
        ${incorrectAnswersString}

        Here are the available transcripts:
        ${transcriptsString}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });

    return response.text.trim();
};
