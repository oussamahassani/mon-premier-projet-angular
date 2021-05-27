import {Injectable} from '@angular/core'
import {HttpClient,HttpHeaders} from '@angular/common/http'
import {environment} from 'src/environments/environment'

@Injectable({
    providedIn:'root'
})
export class  Prestatairedeservice {
    authToken: any;
    baseUrl = environment.baseUrl;
    constructor(private http:HttpClient){
    }

    getService() {
        return this.http.get<any>(this.baseUrl + '/service', {
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
      exporter(type){
        return this.http.get<any>(this.baseUrl + '/service/export/'+type, {
          responseType : 'blob' as 'json',
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
      getoneService(id) {
        return this.http.get<any>(this.baseUrl + '/service/'+id, {
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
  
      updateService(data, id) {
        return this.http.put<any>(this.baseUrl + '/service/'+id,data, {
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
      posteService(data) {
        return this.http.post<any>(this.baseUrl + '/service/ajouter',data ,{
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
      deleteservice(id,data) {
        return this.http.put<any>(this.baseUrl + '/service/delete/'+id,data, {
            headers: new HttpHeaders().append('Content-type', 'application/json')
          });
      }
      geservicesByIds(ids){
        return this.http.get<any>(this.baseUrl + '/service/multiple/'+ids, {
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
      commanderservice(ids) {
        return this.http.put<any>(this.baseUrl + '/service/commander/'+ids, {
          headers: new HttpHeaders().append('Content-type', 'application/json')
        });
      }
}