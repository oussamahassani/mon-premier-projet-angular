import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-ajouter-produit',
  templateUrl: './ajouter-produit.component.html',
  styleUrls: ['./ajouter-produit.component.scss']
})
export class AjouterProduitComponent implements OnInit {

  formProduct: FormGroup;
  submitProduct: boolean = false;
  baseUrlImage=environment.baseUrlImage;
  product:any;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/6957dd95-0991-43e7-8cea-b5a8e69bf3a8.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any=this.baseUrlImage+"/uploads/6957dd95-0991-43e7-8cea-b5a8e69bf3a8.webp";
  constructor(private _formBuilder: FormBuilder,
    private generalService:GeneralService,
    private productService:ProductService,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private router:Router) {
    this.formProduct = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required
      ]),
      code: new FormControl('', [
        Validators.required
      ]),
      prix: new FormControl(0, [
        Validators.required
      ]),
      tva: new FormControl(19, [
        Validators.required
      ]),
      promo: new FormControl(0),
      remise: new FormControl(0)

    });
   }

  ngOnInit(): void {
  }
  get ft() { return this.formProduct.controls; }
  onAddProductSubmit()
  {
    this.submitProduct=true;
    if(this.formProduct.valid)
    {
     if(this.imageSrc && this.imageSrc.length>0)
     {
       this.product=this.formProduct.value;
       this.product.image=this.imageSrc;
       this.product.creatorId=this.authService.getIdfromToken();
       this.productService.ajouterProduit(this.product).subscribe(res=>{
         if(res.success)
         {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-success',
              text:'Produit ajoutée avec succées'},
            duration: 3000
          });
          this.router.navigate(['/products'])
         }else{
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-danger',
              text:res.msg},
            duration: 3000
          });
         }
       })
     }   
    }else{
      return;
    }
  }
 

  addImage(imageInputPic: any) {
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
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Image has been uploaded successfully'},
              duration: 3000
            });
            this.imageSrc = res.name;
            this.isUploadingMsg = "Upload finished"
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
