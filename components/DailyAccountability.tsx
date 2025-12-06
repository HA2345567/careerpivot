import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from './ui/Primitives';
import { Send, MessageSquare, Phone, Battery, Wifi, Signal, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const DailyAccountability = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hey! I'm your pivot coach. 🤖 Feeling stuck or frustrated today? Vent here. I'll turn your rant into one tiny, actionable step.",
      timestamp: new Date()
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `You are an empathetic but action-oriented career accountability bot.
        The user is sending you a "vent" or complaint about their job.
        
        Your goal:
        1. Validate their feeling briefly (3-5 words).
        2. Give them ONE tiny, concrete "micro-step" they can do right now to move towards their career pivot goal.
        3. Keep it under 160 characters (SMS length).
        4. Use 1 relevant emoji.
        
        User Vent: "${userMsg.text}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const botResponse = response.text || "I hear you. Take a deep breath. 🧘 Let's focus on what you can control: update one bullet point on your resume tonight.";

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMsg]);
      } else {
        // Simulation Mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: "That sounds draining. 😤 Micro-step: Spend just 15 mins listing your wins from this project. You'll need them for your portfolio.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "Connection fuzzy. 📡 But don't give up. Try sending that again.",
          timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Context */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            Turn Venting into Velocity
          </h3>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Most career pivots fail because the daily grind wears you down. 
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed mt-4">
            Our <strong>AI Accountability Agent</strong> lives in your pocket. Text us your frustrations, and we instantly convert them into productive micro-tasks. 
          </p>
        </div>

        <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <span className="font-bold text-lg">😡</span>
                </div>
                <div>
                    <h4 className="font-bold text-zinc-200">You Vent</h4>
                    <p className="text-sm text-zinc-500">"My boss just rejected my proposal for no reason. I hate it here."</p>
                </div>
            </div>
             <div className="flex justify-center">
                <div className="h-8 w-px bg-zinc-800"></div>
             </div>
             <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Bot className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-200">We Redirect</h4>
                    <p className="text-sm text-zinc-500">"That stings. Use that energy: Write down 3 skills you used in that proposal. Add them to your 'Wins' folder now. 📂"</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="gap-2">
                Start 7-Day SMS Trial
            </Button>
            <p className="text-xs text-zinc-500 self-center">No credit card required.</p>
        </div>
      </div>

      {/* Right Column: Phone Simulator */}
      <div className="lg:col-span-7 flex justify-center lg:justify-end">
        <div className="relative w-[320px] md:w-[375px] h-[650px] bg-zinc-950 rounded-[3rem] border-8 border-zinc-900 shadow-2xl flex flex-col overflow-hidden ring-1 ring-zinc-800">
            
            {/* Dynamic Island / Notch Area */}
            <div className="absolute top-0 w-full h-14 bg-zinc-950/90 backdrop-blur-sm z-20 flex items-center justify-between px-6 pt-2">
                <span className="text-xs font-semibold text-white">9:41</span>
                <div className="w-24 h-6 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2"></div>
                <div className="flex gap-1.5 items-center">
                    <Signal className="h-3 w-3 text-white" />
                    <Wifi className="h-3 w-3 text-white" />
                    <Battery className="h-3 w-3 text-white" />
                </div>
            </div>

            {/* Chat Header */}
            <div className="pt-16 pb-4 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3 shadow-sm z-10">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                    CP
                </div>
                <div>
                    <div className="text-sm font-bold text-white">CareerPivot Bot</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Online
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 bg-zinc-950 p-4 overflow-y-auto space-y-4 scroll-smooth"
            >
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-primary text-white rounded-br-sm' 
                                    : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700'
                            }`}
                        >
                            {msg.text}
                            <div className={`text-[9px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-primary-foreground' : 'text-zinc-500'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isProcessing && (
                     <div className="flex w-full justify-start animate-pulse">
                        <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 border border-zinc-700">
                             <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                             <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                             <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary placeholder-zinc-600"
                        disabled={isProcessing}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessing}
                        className="absolute right-1.5 top-1.5 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 w-full flex justify-center pb-2 pointer-events-none">
                 <div className="w-32 h-1 bg-zinc-800 rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};
