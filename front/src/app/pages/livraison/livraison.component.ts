import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { ClientService } from 'src/app/services/client/client.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.scss']
})
export class LivraisonComponent implements OnInit {
  public focus;
  //num,delievered,enAttente,products_no,total,active,frais,command,client,creatorId,note,date_livraison,createdAt,updatedAt
  displayedColumns: string[] = ['checked','num','client','tel','date_livraison','ttc','total','tva','delievered','action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  selection = new SelectionModel<any>(true, []);
  closeResult: string;
  error: string;
  clients:any;
  livraisons: any;
  livraison: any;
  deleteLivraison: any;
  livraisonsLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];


  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+this.imageSrc;
  constructor(private modalService: NgbModal,
    private livraisonService: LivraisonService,
    private clientService:ClientService,
    private snackBar: MatSnackBar,
    private generalService:GeneralService,
    private router:Router,
    private _lightbox: Lightbox) {

  }

  ngOnInit() {
    this.clientService.getClients().subscribe(res=>{
      if(res.success)
      {
        this.clients=res.obj;
      }else{

      }
    })
    this.generalService.getCount('livraison').subscribe(res => {
      this.livraisonsLength = res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'livraison');
  
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadLivraisonsPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadLivraisonsPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadLivraisonsPage())
      )
      .subscribe();
  }
  loadLivraisonsPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'livraison')
  }
  getClientName(clientId)
  {
    if(this.clients)
    {
     return this.clients.filter(x=>x._id===clientId)[0].name;
    }
  }
  getClientPhone(clientId)
  {
    if(this.clients)
    {
     return this.clients.filter(x=>x._id===clientId)[0].tel;
    }
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


  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  grouperFacture()
  {
    let items=this.selection.selected.map(item=>{
      return {
        id:item.item._id
      }
    })
    this.router.navigate(['/commande/add-facture'],{ queryParams: { items:JSON.stringify(items) } });
  }
  facturerLivraison(element)
  {
    let items=[{id:element.item._id}]
    this.router.navigate(['/commande/add-facture'],{ queryParams: { items:JSON.stringify(items) } });
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
  addLivraisonFile(imageInputPic: any,elementId)
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
              caption: "Justificatif de livraison",
              thumb: this.baseUrlImage+res.name
           };
            let imageArray=[image];
            this._lightbox.open(imageArray, 0);
            this.livraisonService.ajouterJustificatifLivraison(res.name,elementId).subscribe(res=>{
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
}
