import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";

import api from "../utils/api";
import useToast from "../hooks/useToast";

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      toast.error("Có lỗi xảy ra", "Bạn chỉ được tải lên tối đa 5 ảnh");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !reviewText) {
      toast.error(
        "Có lỗi xảy ra",
        "Vui lòng nhập đầy đủ đánh giá và chọn số sao!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("review", reviewText);

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      setLoading(true);

      const res = await api.post("/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Review response:", res.data);

      setRating(0);
      setReviewText("");
      setImages([]);
      e.target.reset();
      toast.success("Thành công", "Đã gửi đánh giá thành công!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 shadow-sm bg-gray-50 mb-10 border-t-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={`cursor-pointer text-2xl ${
                (hoverRating || rating) > i
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        <textarea
          className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          rows="4"
          placeholder="Chia sẻ cảm nhận của bạn..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition w-fit"
        >
          {images.length > 0 ? "Chọn lại" : "Chọn ảnh"}
        </button>

        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((img, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium self-start disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
