"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { categories } from "@/data/categories";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
import styles from "./collection-hub.module.css";

export default function CollectionHub() {
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
      description: handmadeCategory.tagline || handmadeCategory.description,
      href: "/handmade",
      image: handmadeCategory.image,
    },
    {
      title: factoryCategory.name,
      description: factoryCategory.tagline || factoryCategory.description,
      href: "/factory",
      image: factoryCategory.image,
    },
    {
      title: "Custom Orders",
      description: "have a specific design in mind? let's bring it to life.",
      href: `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.customOrder)}`,
      image: "/images/custom-orders.png",
    },
    {
      title: "All Products",
      description: "browse everything in one place.",
      href: "/shop",
      image: "/images/all-products.png",
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
          <Link href={hub.href} key={idx} className={styles.hubCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={hub.image}
                alt={hub.title}
                fill
                className={styles.image}
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{hub.title}</h2>
              <p className={styles.cardDesc}>{hub.description}</p>
              <div className={styles.arrowIcon}>
                <ArrowRightIcon size={20} strokeWidth={1.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
