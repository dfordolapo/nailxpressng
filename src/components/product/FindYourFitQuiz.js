"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import styles from "./FindYourFitQuiz.module.css";
import ProductCard from "@/components/product/ProductCard";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";

const QUESTIONS = [
  {
    id: "vibe",
    question: "What's your current vibe?",
    options: [
      { id: "vibe_minimalist", text: "Cozy & Minimalist", image: "/images/everyday.png" },
      { id: "vibe_glam", text: "Glam & Dramatic", image: "/images/glamour.png" },
      { id: "vibe_artistic", text: "Fun & Artistic", image: "/images/art.png" },
    ],
  },
  {
    id: "shape",
    question: "What's your ideal length & shape?",
    options: [
      { id: "shape_short", text: "Short & Practical", image: "/images/factory-collection.png" },
      { id: "shape_medium", text: "Medium & Classic", image: "/images/shapes/almond.png" },
      { id: "shape_long", text: "Long & Fierce", image: "/images/shapes/stiletto.png" },
    ],
  },
  {
    id: "color",
    question: "Pick a color mood!",
    options: [
      { id: "color_nude", text: "Nudes & Earth Tones", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80" },
      { id: "color_dark", text: "Dark & Moody", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80" },
      { id: "color_pop", text: "Pops of Color", image: "https://images.unsplash.com/photo-1528362359491-039cfa39cd28?auto=format&fit=crop&w=800&q=80" },
    ],
  }
];

export default function FindYourFitQuiz({ allProducts = [] }) {
  const [step, setStep] = useState(0); // 0 = start, 1-3 = questions, 4 = loading, 5 = results
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const handleStart = () => setStep(1);

  const handleAnswer = (questionId, optionId) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    setStep(QUESTIONS.length + 1); // Loading state
    
    setTimeout(() => {
      const scoredProducts = allProducts.map(product => {
        let score = 0;
        const textToSearch = `${product.name} ${product.description} ${product.category} ${product.tags?.join(' ')} ${product.colors?.join(' ')}`.toLowerCase();
        
        // Vibe Scoring
        if (finalAnswers.vibe === 'vibe_minimalist' && (textToSearch.includes('minimal') || textToSearch.includes('everyday') || textToSearch.includes('simple') || textToSearch.includes('nude') || textToSearch.includes('clear'))) score += 2;
        if (finalAnswers.vibe === 'vibe_glam' && (textToSearch.includes('glam') || textToSearch.includes('luxury') || textToSearch.includes('sparkle') || textToSearch.includes('gold') || textToSearch.includes('crystal'))) score += 2;
        if (finalAnswers.vibe === 'vibe_artistic' && (textToSearch.includes('art') || textToSearch.includes('paint') || textToSearch.includes('vibrant') || textToSearch.includes('bold'))) score += 2;

        // Shape/Length Scoring
        if (finalAnswers.shape === 'shape_short') {
            if (product.category === 'factory') score += 3; // Factory sets are short and have prices
            if (textToSearch.includes('short') || textToSearch.includes('square')) score += 1;
        }
        if (finalAnswers.shape === 'shape_medium' && (textToSearch.includes('medium') || textToSearch.includes('almond'))) score += 2;
        if (finalAnswers.shape === 'shape_long' && (textToSearch.includes('long') || textToSearch.includes('stiletto') || product.category === 'handmade')) score += 2;

        // Color Scoring
        if (finalAnswers.color === 'color_nude' && (textToSearch.includes('nude') || textToSearch.includes('brown') || textToSearch.includes('beige') || textToSearch.includes('pink'))) score += 2;
        if (finalAnswers.color === 'color_dark' && (textToSearch.includes('dark') || textToSearch.includes('black') || textToSearch.includes('midnight') || textToSearch.includes('ruby'))) score += 2;
        if (finalAnswers.color === 'color_pop' && (textToSearch.includes('color') || textToSearch.includes('bright') || textToSearch.includes('neon') || textToSearch.includes('blue') || textToSearch.includes('green'))) score += 2;

        return { ...product, score };
      });

      scoredProducts.sort((a, b) => b.score - a.score || 0.5 - Math.random());
      
      const selected = scoredProducts.slice(0, 3);
      setRecommendations(selected);
      setStep(QUESTIONS.length + 2); // Results state
    }, 1500);
  };

  const handleRetake = () => {
    setAnswers({});
    setStep(1);
    setRecommendations([]);
  };

  return (
    <div className={styles.quizContainer}>
      {step === 0 && (
        <div className={styles.startScreen}>
          <h2 className={styles.title}>Style Quiz</h2>
          <p className={styles.subtitle}>
            Not sure which set is for you? Take our 3-question quiz to get personalized recommendations.
          </p>
          <button className={styles.startBtn} onClick={handleStart}>
            Take the Quiz
          </button>
        </div>
      )}

      {step > 0 && step <= QUESTIONS.length && (
        <div className={styles.questionScreen}>
          <div className={styles.progressHeader}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className={styles.progressText}>{step} / {QUESTIONS.length}</span>
          </div>

          <h3 className={styles.questionTitle}>{QUESTIONS[step - 1].question}</h3>

          <div className={styles.optionsGrid}>
            {QUESTIONS[step - 1].options.map((option) => (
              <div 
                key={option.id} 
                className={styles.optionCard}
                onClick={() => handleAnswer(QUESTIONS[step - 1].id, option.id)}
              >
                <div className={styles.optionImageWrapper}>
                  {/* using regular img tag for placeholder support before we generate real next/image paths */}
                  <img src={option.image} alt={option.text} className={styles.optionImage} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <div className={styles.optionText}>{option.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === QUESTIONS.length + 1 && (
        <div className={styles.loadingScreen}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Curating your recommendations...</p>
        </div>
      )}

      {step === QUESTIONS.length + 2 && (
        <div className={styles.resultsScreen}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.title}>Your Curated Picks</h2>
            <p className={styles.subtitle}>
              We analyzed your vibe, and these sets are calling your name!
            </p>
          </div>

          <div className={styles.resultsGrid}>
            {recommendations.map((product, i) => (
              <div key={product.id}>
                {product.category === 'handmade' ? (
                  <HandmadeProductCard product={product} index={i} />
                ) : (
                  <ProductCard product={product} index={i} />
                )}
              </div>
            ))}
          </div>

          <button className={styles.retakeBtn} onClick={handleRetake}>
            <RotateCcw size={16} /> Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
