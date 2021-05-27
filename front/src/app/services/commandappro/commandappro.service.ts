import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommandapproService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getCommands() {
    return this.http.get<any>(this.baseUrl + '/commandeap', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  exportCommands()
  {
    return this.http.get<any>(this.baseUrl + '/commandeap/export', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandNewName()
  {
    return this.http.get<any>(this.baseUrl + '/facture/lastcommandap', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    }); 
  }

  ajouterCommande(commande:any)
  {
    return this.http.post<any>(this.baseUrl + '/commandeap/ajouter',commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  ajouterMultipleCommande(commands:any)
  {
    return this.http.put<any>(this.baseUrl + '/commandeap/add-multiple',commands, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  changeStatut(commande:any,commandId)
  {
    return this.http.put<any>(this.baseUrl+'/commandeap/statut/'+commandId,commande,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  recevoirCommande(commandId,id_reception)
  {
    return this.http.put<any>(this.baseUrl+'/commandeap/recevoir/'+commandId,{id:id_reception},{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  getCommandeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/commandeap/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandeByFournisseur(id)
  {
    return this.http.get<any>(this.baseUrl + '/commandeap/fournisseur/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getIsDemandById(id:string)
  {
    ///isDemande/:demId
    return this.http.get<any>(this.baseUrl + '/commandeap/isDemande/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateCommande(commande:any,commandeId:string)
  {
    return this.http.put<any>(this.baseUrl + '/commandeap/'+commandeId,commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteCommande(id: string,canceled) {
    return this.http.put<any>(this.baseUrl + '/commandeap/delete/'+id,{canceled:canceled}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/commandeap/getcommands/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  exporter(type) {
    return this.http.get<any>(this.baseUrl + '/commandeap/export/'+type, {
      responseType : 'blob' as 'json',
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandeByReception(recid){
    return this.http.get<any>(this.baseUrl + '/commandeap/reception/'+recid, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
