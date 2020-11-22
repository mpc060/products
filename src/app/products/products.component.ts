import { Product } from './../models/product.model';
import { ProductService } from './../services/product.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>;

  filterproducts$: Observable<Product[]>;

  displayedColumns = ['name', 'price', 'stock', 'operations'];

  @ViewChild('name', {static: true}) productName: ElementRef;

  productForm = this.fb.group({
    id: [undefined],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required]],
    price: [0, [Validators.required]],
  })

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    this.filterproducts$ = this.products$;
  }

  submit() {
    let product: Product = this.productForm.value;
    if(!product.id) {
      this.addProduct(product);
    }else {
      this.updateProduct(product);
    }
  }

  addProduct(product: Product) {
    this.productService.addProduct(product)
      .then( () => {
        this.snackBar.open('Product added', 'OK', {duration: 2000});
        this.productForm.reset({name: '', stock: 0, price: 0, id: undefined});
        this.productName.nativeElement.focus();
        this.productForm.controls['name'].markAsPending();
      })
      .catch(() => { 
        this.snackBar.open('Error on submitting the product', 'OK', {duration: 2000});
      })
  }

  updateProduct(product: Product) {
    this.productService.updateProduct(product)
      .then(() => {
        this.snackBar.open("Product updated", "OK", {duration: 2000});
        this.snackBar.open('Product added', 'OK', {duration: 2000});
        this.productForm.reset({name: '', stock: 0, price: 0, id: undefined});
      })
      .catch(() => {
        this.snackBar.open("Error updating product", "OK", {duration: 2000});
      })
  }

  edit(product: Product) {
    this.productForm.setValue(product)
  }

  delete(product: Product) {
    this.productService.deleteProduct(product)
      .then(() => {
        this.snackBar.open("Product has been removed", "OK", {duration: 2000});
      })
      .catch(() => {
        this.snackBar.open("Error when trying to remove the product", "OK", {duration: 2000});
      })
  }

  filter(event) {
    this.filterproducts$ = this.productService.searchByName(event.target.value.toLowerCase());
  }
}
