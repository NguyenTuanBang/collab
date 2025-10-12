import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewOverview from "./ReviewOverview";
import api from "../utils/api";
import { FaStar } from "react-icons/fa";

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews`);
        setReviews(res.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true;
    if (filter === "withImages") return r.images?.length > 0;
    return r.rating === Number(filter);
  });

  return (
    <div className="mt-16 pt-8 px-40 ">
      <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

      {loading ? (
        <p className="text-gray-500">Đang tải đánh giá...</p>
      ) : (
        <>
          <ReviewOverview
            reviews={reviews}
            onFilter={setFilter}
            activeFilter={filter}
          />

          {filteredReviews.length === 0 ? (
            <p className="text-gray-500">Không có đánh giá nào.</p>
          ) : (
            filteredReviews.map((review, index) => (
              <div key={index} className="flex gap-4 pb-4 mb-4">
                <img
                  src={review.user.avatar}
                  alt={review.user?.username || "Người dùng"}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">{review.user?.username}</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{review.review}</p>

                  {review.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`review-${i}`}
                          className="w-20 h-20 rounded object-cover cursor-pointer"
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}

      <ReviewForm />

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow text-black"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
