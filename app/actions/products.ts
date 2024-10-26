export async function getProducts() {
    // 这里可以连接数据库或其他数据源
    const productsData = {
      products: [
        "iPhone 15 Pro",
        "MacBook Air M2",
        "iPad Pro 2024",
        "AirPods Max",
        "Apple Watch Series 9"
      ]
    };
  
    return productsData;
  }