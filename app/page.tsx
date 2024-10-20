"use client";
import { useState } from "react";

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userInfo, setUserInfo] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const getUserInfo = () => {
    fetch(`${apiBaseUrl}/api/user`)
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data.name);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const getProductsInfo = () => {
    fetch(`${apiBaseUrl}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const products = data.products;
        setList(products);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  return (
    <div>
      <button onClick={getUserInfo}>获取user数据</button>
      <section>user数据区:{userInfo}</section>
      <button onClick={getProductsInfo}>获取products数据</button>
      <section>
        products数据区:
        <ul>
          {list.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
