import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getallReception()
  {
    return this.http.get<any>(this.baseUrl + '/bonreception', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getReceptionNewName()
  {
    return this.http.get<any>(this.baseUrl + '/bonreception/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  changeStatut(bonreception,bonreceptionId)
  {
    return this.http.put<any>(this.baseUrl+'/bonreception/statut/'+bonreceptionId,bonreception,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  ajouterBonreception(bonreception:any)
  {
    return this.http.post<any>(this.baseUrl + '/bonreception/ajouter',bonreception, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  payerReception(recIds,id_facture)
  {
    return this.http.put<any>(this.baseUrl+'/bonreception/recevoir/'+recIds,{id:id_facture},{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  getBonreceptionById(id:string) {
    return this.http.get<any>(this.baseUrl + '/bonreception/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getBonreceptionByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/bonreception/getbonreceptions/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
 
  updateBonreception(bonreception:any,bonreceptionId:string)
  {
    return this.http.put<any>(this.baseUrl + '/bonreception/'+bonreceptionId,bonreception, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterJustificatifReception(src,id)
  {
    return this.http.put<any>(this.baseUrl + '/bonreception/justifrec/'+id,{src:src}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getReceptionByFournisseur(id)
  {
    //fournisseur
    return this.http.get<any>(this.baseUrl + '/bonreception/fournisseur/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
