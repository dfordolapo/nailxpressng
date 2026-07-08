import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/components/shop-the-look.module.css";

export default function ShopTheLook() {
  return (
    <section className={styles.section} id="shop-the-look">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/shop_the_look.png"
              alt="Lifestyle showing nails and coffee in a car"
              fill
              className={styles.image}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            
            <div className={styles.overlay}>
              <h2 className={styles.title}>Nails that speak louder than words.</h2>
              <Link href="/handmade" className={styles.button}>
                SHOP THE LOOK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
