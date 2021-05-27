import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  authToken: any;
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getMatieres() {
    return this.http.get<any>(this.baseUrl + '/matiere', {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updatemultiple(data){
    return this.http.put<any>(this.baseUrl + '/matiere/updatemultiple',data, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  searchMatieresLabel(value) {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/matiere/label/' + value, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/matiere', {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  searchMatieresRef(value)
  {
    if (value && value.length > 0) {
      return this.http.get<any>(this.baseUrl + '/matiere/reference/' + value, {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    } else {
      return this.http.get<any>(this.baseUrl + '/matiere', {
        headers: new HttpHeaders().append('Content-type', 'application/json')
      });
    }
  }

  getMatieresNumber() {
    return this.http.get<any>(this.baseUrl + '/matiere/nbr', {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterMatiere(matiere: any) {
    return this.http.post<any>(this.baseUrl + '/matiere/ajouter', matiere, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getMatiereById(id: string) {
    return this.http.get<any>(this.baseUrl + '/matiere/' + id, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateMatiere(matiere: any, matiereId: string) {
    return this.http.put<any>(this.baseUrl + '/matiere/' + matiereId, matiere, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getMatiereByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/matiere/getmatieres/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteMatiere(id: string, active) {
    return this.http.put<any>(this.baseUrl + '/matiere/delete/' + id, { active: active }, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterLot(id, lots) {
    return this.http.put<any>(this.baseUrl + '/matiere/add-lot/' + id, lots, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateQuantite(ids,stocks)
  {
    return this.http.put<any>(this.baseUrl + '/matiere/update-quantite/' + ids, stocks, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateQuantiteReception(ids,stocks)
  {
    return this.http.put<any>(this.baseUrl + '/matiere/update-quantite-reception/' + ids, stocks, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateFournisseursPrices(ids,stocks)
  {
    return this.http.put<any>(this.baseUrl + '/matiere/update-fournisseur/' + ids, stocks, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  updateReelTheoriqueMultiple(ids,stocks)
  {
    return this.http.put<any>(this.baseUrl + '/matiere/update-multiple/' + ids, stocks, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterLotSortie(id, lots) {
    return this.http.put<any>(this.baseUrl + '/matiere/add-lot-sortie/' + id, lots, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  ajouterInventaire(ids, inventaire) {
    return this.http.put<any>(this.baseUrl + '/matiere/add-inventaire/' + ids, inventaire, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  commanderMatiere(matIds)
  {
    return this.http.put<any>(this.baseUrl+'/matiere/commander/'+matIds,{
      headers : new HttpHeaders().append('Content-type', 'application/json')
    })
  }

  getMatiereByFournisseur(id)
  {
    ///getbyfournisseur/:fournId
    return this.http.get<any>(this.baseUrl + '/matiere/getbyfournisseur/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  
  exporter(type) {
    return this.http.get<any>(this.baseUrl + '/matiere/export/'+type, {
      responseType : 'blob' as 'json',
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  
  importer(file: File,id){
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<any>(this.baseUrl + '/matiere/importer'+id,formData, {
      headers : new HttpHeaders()
    });
  }
}
