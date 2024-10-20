"use client";
import { useState } from "react";

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userInfo, setUserInfo] = useState<string>("");
  const getUserInfo = () => {
    fetch(`${apiBaseUrl}/api/user`)
      .then((response) => response.json())
      .then((data) => {
        console.log("response:", data);
        setUserInfo(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  return (
    <div>
      <button onClick={getUserInfo}>获取user数据</button>
      <section>user数据区</section>
      <button>获取products数据</button>
      <section>products数据区</section>
    </div>
  );
}
