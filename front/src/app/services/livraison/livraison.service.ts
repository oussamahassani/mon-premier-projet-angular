import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getLivraisonNewName()
  {
    return this.http.get<any>(this.baseUrl + '/livraison/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  changeStatut(livraison,livraisonId)
  {
    return this.http.put<any>(this.baseUrl+'/livraison/statut/'+livraisonId,livraison,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  ajouterLivraison(livraison:any)
  {
    return this.http.post<any>(this.baseUrl + '/livraison/ajouter',livraison, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  getLivraisonById(id:string) {
    return this.http.get<any>(this.baseUrl + '/livraison/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getLivraisonByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/livraison/getlivraisons/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  payerLivraison(livIds,id_facture)
  {
    return this.http.put<any>(this.baseUrl+'/livraison/payer/'+livIds,{id:id_facture},{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  updateLivraison(livraison:any,livraisonId:string)
  {
    return this.http.put<any>(this.baseUrl + '/livraison/'+livraisonId,livraison, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterJustificatifLivraison(src,id)
  {
    return this.http.put<any>(this.baseUrl + '/livraison/justifliv/'+id,{src:src}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
