import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
//import {ToasterService} from 'angular2-toaster';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders   } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  authToken: any;
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  createNotification(notification) {
    const headers = new HttpHeaders();
    this.loadToken();
    return this.http.post<any>(this.baseUrl + '/api/notification/create', notification, {
      headers : new HttpHeaders().append('Authorization', this.authToken).append('Content-type', 'application/json')
    });
  }

  getNotification(id) {
    const headers = new HttpHeaders();
    this.loadToken();
    return this.http.get<any>(this.baseUrl + '/api/notification/' + id, {
      headers : new HttpHeaders().append('Authorization', this.authToken).append('Content-type', 'application/json')
    });
  }

  public getToken(): string {
    return localStorage.getItem('id_token');
  }


  getIdfromToken(): string{
    const jwtData = this.getToken().split('.')[1]
    const decodedJwtJsonData = window.atob(jwtData)
    const decodedJwtData = JSON.parse(decodedJwtJsonData)
    return decodedJwtData._id;
}
  seennotification(userId) {
    const headers = new HttpHeaders();
    this.loadToken();
    return this.http.put<any>(this.baseUrl + '/api/notification/seen/' + userId, {
      headers : new HttpHeaders().append('Authorization', this.authToken).append('Content-type', 'application/json')
    });
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
