import { create } from "zustand";

interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  recognition: SpeechRecognition | null;
  
  // Actions
  startListening: () => void;
  stopListening: () => void;
  initializeSpeechRecognition: () => void;
  onSpeechResult: (callback: (transcript: string, confidence: number) => void) => void;
  clearTranscript: () => void;
}

// Global callback for speech results
let speechResultCallback: ((transcript: string, confidence: number) => void) | null = null;

export const useSpeechRecognition = create<SpeechRecognitionState>((set, get) => ({
  isListening: false,
  isSupported: false,
  transcript: "",
  confidence: 0,
  recognition: null,

  initializeSpeechRecognition: () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      set({ isSupported: false });
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event) => {
      const result = event.results[0];
      const transcript = result[0].transcript.toLowerCase().trim();
      const confidence = result[0].confidence;
      
      console.log(`Speech recognized: "${transcript}" (confidence: ${confidence})`);
      
      set({ 
        transcript,
        confidence,
        isListening: false 
      });

      // Call the registered callback
      if (speechResultCallback) {
        speechResultCallback(transcript, confidence);
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      set({ isListening: false });
    };

    // Handle end
    recognition.onend = () => {
      set({ isListening: false });
    };

    set({ 
      recognition,
      isSupported: true 
    });
  },

  startListening: () => {
    const { recognition, isSupported } = get();
    
    if (!isSupported || !recognition) {
      console.log("Speech recognition not available");
      return;
    }

    try {
      recognition.start();
      set({ 
        isListening: true,
        transcript: "",
        confidence: 0 
      });
      console.log("Started listening...");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  },

  stopListening: () => {
    const { recognition } = get();
    
    if (recognition) {
      recognition.stop();
      set({ isListening: false });
      console.log("Stopped listening");
    }
  },

  onSpeechResult: (callback) => {
    speechResultCallback = callback;
  },

  clearTranscript: () => {
    set({ transcript: "", confidence: 0 });
  }
}));