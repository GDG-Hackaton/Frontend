import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function VoiceInput({ onTranscript, language = 'am-ET' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  
  const languages = [
    { code: 'am-ET', name: 'አማርኛ (Amharic)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' }
  ];
  
  useEffect(() => {
    // Check browser support
    const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(isSpeechSupported);
    
    if (!isSpeechSupported) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported');
      return;
    }
    
    setError(null);
    setInterimText('');
    finalTranscriptRef.current = '';
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.maxAlternatives = 3;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        toast.success(`Listening in ${languages.find(l => l.code === selectedLanguage)?.name}...`);
      };
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;
          
          if (result.isFinal) {
            finalTranscriptRef.current += transcript + ' ';
            setFinalText(finalTranscriptRef.current);
            
            // Log confidence for debugging
            if (confidence < 0.5) {
              console.warn('Low confidence transcript:', transcript, confidence);
            }
          } else {
            interimTranscript += transcript;
          }
        }
        
        setInterimText(interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        const errorMessages = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'No microphone found. Please check your microphone.',
          'not-allowed': 'Microphone permission denied. Please allow microphone access.',
          'network': 'Network error. Please check your connection.',
          'aborted': 'Recording was aborted.',
          'language-not-supported': `Language ${selectedLanguage} not supported. Try English.`
        };
        
        const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
        setError(message);
        toast.error(message);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        // Process final transcript
        if (finalTranscriptRef.current) {
          onTranscript(finalTranscriptRef.current.trim());
          toast.success('Voice captured successfully!');
        } else {
          toast.warning('No speech was captured');
        }
        
        setIsProcessing(false);
      };
      
      recognitionRef.current.start();
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          stopRecording();
          toast.info('Recording auto-stopped after 30 seconds');
        }
      }, 30000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Failed to start recording. Please try again.');
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const clearText = () => {
    setFinalText('');
    setInterimText('');
    finalTranscriptRef.current = '';
    onTranscript('');
  };
  
  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Speech recognition is not supported in your browser. 
          Please use Chrome, Edge, or Safari.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Language Selector */}
      <div className="flex gap-2">
        {languages.map(lang => (
          <Badge
            key={lang.code}
            variant={selectedLanguage === lang.code ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => !isRecording && setSelectedLanguage(lang.code)}
          >
            {lang.name}
          </Badge>
        ))}
      </div>
      
      {/* Recording Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          size="lg"
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`
            w-32 h-32 rounded-full transition-all transform hover:scale-105
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
          `}
        >
          {isProcessing ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : isRecording ? (
            <Square className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12" />
          )}
        </Button>
      </div>
      
      {/* Status */}
      <div className="text-center">
        {isRecording ? (
          <p className="text-red-600 font-medium flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 animate-pulse" />
            Recording... Click to stop
          </p>
        ) : isProcessing ? (
          <p className="text-blue-600">Processing voice...</p>
        ) : (
          <p className="text-gray-500">Click the microphone to start speaking</p>
        )}
      </div>
      
      {/* Live Transcript */}
      {(interimText || finalText) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">Transcript:</h4>
            {finalText && (
              <Button variant="ghost" size="sm" onClick={clearText}>
                Clear
              </Button>
            )}
          </div>
          
          <p className="text-gray-900 whitespace-pre-wrap">
            {finalText}
            {interimText && (
              <span className="text-gray-400 italic"> {interimText}</span>
            )}
          </p>
          
          {finalText && (
            <p className="text-xs text-gray-500 mt-2">
              Click "AI Extract" to analyze this text
            </p>
          )}
        </div>
      )}
      
      {/* Tips */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium text-blue-800 mb-1">Voice Input Tips:</p>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Speak clearly and at a moderate pace</li>
          <li>Minimize background noise</li>
          <li>Describe the person and location in detail</li>
          <li>Amharic language is supported</li>
        </ul>
      </div>
    </div>
  );
}
