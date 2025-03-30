import React from "react";
import ReviewSummary from "../../../../src/components/vendor/ReviewSummary";

const mockReviews = [
  {
    id: "1",
    vendor_id: "v1",
    user_id: "u1",
    rating: 5,
    review_text: "Great service!",
  },
  {
    id: "2",
    vendor_id: "v1",
    user_id: "u2",
    rating: 4,
    review_text: "Very good",
  },
  {
    id: "3",
    vendor_id: "v1",
    user_id: "u3",
    rating: 5,
    review_text: "Excellent",
  },
  {
    id: "4",
    vendor_id: "v1",
    user_id: "u4",
    rating: 3,
    review_text: "Average",
  },
  {
    id: "5",
    vendor_id: "v1",
    user_id: "u5",
    rating: 2,
    review_text: "Below average",
  },
  {
    id: "6",
    vendor_id: "v1",
    user_id: "u6",
    rating: 5,
    review_text: "Amazing!",
  },
  {
    id: "7",
    vendor_id: "v1",
    user_id: "u7",
    rating: 4,
    review_text: "Good service",
  },
  {
    id: "8",
    vendor_id: "v1",
    user_id: "u8",
    rating: 1,
    review_text: "Terrible",
  },
];

const averageRating =
  mockReviews.reduce((acc, review) => acc + review.rating, 0) /
  mockReviews.length;

const ratingDistribution = {
  1: mockReviews.filter((r) => r.rating === 1).length,
  2: mockReviews.filter((r) => r.rating === 2).length,
  3: mockReviews.filter((r) => r.rating === 3).length,
  4: mockReviews.filter((r) => r.rating === 4).length,
  5: mockReviews.filter((r) => r.rating === 5).length,
};

const ReviewSummaryDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vendor Review Summary</h1>
      <ReviewSummary
        reviews={mockReviews}
        averageRating={averageRating}
        ratingDistribution={ratingDistribution}
      />
    </div>
  );
};

export default ReviewSummaryDemo;
