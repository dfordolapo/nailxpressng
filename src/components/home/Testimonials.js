import React from 'react';
import styles from './Testimonials.module.css';

// Ultra-clean, unmistakable female silhouette icons in pure vector line-art
function FemalePortraitIcon({ variant = 1, size = 18, color = "#7A403D" }) {
  const type = ((variant - 1) % 4) + 1;

  if (type === 1) {
    // 1. Sleek Ponytail (Unmistakable female silhouette)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9 }}>
        {/* Head */}
        <circle cx="11" cy="9" r="4" />
        {/* Ponytail arch and drop */}
        <path d="M14.5 7.5C16.5 6 18.5 6.5 19.5 8.5C20.5 11 19 14.5 17.5 16.5" />
        {/* Hair tie */}
        <circle cx="14.5" cy="7.5" r="1" fill={color} />
        {/* Slender neck & shoulders */}
        <path d="M5.5 21C5.5 18 8 16 11 16C14 16 16.5 18 16.5 21" />
      </svg>
    );
  }

  if (type === 2) {
    // 2. High Topknot Bun (Classic chic girl bun)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9 }}>
        {/* Topknot Bun */}
        <ellipse cx="12" cy="3.5" rx="2.5" ry="2" />
        {/* Head */}
        <circle cx="12" cy="10" r="4.5" />
        {/* Hair hairline sweep */}
        <path d="M7.8 9C8.5 6.5 10 5.5 12 5.5C14 5.5 15.5 6.5 16.2 9" />
        {/* Slender shoulders */}
        <path d="M6 21C6 18 8.5 16.5 12 16.5C15.5 16.5 18 18 18 21" />
      </svg>
    );
  }

  if (type === 3) {
    // 3. Classic Bob / Pageboy (Sleek feminine haircut)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9 }}>
        {/* Head */}
        <circle cx="12" cy="9.5" r="3.5" />
        {/* Bob hair surrounding face */}
        <path d="M7 11.5V9C7 5.5 9 3.5 12 3.5C15 3.5 17 5.5 17 9V11.5C17 14 15.5 14.5 14.5 13.5" />
        <path d="M7 11.5C7 14 8.5 14.5 9.5 13.5" />
        {/* Shoulders */}
        <path d="M6.5 21C6.5 18.5 9 17 12 17C15 17 17.5 18.5 17.5 21" />
      </svg>
    );
  }

  // 4. Twin Space Buns (Cute, distinct double buns & soft tendrils)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9 }}>
      {/* Left Bun */}
      <circle cx="7" cy="4.5" r="2" />
      {/* Right Bun */}
      <circle cx="17" cy="4.5" r="2" />
      {/* Head */}
      <circle cx="12" cy="10" r="4.5" />
      {/* Hair part sweep */}
      <path d="M12 5.5V8.5" />
      <path d="M7.5 8C9 6 11 5.5 12 5.5C13 5.5 15 6 16.5 8" />
      {/* Slender shoulders */}
      <path d="M6 21C6 18 8.5 16.5 12 16.5C15.5 16.5 18 18 18 21" />
    </svg>
  );
}

// Real customer feedback with expressive emojis after every review
const ROW_1 = [
  { id: 'r1-1', text: "The nails are Gorg! 😍💅", v: 1 },
  { id: 'r1-2', text: "The gifts are a lot 🥹💗", v: 2 },
  { id: 'r1-3', text: "Pictures & videos NEVER do justice ✨📸", v: 3 },
  { id: 'r1-4', text: "Ready within 1 business day! ⚡📦", v: 4 },
  { id: 'r1-5', text: "Nails are strong & better than pictures 💎✨", v: 1 },
  { id: 'r1-6', text: "Very supportive customer service 💌🫶", v: 2 },
  { id: 'r1-7', text: "I’m definitely shopping again & again 🛍️💃", v: 3 },
  { id: 'r1-8', text: "Basic? We don't do that here 👑🔥", v: 4 },
];

const ROW_2 = [
  { id: 'r2-1', text: "And I'm hard to satisfy... 10/10! 💯🙌", v: 2 },
  { id: 'r2-2', text: "I loveeee the details in the prep kit 🪄✨", v: 3 },
  { id: 'r2-3', text: "Package is so pretty & thoughtful 🌸💖", v: 4 },
  { id: 'r2-4', text: "Everything is eye-catching & mind-blowing 🤯💫", v: 1 },
  { id: 'r2-5', text: "Glad I came across your page 💖🥰", v: 2 },
  { id: 'r2-6', text: "Cheapest and highest quality! 💸💎", v: 3 },
  { id: 'r2-7', text: "Never had this experience with nail vendors 🌟🥂", v: 4 },
  { id: 'r2-8', text: "Thank you thank you thank you! 💃🎉", v: 1 },
];

const ROW_3 = [
  { id: 'r3-1', text: "Everyone needs this joy from something so small! ✨🥳", v: 3 },
  { id: 'r3-2', text: "Then the giftsssssss 😍🎁", v: 4 },
  { id: 'r3-3', text: "You’re simply so amazing 🥰👑", v: 1 },
  { id: 'r3-4', text: "Received my order very quickly 📦⚡", v: 2 },
  { id: 'r3-5', text: "Even my daughter said it’s so much for the amount 👛💗", v: 3 },
  { id: 'r3-6', text: "I love them so much 🥹💅", v: 4 },
  { id: 'r3-7', text: "It is lovely, I will be purchasing more! 🛍️💖", v: 1 },
  { id: 'r3-8', text: "Thanks for being intentional 🌸🎯", v: 2 },
];

function PillCard({ item }) {
  return (
    <div className={styles.pill}>
      <FemalePortraitIcon variant={item.v} size={18} />
      <span className={styles.pillText}>{item.text}</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className={styles.section}>
      {/* SECTION HEADER COPY FIRST */}
      <div className={styles.headerContainer}>
        <div className="container">
          <div className={styles.headerContent}>
            <h2 className={styles.headline}>
              We nail it no matter the occasion
            </h2>
            <p className={styles.subheadline}>
              You’re in good hands. 700+ women served.
            </p>
          </div>
        </div>
      </div>

      {/* CONTINUOUS MARQUEE ROWS UNDERNEATH */}
      <div className={styles.marqueeContainer}>
        {/* Row 1 - Left */}
        <div className={styles.marqueeTrack}>
          <div className={`${styles.marqueeRow} ${styles.scrollLeft}`}>
            {[...ROW_1, ...ROW_1].map((item, idx) => (
              <PillCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right */}
        <div className={styles.marqueeTrack}>
          <div className={`${styles.marqueeRow} ${styles.scrollRight}`}>
            {[...ROW_2, ...ROW_2].map((item, idx) => (
              <PillCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 3 - Left */}
        <div className={styles.marqueeTrack}>
          <div className={`${styles.marqueeRow} ${styles.scrollLeftSlow}`}>
            {[...ROW_3, ...ROW_3].map((item, idx) => (
              <PillCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
