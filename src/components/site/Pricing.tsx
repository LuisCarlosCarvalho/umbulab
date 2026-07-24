import React from 'react';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  features?: string[];
  isPopular?: boolean;
}

export interface PricingProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export function Pricing({ title = "Planos e Preços", subtitle, plans }: PricingProps) {
  if (!plans || plans.length === 0) return null;

  return (
    <section className="w-full py-24 bg-neutral-50 text-neutral-900 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xl text-neutral-500 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.isPopular 
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xl scale-105 z-10' 
                  : 'bg-white text-neutral-900 border-neutral-200 hover:shadow-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Mais Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-extrabold">{plan.price}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {(plan.features || ["Feature incrível inclusa", "Suporte 24/7", "Acesso total"]).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={plan.isPopular ? 'text-neutral-300' : 'text-neutral-600'}>{feat}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.isPopular 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                }`}
                disabled
              >
                Escolher Plano
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
