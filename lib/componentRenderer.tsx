'use client';

import { lazy, Suspense } from 'react';
import { MessageComponent } from '@/types/chat';
import { CreditCardData, ComparisonData } from '@/types/card';

// Lazy load heavy financial components for better performance
const CreditCardComponent = lazy(() => 
  import('@/components/financial/CreditCardComponent').then(mod => ({ default: mod.CreditCardComponent }))
);

const ComparisonGrid = lazy(() => 
  import('@/components/financial/ComparisonGrid').then(mod => ({ default: mod.ComparisonGrid }))
);

interface ComponentRendererProps {
  component: MessageComponent;
}

// Loading fallback component
function ComponentLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-pulse flex space-x-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
      </div>
    </div>
  );
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  switch (component.type) {
    case 'credit-card':
      return (
        <Suspense fallback={<ComponentLoader />}>
          <CreditCardComponent card={component.data as CreditCardData} />
        </Suspense>
      );
    
    case 'comparison-grid':
      return (
        <Suspense fallback={<ComponentLoader />}>
          <ComparisonGrid data={component.data as ComparisonData} />
        </Suspense>
      );
    
    default:
      // Handle unknown component types gracefully
      console.warn(`Unknown component type: ${component.type}`);
      return null;
  }
}
