import { Component,ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from 'src/app/services/general.service';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
} 
@Component({
  selector: 'app-voirservicereception',
  templateUrl: './voirservicereception.component.html',
  styleUrls: ['./voirservicereception.component.scss']
})
export class VoirservicereceptionComponent implements OnInit {
  @ViewChild('docModal') private docModal;
  id :any ;
  reception : any;
  statutValue: any;
  statut:any;
  justificatif:any;
  command:any;
  closeResult:any;
  baseUrlImage = environment.baseUrlImage;
  selectedFile: ImageSnippet;
  service:any;
  isUploading: boolean = false;
  imageSrc: string = "/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploadingMsg: string = "";
  previewURL: any = this.baseUrlImage + this.imageSrc;
  values = ["Reçu", "En Attente"];
  constructor(private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commandapService:CommandapproService,
    private receptionService : ReceptionService,
    private prestatairedeservice :Prestatairedeservice,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.receptionService.getBonreceptionById(this.id).subscribe(res => {
        this.reception = res;
        if (this.reception.statut === "Recu") {
          this.statut = "Reçu";
          this.statutValue = true;
          this.justificatif = this.reception.justificatif_reception;
        } else {
          this.statut = "En Attente";
          this.statutValue = false;
        
        }
        this.commandapService.getCommandeByReception(this.reception._id).subscribe(res => {
          if (res.success) {
            this.command = res.obj;
            this.getservice();
          } else {

          }

        })
      }, err => {
        this.snackBar.open("Problem getting Client", 'X', {
          duration: 3000
        });
      })
    })
  }
  getservice () {
    this.prestatairedeservice.geservicesByIds(this.parsIds(this.reception.products)).subscribe(res => {
      if (res.success) {
        this.service = res.obj;
        this.service = this.service.map(item => {
          return {
            _id: item._id,
            name: item.name,
            num: item.num,
            fournisseurs: item.fournisseurs,
            tva: item.tva,
            prix_achat: this.reception.products.filter(x => x.id_produit === item._id)[0].ht_unitaire,
            creatorId: item.creatorId,
            asked_quantite: this.reception.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
            livred_quantite: this.reception.products.filter(x => x.id_produit === item._id)[0].livred_quantite,
 
          }

  })
}})
}
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
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
  testprintpdf () {
    let doc ;
       
    doc = document.getElementById('bon').innerHTML
    
    document.body.innerHTML = doc;
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<'+'html'+'><'+'body'+'>');
    win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
    win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
    win.document.write('<h1 style="text-align:center">'+'Entreprise hayat bon de reception'+'<h1>');
    win.document.write(doc);
    win.document.write('<'+'/body'+'><'+'/html'+'>');
    setTimeout(() => {
      win.print()
     }, 1000);
    
    
    }
    changerStatut(event){
      if (event.target.value === "Reçu") {
        this.statutValue = true;
        this.reception.statut = "Recu"
        this.receptionService.changeStatut(this.reception, this.reception._id).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: "Bon de reception ajouté avec succées, stock mis a jour"
              },
              duration: 3000
            });
            this.router.navigate(['mp/receptions'])
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: "Matiere :" + res.msg
              },
              duration: 3000
            });
          }
        })

      }
      else {
        this.statutValue = false;
      }
    }

    addReceptionFile(imageInputPic: any, elementId){
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
              this.justificatif = res.name;
              this.open(this.docModal);
              this.receptionService.ajouterJustificatifReception(res.name, elementId).subscribe(res => {
                if (res.success) {
                  this.snackBar.openFromComponent(SnackbarComponent, {
                    data: {
                      type: 'alert-success',
                      text: 'Justificatif ajouté avec succées'
                    },
                    duration: 3000
                  });
  
                } else {
                  this.snackBar.openFromComponent(SnackbarComponent, {
                    data: {
                      type: 'alert-success',
                      text: 'Probléme ajout de justificatif'
                    },
                    duration: 3000
                  });
                }
              })
  
  
            } else {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-danger',
                  text: 'Problem uploading image'
                },
                duration: 3000
              });
            }
          })
    })
  }

}
