/**
 * Split landing headings: bold sans lead + orange italic serif accent.
 * Matches Featured Treks "Explore The / Sahyadri" style.
 */
export default function LandingSectionTitle({
  lead,
  accent,
  className = "",
  size = "default",
  inverted = false,
}) {
  const styles = {
    default: {
      lead: inverted
        ? "block font-heading text-4xl font-normal italic text-orange-400 md:text-6xl"
        : "text-4xl font-black leading-tight text-[#08112b] md:text-6xl",
      accent: inverted
        ? "block text-4xl font-black text-white md:text-6xl"
        : "block font-heading text-4xl font-normal italic text-orange-500 md:text-6xl",
      wrap: "mt-7",
    },
    compact: {
      lead: "text-3xl font-black leading-tight text-[#08112b] md:text-5xl",
      accent:
        "block font-heading text-3xl font-normal italic text-orange-500 md:text-5xl",
      wrap: "mt-3",
    },
  };

  const tone = styles[size] || styles.default;

  return (
    <h2 className={`${tone.wrap} ${tone.lead} ${className}`}>
      {lead}
      <span className={tone.accent}>{accent}</span>
    </h2>
  );
}
