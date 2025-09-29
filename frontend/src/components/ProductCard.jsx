const ProductCard = ({ product, discount = 25 }) => {
  const discountedPrice = Math.round(product.price * (1 - discount / 100));

  return (
    <div className="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-300">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 z-10 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      {discount > 0 && (
        <div className="absolute top-2 right-2 z-20 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
          -{discount}%
        </div>
      )}

      <div className="relative z-0 w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100">
        <img
          src={product.img?.[0] || "/ao.webp"}
          alt={product.productName}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="relative z-20 p-3">
        <h3 className="text-md truncate font-semibold text-gray-800">
          {product.productName}
        </h3>

        <div className="mt-2 flex gap-5 items-center">
          {discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
          )}
          <p className="text-lg font-bold text-blue-500">
            {discountedPrice.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-800">
          <span>Hồ Chí Minh</span>
          <span>Đã bán: {product.traded_count}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
