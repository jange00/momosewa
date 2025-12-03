import { useState } from "react";
import { FiStar, FiEdit, FiX, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Badge from "../../ui/badges/Badge";
import Button from "../../ui/buttons/Button";
import Input from "../../ui/inputs/Input";

// Mock reviews - replace with actual API call
const mockReviews = [
  {
    id: 1,
    orderId: "ORD-12344",
    productName: "Fried Momo (8 pcs)",
    rating: 5,
    review: "Absolutely delicious! The momos were crispy and flavorful. Highly recommended!",
    date: "Jan 14, 2024",
  },
  {
    id: 2,
    orderId: "ORD-12343",
    productName: "Chicken Momo (10 pcs)",
    rating: 4,
    review: "Good taste and quality. Could be a bit more spicy though.",
    date: "Jan 14, 2024",
  },
];

const CustomerReviewsPage = () => {
  const [editingId, setEditingId] = useState(null);
  const [reviews, setReviews] = useState(mockReviews);
  const [editForm, setEditForm] = useState({ rating: 5, review: "" });

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, review: review.review });
  };

  const handleSaveEdit = () => {
    if (!editForm.review.trim()) {
      toast.error("Please enter a review");
      return;
    }

    setReviews(
      reviews.map((r) =>
        r.id === editingId
          ? { ...r, rating: editForm.rating, review: editForm.review }
          : r
      )
    );
    setEditingId(null);
    toast.success("Review updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ rating: 5, review: "" });
  };

  const renderStars = (rating, editable = false, onChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => editable && onChange && onChange(i + 1)}
        className={editable ? "cursor-pointer hover:scale-110 transition-transform" : ""}
        disabled={!editable}
      >
        <FiStar
          className={`w-4 h-4 ${
            i < rating
              ? "text-golden-amber fill-golden-amber"
              : "text-charcoal-grey/20"
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
            My Reviews
          </h1>
          <p className="text-charcoal-grey/70">
            Reviews and ratings you've submitted
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-charcoal-grey text-lg">
                      {review.productName}
                    </h3>
                    <Badge variant="default">Order #{review.orderId}</Badge>
                  </div>
                  {editingId === review.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-2">
                          {renderStars(editForm.rating, true, (newRating) =>
                            setEditForm({ ...editForm, rating: newRating })
                          )}
                          <span className="text-sm text-charcoal-grey/60 ml-2">
                            {editForm.rating} / 5
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                          Review
                        </label>
                        <textarea
                          value={editForm.review}
                          onChange={(e) => setEditForm({ ...editForm, review: e.target.value })}
                          placeholder="Write your review..."
                          rows={4}
                          className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                          <FiSave className="w-4 h-4" />
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                          <FiX className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-charcoal-grey/70 mb-2">{review.review}</p>
                      <p className="text-sm text-charcoal-grey/60">{review.date}</p>
                    </>
                  )}
                </div>
                {editingId !== review.id && (
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 rounded-lg hover:bg-charcoal-grey/5 text-charcoal-grey/60"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">No reviews yet</h3>
              <p className="text-charcoal-grey/60 mb-6">
                Start reviewing your orders to help others make better choices
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerReviewsPage;

