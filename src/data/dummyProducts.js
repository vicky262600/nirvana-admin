// src/data/dummyProducts.js
const dummyProducts = [
    {
      _id: "1",
      title: "Premium Cotton T-Shirt",
      description: "Comfortable and stylish cotton t-shirt perfect for everyday wear",
      images: ["https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["T-Shirts", "Casual"],
      price: 29.99,
      onSale: false,
      salePrice: 0,
      variants: [
        { size: "S", color: "White", quantity: 25 },
        { size: "M", color: "White", quantity: 30 },
        { size: "L", color: "White", quantity: 20 },
        { size: "XL", color: "White", quantity: 15 },
        { size: "S", color: "Black", quantity: 20 },
        { size: "M", color: "Black", quantity: 25 },
        { size: "L", color: "Black", quantity: 18 },
        { size: "XL", color: "Black", quantity: 12 }
      ]
    },
    {
      _id: "2",
      title: "Denim Jeans Classic Fit",
      description: "Classic fit denim jeans with perfect stretch and comfort",
      images: ["https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["Jeans", "Denim"],
      price: 79.99,
      onSale: true,
      salePrice: 59.99,
      variants: [
        { size: "30", color: "Blue", quantity: 15 },
        { size: "32", color: "Blue", quantity: 20 },
        { size: "34", color: "Blue", quantity: 18 },
        { size: "36", color: "Blue", quantity: 12 },
        { size: "30", color: "Black", quantity: 10 },
        { size: "32", color: "Black", quantity: 15 },
        { size: "34", color: "Black", quantity: 12 },
        { size: "36", color: "Black", quantity: 8 }
      ]
    },
    {
      _id: "3",
      title: "Hooded Sweatshirt",
      description: "Warm and cozy hooded sweatshirt for cold weather",
      images: ["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["Hoodies", "Sweatshirts"],
      price: 49.99,
      onSale: false,
      salePrice: 0,
      variants: [
        { size: "S", color: "Gray", quantity: 0 },
        { size: "M", color: "Gray", quantity: 5 },
        { size: "L", color: "Gray", quantity: 8 },
        { size: "XL", color: "Gray", quantity: 3 },
        { size: "S", color: "Navy", quantity: 12 },
        { size: "M", color: "Navy", quantity: 15 },
        { size: "L", color: "Navy", quantity: 10 },
        { size: "XL", color: "Navy", quantity: 7 }
      ]
    },
    {
      _id: "4",
      title: "Summer Dress Floral",
      description: "Beautiful floral summer dress perfect for warm days",
      images: ["https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["Dresses", "Summer"],
      price: 89.99,
      onSale: true,
      salePrice: 69.99,
      variants: [
        { size: "XS", color: "Pink", quantity: 8 },
        { size: "S", color: "Pink", quantity: 12 },
        { size: "M", color: "Pink", quantity: 15 },
        { size: "L", color: "Pink", quantity: 10 },
        { size: "XL", color: "Pink", quantity: 6 }
      ]
    },
    {
      _id: "5",
      title: "Leather Jacket",
      description: "Classic leather jacket for a bold and stylish look",
      images: ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["Jackets", "Leather"],
      price: 199.99,
      onSale: false,
      salePrice: 0,
      variants: [
        { size: "S", color: "Black", quantity: 5 },
        { size: "M", color: "Black", quantity: 8 },
        { size: "L", color: "Black", quantity: 6 },
        { size: "XL", color: "Black", quantity: 4 },
        { size: "S", color: "Brown", quantity: 3 },
        { size: "M", color: "Brown", quantity: 6 },
        { size: "L", color: "Brown", quantity: 4 },
        { size: "XL", color: "Brown", quantity: 2 }
      ]
    },
    {
      _id: "6",
      title: "Athletic Shorts",
      description: "Comfortable athletic shorts for workouts and sports",
      images: ["https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600"],
      categories: ["Shorts", "Athletic"],
      price: 34.99,
      onSale: false,
      salePrice: 0,
      variants: [
        { size: "S", color: "Gray", quantity: 20 },
        { size: "M", color: "Gray", quantity: 25 },
        { size: "L", color: "Gray", quantity: 22 },
        { size: "XL", color: "Gray", quantity: 18 },
        { size: "S", color: "Black", quantity: 15 },
        { size: "M", color: "Black", quantity: 20 },
        { size: "L", color: "Black", quantity: 18 },
        { size: "XL", color: "Black", quantity: 15 }
      ]
    }
  ];
  
  export default dummyProducts;
  