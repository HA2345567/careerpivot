import React, { useState } from 'react';
import { FAQS } from '../constants';
import { SectionHeader } from './ui/Primitives';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-zinc-900/30 border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <SectionHeader 
            title="Common Questions" 
            centered={true}
        />
        
        <div className="space-y-4">
            {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <div 
                        key={index} 
                        className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden"
                    >
                        <button 
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="flex items-center justify-between w-full p-6 text-left transition-colors hover:bg-zinc-900"
                        >
                            <span className="font-semibold text-zinc-200 pr-8">{faq.question}</span>
                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-zinc-500" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-zinc-500" />
                            )}
                        </button>
                        {isOpen && (
                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4 bg-zinc-900/20">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
