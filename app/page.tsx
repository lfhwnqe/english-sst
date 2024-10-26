import { getUser } from './actions/user';
import { getProducts } from './actions/products';

export default async function Home() {
  const userData = await getUser();
  const productsData = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* User Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">用户数据</h2>
              <div className="text-gray-700">
                <p>姓名: {userData.name}</p>
                <p>ID: {userData.id}</p>
                <p>角色: {userData.role}</p>
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
                {productsData.products.map((product) => (
                  <li
                    key={product}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}