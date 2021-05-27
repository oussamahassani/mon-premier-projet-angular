import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { FactureService } from 'src/app/services/facture/facture.service';
import { Lightbox } from 'ngx-lightbox';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {

 
  public focus;
  displayedColumns: string[] = ['numero','client','createdAt','ttc','ht','tva','payement.paid_status','payement.mode_paiement', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  closeResult: string;
  error: string;
  factures: any;
  facture: any;
  datasour:any;
  elem:any;
  deleteFacture: any;
  facturesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];


  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+this.imageSrc;
  isReceptionOnly=false;
  category : any;
  type="";
  query: any = {};
  constructor(private modalService: NgbModal,
    private factureService: FactureService, private snackBar: MatSnackBar,
    private generalService:GeneralService,
    private _lightbox: Lightbox,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private location:Location
    ) { 
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

    }

  ngOnInit(): void {
    this.query.categorie = this.category;
    this.init(this.query);

  }
  
  init(query : any = ""){
   this.activatedRoute.queryParams.subscribe(params=>{
      this.query.isReception=false;
      if(params["type"] && params["type"]==="interne")
      {
        this.query.isReception=true;
      } else {
        this.location.back();
      }
    })

    
    this.factureService.getfacture().subscribe(res => {
      console.log("res",res)
      this.datasour =   new MatTableDataSource(res);
      this.datasour.sort = this.sort;
      this.datasour.paginator = this.paginator;
      this.facturesLength=res.length
    } )

  }


  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadCommandesPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadCommandesPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadCommandesPage())
      )
      .subscribe();
  }
  loadCommandesPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'facture',this.query)
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
  voirImage(src)
  {
    const image = {
      src: this.baseUrlImage+src,
      caption: "Justificatif",
      thumb: this.baseUrlImage+src
   };
    let imageArray=[image];
    this._lightbox.open(imageArray, 0);
  }
  addFactureFile(imageInputPic: any,elementId)
  {
    this.isUploading = true;
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
              caption: "Justificatif de facturation",
              thumb: this.baseUrlImage+res.name
           };
            let imageArray=[image];
            this._lightbox.open(imageArray, 0);
            this.factureService.ajouterJustificatifFacture(res.name,elementId).subscribe(res=>{
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
       this.query.payment = {
         paid_status : statut
       }
      } else{
        delete this.query.statut;
      }
      this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'facture',this.query);
  }

  /*confirmCommand()
  {
    let commande=this.elem;
    commande.confirmed=true;
    commande.enCours=false;
    this.commandeService.changeStatut(commande,commande._id).subscribe(res=>{
      if(res.success)
      {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:"Command has been confirmed"},
          duration: 3000
        });
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:res.msg},
          duration: 3000
        });
      }
    })
  }*/

}
