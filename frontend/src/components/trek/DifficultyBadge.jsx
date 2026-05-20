import { FaMountain } from "react-icons/fa";

const toneByDifficulty = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Easy-Moderate": "bg-primary/10 text-primary border-primary/20",
  Moderate: "bg-primary/10 text-primary border-primary/20",
  "Moderate-Hard": "bg-amber-50 text-amber-700 border-amber-200",
  Hard: "bg-orange-50 text-orange-700 border-orange-200",
};

const DifficultyBadge = ({ difficulty }) => {
  const tone = toneByDifficulty[difficulty] || "bg-surface-muted text-ink-muted border-slate-200";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      <FaMountain />
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
