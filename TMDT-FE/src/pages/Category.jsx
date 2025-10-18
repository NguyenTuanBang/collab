import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@heroui/react";
import api from "../utils/api";
import CartDropdown from "../components/CartDropDown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_PORT}/sixTags`);
        // const response = await axios.get(`${import.meta.env.VITE_DEPLOY_PORT}/fiveTags`);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
                src={'/ao.webp'}
                alt={cat.nameTag}
                className="w-30 h-30 object-contain"
              />
            </div>
            <span className="text-sm text-gray-700 text-center">
              {cat.nameTag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
