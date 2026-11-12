import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  PageResponse,
  Product,
  ProductFilters,
  ProductRequest,
} from '../../../shared/models/shared-structure.model';
import { catchError, Observable } from 'rxjs';
import { handleHttpError } from '../../../shared/functions/error-handler.utils';

@Service()
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private getPagedProductsUrl = 'productos/paged';
  private getProductByIdUrl = 'productos/';
  private createProductUrl = 'productos';
  private updateProductUrl = 'productos';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}productos`).pipe(catchError(handleHttpError));
  }

  getPagedProducts(filters: ProductFilters): Observable<PageResponse<Product>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString())
      .set('sortBy', filters.sortBy)
      .set('direction', filters.direction);

    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.minStock) {
      params = params.set('minStock', filters.minStock);
    }
    if (filters.maxStock) {
      params = params.set('maxStock', filters.maxStock);
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice);
    }

    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    return this.http
      .get<PageResponse<Product>>(this.apiUrl + this.getPagedProductsUrl, { params })
      .pipe(catchError(handleHttpError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<Product>(this.apiUrl + this.getProductByIdUrl + id)
      .pipe(catchError(handleHttpError));
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl + this.createProductUrl,  product)
      .pipe(catchError(handleHttpError));
  }

  updateProduct(product: ProductRequest): Observable<Product> {
    return this.http
      .put<Product>(this.apiUrl + this.updateProductUrl, product)
      .pipe(catchError(handleHttpError));
  }
}
