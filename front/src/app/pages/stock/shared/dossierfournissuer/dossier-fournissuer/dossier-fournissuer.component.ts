import { Component,ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DossierFournissuerService} from 'src/app/services/dossierservice/dossier.service'
import {FournisseurService} from 'src/app/services/fournisseur/fournisseur.service'
@Component({
  selector: 'app-dossier-fournissuer',
  templateUrl: './dossier-fournissuer.component.html',
  styleUrls: ['./dossier-fournissuer.component.scss']
})
export class DossierFournissuerComponent implements OnInit {
  datasour : any
  isLoading:boolean=false;
  selectedValue:any;
  fournissuers:any;
  liste:any;
  displayedColumns: string[] = ['num','asked_quantite','creatorId','createdAt','statut','action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fournisseurService : FournisseurService ,private dossierFournissuerService : DossierFournissuerService) { 
}

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe(res => {
       this.fournissuers = res.obj.filter(el => el.type==false)

    })
    this.dossierFournissuerService.getalldossier().subscribe(res => {
      this.liste = res.obj
      this.datasour = new MatTableDataSource(res.obj)
      this.datasour.sort = this.sort;
      this.datasour.paginator = this.paginator;
    })
  }
  rechrche(event){
    const val = event.target.value;
    this.datasour =   new MatTableDataSource(this.liste.filter(el => el.referencefacture.toString().includes(val) ||el.fournisseur.name.toString().includes(val)
     || el.creatorId.fname.includes(val)
    ));
    if(val =="")
    this.datasour= this.liste
  } 
  filtre(id){
    this.datasour =   new MatTableDataSource(this.liste.filter(el => el.fournisseur._id == id
   ));
    if(id == '')
    this.datasour= this.liste
  }

}
