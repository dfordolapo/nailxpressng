"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { categories } from "@/data/categories";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
import styles from "./collection-hub.module.css";

export default function CollectionHub() {
  const router = useRouter();
  const [expandingCard, setExpandingCard] = useState(null);

  const handleCardClick = (e, href, idx) => {
    e.preventDefault();
    setExpandingCard(idx);
    setTimeout(() => {
      if (href.startsWith("http")) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    }, 250);
  };
  const handmadeCategory = categories.find((c) => c.slug === "handmade") || {
    name: "Handmade Nails",
    description: "Wearable Art, Made by Hand",
    image: "/images/hero.png",
  };
  const factoryCategory = categories.find((c) => c.slug === "factory") || {
    name: "Factory Made",
    description: "Precision Made, Style Perfected",
    image: "/images/hero.png",
  };

  const hubs = [
    {
      title: handmadeCategory.name,
      description: "wearable art. made by hand.",
      href: "/handmade",
      image: handmadeCategory.image,
      strokeColor: "#FF007F", // Neon Pink
    },
    {
      title: factoryCategory.name,
      description: "instant glam. zero waiting.",
      href: "/factory",
      image: factoryCategory.image,
      strokeColor: "#FFB6C1", // Light Pink
    },
    {
      title: "Custom Orders",
      description: "bring your ideas to life.",
      href: `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.customOrder)}`,
      image: "/images/custom-orders.png",
      strokeColor: "#39FF14", // Neon Green
    },
    {
      title: "All Products",
      description: "browse everything in one place.",
      href: "/shop",
      image: "/images/all-products.png",
      strokeColor: "#FF4500", // Orange Red
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <h1 className={styles.title}>Explore our Collections</h1>
          <span style={{
            position: "absolute",
            bottom: "2px",
            left: "50%",
            transform: "translateX(-50%) rotate(-1deg)",
            width: "60%",
            height: "8px",
            background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            borderRadius: "var(--radius-full)",
            opacity: 0.6,
            pointerEvents: "none",
          }} />
        </div>
      </div>

      <div className={styles.hubGrid}>
        {hubs.map((hub, idx) => (
          <a 
            href={hub.href} 
            key={idx} 
            className={`${styles.hubCard} ${expandingCard === idx ? styles.expanding : ""}`}
            onClick={(e) => handleCardClick(e, hub.href, idx)}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={hub.image}
                alt={hub.title}
                fill
                className={styles.image}
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={idx < 2}
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.cardContent}>
              <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start", marginBottom: "var(--space-2)" }}>
                <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>{hub.title}</h2>
                <span style={{
                  position: "absolute",
                  bottom: "2px",
                  left: "0",
                  transform: "rotate(-1deg)",
                  width: "90%",
                  height: "4px",
                  background: `linear-gradient(90deg, ${hub.strokeColor}, transparent)`,
                  borderRadius: "var(--radius-full)",
                  opacity: 0.9,
                  pointerEvents: "none",
                }} />
              </div>
              <p className={styles.cardDesc}>{hub.description}</p>
              <div className={styles.arrowIcon}>
                <ArrowRightIcon size={20} strokeWidth={1.5} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
