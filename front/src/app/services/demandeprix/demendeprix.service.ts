import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DemandePrixService {
    baseUrl = environment.baseUrl;
    constructor(private http:HttpClient) { }
    getalldemande()
    {
      return this.http.get<any>(this.baseUrl + '/demandeprix', {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });
    }
    postnewdevis(devis: File) {
      const formData = new FormData();
      formData.append('file',devis);
      return this.http.post<any>(this.baseUrl + '/demandeprix/upload',formData, {
      });
    }
    postemail(data:any)
    {
      return this.http.post<any>(this.baseUrl + '/demandeprix/sendmail',data, {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });
     
    }
getlasts(){
    return this.http.get<any>(this.baseUrl + '/demandeprix/last', {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });  
}
  getnumerodemandeprix() {
    return this.http.get<any>(this.baseUrl + '/demandeprix/nbr', {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });  
  }
    addnrewdemande(data:any)
    {
      return this.http.post<any>(this.baseUrl + '/demandeprix/ajouter',data, {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });
     
    }
  
    updatedemande(id:string , data:any) {
      return this.http.put<any>(this.baseUrl + '/demandeprix/'+id,data, {
        headers : new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  getdemandebyid(id:string) {
        return this.http.get<any>(this.baseUrl + '/demandeprix/'+id, {
          headers : new HttpHeaders().append('Content-type', 'application/json')
        });
}

    }