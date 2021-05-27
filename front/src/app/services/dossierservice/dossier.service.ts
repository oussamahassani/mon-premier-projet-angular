import { Injectable} from '@angular/core'
import {environment} from 'src/environments/environment'
import {HttpClient , HttpHeaders} from '@angular/common/http'


@Injectable ({
providedIn:'root'
})

export class DossierFournissuerService{
baseUrl = environment.baseUrl
 constructor(private http : HttpClient){}

 uploadphoto(photo:any){
    let formData = new FormData();
    formData.append('file',photo);
    return this.http.post<any>(this.baseUrl + "/dossierfournisseur/add",formData)
 }
 getalldossier(){
     return this.http.get<any>(this.baseUrl+"/dossierfournisseur",{
    headers: new HttpHeaders().append('Content-type','application/json')
     })
 }
 adddossier(dossier :any){
     return this.http.post<any>(this.baseUrl + "/dossierfournisseur/ajouter",dossier,{
         headers:new HttpHeaders().append('content-type','application/json')
     })
 }

getonedossier(id : any){
    return this.http.get<any>(this.baseUrl+"/dossierfournisseur/"+id,{
     headers : new HttpHeaders().append('content-type','application/json')
    })
}
updateone(id:any,data:any){
    return this.http.patch<any>(this.baseUrl+"/dossierfournisseur/update/"+id,data ,{
        headers : new HttpHeaders().append('content-type','application/json')
    })
}
}