const categories = [
  { id: 1, name: "Quần áo", img: "/ao.webp" },
  { id: 2, name: "Đồ gia dụng", img: "/ao.webp" },
  { id: 3, name: "Thiết Bị Điện Tử", img: "/ao.webp" },
  { id: 4, name: "Máy Tính & Laptop", img: "/ao.webp" },
  { id: 5, name: "Máy Ảnh & Máy Quay Phim", img: "/ao.webp" },
  { id: 6, name: "Đồng Hồ", img: "/ao.webp" },
];

const Category = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="grid grid-cols-6 gap-6 justify-start py-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
          >
            <div className="w-30 h-30 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden shadow-md mb-2">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-30 h-30 object-contain"
              />
            </div>
            <span className="text-sm text-gray-700 text-center">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
