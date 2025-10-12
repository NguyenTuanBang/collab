import { useState } from "react";

function ProductImageSelector({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col items-center">
      <img
        src={selectedImage}
        alt="Product"
        className="h-96 w-96 object-contain mb-4 "
      />

      <div className="flex gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`w-20 h-20 object-cover border p-1 cursor-pointer ${
              selectedImage === img ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductImageSelector;
