"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/pages/terms.module.css";

const SECTIONS = [
  {
    id: "welcome",
    title: "Welcome",
    content: [
      "Welcome to Nailexpress. We are committed to providing premium quality press-on nails and an enjoyable shopping experience. By accessing our website or placing an order with us, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our website or purchasing our products.",
    ],
  },
  {
    id: "orders",
    title: "Orders",
    content: [
      "All orders placed on our website are subject to acceptance and availability. An order is only considered confirmed after payment has been successfully received and verified. For customers paying via bank transfer, processing will begin only after payment has been confirmed in our account.",
      "Nailexpress reserves the right to refuse, cancel or limit any order where fraudulent activity is suspected, incorrect pricing has occurred, stock becomes unavailable, payment cannot be verified, or a customer provides incomplete or inaccurate information. Where an order is cancelled by us before production begins, any payment received will be refunded in full.",
    ],
  },
  {
    id: "products",
    title: "Our Products",
    content: [
      "Nailexpress offers three categories of press-on nails: factory-made, handmade and custom made.",
      "Factory-made sets are ready-to-ship products manufactured in standard sizes. Handmade sets are individually crafted after an order is placed, while custom made sets are designed specifically according to the customer's preferred size, shape, length, colour or artwork.",
      "Because handmade and custom made products are created individually, slight differences in brush strokes, embellishment placement, glitter distribution or artwork may occur. These minor variations are a normal part of handmade craftsmanship and should not be regarded as defects.",
      "We make every effort to display our products as accurately as possible. However, colours may appear slightly different depending on your phone, tablet or computer screen settings, lighting conditions and display quality.",
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    content: [
      "Customers are responsible for selecting the correct nail sizes before placing an order. We strongly recommend using our sizing guide or purchasing a sizing kit where available. Measurements submitted for custom made sets will be used exactly as provided.",
      "Nailexpress cannot be held responsible for sets that do not fit because incorrect measurements or sizes were supplied by the customer. Orders made with customer-provided measurements are not eligible for refunds or exchanges due to sizing issues.",
    ],
  },
  {
    id: "custom-orders",
    title: "Custom Orders",
    content: [
      "Custom made nails are personalised products created exclusively for one customer. Production begins shortly after your order has been confirmed, which means cancellations or significant design changes may not be possible once work has started.",
      "Where a design preview is provided, customers are expected to review and approve it promptly. Delays in approval may extend the estimated production timeline. If no response is received within 48 hours, Nailexpress reserves the right to proceed using the design discussed during the order process to avoid unnecessary production delays.",
    ],
  },
  {
    id: "production-time",
    title: "Production Time",
    content: [
      "Production times vary depending on the type of order, order volume and seasonal demand.",
      "Factory-made products are usually dispatched within one to three business days. Handmade sets generally require between three and ten business days, while custom made sets may take between five and fifteen business days depending on the complexity of the design.",
      "During festive periods, nationwide holidays, promotional sales or unforeseen production delays, additional processing time may be required. We appreciate your patience and understanding during these periods.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    content: [
      "Once production has been completed, orders will be handed over to our delivery partners. Delivery timelines provided during checkout are estimates and may occasionally be affected by factors beyond our control.",
      "Within Nigeria, deliveries may experience delays due to weather conditions, traffic, courier operations, fuel shortages, security situations, public holidays or other unforeseen circumstances. While we work with reliable logistics partners, Nailexpress cannot guarantee exact delivery dates once an order has been dispatched.",
      "Customers are responsible for providing accurate delivery details, including a complete address and reachable telephone number. Orders returned because of incorrect addresses, unavailable recipients or failed delivery attempts may attract an additional delivery charge before they can be resent.",
      "Risk in the product transfers to the customer once the order has been successfully delivered to the address provided.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations",
    content: [
      "Factory-made orders may be cancelled before they have been packaged for dispatch. Once they have been shipped, cancellations are no longer possible.",
      "Handmade orders may only be cancelled before production has commenced. Once materials have been prepared or work has begun, the order becomes non-cancellable.",
      "Custom made products are personalised specifically for one customer and therefore cannot be cancelled or refunded once production has started.",
    ],
  },
  {
    id: "returns",
    title: "Returns and Refunds",
    content: [
      "Due to hygiene and health considerations, Nailexpress does not accept returns of press-on nails once they have been delivered, except where a manufacturing defect exists or the wrong product was supplied.",
      "Refunds or replacements may be considered where a product arrives damaged due to manufacturing faults, where the wrong item was sent, or where Nailexpress is unable to fulfil an order after payment has been received.",
      "Requests relating to damaged or incorrect products must be reported within 48 hours of delivery and should include clear photographs showing the issue. Claims made after this period may not be accepted.",
      "Refunds will be processed using the original payment method where applicable. Delivery fees are non-refundable unless the error was caused by Nailexpress.",
    ],
  },
  {
    id: "product-care",
    title: "Product Care",
    content: [
      "Proper application and removal are essential for achieving the best results. Nailexpress is not responsible for damage resulting from improper application, forceful removal, misuse of adhesives, use of incompatible products or failure to follow our care instructions.",
      "Customers who experience irritation or an allergic reaction should discontinue use immediately and seek appropriate medical advice if necessary.",
    ],
  },
  {
    id: "promotions",
    title: "Promotions",
    content: [
      "From time to time, Nailexpress may offer discounts, promotional codes or special offers. Unless otherwise stated, promotions cannot be combined and cannot be exchanged for cash. Promotional campaigns may be modified, suspended or withdrawn at any time without prior notice.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      "All product photographs, videos, designs, logos, branding, graphics, website content and original nail artwork remain the exclusive property of Nailexpress. They may not be copied, reproduced, edited, distributed or used for commercial purposes without our prior written consent.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      "While we take every reasonable step to ensure the quality of our products and services, Nailexpress shall not be liable for indirect, incidental or consequential losses arising from the use of our products, delays caused by third-party delivery companies, events beyond our reasonable control or customer misuse.",
      "Our total liability for any successful claim shall not exceed the purchase price of the affected product.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    content: [
      "Your personal information is collected solely for the purpose of processing orders, providing customer support, arranging deliveries and improving our services. We do not sell or intentionally disclose your personal information to third parties except where required to complete your order or comply with applicable Nigerian laws.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: [
      "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria. Any dispute arising from the use of our website or purchase of our products shall first be resolved through amicable discussions. Where a resolution cannot be reached, the matter shall be submitted to the courts of competent jurisdiction in Nigeria.",
      "By placing an order with Nailexpress, you confirm that you have read, understood and agreed to these Terms and Conditions.",
    ],
  },
];

export default function TermsPage() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const observerRef = useRef(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
  }, []);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div className="container container--narrow">
        <div className={styles.header}>
          <h1 className={styles.title}>Terms &amp; Conditions</h1>
          <p className={styles.updated}>Last updated: July 2025</p>
        </div>

        {/* Mobile horizontal pill TOC */}
        <div className={styles.mobileToc}>
          <div className={styles.mobileTocScroll}>
            {SECTIONS.map(({ id, title }) => (
              <button
                key={id}
                className={`${styles.mobilePill} ${activeId === id ? styles.mobilePillActive : ""}`}
                onClick={() => scrollTo(id)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.layout}>
          {/* Desktop sticky TOC */}
          <nav className={styles.tocWrapper}>
            <div className={styles.toc}>
              {SECTIONS.map(({ id, title }) => (
                <button
                  key={id}
                  className={`${styles.tocLink} ${activeId === id ? styles.tocLinkActive : ""}`}
                  onClick={() => scrollTo(id)}
                >
                  {title}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className={styles.content}>
            {SECTIONS.map(({ id, title, content }) => (
              <section key={id} id={id} className={styles.section}>
                <h2 className={styles.sectionHeading}>{title}</h2>
                {content.map((paragraph, i) => (
                  <p key={i} className={styles.sectionText}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
