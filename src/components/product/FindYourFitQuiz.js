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
      { id: "vibe_minimalist", text: "Cozy & Minimalist", image: "/images/factory-made/0A09BD69-438E-4EA3-A4B6-790A9E08DADB.jpg" },
      { id: "vibe_glam", text: "Glam & Dramatic", image: "/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg" },
      { id: "vibe_artistic", text: "Fun & Artistic", image: "/images/Handmade/IMG_3267.jpg" },
    ],
  },
  {
    id: "shape",
    question: "What's your ideal length?",
    options: [
      { id: "shape_short", text: "Short & Practical", image: "/images/factory-made/00E55F3C-EBF0-4ED1-82C1-26F0C9298682.jpg" },
      { id: "shape_medium", text: "Medium & Classic", image: "/images/Handmade/IMG_3174.jpg" },
      { id: "shape_long", text: "Long & Fierce", image: "/images/Handmade/IMG_3181.jpg" },
    ],
  },
  {
    id: "color",
    question: "Pick a color mood!",
    options: [
      { id: "color_nude", text: "Nudes & Earth Tones", image: "/images/factory-made/16B8B425-6D92-4E02-BDD4-520E64C68F23.jpg" },
      { id: "color_dark", text: "Dark & Moody", image: "/images/Handmade/IMG_2667.jpg" },
      { id: "color_pop", text: "Pops of Color", image: "/images/Handmade/IMG_2674.jpg" },
    ],
  }
];

export default function FindYourFitQuiz({ allProducts = [], hideBanner = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = start, 1-3 = questions, 4 = loading, 5 = results
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Auto-show modal after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('quizSeen')) {
        setIsModalOpen(true);
        sessionStorage.setItem('quizSeen', 'true');
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, []);

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
        const lengths = (product.lengths || []).map(l => l.toLowerCase());
        const shape = (product.nailShape || '').toLowerCase();
        
        // Vibe Scoring
        if (finalAnswers.vibe === 'vibe_minimalist' && (textToSearch.includes('minimal') || textToSearch.includes('everyday') || textToSearch.includes('simple') || textToSearch.includes('nude') || textToSearch.includes('clear'))) score += 2;
        if (finalAnswers.vibe === 'vibe_glam' && (textToSearch.includes('glam') || textToSearch.includes('luxury') || textToSearch.includes('sparkle') || textToSearch.includes('gold') || textToSearch.includes('crystal') || textToSearch.includes('chrome') || textToSearch.includes('3d') || textToSearch.includes('rhinestones'))) score += 2;
        if (finalAnswers.vibe === 'vibe_artistic' && (textToSearch.includes('art') || textToSearch.includes('paint') || textToSearch.includes('vibrant') || textToSearch.includes('bold') || textToSearch.includes('abstract') || textToSearch.includes('swirls'))) score += 2;

        // Shape/Length Scoring
        if (finalAnswers.shape === 'shape_short') {
            if (lengths.includes('short') || textToSearch.includes('short')) score += 2;
            if (product.category === 'factory') score += 1; // Factory sets generally skew shorter
        }
        if (finalAnswers.shape === 'shape_medium' && (lengths.includes('medium') || textToSearch.includes('medium'))) score += 2;
        if (finalAnswers.shape === 'shape_long' && (lengths.includes('long') || lengths.includes('extra long') || textToSearch.includes('long'))) score += 2;

        // Color Scoring
        if (finalAnswers.color === 'color_nude' && (textToSearch.includes('nude') || textToSearch.includes('brown') || textToSearch.includes('beige') || textToSearch.includes('pink') || textToSearch.includes('white') || textToSearch.includes('clear'))) score += 2;
        if (finalAnswers.color === 'color_dark' && (textToSearch.includes('dark') || textToSearch.includes('black') || textToSearch.includes('midnight') || textToSearch.includes('ruby') || textToSearch.includes('burgundy') || textToSearch.includes('deep'))) score += 2;
        if (finalAnswers.color === 'color_pop' && (textToSearch.includes('color') || textToSearch.includes('bright') || textToSearch.includes('neon') || textToSearch.includes('blue') || textToSearch.includes('green') || textToSearch.includes('red') || textToSearch.includes('purple'))) score += 2;

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
  
  const handleClose = () => {
    setIsModalOpen(false);
    // Optionally reset step if they close it, or keep progress
  };

  return (
    <>
      {!hideBanner && (
        <div className={styles.bannerWrapper}>
          <div className={styles.banner} onClick={() => setIsModalOpen(true)}>
            <div className={styles.bannerContent}>
              <span className={styles.bannerIcon}>✨</span>
              <div className={styles.bannerText}>
                <h3 className={styles.bannerTitle}>Find Your Perfect Fit</h3>
                <p className={styles.bannerSubtitle}>Not sure what to pick? Take our 30-second Style Quiz</p>
              </div>
            </div>
            <button className={styles.bannerBtn}>Take Quiz</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close quiz">
              &times;
            </button>
            
            <div className={styles.quizContainer}>
              {step === 0 && (
                <div className={styles.startScreen}>
                  <h2 className={styles.title}>The Style Quiz</h2>
                  <p className={styles.subtitle}>
                    Discover your perfect nail aesthetic. We'll curate a personalized selection just for you.
                  </p>
                  <button className={styles.startBtn} onClick={handleStart}>
                    Begin the Experience
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
                        <div className={styles.optionText}>{option.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === QUESTIONS.length + 1 && (
                <div className={styles.loadingScreen}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Curating your aesthetic...</p>
                </div>
              )}

              {step === QUESTIONS.length + 2 && (
                <div className={styles.resultsScreen}>
                  <div className={styles.resultsHeader}>
                    <h2 className={styles.title}>Your Curated Picks</h2>
                    <p className={styles.subtitle}>
                      We analyzed your vibe. These sets are calling your name.
                    </p>
                  </div>

                  <div className={styles.resultsGrid}>
                    {recommendations.map((product, i) => (
                      <div key={product.id} onClick={handleClose} className={styles.resultItem}>
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
          </div>
        </div>
      )}
    </>
  );
}
