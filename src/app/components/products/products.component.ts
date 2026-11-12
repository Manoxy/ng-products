import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/imports/shared-imports';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { PageResponse, Product, ProductFilters } from '../../shared/models/shared-structure.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DEFAULT_ERROR, PRODUCTS_LIST_SIZE } from '../../shared/constants/AppConstants';
import { LoadingService } from '../../core/services/loading/loading.service';
import { MessagesService } from '../../core/services/messages/messages.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderCell,
  MatCell,
  MatHeaderRowDef,
  MatRowDef,
  MatHeaderRow,
  MatRow,
} from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [
    SHARED_IMPORTS,
    MatPaginator,
    MatTable,
    MatSort,
    MatFormField,
    MatLabel,
    MatInput,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
  ],
  selector: 'app-products',
  styleUrl: './products.component.scss',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnDestroy, OnInit {
  private router = inject(Router);
  private subscriptions: Subscription = new Subscription();
  private productsService: ProductsService = inject(ProductsService);
  private loadingService: LoadingService = inject(LoadingService);
  private messageService: MessagesService = inject(MessagesService);

  public pageSizeOptions: number[] = PRODUCTS_LIST_SIZE;

  // 🔹 Definimos los estados reactivos como Signals
  public totalCount = signal<number>(0);
  public productsList = signal<Product[]>([]);
  public isAllLoaded = signal<boolean>(false);

  public displayedColumns: string[] = ['name', 'price', 'stock', 'actions'];
  public filters: ProductFilters = {
    page: 0,
    size: 10,
    sortBy: 'name',
    direction: 'asc',
    name: '',
    minPrice: null,
    maxPrice: null,
    minStock: null,
    maxStock: null,
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  public loadProducts(): void {
    this.isAllLoaded.set(false);
    this.loadingService.toggleIndicator(true);

    this.subscriptions.add(
      this.productsService.getPagedProducts(this.filters).subscribe({
        next: (data: PageResponse<Product>) => {
          this.loadingService.toggleIndicator(false);
          // 🔹 Actualizamos los Signals; la vista reaccionará de inmediato
          this.productsList.set(data.content);
          this.totalCount.set(data.totalElements);
          this.isAllLoaded.set(true);
        },
        error: (err: HttpErrorResponse) => {
          this.loadingService.toggleIndicator(false);
          this.isAllLoaded.set(true);
          this.messageService.error(
            err?.error?.code ? 'PRODUCTS.PRODUCTS_LIST.' + err.error.code : DEFAULT_ERROR,
          );
        },
      }),
    );
  }

  public onPageChange(event: PageEvent): void {
    this.filters.page = event.pageIndex;
    this.filters.size = event.pageSize;
    this.loadProducts();
  }

  public onSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.filters.sortBy = sortState.active;
      this.filters.direction = sortState.direction as 'asc' | 'desc';
    } else {
      this.filters.sortBy = 'name';
      this.filters.direction = 'asc';
    }
    this.loadProducts();
  }

  public onFilterNameChange(name: string): void {
    this.filters.name = name;
    this.filters.page = 0;
    this.loadProducts();
  }

  public onFilterMinPriceChange(value: string): void {
    this.filters.minPrice = value ? Number(value) : null;
    this.filters.page = 0;
    this.loadProducts();
  }

  public onFilterMaxPriceChange(value: string): void {
    this.filters.maxPrice = value ? Number(value) : null;
    this.filters.page = 0;
    this.loadProducts();
  }

  public onFilterMinStockChange(value: string): void {
    this.filters.minStock = value ? Number(value) : null;
    this.filters.page = 0;
    this.loadProducts();
  }

  public onFilterMaxStockChange(value: string): void {
    this.filters.maxStock = value ? Number(value) : null;
    this.filters.page = 0;
    this.loadProducts();
  }

  public goToDetail(id: number | string): void {
    this.router.navigate(['/products', id]).then();
  }

  public goToCreate(): void {
    this.router.navigate(['/products/create']).then();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
