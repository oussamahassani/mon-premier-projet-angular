import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TypeMatService {


  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getTypes(category)
  {
    return this.http.get<any>(this.baseUrl + '/typemat/active/'+category, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    }); 
  }
  
  getAllTypes()
  {
    return this.http.get<any>(this.baseUrl + '/typemat/allactive', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    }); 
  }
  createTypemat(typemat:any){
    return this.http.post<any>(this.baseUrl + '/typemat/create',typemat, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  deleteTypemat(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/typemat/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateTypemat(typemat:any,typematId:string){
    return this.http.put<any>(this.baseUrl + '/typemat/'+typematId,typemat, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getTypeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/typemat/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
