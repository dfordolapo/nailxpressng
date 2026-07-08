import { testimonials } from "@/data/testimonials";
import styles from "@/styles/pages/home.module.css";

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" width="16" height="16">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="section section--warm" id="testimonials">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">What Our Babes Say</h2>
          <p className="section__subtitle">
            Real reviews from real nail lovers
          </p>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className={styles.testimonialCard} id={`testimonial-${t.id}`}>
              <div className={styles.testimonialStars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className={styles.testimonialName}>{t.name}</div>
                  <div className={styles.testimonialLocation}>{t.location}</div>
                  <div className={styles.testimonialProduct}>Purchased: {t.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
