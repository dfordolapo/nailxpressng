"use client";

import { ANNOUNCEMENT_TEXT } from "@/lib/constants";
import styles from "@/styles/components/header.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.announcement} id="announcement-bar">
      <span>{ANNOUNCEMENT_TEXT}</span>
    </div>
  );
}
