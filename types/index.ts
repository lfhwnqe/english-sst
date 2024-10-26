export interface UserData {
    name: string;
    id: string;
    role: string;
    requestTime: string;
  }
  
  export interface ProductsData {
    products: string[];
    requestTime: string;
  }
  
  export interface PageData {
    user: UserData;
    products: ProductsData;
  }