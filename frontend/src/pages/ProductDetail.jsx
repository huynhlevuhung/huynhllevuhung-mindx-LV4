import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductImageSelector from "../components/ProductImageSeletor";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function ProductDetail() {
  const product = {
    _id: "68c5895fe340ec13b0e97a71",
    productName: "Áo thun nam thời trang",
    price: 250000,
    img: ["/ao.webp", "/ao1.webp", "/ao2.webp", "/ao3.webp", "/ao4.webp"],
    quantity: 50,
    totalRating: 4.2,
    rate_counting: 87,
    traded_count: 35,
    description:
      "Áo thun nam chất liệu cotton cao cấp, thoáng mát, dễ phối đồ, phù hợp mặc hàng ngày.",
    colors: ["Đen", "Trắng", "Xanh dương", "Đỏ"],
    sizes: ["S", "M", "L", "XL"],
  };

  const discount = 25;
  const discountedPrice = Math.round(product.price * (1 - discount / 100));

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(product.totalRating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - product.totalRating < 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      prev < product.quantity ? prev + 1 : product.quantity
    );
  };

  return (
    <>
      <Navbar />
      <div className="px-40 mt-40">
        <div className="flex gap-20">
          <ProductImageSelector images={product.img} />

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>

            <div className="flex gap-5 items-center">
              {discount > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString("vi-VN")}₫
                </p>
              )}
              <p className="text-2xl font-bold text-blue-600">
                {discountedPrice.toLocaleString("vi-VN")}₫
              </p>
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-800">
                  {product.totalRating}
                </span>
                <div className="flex">{renderStars()}</div>
              </div>

              <span className="text-gray-400">|</span>

              <div className="text-sm">{product.rate_counting} đánh giá</div>

              <span className="text-gray-400">|</span>

              <div className="text-sm">Đã bán: {product.traded_count}</div>
            </div>

            <p className="mt-4 text-gray-700">{product.description}</p>

            {/* Chọn màu */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Chọn màu:</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded border cursor-pointer ${
                      selectedColor === color
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn size */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Chọn size:</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border cursor-pointer ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <p className="font-semibold">Số lượng:</p>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50 transition font-bold text-lg"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50 transition font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="cursor-pointer flex-1 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition font-medium">
                Thêm vào giỏ hàng
              </button>

              <button className="cursor-pointer flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-medium">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;