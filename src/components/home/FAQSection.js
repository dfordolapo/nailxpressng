"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQSection.module.css';

const FAQ_DATA = [
  {
    id: 1,
    question: "How long do the nails last?",
    answer: "With proper application and care, your press-on nails can last up to 2-3 weeks using our premium glue, or 3-5 days when using adhesive tabs."
  },
  {
    id: 2,
    question: "Will they damage my natural nails?",
    answer: "Not at all! Safe application and, more importantly, proper removal are key. Avoid tearing them off; instead, follow our gentle soak-off guide to protect your natural nails."
  },
  {
    id: 3,
    question: "Do you do private labelling?",
    answer: "Yes, we offer custom manufacturing and private labelling solutions for brands looking to launch their own press-on nail lines. Contact our support team for bulk inquiries."
  },
  {
    id: 4,
    question: "Do you ship worldwide?",
    answer: "Absolutely! We ship our premium press-on nails globally with fast, tracked shipping options to make sure you get your sets wherever you are."
  },
  {
    id: 5,
    question: "Which is better? Nail glue or adhesive tabs",
    answer: "It depends on your wear goals! Nail glue is perfect for long-term wear (up to 3 weeks), while adhesive tabs are ideal for short-term wear (1-3 days), quick style changes, and keeping the nails reusable."
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div className={styles.accordionList}>
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                <button 
                  className={styles.questionButton} 
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      className={styles.answerWrapper}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className={styles.answerContent}>
                        <p className={styles.answerText}>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
