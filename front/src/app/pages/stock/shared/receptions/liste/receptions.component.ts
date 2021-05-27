import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import {MatTableDataSource} from '@angular/material/table';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-receptions',
  templateUrl: './receptions.component.html',
  styleUrls: ['./receptions.component.scss']
})

export class ReceptionsComponent implements OnInit {

  public focus;
  displayedColumns: string[] = ['num','fournisseur','totalpr','total_ht','ttc','createdAt','recu','action'];
  dataSource: GeneralDataSource;
  datasource : any ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  selection = new SelectionModel<any>(true, []);
  closeResult: string;
  error: string;
  bonreceptions: any;
  bonreception: any;
  deletebonreception: any;
  bonreceptionsLength: Number = 0;
  bonreceptionsserviceLength:Number=0;
  activeSortHeader = [];
  valueSortHeader = [];
  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+this.imageSrc;
  selectedItems=[];
  seenData = [];
  category = "";
  query:any = {};
  fours:any;
  valeurtypedemande: any = 'stock'
  constructor(private modalService: NgbModal,
    private bonreceptionService: ReceptionService,
    private snackBar: MatSnackBar,
    private generalService:GeneralService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private _lightbox: Lightbox) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
  }

  ngOnInit() {
    this.query.categorie = this.category;
    this.init(this.query);
  }

  init(query : any = ""){

    this.fournisseurService.getFournisseurs().subscribe(res => {
      this.fours = res.obj;
      console.log(res);
    }, err => {
      console.log(err);
    })
    this.bonreceptionService.getallReception().subscribe(res => {
      let stock = res.obj.filter(el => el.categorie !=='service')
      this.bonreceptionsLength = stock.length;
      this.datasource =   new MatTableDataSource(stock)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    })

    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'bonreception',query);
    this.dataSource.generalSubject.subscribe(data => {
      data.forEach(obj => {
        if(!obj.facture_id && obj.statut == 'Recu')
        this.seenData.push(obj);    
      });
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadbonreceptionsPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadbonreceptionsPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadbonreceptionsPage())
      )
      .subscribe();
  }
  loadbonreceptionsPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'bonreception',this.query)
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

  grouperFacture()
  {
    let items=[];
      this.selectedItems.forEach(item => {
            let tmp ={id:item._id}
            items.push(tmp);
      });
    this.router.navigate([this.category+'/receptions/add-facture'],{ queryParams: { items:JSON.stringify(items) } });
  }
  facturerbonreception(element)
  {
    let items=[{id:element._id}]
    this.router.navigate([this.category+'/receptions/add-facture'],{ queryParams: { items:JSON.stringify(items) } });
  }

  calculPrix(element)
  {
    let matieres=element.products;
    let total=0;
    for (let i = 0; i < matieres.length; i++) {
      let prix = matieres[i].ht_unitaire;
      let qte = matieres[i].asked_quantite;
      total += prix * qte;
    }
    return total;
  }

  voirImage(src)
  {
    /*const image = {
      src: this.baseUrlImage+src,
      caption: "Justificatif",
      thumb: this.baseUrlImage+src
   };
    let imageArray=[image];
    this._lightbox.open(imageArray, 0);*/
  }
  addReceptionFile(imageInputPic: any,elementId)
  {
    this.isUploading = true;
    this.isUploadingMsg = "Image is uploading"
    const file: File = imageInputPic.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.previewURL = reader.result;
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.generalService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          if (res.success) {
            //popup show image
            //update facture
            const image = {
              src: this.baseUrlImage+res.name,
              caption: "Justificatif de reception",
              thumb: this.baseUrlImage+res.name
           };
            let imageArray=[image];
            this._lightbox.open(imageArray, 0);
            this.bonreceptionService.ajouterJustificatifReception(res.name,elementId).subscribe(res=>{
              if(res.success)
              {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type:'alert-success',
                    text:'Justificatif ajouté avec succées'},
                  duration: 3000
                });
                
              }else{
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type:'alert-success',
                    text:'Probléme ajout de justificatif'},
                  duration: 3000
                });
              }
            })
            
            
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problem uploading image'},
              duration: 3000
            });
          }
        },
        (err) => {

        })
    });
    if (imageInputPic.files[0]) {
      reader.readAsDataURL(imageInputPic.files[0]);
    }
  }

  getStatut(statut){
    if(statut != 0){
       this.query.statut = statut
      } else{
        delete this.query.statut;
      }
      this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'bonreception',this.query);
  }
  getfour(fournisseur){
    if(fournisseur != 0){
      this.displayedColumns = ['checked','num','fournisseur','totalpr','total_ht','ttc','createdAt','recu','action'];
       this.query.fournisseur = fournisseur
      } else{
        this.selectedItems.length = 0 ;
        delete this.query.fournisseur;
        this.displayedColumns = ['num','fournisseur','totalpr','total_ht','ttc','createdAt','recu','action'];
      }
      this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'bonreception',this.query);
  }

  isIndeterminate() {
    return (this.selectedItems.length > 0 && !this.isChecked());
  };
 
  isChecked() {
    return this.selectedItems.length === this.seenData.length && this.seenData.length > 0;
  };

  toggle(item,event: MatCheckboxChange) {
    if (event.checked) {
     this.selectedItems.push(item);
   } else {
     const index = this.selectedItems.findIndex(i => i._id === item._id);
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
  console.log(this.selectedItems);
}

exists(item) {
  return this.selectedItems.findIndex(i => i._id === item._id) > -1;
};
toggledtype(){
  if(this.valeurtypedemande=="stock"){
  this.valeurtypedemande="service"
  this.bonreceptionService.getallReception().subscribe(res => {
    let stock = res.obj.filter(el => el.categorie =='service')
    this.bonreceptionsserviceLength = stock.length;
   this.datasource = new MatTableDataSource(stock)
  })
}
  else{
  this.valeurtypedemande="stock"
  this.bonreceptionService.getallReception().subscribe(res => {
    let stock = res.obj.filter(el => el.categorie !=='service')
   this.datasource = new MatTableDataSource(stock)
  })
  }
}
}
