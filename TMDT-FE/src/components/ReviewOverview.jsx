import { FaStar } from "react-icons/fa";

function ReviewOverview({ reviews, onFilter, activeFilter }) {
  if (!reviews || reviews.length === 0) return null;

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const countByStars = (star) =>
    reviews.filter((r) => r.rating === star).length;

  const withImages = reviews.filter((r) => r.images?.length > 0).length;

  const filters = [
    { label: "Tất cả", value: "all", count: totalReviews },
    { label: "Có ảnh", value: "withImages", count: withImages },
    ...[5, 4, 3, 2, 1].map((star) => ({
      label: `${star} sao`,
      value: `${star}`,
      count: countByStars(star),
    })),
  ];

  return (
    <div className="p-6 rounded-lg shadow-sm bg-gray-50 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={
                i < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-gray-500 text-sm">({totalReviews} đánh giá)</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => onFilter(f.value)}
              className={`cursor-pointer px-3 py-1 border rounded-full text-sm transition font-medium ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md hover:bg-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.label} ({f.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewOverview;
