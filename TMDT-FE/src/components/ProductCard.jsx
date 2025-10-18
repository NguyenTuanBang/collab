const ProductCard = ({ product }) => {
  const minPrice = Math.min(...product.variants.map(v => v.price));

  return (
    <div className="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-300 mb-5">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 z-10 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      <div className="relative z-0 w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100">
        <img
          src={product.variants[0].image.url || "/ao.webp"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="relative z-20 p-3">
        <h3 className="text-md truncate font-semibold text-gray-800">
          {product.name}
        </h3>

        <div className="mt-2 flex gap-5 items-center">
          {/* {discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
          )}
          <p className="text-lg font-bold text-blue-500">
            {discountedPrice.toLocaleString("vi-VN")}₫
          </p> */}
          <p className="text-lg font-bold text-blue-500">
            {minPrice.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-800">         
          <span>Đã bán: {product.tradedCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
