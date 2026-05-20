import { FaMountain } from "react-icons/fa";
import GlassCard from "./GlassCard";
import GradientButton from "./GradientButton";

const EmptyState = ({ title, description, actionLabel, onAction, icon: Icon = FaMountain }) => {
  return (
    <GlassCard className="p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
        <Icon />
      </div>
      <h3 className="font-heading mt-6 text-2xl font-bold text-ink">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-md text-ink-muted">{description}</p>}
      {actionLabel && (
        <GradientButton onClick={onAction} className="mt-6">
          {actionLabel}
        </GradientButton>
      )}
    </GlassCard>
  );
};

export default EmptyState;
