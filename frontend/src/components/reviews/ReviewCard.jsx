import { FaStar } from "react-icons/fa";

export default function ReviewCard({ review }) {
  const author =
    review.author_name || review.email || "Traveler";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{author}</p>
          <p className="text-xs text-slate-500">
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString()
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar
              key={index}
              className={
                index < review.rating
                  ? "opacity-100"
                  : "opacity-25"
              }
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {review.review_text}
      </p>
      {review.image_url && (
        <img
          src={review.image_url}
          alt="Review"
          className="mt-4 h-40 w-full rounded-xl object-cover"
        />
      )}
    </div>
  );
}
