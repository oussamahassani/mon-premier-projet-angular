import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product/product.service';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-update-produit',
  templateUrl: './update-produit.component.html',
  styleUrls: ['./update-produit.component.scss']
})
export class UpdateProduitComponent implements OnInit {

  formProduct: FormGroup;
  id;
  product:any;
  selectedFile: ImageSnippet;
  imageSrc:string="";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL:any;
  baseUrlImage = environment.baseUrlImage;
  submitProduct: boolean = false;
  isError:boolean=false;
  errorMsg:string="";
  
  constructor(private activatedRoute:ActivatedRoute,
    private productService:ProductService,
    private generalService:GeneralService, 
    private snackBar: MatSnackBar) {
   }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.productService.getProductById(this.id).subscribe(res=>{
        this.product=res;
        this.previewURL=this.baseUrlImage+""+this.product.image;
        this.imageSrc=this.product.image;
      },err=>{
        this.snackBar.open("Problem getting product", 'X', {
          duration: 3000
        });
      })
    })
  }
  get ft() { return this.formProduct.controls; }
  updateProductSubmit()
  {
    if(this.imageSrc && this.imageSrc.length>0)
    {
      if(this.validateProduct())
      {
        this.productService.updateProduct(this.product,this.product._id).subscribe(res=>{
          if(res.success)
          {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Product has been updated successfully'},
              duration: 3000
            });
           
          }else{
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problem updating product'},
              duration: 3000
            });
          }
        }) 
      }else{
        this.isError=true;
        this.errorMsg="Remplir tous les champs requis";
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: 'Veuillez remplir tout les champs',
          duration: 3000
        });
      }
    }
  }
  validateProduct()
  {
    if(this.product.name && this.product.name.length>0 && 
      this.product.code && this.product.code.length>0 &&
      this.product.prix && this.product.prix > 0 &&
      this.product.tva && this.product.tva > 0)
    {
      return true;
    }else{
      
      return false;
    }
  }
  updateImage(imageInputPic)
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
            this.imageSrc = res.name;
            this.isUploadingMsg = "Upload finished"
            
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Image has been uploaded successfully'},
              duration: 3000
            });
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
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-danger',
              text:'Internal Server Error'},
            duration: 3000
          });
        })
    });
    if (imageInputPic.files[0]) {
      reader.readAsDataURL(imageInputPic.files[0]);
    }
  }

}
