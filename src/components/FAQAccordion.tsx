import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className={`faq-question ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleItem(index)}
            aria-expanded={activeIndex === index}
          >
            {item.question}
          </button>
          <div 
            className="faq-answer"
            style={{ maxHeight: activeIndex === index ? '500px' : '0px' }}
            aria-hidden={activeIndex !== index}
          >
            <div className="faq-answer-content">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
