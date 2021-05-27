import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  
  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getInventaireNewName()
  {
    return this.http.get<any>(this.baseUrl + '/inventaire/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterinventaire(inventaire:any)
  {
    return this.http.post<any>(this.baseUrl + '/inventaire/ajouter',inventaire, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }

  getinventaireById(id:string) {
    return this.http.get<any>(this.baseUrl + '/inventaire/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getinventaireByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/inventaire/getinventaires/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
 
  getDernierInventaire()
  {
    return this.http.get<any>(this.baseUrl + '/inventaire/dernier', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateinventaire(inventaire:any,inventaireId:string)
  {
    return this.http.put<any>(this.baseUrl + '/inventaire/'+inventaireId,inventaire, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
