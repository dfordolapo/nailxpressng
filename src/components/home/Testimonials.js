import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Sparkles } from 'lucide-react';
import styles from './Testimonials.module.css';

// Real customer feedback extracted directly from happy client reviews & DMs
const ROW_1 = [
  { id: 'r1-1', text: "The nails are Gorg! 😍", emoji: "💅" },
  { id: 'r1-2', text: "The gifts are a lot 🥹💗", emoji: "🎁" },
  { id: 'r1-3', text: "Pictures & videos NEVER do justice", emoji: "✨" },
  { id: 'r1-4', text: "Ready within 1 business day!", emoji: "⚡" },
  { id: 'r1-5', text: "Nails are strong & better than pictures", emoji: "💎" },
  { id: 'r1-6', text: "Very supportive customer service", emoji: "💌" },
  { id: 'r1-7', text: "I’m definitely shopping again & again", emoji: "🛍️" },
  { id: 'r1-8', text: "Basic? We don't do that here 👑", emoji: "🔥" },
];

const ROW_2 = [
  { id: 'r2-1', text: "And I'm hard to satisfy... 10/10!", emoji: "💯" },
  { id: 'r2-2', text: "I loveeee the details in the prep kit", emoji: "🪄" },
  { id: 'r2-3', text: "Package is so pretty & thoughtful", emoji: "🌸" },
  { id: 'r2-4', text: "Everything is eye-catching & mind-blowing", emoji: "🤯" },
  { id: 'r2-5', text: "Glad I came across your page", emoji: "💖" },
  { id: 'r2-6', text: "Cheapest and highest quality!", emoji: "💸" },
  { id: 'r2-7', text: "Never had this experience with nail vendors", emoji: "🌟" },
  { id: 'r2-8', text: "Thank you thank you thank you!", emoji: "💃" },
];

const ROW_3 = [
  { id: 'r3-1', text: "Everyone needs this joy from something so small!", emoji: "✨" },
  { id: 'r3-2', text: "Then the giftsssssss 😍", emoji: "🎀" },
  { id: 'r3-3', text: "You’re simply so amazing 🥰", emoji: "👑" },
  { id: 'r3-4', text: "Received my order very quickly", emoji: "📦" },
  { id: 'r3-5', text: "Even my daughter said it’s so much for the amount", emoji: "👛" },
  { id: 'r3-6', text: "I love them so much 🥹💗", emoji: "🤌" },
  { id: 'r3-7', text: "It is lovely, I will be purchasing more!", emoji: "🛍️" },
  { id: 'r3-8', text: "Thanks for being intentional 🌸", emoji: "🎯" },
];

function PillCard({ item }) {
  return (
    <div className={styles.pill}>
      <span className={styles.emojiIcon}>{item.emoji}</span>
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
              You’re in good hands. Over 700+ women served.
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
