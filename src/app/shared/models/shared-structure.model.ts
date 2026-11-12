
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  expires: number;
  rol: string;
  token: string;
  username: string;
}

export interface ProductRequest {
  id?: number;
  name: string;
  price: number;
  stock: number;
  contentType: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  contentType: string;
  image: string;
}

export interface ProductFilters {
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
  name?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minStock?: number | null;
  maxStock?: number | null;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
}
