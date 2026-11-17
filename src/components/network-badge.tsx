import styles from "./network-badge.module.css"

/**
 * The webapp's network badge (monorepo webapp/app/components/network-badge.tsx): a light-blue pill
 * with the network icon, an uppercase label and sparkles on hover. Used on the reference pages
 * whose values are testnet values, so they are not mistaken for mainnet.
 */
export function NetworkBadge({
  label,
  size = "default",
}: {
  label: string
  size?: "default" | "compact"
}) {
  return (
    <span className={size === "compact" ? `${styles.badge} ${styles.compact}` : styles.badge}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny local icon at a fixed box */}
      <img
        src="/images/network-testnet.webp"
        alt=""
        aria-hidden="true"
        width={14}
        height={14}
        className={styles.icon}
      />
      <span>{label}</span>
      <span aria-hidden="true" className={`${styles.sparkle} ${styles.sparkleOne}`}>
        ✦
      </span>
      <span aria-hidden="true" className={`${styles.sparkle} ${styles.sparkleTwo}`}>
        ✧
      </span>
      <span aria-hidden="true" className={`${styles.sparkle} ${styles.sparkleThree}`}>
        ✦
      </span>
    </span>
  )
}
