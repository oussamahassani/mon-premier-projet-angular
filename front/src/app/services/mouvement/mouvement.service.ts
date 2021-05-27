import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }


  
  getMouvement() {
    return this.http.get<any>(this.baseUrl + '/mouvement', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  exportLots()
  {
    return this.http.get<any>(this.baseUrl + '/mouvement/export', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterMouvement(mouvement:any)
  {
    return this.http.post<any>(this.baseUrl + '/mouvement/ajouter',mouvement, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  ajouterMultipleMouvement(mouvements:any)
  {
    return this.http.put<any>(this.baseUrl + '/mouvement/add-multiple',mouvements, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }



  getMouvementById(id:string) {
    return this.http.get<any>(this.baseUrl + '/mouvement/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateMouvement(mouvement:any,mouvementId:string)
  {
    return this.http.put<any>(this.baseUrl + '/mouvement/'+mouvementId,mouvement, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteMouvement(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/mouvement/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getMouvementByProdId(id)
  {
    return this.http.get<any>(this.baseUrl + '/mouvement/getMouvement/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getMouvementNewName()
  {
    return this.http.get<any>(this.baseUrl + '/mouvement/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
