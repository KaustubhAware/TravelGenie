const SLOTS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

const toText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return (
    value.title ||
    value.activity ||
    value.description ||
    value.name ||
    value.plan ||
    ""
  );
};

const slotFromActivity = (activity, index) => {
  const text = `${activity?.time || ""} ${activity?.timing || ""} ${toText(activity)}`.toLowerCase();
  if (text.includes("morning") || text.includes("breakfast") || text.includes("sunrise")) return "morning";
  if (text.includes("evening") || text.includes("dinner") || text.includes("sunset") || text.includes("night")) return "evening";
  if (text.includes("afternoon") || text.includes("lunch")) return "afternoon";
  return SLOTS[Math.min(index, SLOTS.length - 1)].key;
};

const normalizeSlots = (day) => {
  const explicit = SLOTS.reduce((acc, slot) => {
    const value = day?.[slot.key] || day?.[slot.label] || day?.[slot.key]?.activities;
    acc[slot.key] = Array.isArray(value) ? value.map(toText).filter(Boolean) : [toText(value)].filter(Boolean);
    return acc;
  }, {});

  const activities = Array.isArray(day?.activities) ? day.activities : [];
  activities.forEach((activity, index) => {
    const slot = slotFromActivity(activity, index);
    const text = toText(activity);
    if (text) explicit[slot].push(text);
  });

  if (!activities.length && !SLOTS.some((slot) => explicit[slot.key].length) && day?.description) {
    explicit.morning.push(day.description);
  }

  return explicit;
};

export default function DayPlanCard({ day = {} }) {
  const slots = normalizeSlots(day);

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {SLOTS.map(({ key, label }) => {
        const items = slots[key].length ? slots[key] : ["Details available in the generated itinerary."];

        return (
          <div key={key} className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
              {label}
            </p>
            <div className="mt-3 space-y-2">
              {items.map((item, itemIndex) => (
                <p key={`${key}-${itemIndex}`} className="text-sm leading-6 text-slate-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
