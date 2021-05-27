import { environment } from '../../../environments/environment'
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();

import * as decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any ;
  authToken: any;
  permissions: any = [];
  departs: any;
  client: any;
  baseUrl = environment.baseUrl;
  
  cachedRequests: Array<HttpRequest<any>> = [];
public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }
public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  constructor(private http: HttpClient,private router:Router) {}


  authenticateUser(user) {
    return this.http.post<any>(this.baseUrl + '/user/auth', user, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

 

  sotreUserData(token) {
    localStorage.setItem('id_token' , token);

  }

  getOneUser(id: string) {
    return this.http.get<any>(this.baseUrl + '/user/' + id, {
      headers : new HttpHeaders().append('Authorization', this.authToken).append('Content-type', 'application/json')
    });
  }
  



  loggedIn() {
    return !helper.isTokenExpired(localStorage.getItem('id_token'));
  }


  logout() {
    this.user = null ;
    localStorage.clear();
    this.router.navigate(['login']);
  }

  getUserData() {
   const info = JSON.parse(localStorage.getItem('user')) ;
   return info ;
  }

  public getToken(): string {
    return localStorage.getItem('id_token');
  }

  getIdfromToken(): string{

    const decodedJwtData =  helper.decodeToken(this.getToken())
    console.log(decodedJwtData)
    return decodedJwtData._id;
  }

  getUserfromToken(){
    const decodedJwtData =  helper.decodeToken(this.getToken())
    return decodedJwtData;
  }



  getGroupes(GroupeIds) {
    return this.http.get<any>(this.baseUrl + '/groupe/getgroupes/' + GroupeIds, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

 async stockToken(){
    let permessionId: any = [];
    this.getOneUser(this.getIdfromToken())
    .subscribe((res) => {
      res.permissions.forEach( (permission) => {
        permessionId.push(permission);
        });
        this.getGroupes(permessionId)
        .subscribe((res) => {
          res.forEach( (groupe) => {
            this.permissions = this.permissions.concat(groupe.permissions);
        });
        
    }, err => {
      console.log(err);
    });
  });
  }



}
