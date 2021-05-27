import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service';
import { LotService } from 'src/app/services/lot/lot.service';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent implements OnInit {

  id;
  matiere: any;
  users: any;
  mouvements:any;
  lots:any;
  public focus;
  //name,mat_fis,tel,adresse,num_tva,email,zone,active,commands_no,chiffre_affaire,createdAt

displayedColumns: string[] = ['Ref','Date','Nature','Quantité','Prix','CMP','Valeur Global','Qte globale','Total MVT','N° Lot'];
  dataSource: GeneralDataSource;
  datasour : any
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  mouvement: any;
  deleteTypeMat: any;
  mouvementsLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  commands:any=[];
  fourCommandName="";
  isCommand:boolean=false;
  category: string;
  
  constructor(private snackBar: MatSnackBar,
    private userService: UserService,
    private mouvementService:MouvementService,
    private lotService:LotService,
    private matiereService:MatiereService,
    private generalService:GeneralService,
    private router:Router,
    private activatedRoute:ActivatedRoute) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      let query = {
        id_produit : this.id 
      } 
    this.generalService.getCount('mouvement',query).subscribe(res => {
      this.mouvementsLength = res;
    });
    this.mouvementService.getMouvement().subscribe(res => {  
      let mouvment =  res.obj.filter(el => el.id_produit == this.id)
      this.datasour =   new MatTableDataSource(mouvment);
      this.datasour.sort = this.sort;
      this.datasour.paginator = this.paginator;
    } ) ,(err => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de récuperation des mouvements'
          },
          duration: 3000
        });
      });
  })
  }

ngAfterViewInit(): void {
  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
}

loadMouvementsPage() {
  if (this.sort.active) {
    let x = this.activeSortHeader.filter(x => x === this.sort.active);
    if (!x || x.length == 0) {
      this.activeSortHeader.push(this.sort.active);
      if (this.sort.direction === "asc") {
        this.valueSortHeader.push(1)
      } else {
        this.valueSortHeader.push(-1);
      }
    }else{
      let index=this.activeSortHeader.indexOf(this.sort.active);
      if(this.sort.direction === "asc")
      {
        this.valueSortHeader[index]=1;
      }else{
        this.valueSortHeader[index]=-1;
      }
      
    }
  }
  this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, '','mouvement')
}


codelot(code){
  if(code.substring(0,4)==="lot0"){
    return "lot0";
  } else{
    return code;
  }

}


}
