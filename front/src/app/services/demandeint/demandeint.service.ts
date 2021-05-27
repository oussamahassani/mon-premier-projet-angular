import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DemandeintService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getDemandes() {
    return this.http.get<any>(this.baseUrl + '/demandeint', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterDemande(demande)
  {
    return this.http.post<any>(this.baseUrl + '/demandeint/ajouter',demande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }

  getDemandeNewName()
  {
    return this.http.get<any>(this.baseUrl + '/demandeint/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  changeStatut(demande:any,demandeId)
  {
    return this.http.put<any>(this.baseUrl+'/demandeint/statut/'+demandeId,demande,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }


 
  recevoirdemande(demandeId,comId)
  {
    return this.http.get<any>(this.baseUrl+'/demandeint/recevoir/'+demandeId+'/'+comId,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  getDemandeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/demandeint/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateDemande(demande:any,demandeId:string)
  {
    return this.http.put<any>(this.baseUrl + '/demandeint/'+demandeId,demande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteDemande(id: string,canceled) {
    return this.http.put<any>(this.baseUrl + '/demandeint/delete/'+id,{canceled:canceled}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
