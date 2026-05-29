import { useCallback, useState } from "react";
import { reviewService } from "../../services/reviewService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    avg_rating: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const [listRes, statsRes] = await Promise.all([
        reviewService.adminList(),
        reviewService.adminAnalytics(),
      ]);
      setReviews(listRes.data?.reviews || []);
      setStats(statsRes.data || stats);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useAutoRefresh(load, {
    intervalMs: 30000,
    immediate: true,
  });

  const moderate = async (reviewId, status, featured = false) => {
    await reviewService.moderate(reviewId, {
      moderation_status: status,
      is_featured: featured,
    });
    await load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Moderation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Review management
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total", stats.total],
          ["Pending", stats.pending],
          ["Approved", stats.approved],
          ["Avg rating", stats.avg_rating || "—"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Review</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.review_id} className="border-t border-slate-100">
                <td className="px-6 py-4">{review.email || review.user_id}</td>
                <td className="px-6 py-4">★ {review.rating}</td>
                <td className="px-6 py-4 max-w-md truncate">
                  {review.review_text}
                </td>
                <td className="px-6 py-4 capitalize">
                  {review.moderation_status}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => moderate(review.review_id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moderate(review.review_id, "hidden")}
                    >
                      Hide
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        moderate(review.review_id, "approved", true)
                      }
                    >
                      Feature
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
