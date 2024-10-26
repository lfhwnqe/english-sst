export async function getUser() {
    // 这里可以连接数据库或其他数据源
    const userData = {
      name: "张三",
      id: "001",
      role: "admin"
    };
  
    return userData;
  }