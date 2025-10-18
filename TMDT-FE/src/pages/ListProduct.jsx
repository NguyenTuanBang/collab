import React, { useState, useEffect, use } from "react";
import { Pagination, Button } from "antd";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
// import FilterDropdown from "../components/FilterProduct";
import FilterDrawer from "../components/FilterProduct";

const ListProduct = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState({ min: 0, max: Number.MAX_SAFE_INTEGER });

  const pageSize = 10;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  
  
  const handlePageChange = (page) => setCurrentPage(page);
  const fetchData = async () => {
    try {
      const url = `${import.meta.env.VITE_LOCAL_PORT}/products?page=${currentPage}`;
      const body = { keyword: name, category, price };
      // dùng POST thay cho GET
      const res = await axios.post(url, body);
      setData(res.data.data);
      setTotal(res.data.numberOfPages || 0);
    } catch (err) {
      console.error("❌ Lỗi khi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   let url = `${import.meta.env.VITE_LOCAL_PORT}/products?page=${currentPage}`;
    //   if (name) url += `&name=${name}`;
    //   const response = await axios.get(url);
    //   setData(response.data.data);
    //   setTotal(response.data.numberOfPages);
    // };
    fetchData();
  }, [currentPage, name, category, price]);

  

  return (
    <>
      <Navbar />
      <div className="mt-25 px-6">
        <h1 className="text-center text-5xl md:text-6xl font-bold mb-8">
          Danh sách sản phẩm
        </h1>

        {/* Hàng chứa kết quả tìm kiếm + nút filter */}
        <div className="flex justify-between items-center ml-11 mr-12 mb-10">
          {name ? (
            <span className="text-lg text-gray-600">
              Kết quả tìm kiếm cho: {name}
            </span>
          ) : (
            <span></span>
          )}

          <FilterDrawer
            open={open}
            setOpen={setOpen}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
          />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ml-10">
          {data.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`}>
              <ProductCard product={item} />
            </Link>
          ))}
        </div>

        {/* Phân trang */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 32 }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default ListProduct;
