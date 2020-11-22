import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection: AngularFirestoreCollection<Product> = this.firestore.collection('products');

  constructor(private firestore: AngularFirestore) { }

  getProducts = (): Observable<Product[]> => this.productsCollection.valueChanges();

  addProduct(product: Product) {
    product.id = this.firestore.createId();
    product.name = product.name.toLowerCase();
    return this.productsCollection.doc(product.id).set(product);
  } 

  updateProduct(product: Product) {
    product.name = product.name.toLowerCase();
    return this.productsCollection.doc(product.id).set(product);
  } 

  deleteProduct = (product: Product) => this.productsCollection.doc(product.id).delete();

  searchByName(name: string){
   return this.firestore.collection<Product>('products', ref => ref.orderBy('name')
    .startAt(name).endAt(name+"\uf8ff")).valueChanges();
  }
  
}
