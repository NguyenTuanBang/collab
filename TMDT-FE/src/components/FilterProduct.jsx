import React, { useState, useEffect } from "react";
import { Drawer, Button, Checkbox, InputNumber, Space, message } from "antd";
import axios from "axios";

const FilterDrawer = ({
  category,
  setCategory,
  price,
  setPrice,
  open,
  setOpen,
}) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_LOCAL_PORT}/allTags`
        );
        setTags(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  // 🔹 Khi tick chọn/uncheck tag
  const handleCategoryChange = (checkedValues) => {
    setCategory(checkedValues);
  };

  // 🔹 Khi nhập min/max price
  const handlePriceChange = (field, value) => {
    setPrice((prev) => ({
      ...prev,
      [field]: Number(value) || 0,
    }));
  };

  // 🔹 Reset filter
  const handleReset = () => {
    setCategory([]);
    setPrice({ min: 0, max: 0 });
  };

  // 🔹 Kiểm tra giá trị hợp lệ
  const isInvalidPrice = price.min < 0 || price.max < 0 || price.min > price.max;

  // 🔹 Khi click “Áp dụng”
  const handleApply = () => {
    if (isInvalidPrice) {
      message.error("Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa!");
      return;
    }

    setOpen(false);
    console.log("Áp dụng filter:");
    console.log("Danh mục:", category);
    console.log("Khoảng giá:", price);
  };

  return (
    <>
      {/* Nút mở Drawer */}
      <Button
        type="primary"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        <i className="fa-solid fa-filter mr-2"></i>Bộ lọc
      </Button>

      {/* Drawer chứa nội dung filter */}
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="right"
        width={340}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col gap-6">
          {/* ✅ Danh mục (Tags) */}
          <div>
            <h3 className="font-semibold mb-2">Danh mục (Tags)</h3>
            <Checkbox.Group
              className="flex flex-col gap-1"
              value={category}
              onChange={handleCategoryChange}
            >
              {tags.map((tag) => (
                <Checkbox key={tag._id} value={tag._id}>
                  {tag.nameTag}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>

          {/* ✅ Khoảng giá */}
          <div>
            <h3 className="font-semibold mb-2">Khoảng giá (VNĐ)</h3>
            <Space>
              <InputNumber
                placeholder="Min"
                min={0}
                value={price.min===0 ? undefined : price.min}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\./g, "")}
                style={{ width: "100%" }}
                onChange={(val) => handlePriceChange("min", val)}
              />
              <span>-</span>
              <InputNumber
                placeholder="Max"
                min={0}
                value={price.max===Number.MAX_SAFE_INTEGER ? undefined : price.max}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\./g, "")}
                style={{ width: "100%" }}
                onChange={(val) => handlePriceChange("max", val)}
              />
            </Space>
            {isInvalidPrice && (
              <p className="text-red-500 text-sm mt-2">
                ⚠️ Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa.
              </p>
            )}
          </div>

          {/* ✅ Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={handleReset}>Reset</Button>
            <Button
              type="primary"
              disabled={isInvalidPrice}
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
