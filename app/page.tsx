import { headers } from 'next/headers';

interface UserData {
  name: string;
  id: string;
  role: string;
  requestTime: string;
}

interface ProductsData {
  products: string[];
  requestTime: string;
}

interface PageData {
  user: UserData;
  products: ProductsData;
}

export const dynamic = 'force-dynamic';

async function getData(): Promise<PageData> {
  // 使用 headers() 获取当前请求的 host
  const headersList = headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  // 打印当前环境信息，帮助调试
  console.log('Current environment:', {
    host,
    protocol,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    const baseUrl = `${protocol}://${host}`;
    console.log('Fetching from baseUrl:', baseUrl);

    const [userRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/api/user`, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${baseUrl}/api/products`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ]);

    if (!userRes.ok) {
      throw new Error(`User API failed: ${userRes.status}`);
    }
    if (!productsRes.ok) {
      throw new Error(`Products API failed: ${productsRes.status}`);
    }

    const userData = await userRes.json();
    const productsData = await productsRes.json();

    return {
      user: userData,
      products: productsData
    };
  } catch (error) {
    console.error('Data fetching error:', error);
    // 提供后备数据而不是抛出错误
    return {
      user: {
        name: "默认用户",
        id: "000",
        role: "guest",
        requestTime: new Date().toISOString()
      },
      products: {
        products: ["加载失败，请刷新重试"],
        requestTime: new Date().toISOString()
      }
    };
  }
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
                {data.products.products.map((product: string) => (
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