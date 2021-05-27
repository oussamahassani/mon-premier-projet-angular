import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  authToken: any;
  baseUrl = environment.baseUrl;
  public livraisons:any;
  constructor(private http:HttpClient) { }
  uploadImage(image: File)
  {
    const formData = new FormData();
    formData.append('image',image);
    return this.http.post<any>(this.baseUrl + '/file/upload',formData, {
      headers : new HttpHeaders()
    });
  }

  getBunch(skip,limit,sort,sortOrder,searchText,entity,query?)
  {
    let obj={
      entity:entity,
      sort:sort,
      sortOrder:sortOrder,
      searchText:searchText,
      query:query
    }
    return this.http.put<any>(this.baseUrl + '/file/'+skip+'/'+limit,obj, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    }).pipe(map(res=>res.obj.docs));
  }

  getCount(entity, query:any = '')
  {
    let body = {
      query: query
    }
    return this.http.post<any>(this.baseUrl + '/file/nbr/'+entity, body, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getAlertStockMP()
  {
    return this.http.get<any>(this.baseUrl + '/file/getAlertStockMP/', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  setLivraison(livraison)
  {
    this.livraisons=livraison;
  }
 
}
