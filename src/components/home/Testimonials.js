import React from 'react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    text: "You might say you were just selling your product, but you sold me an experience. You sold joy and confidence through this set.",
    name: "Phummie",
    role: "Lagos, NG",
    avatar: "/images/dolapo.jpg",
    color: "#C4866C",
  },
  {
    id: 2,
    text: "I am very hard to please but these nails are strong and even better than the pictures, and the packaging is superb.",
    name: "Dr Latre",
    role: "London, UK",
    avatar: "/images/teni.jpg",
    color: "#B84C6A",
  },
  {
    id: 3,
    text: "I love the details. From the packaging, prep materials and the gift you added. I'm glad I came across your page.",
    name: "Shola",
    role: "Abuja, NG",
    avatar: "/images/chioma.jpg",
    color: "#8B6B8A",
  }
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>We nail it no matter the occasion</h2>
          <p className={styles.subtitle}>You’re in good hands.</p>
        </div>
        
        <div className={styles.grid}>
          {TESTIMONIALS_DATA.map((testimonial) => (
            <div key={testimonial.id} className={styles.card}>
              <div className={styles.quoteIcon} style={{ backgroundColor: testimonial.color }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.192 15.757c0-.907-.188-1.754-.563-2.54a5.72 5.72 0 0 0-1.503-2.025 6.08 6.08 0 0 0-2.182-1.3c-.87-.318-1.792-.477-2.767-.477h-.088c.066-.748.243-1.423.53-2.026.297-.627.693-1.168 1.189-1.623C6.262 5.312 6.84 4.966 7.5 4.73l.4-.143L6.963 2.5l-.363.119C5.1 3.12 3.86 4.025 2.888 5.3 1.91 6.574 1.42 8.163 1.42 10.067c0 1.628.32 3.033.958 4.215a7.11 7.11 0 0 0 2.65 2.843c1.112.66 2.3.99 3.562.99 1.056 0 1.925-.264 2.607-.792.682-.528 1.023-1.22 1.023-2.079c-.028-.242-.028-.352-.028-.506zm11.386 0c0-.907-.188-1.754-.563-2.54a5.72 5.72 0 0 0-1.503-2.025 6.08 6.08 0 0 0-2.182-1.3c-.87-.318-1.792-.477-2.767-.477h-.088c.066-.748.243-1.423.53-2.026.297-.627.693-1.168 1.189-1.623.495-.455 1.073-.801 1.733-1.037l.4-.143L18.35 2.5l-.363.119c-1.5.502-2.74 1.407-3.712 2.681-.978 1.274-1.468 2.863-1.468 4.767 0 1.628.32 3.033.958 4.215a7.11 7.11 0 0 0 2.65 2.843c1.112.66 2.3.99 3.562.99 1.056 0 1.925-.264 2.607-.792.682-.528 1.023-1.22 1.023-2.079c-.028-.242-.028-.352-.028-.506z"/>
                </svg>
              </div>
              <p className={styles.text}>"{testimonial.text}"</p>
              <div className={styles.author}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    sizes="40px"
                    className={styles.avatar}
                    style={testimonial.name === "Phummie" ? { transform: "scale(1.5) translateY(-10%)", objectPosition: "center" } : {}}
                  />
                </div>
                <div className={styles.info}>
                  <h4 className={styles.name}>{testimonial.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Filter for torn paper edge effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="torn-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.075" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </section>
  );
}
