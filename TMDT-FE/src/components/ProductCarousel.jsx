import React, { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductCarousel = ({ products }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const firstCard = carouselRef.current.firstChild;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth; // chỉ lấy width card, không tính gap
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
      </button>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide  py-6 scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default ProductCarousel;
