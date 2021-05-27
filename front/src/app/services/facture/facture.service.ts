import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FactureService {


  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getFactureNewName()
  {
    return this.http.get<any>(this.baseUrl + '/facture/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getfacture() {
    return this.http.get<any>(this.baseUrl + '/facture/', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getFactureNumber(type)
  {
    return this.http.get<any>(this.baseUrl + '/facture/nbr/'+type, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  changeStatut(facture,factureId)
  {
    return this.http.put<any>(this.baseUrl+'/facture/statut/'+factureId,facture,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  ajouterfacture(facture:any)
  {
    return this.http.post<any>(this.baseUrl + '/facture/ajouter',facture, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  getfactureById(id:string) {
    return this.http.get<any>(this.baseUrl + '/facture/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updatefacture(facture:any,factureId:string)
  {
    return this.http.put<any>(this.baseUrl + '/facture/'+factureId,facture, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterJustificatifFacture(src,id)
  {
    return this.http.put<any>(this.baseUrl + '/facture/justiffac/'+id,{src:src}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }


  getFactureByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/facture/multiple/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
