import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { ClientService } from 'src/app/services/client/client.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-voirbon',
  templateUrl: './voirbon.component.html',
  styleUrls: ['./voirbon.component.scss']
})
export class VoirbonComponent implements OnInit {
  id;
  livraison: any;
  client: any;
  command: any;
  statut = "";
  statutValue = false;
  products: any = [];
  values = ["Expediée", "En Attente"]


  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+this.imageSrc;
  constructor(private activatedRoute: ActivatedRoute,
    private livraisonService: LivraisonService,
    private generalService: GeneralService,
    private clientService: ClientService,
    private commandeService: CommandeService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router:Router,  private _lightbox: Lightbox) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.livraisonService.getLivraisonById(this.id).subscribe(res => {
        this.livraison = res;
        if (this.livraison.delievered) {
          this.statut = "Expediée";
          this.statutValue = true;
        } else {
          this.statut = "En Attente";
          this.statutValue = false;
        }
        this.clientService.getClientById(this.livraison.client).subscribe(res => {
          this.client = res;
        }, err => {

        })
        this.commandeService.getCommandeById(this.livraison.command).subscribe(res => {
          this.command = res;
          this.getProducts();
        }, err => {

        })
      }, err => {
        this.snackBar.open("Problem getting Client", 'X', {
          duration: 3000
        });
      })
    })
  }

  getProducts() {
    for (let i = 0; i < this.command.products.length; i++) {
      this.productService.getProductById(this.command.products[i].product_id).subscribe(res => {
        this.products.push({
          quantite: this.command.products[i].quantite,
          item: res
        });
      }, (err) => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: "Probléme de récuperation des produits"
          },
          duration: 3000
        });
      })
    }
  }

  changerStatut(event) {


    if (event.target.value === "Expediée") {
      this.statutValue = true;
      this.livraison.delievered = true;
      this.livraison.enAttente = false;
      this.livraisonService.changeStatut(this.livraison, this.livraison._id).subscribe(res => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: "Statut mis a jour avec succées"
            },
            duration: 3000
          });
          this.router.navigate(['/livraison'])
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: res.msg
            },
            duration: 3000
          });
        }
      })
    } else {
      this.statutValue = false;
    }
  }
  printWindow()
  {
    window.print(); 
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
