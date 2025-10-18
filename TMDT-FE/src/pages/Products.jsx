import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/ProductBanner";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import Category from "./Category";
import { useEffect, useState } from "react";
import axios from "axios";

function Product() {
  // const products = [
  //   {
  //     _id: "68c5895fe340ec13b0e97a71",
  //     productName: "Nồi cơm điện siêu nhanh",
  //     price: 700000,
  //     img: ["ao.webp"],
  //     quantity: 30,
  //     totalRating: 5,
  //     rate_counting: 105,
  //     traded_count: 20,
  //     description: "Nồi cơm điện 1.8L",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a72",
  //     productName: "Máy xay sinh tố",
  //     price: 450000,
  //     img: ["ao.webp"],
  //     quantity: 50,
  //     totalRating: 4.5,
  //     rate_counting: 80,
  //     traded_count: 15,
  //     description: "Máy xay sinh tố công suất 500W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a73",
  //     productName: "Lò vi sóng",
  //     price: 1200000,
  //     img: ["ao.webp"],
  //     quantity: 12,
  //     totalRating: 4,
  //     rate_counting: 60,
  //     traded_count: 8,
  //     description: "Lò vi sóng dung tích 20L",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a74",
  //     productName: "Bình đun siêu tốc",
  //     price: 350000,
  //     img: ["ao.webp"],
  //     quantity: 40,
  //     totalRating: 4.2,
  //     rate_counting: 90,
  //     traded_count: 10,
  //     description: "Bình đun 1.7L, tự ngắt điện",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  //   {
  //     _id: "68c5895fe340ec13b0e97a75",
  //     productName: "Máy sấy tóc",
  //     price: 250000,
  //     img: ["ao.webp"],
  //     quantity: 25,
  //     totalRating: 4.1,
  //     rate_counting: 50,
  //     traded_count: 5,
  //     description: "Máy sấy tóc 1200W",
  //   },
  // ];
  const [products, setProducts] = useState([])
  const [topRating, setTopRating] = useState([])
  useEffect(() => {
    const fetchTopRating = async () => {
      const res = await axios.get(`${import.meta.env.VITE_LOCAL_PORT}/products/most-favourite`)
      // const res = await axios.get(`${import.meta.env.VITE_DEPLOY_PORT}/products/most-favourite`)
      setTopRating(res.data.data)
    }
    const fetchProduct = async () => {
      const res = await axios.post(`${import.meta.env.VITE_LOCAL_PORT}/products`)
      // const res = await axios.get(`${import.meta.env.VITE_DEPLOY_PORT}/products/most-favourite`)
      setProducts(res.data.data)
    }
    fetchTopRating()
    fetchProduct()
  },[])


  return (
    <>
      <Navbar />
      <div className="mt-25 px-6">
        <Banner />
        <div className="mt-20 px-10">
          <h2 className="text-2xl font-bold mb-4">Danh mục</h2>
          <Category />
        </div>

        <div className="mt-20 px-10">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
          <ProductCarousel products={topRating} />
        </div>

        <h2 className="text-2xl font-bold mb-4 px-10">Sản phẩm hôm nay</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ml-10">
          {products.map((product) => (
            <Link to={`/product/${product._id}`}>
              <ProductCard key={product._id} product={product} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Product;
