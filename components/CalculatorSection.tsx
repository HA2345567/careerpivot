import React from 'react';
import { SalaryBridgeCalculator } from './SalaryBridgeCalculator';
import { SectionHeader } from './ui/Primitives';

const CalculatorSection = () => {
  return (
    <section id="calculator" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
          title="Calculate Your Escape" 
          subtitle="Stop guessing. See exactly how much runway you need to leave your job safely."
          centered={true}
        />
        
        <div className="max-w-5xl mx-auto">
          <SalaryBridgeCalculator />
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-zinc-500 text-sm">
            *This calculator provides a simplified estimate based on your inputs. 
            The full CareerPivot app includes tax calculations, COBRA/healthcare costs, and dynamic inflation adjustments.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
