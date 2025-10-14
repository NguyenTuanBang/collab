import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ReviewSection from "../components/ReviewSection";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import axios from "axios";
import api from "../utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ProductDetail() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [product, setProduct] = useState({ variants: [] });
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${import.meta.env.VITE_LOCAL_PORT}/products/${id}`);
      setProduct(res.data.data);
    };
    fetchData();
  }, [id]);

  const colors = [...new Set(product.variants.map(v => v.image.color))];
  const sizes = [...new Set(product.variants.map(v => v.size.size_value))];
  const images = [...new Set(product.variants.map(v => v.image.url))];

  const validSizes = useMemo(() => {
    if (!selectedColor) return sizes;
    return [...new Set(
      product.variants
        .filter(v => v.image.color === selectedColor && v.quantity > 0)
        .map(v => v.size.size_value)
    )];
  }, [selectedColor, product.variants]);

  // Valid colors dựa trên size hiện tại
  const validColors = useMemo(() => {
    if (!selectedSize) return colors;
    return [...new Set(
      product.variants
        .filter(v => v.size.size_value === selectedSize && v.quantity > 0)
        .map(v => v.image.color)
    )];
  }, [selectedSize, product.variants]);

  const selectedVariant = useMemo(() => {
    return product.variants.find(v =>
      (!selectedColor || v.image.color === selectedColor) &&
      (!selectedSize || v.size.size_value === selectedSize) &&
      v.quantity > 0
    );
  }, [selectedColor, selectedSize, product.variants]);

  const minQuantityOverall = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return 1;
    return Math.min(...product.variants.map(v => v.quantity));
  }, [product.variants]);

  const minValueOverall = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return 1;
    return Math.min(...product.variants.map(v => v.price));
  }, [product.variants]);

  const displayQuantity = selectedVariant?.quantity ?? minQuantityOverall;
  const displayValue = selectedVariant?.price ?? minValueOverall;
  const display = selectedVariant ? selectedVariant.price : displayValue;

  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));
  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, displayQuantity));

  const handleSelectColor = (color) => {
    const hasVariantWithCurrentSize = product.variants.some(
      v => v.image.color === color && (!selectedSize || v.size.size_value === selectedSize) && v.quantity > 0
    );

    if (!hasVariantWithCurrentSize) {
      // reset size nếu size hiện tại không hợp lệ với color mới
      setSelectedSize("");
    }

    setSelectedColor(color);

    // cập nhật ảnh theo color mới
    const variant = product.variants.find(v => v.image.color === color && v.quantity > 0);
    if (variant) setSelectedImage(variant.image.url);
  };

  // Chọn size
  const handleSelectSize = (size) => {
    const hasVariantWithCurrentColor = product.variants.some(
      v => (!selectedColor || v.image.color === selectedColor) && v.size.size_value === size && v.quantity > 0
    );

    if (!hasVariantWithCurrentColor) {
      // reset color nếu color hiện tại không hợp lệ với size mới
      setSelectedColor("");
    }

    setSelectedSize(size);
  };

  // const addToCart = async () => {
  //   if (!selectedColor || !selectedSize) return toast.error("Thiếu trường", "Vui lòng chọn đủ các trường giá trị");
  //   const res = await api.post(`/cart/addToCart`, { variant_id: selectedVariant._id, quantity });
  //   if (res.status === 200) toast.success("Thành công", "Vui lòng ấn vào giỏ hàng để xem thêm");
  //   else toast.error("Lỗi", "Vui lòng thử lại");
  // };
   const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/cart/addToCart", {
        variant_id: selectedVariant._id,
        quantity,
      });
    },
    onSuccess: () => {
      // ✅ Làm mới lại cart count trong Navbar
      toast.success("Thành công", "Vui lòng ấn vào giỏ hàng để xem thêm")
      queryClient.invalidateQueries(["cartCount"]);
    },
    onError: (err) => {
      toast.error("Lỗi", "Vui lòng thử lại");
      console.error(err);
    },
  });

  const addToCart = () => {
    if (!selectedVariant || !quantity) return;
    addToCartMutation.mutate();
  };

  const buyNow = async () => {
    if (!selectedColor || !selectedSize) return toast.error("Thiếu trường", "Vui lòng chọn đủ các trường giá trị");
    const res = await api.post(`/cart/buyNow`, { variant_id: selectedVariant._id, quantity });
    if (res.status === 200) {
      toast.success("Thành công", "Vui lòng ấn vào giỏ hàng để xem thêm");
      navigate('/cart');
    } else toast.error("Lỗi", "Vui lòng thử lại");
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(product.rating)) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i - product.rating < 1) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="px-40 mt-40">
        <div className="flex gap-20">
          <div className="flex flex-col items-center">
            <img
              src={selectedImage || images[0]}
              alt="Product"
              className="h-96 w-96 object-contain mb-4"
            />
            <div className="flex gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover border p-1 cursor-pointer ${selectedImage === img ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => {
                    setSelectedImage(img);
                    const variant = product.variants.find(v => v.image.url === img);
                    if (variant) setSelectedColor(variant.image.color);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-800">{product.rating}</span>
                <div className="flex">{renderStars()}</div>
              </div>
              <span className="text-gray-400">|</span>
              <div className="text-sm">{product.countRating} lượt đánh giá</div>
              <span className="text-gray-400">|</span>
              <div className="text-sm">Đã bán: {product.tradedCount}</div>
            </div>
            <p className="mt-4 text-gray-700">{product.description}</p>

            <div className="mt-4">
              <p className="font-semibold mb-2">
                Hàng tồn kho: <span className="text-gray-700">{selectedVariant ? selectedVariant.quantity : displayQuantity}</span>
              </p>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">
                Giá: <span className="text-gray-700">{display.toLocaleString("vi-VN")} VNĐ</span>
              </p>
            </div>

            {/* Chọn màu */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Chọn màu:</p>
              <div className="flex gap-2">
                {colors.map(color => {
                  const isValid = validColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => handleSelectColor(color)}
                      className={`px-4 py-2 rounded border cursor-pointer 
                        ${selectedColor === color ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}
                        ${!isValid ? "opacity-50" : ""}
                      `}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chọn size */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Chọn size:</p>
              <div className="flex gap-2">
                {sizes.map(size => {
                  const isValid = validSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className={`px-4 py-2 rounded border cursor-pointer
                        ${selectedSize === size ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}
                        ${!isValid ? "opacity-50" : ""}
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mt-4 flex items-center gap-3">
              <p className="font-semibold">Số lượng:</p>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button onClick={decreaseQuantity} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50 transition font-bold text-lg">-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={increaseQuantity} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50 transition font-bold text-lg">+</button>
              </div>
            </div>

            {user ? (
              <div className="mt-6 flex gap-4">
                <button className="flex-1 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition font-medium"
                  onClick={() => addToCart()}>
                  Thêm vào giỏ hàng
                </button>

                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-medium"
                  onClick={() => buyNow()}>
                  Mua ngay
                </button>
              </div>
            ) : (
              <div className="mt-6 flex gap-4">
                <button className="flex-1 border-2 border-green-600 text-green-600 px-6 py-3 rounded hover:bg-blue-50 transition font-medium" onClick={() => navigate("/authen/login")}>
                  Đăng nhập để mua hàng
                </button>
              </div>
            )}

          </div>
        </div>
      </div >
      <ReviewSection id={id} />
    </>
  );
}

export default ProductDetail;
