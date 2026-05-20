import GlassCard from "./GlassCard";

const StatCard = ({ label, value, icon: Icon, helper, dark = false }) => {
  return (
    <GlassCard dark={dark} hover className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm ${dark ? "text-white/62" : "text-ink-muted"}`}>
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${dark ? "text-white" : "text-ink"}`}>
            {value}
          </p>
          {helper && (
            <p className={`mt-2 text-xs ${dark ? "text-white/54" : "text-ink-muted"}`}>
              {helper}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? "bg-white/10 text-accent" : "bg-primary/10 text-primary"}`}>
            <Icon />
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;
