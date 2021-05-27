import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ProductService } from 'src/app/services/product/product.service';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FactureService } from 'src/app/services/facture/facture.service';
import { GeneralService } from 'src/app/services/general.service';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-voirfacture',
  templateUrl: './voirfacture.component.html',
  styleUrls: ['./voirfacture.component.scss']
})
export class VoirfactureComponent implements OnInit {

 

  id;
  facture:any;
  items: any;
  client: any;
  livraisons: any = [];
  receptions:any=[];
  fournisseur:any;
  now = new Date();
  timbre = 0;
  name = "00000";
  mode = "";
  modes = ["Cash", "Chéque", "Banque", "Credit", "TPE"]
  statut = false;
  otherStatut=false;
  statutValue="";
  statutValues=["Payée","Non Payée"]
  total = 0;
  totalTva = 0;
  frais = 0;

  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+this.imageSrc;
  constructor(private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private commandService: CommandeService,
    private livraisonService: LivraisonService,
    private productService: ProductService,
    private factureService: FactureService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private generalService: GeneralService,
    private receptionService:ReceptionService,
    private fournisseurService:FournisseurService,
    private _lightbox: Lightbox) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.factureService.getfactureById(this.id).subscribe(res=>{
        this.facture=res;
        console.log(this.facture);
        if (this.facture.payement.paid_status) {
          this.statutValue = "Payée";
          this.mode=this.facture.payement.mode_paiement;
          this.statut = true;
        } else {
          this.statutValue = "Non Payée";
          this.statut = false;
        }
        if(this.facture.isReception)
        {
         this.receptionService.getBonreceptionByIds(this.parsIds(this.facture.bon_receptions)).subscribe(res=>{
           if(res.success)
           {
             console.log(res.obj)
             this.receptions=res.obj;
             console.log(this.receptions);
               this.fournisseur=this.facture.fournisseur;
           }else{
             
           }
         })
        }else{
          this.livraisonService.getLivraisonByIds(this.parsIds(this.facture.bon_livraisons)).subscribe(res => {
            if (res.success) {
              this.livraisons = res.obj;
              this.clientService.getClientById(this.livraisons[0].client).subscribe(res => {
                this.client = res;
              })
            } else {
    
            }
          })
        }
        
      })

     
    })
  }



  changerStatut(event) {
    if (event.target.value === "Payée") {
      this.otherStatut = true;
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type: 'alert-warning',
          text: 'Veuillez choisir un mode de paiement'
        },
        duration: 1500
      });
    } else {
      this.otherStatut = false;
    }
  }
  changerMode(event) {
    this.mode = event.target.value;
    if(this.otherStatut)
    {
       this.facture.payement={
         paid_status:true,
         mode_paiement:this.mode,
         user:this.authService.getIdfromToken()
       }
       this.factureService.changeStatut(this.facture,this.facture._id).subscribe(res=>{
         if(res.success)
         {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'La facture a été mise à jour'
            },
            duration: 3000
          });
          this.router.navigate(['/factures'])
         }else{
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Probléme de mise a jour'
            },
            duration: 3000
          });
         }
       })
    }
  }





  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i]._id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  printWindow()
  {
    let doc ;
   
    doc = document.getElementById('facture').innerHTML
    
    document.body.innerHTML = doc;
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<'+'html'+'><'+'body'+'>');
    win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
    win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
    win.document.write('<h1 style="text-align:center">'+'Entreprise hayat : Voire facture'+'<h1>');
    win.document.write(doc);
    win.document.write('<'+'/body'+'><'+'/html'+'>');
    setTimeout(() => {
      win.print()
     }, 1000);
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
}
