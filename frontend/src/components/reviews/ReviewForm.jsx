import { useState } from "react";
import { reviewService } from "../../services/reviewService";
import Button from "../ui/Button";

export default function ReviewForm({ packageId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Please write a short review.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await reviewService.create({
        package_id: packageId,
        rating: Number(rating),
        review_text: reviewText.trim(),
      });
      setReviewText("");
      setRating(5);
      onSubmitted?.();
    } catch (err) {
      setError(err.message || "Could not submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <h4 className="font-semibold text-slate-900">Write a review</h4>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Your experience
        <textarea
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </label>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
