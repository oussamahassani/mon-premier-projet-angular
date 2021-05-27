import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LotService {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }


  
  getLots() {
    return this.http.get<any>(this.baseUrl + '/lot', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  exportLots()
  {
    return this.http.get<any>(this.baseUrl + '/lot/export', {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  ajouterLot(lot:any)
  {
    return this.http.post<any>(this.baseUrl + '/lot/ajouter',lot, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
   
  }
  ajouterMultipleLots(lots:any)
  {
    return this.http.put<any>(this.baseUrl + '/lot/add-multiple',lots, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
 verifyCodes(codes)
  {
    return this.http.get<any>(this.baseUrl + '/lot/verifycodes/'+codes, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  verifyCodesRecu(codes)
  {
    return this.http.get<any>(this.baseUrl + '/lot/verifycodes-recu/'+codes, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  getLotsByProdId(id)
  {
    return this.http.get<any>(this.baseUrl + '/lot/getLotsByProd/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }


  getLogById(id:string) {
    return this.http.get<any>(this.baseUrl + '/lot/'+id, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  updateLot(lot:any,lotId:string)
  {
    return this.http.put<any>(this.baseUrl + '/lot/'+lotId,lot, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  deleteLot(id: string,active) {
    return this.http.put<any>(this.baseUrl + '/lot/delete/'+id,{active:active}, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getLotsByIds(ids)
  {
    return this.http.get<any>(this.baseUrl + '/lot/getLots/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
  getLotsByMatiere(ids)
  {
    return this.http.get<any>(this.baseUrl + '/lot/getLotsByMultipleProd/'+ids, {
      headers : new HttpHeaders().append('Content-type', 'application/json')
    });
  }
 
  updateReelTheoriqueMultiple(ids,lots)
  {
    return this.http.put<any>(this.baseUrl + '/lot/update-multiple/' + ids, lots, {
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }
}
