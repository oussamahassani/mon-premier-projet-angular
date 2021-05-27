import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  
  getCommands() {
    return this.http.get<any>(this.baseUrl + '/commande', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterCommande(commande:any)
  {
    return this.http.post<any>(this.baseUrl + '/commande/ajouter',commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }

  changeStatut(commande:any,commandId)
  {
    return this.http.put<any>(this.baseUrl+'/commande/statut/'+commandId,commande,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  livrerCommande(commandId,id_liv)
  {
    return this.http.put<any>(this.baseUrl+'/commande/livrer/'+commandId,{id:id_liv},{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }
  getCommandeById(id:string) {
    return this.http.get<any>(this.baseUrl + '/commande/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateCommande(commande:any,commandeId:string)
  {
    return this.http.put<any>(this.baseUrl + '/commande/'+commandeId,commande, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteCommande(id: string,canceled) {
    return this.http.put<any>(this.baseUrl + '/commande/delete/'+id,{canceled:canceled}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
