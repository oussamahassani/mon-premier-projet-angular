import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getClients() {
    return this.http.get<any>(this.baseUrl + '/client', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getClientsNumber(){

    return this.http.get<any>(this.baseUrl + '/client/nbr', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  ajouterClient(client:any)
  {
    return this.http.post<any>(this.baseUrl + '/client/ajouter',client, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  getClientById(id:string) {
    return this.http.get<any>(this.baseUrl + '/client/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateClient(client:any,clientId:string)
  {
    return this.http.put<any>(this.baseUrl + '/client/'+clientId,client, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteClient(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/client/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
