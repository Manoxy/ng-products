import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/imports/shared-imports';
import { ProductsService } from '../../../core/services/products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DEFAULT_ERROR } from '../../../shared/constants/AppConstants';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { MessagesService } from '../../../core/services/messages/messages.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslateService } from '../../../core/services/translate/translate.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Product, ProductRequest } from '../../../shared/models/shared-structure.model';

@Component({
  imports: [SHARED_IMPORTS, MatFormField, MatLabel, MatInput],
  selector: 'app-products-detail',
  styleUrl: './products-detail.component.scss',
  templateUrl: './products-detail.component.html',
})
export class ProductsDetailComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private productsService: ProductsService = inject(ProductsService);
  private loadingService: LoadingService = inject(LoadingService);
  private messageService: MessagesService = inject(MessagesService);
  public translateService: TranslateService = inject(TranslateService);
  private location: Location = inject(Location);

  public productForm!: FormGroup;
  public creationMode: boolean = true;
  private productId: number | null = null;

  // Para la previsualización de la imagen
  public imagePreview = signal<string | null>(null);
  public isAllLoaded = signal<boolean>(false)
  public selectedFile: File | null = null;
  public isDragging = false;

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.creationMode = false;
      this.productId = Number(idParam);
      this.loadProductData(this.productId);
    } else {
      this.creationMode = true;
      this.isAllLoaded.set(true);
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      contentType: ['', [Validators.required]],
    });
  }

  private loadProductData(id: number): void {
    this.loadingService.toggleIndicator(true);
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.loadingService.toggleIndicator(false);
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.image,
          contentType: product.contentType,
        });
        this.imagePreview.set(product.image || null);
        this.isAllLoaded.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.loadingService.toggleIndicator(false);
        this.messageService.error(
          err?.error?.code ? 'PRODUCTS.PRODUCTS_LIST.' + err.error.code : DEFAULT_ERROR,
        );
      },
    });
  }

  // --- Lógica de Drag & Drop y Selección de Archivos ---
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      return; // Validar que sea imagen
    }
    this.selectedFile = file;

    // Generar previsualización local en Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagePreview.set(base64String);
      this.productForm.patchValue({
        image: this.imagePreview,
        contentType: this.selectedFile?.type,
      });
    };
    reader.readAsDataURL(file);
  }

  public removeImage(event: Event): void {
    event.stopPropagation();
    this.imagePreview.set(null);
    this.selectedFile = null;
    this.productForm.patchValue({ image: '' });
  }

  cancel(): void {
    this.location.back();
  }

  private prepareProductForm(): ProductRequest {
    const product: ProductRequest = {
      name: this.productForm.value.name,
      contentType: this.productForm.value.contentType,
      stock: this.productForm.value.stock,
      price: this.productForm.value.price,
      image: this.productForm.value.image()
    };
    return product
  }

  public createOrUpdateProduct(): void {
    if (this.productForm.valid) {
      if (this.creationMode) {
        this.loadingService.toggleIndicator(true);
        this.subscriptions.add(
          this.productsService.createProduct(this.prepareProductForm()).subscribe({
            next: (data: Product) => {
              this.loadingService.toggleIndicator(false);
              if (data) {
                this.router.navigate(['/products']).then();
                this.messageService.success(
                  this.translateService.translate('PRODUCTS.PRODUCTS_DETAIL.OK_CREATE', {
                    name: data.name,
                  }),
                );
              }
            },
            error: (err: HttpErrorResponse) => {
              this.loadingService.toggleIndicator(false);
              this.messageService.error(
                err?.error?.code
                  ? 'PRODUCTS.PRODUCTS_LIST.' + err.error.code
                  : this.translateService.translate('PRODUCTS.PRODUCTS_DETAIL.KO_CREATE', {
                      name: this.productForm.value.name,
                    }),
              );
            },
          }),
        );
      } else {
        if (this.productId) {
          const productPayload = { id: this.productId, ...this.prepareProductForm() };
          this.loadingService.toggleIndicator(true);
          this.subscriptions.add(
            this.productsService.updateProduct(productPayload).subscribe({
              next: (data: Product) => {
                this.loadingService.toggleIndicator(false);
                if (data) {
                  this.router.navigate(['/products']).then();
                  this.messageService.success(
                    this.translateService.translate('PRODUCTS.PRODUCTS_DETAIL.OK_UPDATE', {
                      name: data.name,
                    }),
                  );
                }
              },
              error: (err: HttpErrorResponse) => {
                this.loadingService.toggleIndicator(false);
                this.messageService.error(
                  err?.error?.code
                    ? 'PRODUCTS.PRODUCTS_LIST.' + err.error.code
                    : this.translateService.translate('PRODUCTS.PRODUCTS_DETAIL.KO_UPDATE', {
                        name: productPayload.name,
                      }),
                );
              },
            })
          )
        }
      }
    } else {
      this.messageService.info('SHARED.INVALID_FORM');
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
