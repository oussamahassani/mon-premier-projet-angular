import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  authToken: any;
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>(this.baseUrl + '/product', {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  searchProducts(value) {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/product/name/' + value, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/product', {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  searchProductsCode(value)
  {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/product/code/' + value, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/product', {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  getProductsNumber() {
    return this.http.get<any>(this.baseUrl + '/product/nbr', {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterProduit(product: any) {
    return this.http.post<any>(this.baseUrl + '/product/ajouter', product, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getProductById(id: string) {
    return this.http.get<any>(this.baseUrl + '/product/' + id, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateProduct(product: any, productId: string) {
    return this.http.put<any>(this.baseUrl + '/product/' + productId, product, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteProduct(id: string, active) {
    return this.http.put<any>(this.baseUrl + '/product/delete/' + id, { active: active }, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateStock(id, stock) {
    return this.http.put<any>(this.baseUrl + '/product/qte/' + id, { stock: stock }, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
