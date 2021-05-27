import { Component, OnInit } from '@angular/core';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {Router,ActivatedRoute} from '@angular/router'
import {environment} from 'src/environments/environment'
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray, ValidationErrors } from '@angular/forms';
import {FournisseurService} from 'src/app/services/fournisseur/fournisseur.service'
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-consultservice',
  templateUrl: './consultservice.component.html',
  styleUrls: ['./consultservice.component.scss']
})

export class ConsultserviceComponent implements OnInit {
  formservice : FormGroup
  id:any;
  fournissuer:any;
  creator:any;
  listefournissuer:any;
  fournissuersname: any = []
  imageSrc:string="/uploads/28378e25-9f8b-4fe4-a69f-c91bbf3e815a.webp";
  baseUrlImage = environment.baseUrlImage;
  previewURL :any = this.baseUrlImage + this.imageSrc
  constructor(private fournisseurService:FournisseurService , private generalService:GeneralService, private fromBuilder :FormBuilder,private snackBar: MatSnackBar, private ActivatedRoute:ActivatedRoute,
    private authService: AuthService, private prestatairedeservice:Prestatairedeservice ) { this.formservice = this.fromBuilder.group({
    num: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    total: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    tva: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    fournisseur:'',
    note: new FormControl('')
  }) 

}

  ngOnInit(): void {
    
    this.fournisseurService.getFournisseurs().subscribe(res => {
      this.listefournissuer = res.obj
     })
  this.ActivatedRoute.queryParams.subscribe(params => {
  this.id = params['id'];
    this.prestatairedeservice.getoneService(this.id).subscribe(res => {
      this.fournissuer = res.fournisseurs.map(el => el.fournisseur._id)
      this.imageSrc=res.image
      this.previewURL = this.baseUrlImage + this.imageSrc
      this.fournissuersname=res.fournisseurs.map(el =>el.fournisseur)
      this.creator = res.creatorId
      this.formservice.patchValue(res)
      console.log(res)
    })
  })
}
get ft() { return this.formservice.controls; }
updateservice(){
  console.log(this.fournissuer )
  let data = this.formservice.value;
  data.creatorId = this.authService.getIdfromToken();
  let four = [];
  for (let i = 0 ;i<this.fournissuer.length;i++){
    four.push({'fournisseur':this.fournissuer[i]})
  }
  data.fournisseurs = four;
  data.image  = this.imageSrc

this.prestatairedeservice.updateService(data,this.id).subscribe(res => console.log(res))
}

ajouterFournissuer(){
  const val = this.formservice.controls.fournisseur.value;
  this.fournissuer.push(val);
  const fournissuer = this.listefournissuer.filter(el =>el._id == val)
  this.fournissuersname.push(fournissuer[0])

}
deleteservice(elem){
  this.fournissuersname = this.fournissuersname.filter(el =>el._id !==elem._id)
  this.fournissuer = this.fournissuer.filter(el =>el !==elem._id)
}
addImage(image){
  const file: File = image.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', (event: any) => {
    this.previewURL = reader.result;
    let selectedFile = new ImageSnippet(event.target.result, file);
    this.generalService.uploadImage(selectedFile.file).subscribe(
      (res) => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Image téléchargée avec succées'
            },
            duration: 3000
          });
          this.imageSrc = res.name;
         
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: 'Probleme de telechargement image'
            },
            duration: 3000
          });
        }
      });
    })
  if (image.files[0]) {
    reader.readAsDataURL(image.files[0]);
  }
}
}
