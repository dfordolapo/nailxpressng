"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { RotateCcw, HelpCircle, ArrowRight, Check } from "lucide-react";
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

export default function FindYourFitQuiz({ allProducts = [], hideBanner = false, showFloatingPill = false }) {
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

  // Auto-show modal after 60 seconds (once per 24 hours)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const lastSeen = localStorage.getItem('quizLastSeen');
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        if (!lastSeen || now - Number(lastSeen) > ONE_DAY_MS) {
          setIsModalOpen(true);
          localStorage.setItem('quizLastSeen', String(now));
        }
      } catch (e) {
        console.error("Storage error in quiz:", e);
      }
    }, 60000);

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
        
        // Vibe Scoring
        if (finalAnswers.vibe === 'vibe_minimalist' && (textToSearch.includes('minimal') || textToSearch.includes('everyday') || textToSearch.includes('simple') || textToSearch.includes('nude') || textToSearch.includes('clear'))) score += 2;
        if (finalAnswers.vibe === 'vibe_glam' && (textToSearch.includes('glam') || textToSearch.includes('luxury') || textToSearch.includes('sparkle') || textToSearch.includes('gold') || textToSearch.includes('crystal') || textToSearch.includes('chrome') || textToSearch.includes('3d') || textToSearch.includes('rhinestones'))) score += 2;
        if (finalAnswers.vibe === 'vibe_artistic' && (textToSearch.includes('art') || textToSearch.includes('paint') || textToSearch.includes('vibrant') || textToSearch.includes('bold') || textToSearch.includes('abstract') || textToSearch.includes('swirls'))) score += 2;

        // Shape/Length Scoring
        if (finalAnswers.shape === 'shape_short') {
            if (lengths.includes('short') || textToSearch.includes('short')) score += 2;
            if (product.category === 'factory') score += 1;
        }
        if (finalAnswers.shape === 'shape_medium' && (lengths.includes('medium') || textToSearch.includes('medium'))) score += 2;
        if (finalAnswers.shape === 'shape_long' && (lengths.includes('long') || lengths.includes('extra long') || lengths.includes('xl') || textToSearch.includes('long') || textToSearch.includes('xl'))) score += 2;

        // Color Scoring
        const hasWord = (word) => new RegExp(`\\b${word}\\b`, 'i').test(textToSearch);
        if (finalAnswers.color === 'color_nude' && (hasWord('nude') || hasWord('brown'))) score += 2;
        if (finalAnswers.color === 'color_dark' && (hasWord('dark') || hasWord('black'))) score += 2;
        if (finalAnswers.color === 'color_pop' && (hasWord('pink') || hasWord('yellow') || hasWord('multi'))) score += 2;

        return { ...product, score };
      });

      // Properly shuffle first to ensure true randomness for items with identical scores
      for (let i = scoredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scoredProducts[i], scoredProducts[j]] = [scoredProducts[j], scoredProducts[i]];
      }
      
      // Then stable sort by score descending
      scoredProducts.sort((a, b) => b.score - a.score);
      
      const selected = scoredProducts.slice(0, 3);
      setRecommendations(selected);
      setStep(QUESTIONS.length + 2); // Results state
    }, 1200);
  };

  const handleRetake = () => {
    setAnswers({});
    setStep(1);
    setRecommendations([]);
  };
  
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const bannerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  const handleMouseMove = (e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  // 3D tilt angles calculated from cursor position (-8deg to +8deg)
  const rotateX = isHovered ? (mousePos.y - 0.5) * -12 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 14 : 0;

  return (
    <>
      {!hideBanner && (
        <div 
          className={styles.bannerWrapper} 
          ref={bannerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
        >
          <motion.div 
            className={styles.banner} 
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            animate={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            {/* Dynamic Spotlight Sheen that follows the user's cursor */}
            <div 
              className={styles.cursorSpotlight}
              style={{
                background: isHovered 
                  ? `radial-gradient(550px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(247, 222, 218, 0.18), transparent 65%)`
                  : 'none'
              }}
            />

            {/* Background Hero Image with parallax & 3D depth */}
            <div className={styles.bannerBgImageWrapper}>
              <motion.div style={{ y: bgY, scale: bgScale, position: 'relative', width: '100%', height: '116%', top: '-8%' }}>
                <Image 
                  src="/images/matchmaker-hero.png" 
                  alt="Nail Matchmaker luxury set" 
                  fill 
                  sizes="(max-width: 1200px) 100vw, 1140px"
                  className={styles.heroImage}
                  priority={true}
                />
              </motion.div>
              <div className={styles.imageBlendOverlay} />
            </div>

            {/* Overlaid Content Area with elevated 3D depth */}
            <div className={styles.bannerContent} style={{ transform: 'translateZ(30px)' }}>
              <motion.span 
                className={styles.eyebrow}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
              >
                <span className={styles.eyebrowDot} />
                Nail Matchmaker
              </motion.span>

              <motion.h2 
                className={styles.bannerTitle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                Your dream set is
                <span className={styles.bannerScript}>3 taps away.</span>
              </motion.h2>

              <motion.div 
                className={styles.bannerCtaRow}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.button 
                  className={styles.bannerBtn} 
                  aria-label="Find My Match"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: [0.95, 1.05, 1] }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <span className={styles.btnShimmer} />
                  <span>Find My Match</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={18} className={styles.bannerBtnArrow} />
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Corner Quiz Pill */}
      {showFloatingPill && (
        <button 
          className={styles.floatingPill}
          onClick={() => setIsModalOpen(true)}
          title="Nail Matchmaker Quiz"
          aria-label="Nail Matchmaker Quiz"
        >
          <span className={styles.floatingPillIcon}>
            <HelpCircle size={16} color="#eccbc6" />
          </span>
          <span className={styles.floatingPillText}>Nail Matchmaker</span>
        </button>
      )}

      {/* Quiz Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close quiz">
              &times;
            </button>
            
            <div className={styles.quizContainer}>
              {step === 0 && (
                <div className={styles.startScreen}>
                  <h2 className={styles.title}>Nail Matchmaker</h2>
                  <p className={styles.subtitle}>
                    Your dream set is 3 taps away. Custom recommendations matched to your style.
                  </p>
                  <button className={styles.startBtn} onClick={handleStart}>
                    Find My Match
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
                    <span className={styles.progressText}>Step {step} of {QUESTIONS.length}</span>
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
                          <Image 
                            src={option.image} 
                            alt={option.text} 
                            fill 
                            sizes="260px"
                            className={styles.optionImage}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className={styles.optionOverlay} />
                        <div className={styles.optionContent}>
                          <span className={styles.optionText}>{option.text}</span>
                          <span className={styles.optionCheckCircle}>
                            <Check size={14} strokeWidth={2.5} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === QUESTIONS.length + 1 && (
                <div className={styles.loadingScreen}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Curating your dream set...</p>
                </div>
              )}

              {step === QUESTIONS.length + 2 && (
                <div className={styles.resultsScreen}>
                  <div className={styles.resultsHeader}>
                    <h2 className={styles.title}>Your Curated Matches</h2>
                    <p className={styles.subtitle}>
                      Hand-selected based on your style, length & color preferences.
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
                    <RotateCcw size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Retake Quiz
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
