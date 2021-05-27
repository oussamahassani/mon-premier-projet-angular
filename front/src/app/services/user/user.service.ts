import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.baseUrl + '/user', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getUsersByZone(zone){
    return this.http.put<any>(this.baseUrl + '/user/zone/',{zone:zone}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterUser(user:any)
  {
    return this.http.post<any>(this.baseUrl + '/user/register',user, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getUserById(id:string) {
    return this.http.get<any>(this.baseUrl + '/user/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateUser(user:any,userId:string)
  {
    return this.http.put<any>(this.baseUrl + '/user/'+userId,user, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteUser(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/user/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  //Group management
  getGroupes() {
    return this.http.get(this.baseUrl + '/groupe', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  createGroupe(groupe) {
    return this.http.post<any>(this.baseUrl + '/groupe/create',groupe, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getOneGroupe(id) {
    return this.http.get<any>(this.baseUrl + '/groupe/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateGroupe(id: string, data)  {
    return this.http.put<any>(this.baseUrl + '/groupe/'+id,data, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  deleteGroupe(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/groupe/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  
}
