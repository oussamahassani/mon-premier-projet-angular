import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getDemandes() {
    return this.http.get<any>(this.baseUrl + '/demande', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getDemandesByIds(ids) {
    return this.http.get<any>(this.baseUrl + '/demande/multiple/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterDemande(demande)
  {
    return this.http.post<any>(this.baseUrl + '/demande/ajouter',demande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }

  getDemandeNewName()
  {
    return this.http.get<any>(this.baseUrl + '/demande/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  changeStatut(demande:any,demandeId)
  {
    return this.http.put<any>(this.baseUrl+'/demande/statut/'+demandeId,demande,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  recevoirdemande(demandeId)
  {
    return this.http.get<any>(this.baseUrl+'/demande/recevoir/'+demandeId,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  getDemandeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/demande/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateDemande(demande:any,demandeId:string)
  {
    return this.http.put<any>(this.baseUrl + '/demande/'+demandeId,demande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteDemande(id: string,canceled) {
    return this.http.put<any>(this.baseUrl + '/demande/delete/'+id,{canceled:canceled}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  exporter(type) {
    return this.http.get<any>(this.baseUrl + '/demande/export/'+type, {
      responseType : 'blob' as 'json',
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
