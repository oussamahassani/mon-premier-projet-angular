import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FournisseurService {


  
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }
  addreclamtion(id:string,data:any) {
    return this.http.put<any>(this.baseUrl + '/fournisseur/test/'+id,data, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updatereclamtion(id:string,data:any) {
    return this.http.put<any>(this.baseUrl + '/fournisseur/changestatut/'+id,data, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getFournisseurs() {
    return this.http.get<any>(this.baseUrl + '/fournisseur', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getFournisseursByType(type) {
    return this.http.get<any>(this.baseUrl + '/fournisseur/type/'+type, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  

  getFournisseursNumber(){

    return this.http.get<any>(this.baseUrl + '/fournisseur/nbr', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  ajouterFournisseur(fournisseur:any)
  {
    return this.http.post<any>(this.baseUrl + '/fournisseur/ajouter',fournisseur, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  getFournisseurById(id:string) {
    return this.http.get<any>(this.baseUrl + '/fournisseur/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateFournisseur(fournisseur:any,fournisseurId:string)
  {
    return this.http.put<any>(this.baseUrl + '/fournisseur/'+fournisseurId,fournisseur, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteFournisseur(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/fournisseur/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  searchFournisseurName(value,type) {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/fournisseur/name/' + value + '/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/fournisseur/type/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }
  searchFournisseurRef(value,type) {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/fournisseur/ref/' + value + '/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/fournisseur/type/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  searchFournisseurMatricule(value,type)
  {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/fournisseur/matricule/' + value + '/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/fournisseur/type/'+type, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  getFournisseurByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/fournisseur/getfournisseurs/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterCommande(fournisseurId,commandId)
  {
    return this.http.put<any>(this.baseUrl + '/fournisseur/ajoutercom/'+fournisseurId,{id:commandId}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getFournisseurNewName()
  {
    return this.http.get<any>(this.baseUrl + '/file/last', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  exporter(type) {
    return this.http.get<any>(this.baseUrl + '/fournisseur/export/'+type, {
      responseType : 'blob' as 'json',
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  
  importer(file: File,id){
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<any>(this.baseUrl + '/fournisseur/importer'+id,formData, {
      headers : new HttpHeaders()
    });
  }


}
