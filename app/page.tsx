export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { getBaseUrl } from './config/urls';

async function getData() {
  const baseUrl = getBaseUrl();
  
  const [userRes, productsRes] = await Promise.all([
    fetch(`${baseUrl}/api/user`),
    fetch(`${baseUrl}/api/products`)
  ]);

  if (!userRes.ok || !productsRes.ok) {
    throw new Error('Failed to fetch data');
  }

  const userData = await userRes.json();
  const productsData = await productsRes.json();

  return {
    user: userData,
    products: productsData
  };
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* User Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">用户数据</h2>
              <div className="text-gray-700">
                <p>姓名: {data.user.name}</p>
                <p>ID: {data.user.id}</p>
                <p>角色: {data.user.role}</p>
                <p className="text-sm text-gray-500 mt-2">
                  请求时间: {data.user.requestTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">产品列表</h2>
              <ul className="space-y-2">
                {data.products.products.map((product) => (
                  <li
                    key={product}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm"
                  >
                    {product}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                请求时间: {data.products.requestTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}