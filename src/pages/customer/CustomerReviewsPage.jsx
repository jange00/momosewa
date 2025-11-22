import { FiStar, FiEdit } from "react-icons/fi";
import Card from "../../ui/cards/Card";
import Badge from "../../ui/badges/Badge";

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
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-golden-amber fill-golden-amber"
            : "text-charcoal-grey/20"
        }`}
      />
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
          {mockReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-charcoal-grey text-lg">
                      {review.productName}
                    </h3>
                    <Badge variant="default">Order #{review.orderId}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-charcoal-grey/70 mb-2">{review.review}</p>
                  <p className="text-sm text-charcoal-grey/60">{review.date}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-charcoal-grey/5 text-charcoal-grey/60">
                  <FiEdit className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {mockReviews.length === 0 && (
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

