import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommandsorService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getCommands() {
    return this.http.get<any>(this.baseUrl + '/commandesor', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterMultipleCommande(commands:any)
  {
    return this.http.put<any>(this.baseUrl + '/commandesor/add-multiple',commands, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandNewName()
  {
    return this.http.get<any>(this.baseUrl + '/facture/lastcommandsor', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    }); 
  }

  ajouterCommande(commande:any)
  {
    return this.http.post<any>(this.baseUrl + '/commandesor/ajouter',commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }

  changeStatut(commande:any,commandId)
  {
    return this.http.put<any>(this.baseUrl+'/commandesor/statut/'+commandId,commande,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }


  getCommandeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/commandesor/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateCommande(commande:any,commandeId:string)
  {
    return this.http.put<any>(this.baseUrl + '/commandesor/'+commandeId,commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteCommande(id: string,canceled) {
    return this.http.put<any>(this.baseUrl + '/commandesor/delete/'+id,{canceled:canceled}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getCommandByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/commandesor/getcommands/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

}
