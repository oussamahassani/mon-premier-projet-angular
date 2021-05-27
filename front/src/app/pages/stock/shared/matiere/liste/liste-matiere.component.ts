import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { SelectionModel } from '@angular/cdk/collections';
import { InventaireService } from 'src/app/services/inventaire/inventaire.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import {TypeMatService} from 'src/app/services/typemat/typemat.service';
import {saveAs} from 'file-saver';
@Component({
  selector: 'app-liste',
  templateUrl: './liste-matiere.component.html',
  styleUrls: ['./liste-matiere.component.scss']
})
export class ListeMatiereComponent implements OnInit {

  valeurtypedemande:string="stock"
  fileToUpload: File = null;
  exporting = false;
  importing = false;
  public focus;
  //reference,label,stock,image,lots,creatorId,active,createdAt
  displayedColumns: string[];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  selection = new SelectionModel<any>(true, []);
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  matieres: any;
  matiere: any;
  deleteMatiere: any;
  matieresLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  matQte: any;
  isInventaire: boolean = false;
  now: Date = new Date();
  inventaire: any;
  note = "";
  inventaireName = "";
  retirerElement: any;
  qteRetirer = 0;
  noteRetirer = 0;
  type = "matiere";
  periode_last: any;
  families = [];
  category: string;
  familyFilter: any = '1';
  activeFilter: any = '1';
  query:any={active:true}
  selectedItems=[];
  seenData = [];
  
  constructor(private modalService: NgbModal,
    private matiereService: MatiereService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private generalService: GeneralService,
    private router: Router,
    private typeMatService : TypeMatService,
    private inventaireService: InventaireService,
    private authService: AuthService) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      
      if (params["type"]) {
        switch (params["type"]) {
          case "matiere":
            this.displayedColumns = ['reference', 'designation', 'nature_stock', 'stock', 'stock_securite','valeur', 'prix_achat', 'action'];
            this.type = "matiere";
            this.isInventaire = false;
            break;
          case "inventaire":
            this.displayedColumns = ['checked', 'reference', 'designation', 'nature_stock', 'stock', 'stock_securite', 'stock_max', 'prix_achat'];
            this.startInventaire();
            this.type = "inventaire";

            break;
          case "achat":
            this.type = "achat";
            this.isInventaire = false;
            this.displayedColumns = ['checked', 'reference', 'designation', 'nature_stock', 'stock', 'stock_securite', 'stock_max', 'prix_achat'];
            break;
         case "sortie":
           this.type="sortie";
           this.isInventaire=false;
           this.displayedColumns = ['checked', 'reference', 'designation', 'nature_stock', 'stock'];
           break;   
        }
      } else {

      }
    })
    this.query.categorie = this.category;
    this.init(this.query);
    this.getMatFamilies();
  }

  init(query: any = ''){
    this.generalService.getCount('matiere').subscribe(res => {
      console.log(res)
      this.matieresLength = res;
    }, err => {
    })
    this.matiereService.getMatieres().subscribe(res => {
      console.log(res.obj)
    
    })
    
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'matiere',query);
    this.dataSource.generalSubject.subscribe(data => { console.log(data) ; this.seenData = data });
    
  }


  getMatFamilies(){
    this.typeMatService.getTypes('mp').subscribe(res=>{
      if(res.success)
      {
        this.families= res.obj;
      }
    })
  }

  filtre() {
  
    if (this.familyFilter != '1')
      this.query.famille = this.familyFilter;
    if (this.activeFilter != '1') {
      this.query.active = this.activeFilter == 'true'
    } else {
      this.query.active = true;
    } 
    console.log(this.query)
    this.init(this.query);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadMatieresPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadMatieresPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadMatieresPage())
      )
      .subscribe();
  }
  loadMatieresPage() {
    if (this.sort.active) {
      let x = this.activeSortHeader.filter(x => x === this.sort.active);
      if (!x || x.length == 0) {
        this.activeSortHeader.push(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader.push(1)
        } else {
          this.valueSortHeader.push(-1);
        }
      } else {
        let index = this.activeSortHeader.indexOf(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader[index] = 1;
        } else {
          this.valueSortHeader[index] = -1;
        }

      }
    }
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value, 'matiere')
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close() {
    this.modalService.dismissAll();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  deleteMatieres() {
    this.matiereService.deleteMatiere(this.deleteMatiere._id, false).subscribe(res => {
      if (res.success) {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'matiere');
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'La matiere a été désactivée'
          },
          duration: 3000
        });

      } else {
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de désactivation'
          },
          duration: 3000
        });
      }
    })
  }


  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  grouperDemande() {
    let items = this.selectedItems.map(item => {
      return {
        id: item._id
      }
    })
    this.router.navigate([this.category+'/demandes/add-demande'], { queryParams: { items: JSON.stringify(items) } });
  }
 
 
 


  toggle(item,event: MatCheckboxChange) {
    if (event.checked) {
     this.selectedItems.push(item);
   } else {
     const index = this.selectedItems.indexOf(item);
     if (index >= 0) {
       this.selectedItems.splice(index, 1);
     }
   }
 }

 toggleAll(event: MatCheckboxChange) { 

  if ( event.checked ) {
     this.seenData.forEach(row => {
        this.selectedItems.push(row)
        });
  } else {
     this.selectedItems.length = 0 ;
  }
}

 exists(item) {
   return this.selectedItems.indexOf(item) > -1;
 };

 isIndeterminate() {
   return (this.selectedItems.length > 0 && !this.isChecked());
 };

 isChecked() {
   return this.selectedItems.length === this.seenData.length && this.seenData.length > 0;
 };

  applyInventaire() {
    let inventaire = {
      num: this.inventaireName,
      creatorId: this.authService.getIdfromToken(),
      note: this.note,
      periode_last:this.periode_last,
      products: this.selectedItems.map(item => {
        return {
          id_produit: item._id,
          type_produit:item.categorie,
          prix_achat:item.prix_achat
        }
      })

    }
    this.close();
    this.router.navigate([this.category+'/inventaires/executer-inventaire'], { queryParams: { inventaire: JSON.stringify(inventaire) } });
    /*this.inventaireService.ajouterinventaire(inventaire).subscribe(res => {
      if (res.success) {
        let invId = res.obj;
        let inv = {
          _id: invId,
          matieres: items.map(item => {
            return {
              matiere_id: item.matiere_id,
              stock_reel: item.stock_reel,
              stock_theorique: item.stock_theorique
            }
          })
        }
        this.matiereService.ajouterInventaire(this.parsIds(items), inv).subscribe(res => {
          if (res.success) {
            this.close();
            this.router.navigate(['/inventaires/consulter-inventaire'], { queryParams: { id: inv._id } });
          } else {
           
          }
        })
      } else {
        console.log("err" + res)
      }
    })*/


  }
 
  startInventaire() {
    this.isInventaire = true;
    this.inventaireService.getInventaireNewName().subscribe(res => {
      if (res.success) {
        this.inventaireName = res.obj;
        this.inventaireService.getDernierInventaire().subscribe(res => {
          if (res.success) {
            if(res.obj && res.obj.length>0)
            {
              this.periode_last = res.obj[0].createdAt;
            }else{
              this.periode_last=this.now;
            }
            
          } else {
    
          }
        })
      } else {

      }
    })
    
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].matiere_id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  /*isAllSelected() {
     const numSelected = this.selection.selected.length;
     const numRows = this.dataSource.data.length;
     return numSelected === numRows;
   }
 
   /** Selects all rows if they are not all selected; otherwise clear selection. 
   masterToggle() {
     this.isAllSelected() ?
         this.selection.clear() :
         this.dataSource.data.forEach(row => this.selection.select(row));
   }*/

  
  grouperDemandeInt() {
    let items = this.selectedItems.map(item => {
      return {
        id: item._id
      }
    })
    this.router.navigate([this.category+'/demandesint/add-demandeint'], { queryParams: { items: JSON.stringify(items) } });  }

  
  exporter(type)
  {
    this.exporting = true;
    this.matiereService.exporter(type).subscribe(res=>{
      if(res)
      {
        saveAs(res,'liste_des_matieres_premiere.xlsx')
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Fichier crée avec succée, votre téléchargement commencera dans un instant'},
          duration: 3000
        });
        
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Probléme de création'},
          duration: 3000
        });
      }
      this.exporting = false;
      this.close();
    }, err => {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type:'alert-danger',
          text:'Probléme de création'},
        duration: 3000
      });
      this.exporting = false;
      this.close();
    });
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

  importer() {
    this.importing = true;
    this.matiereService.importer(this.fileToUpload,this.authService.getIdfromToken()).subscribe(res => {
      if(res.success)
      {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data:{
            type:'alert-success',
            text:'Importation terminer avec succée'},
          duration: 3000
        });
        this.init();
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:res.msg},
          duration: 3000
        });
      }
      this.close();
      this.importing = false;
      this.fileToUpload= null;
      }, error => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Une erreur c\'est produite'},
          duration: 3000
        });
        this.close();
        this.importing = false;
        this.fileToUpload= null;
      }); 
  }

  toggledtype(){
    console.log("val",this.valeurtypedemande)
    if(this.valeurtypedemande=="stock")
    this.valeurtypedemande="service"
  else
    this.valeurtypedemande="stock"
  }


}
