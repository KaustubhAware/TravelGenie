import { useCallback, useState } from "react";
import { reviewService } from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";

export default function ReviewSection({ packageId, showForm = true }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!packageId) {
      setLoading(false);
      return;
    }
    try {
      const res = await reviewService.list(packageId);
      setReviews(res.data?.reviews || []);
      setAverageRating(res.data?.average_rating || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useAutoRefresh(load, {
    intervalMs: 30000,
    immediate: true,
    enabled: Boolean(packageId),
  });

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Traveler reviews
          </h3>
          <p className="mt-1 text-slate-500">
            {reviews.length} reviews
            {averageRating > 0 && (
              <span className="ml-2 font-semibold text-amber-600">
                ★ {averageRating}
              </span>
            )}
          </p>
        </div>
      </div>

      {showForm && packageId && (
        <ReviewForm packageId={packageId} onSubmitted={load} />
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No reviews yet. Be the first to share your Maharashtra trek experience.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.review_id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
