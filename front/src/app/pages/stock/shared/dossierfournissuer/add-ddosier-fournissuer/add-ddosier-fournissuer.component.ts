import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {devises} from 'src/app/services/devis'
import {FournisseurService} from 'src/app/services/fournisseur/fournisseur.service'
import {Router} from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import {DossierFournissuerService} from 'src/app/services/dossierservice/dossier.service'
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-ddosier-fournissuer',
  templateUrl: './add-ddosier-fournissuer.component.html',
  styleUrls: ['./add-ddosier-fournissuer.component.scss']
})
export class AddDdosierFournissuerComponent implements OnInit {
  formFournisseur: FormGroup;
  devies  = devises;
  fourEtranger : any;
  filename : string;
  previewURL : any;
  constructor(private authService:AuthService , private dossierFournissuerService:DossierFournissuerService, private _formBuilder: FormBuilder ,private snackBar: MatSnackBar, private router:Router, private fournisseurService : FournisseurService) {  this.formFournisseur = this._formBuilder.group({
    fournisseur :new FormControl('',[
      Validators.required
    ]),
    exp :new FormControl('',[
      Validators.required
    ]),
    date :new FormControl('',[
      Validators.required
    ]),
   
    RefBC: new FormControl('', [
      Validators.required
    ]),
    referencefacture : new FormControl('',[
    Validators.required
    ]),
    devise : new FormControl('' , [
      Validators.required
    ]),
    mtdevise : new FormControl('',[
      Validators.required
    ]),
    tconversion: new FormControl('',[
      Validators.required
    ]),
    mtdinar: new FormControl('', [
      Validators.required
    ]),
    Rdeclation: new FormControl('', [
      Validators.required
    ]),
    droitD: new FormControl('', [
      Validators.required
    ]),
    tva: new FormControl('', [
      Validators.required,
    ]),
    avanceis: new FormControl(''),
 
    refQ: new FormControl(null,[
      Validators.required
    ]),
    assurence: new FormControl('',[
      Validators.required
    ]),
    Magasinage: new FormControl(''),
 
    Fret: new FormControl(null,[
      Validators.required
    ]),
    Transit: new FormControl('',[
      Validators.required
    ]),
    Transport: new FormControl('',[
      Validators.required
    ])
  })}

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe(res => {
      console.log(res)
      let four_etranger = res.obj.filter(el => el.type==false)
      console.log(four_etranger)
      this.fourEtranger=four_etranger
    })
    console.log(this.devies)
  }
  get ft() { return this.formFournisseur.controls; }
  addImage(imageInput){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]); 
    reader.addEventListener('load', (event: any) => {
      this.previewURL = reader.result;
      this.dossierFournissuerService.uploadphoto(file).subscribe(
        (res) => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Image a été téléchargée avec succès'},
              duration: 3000
            });
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problème lors du téléchargement de l image'},
              duration: 3000
            });
          }
        }
    )})
 
  }
  AddossierSubmit(){
    if (this.formFournisseur.valid) {
   
      // this.fournisseur = this.formFournisseur.value;
      // this.fournisseur.logo=this.imageSrc;
      let dossier = this.formFournisseur.value 
       dossier.creatorId=this.authService.getIdfromToken();
       if(this.filename.length>0)
       dossier.photo = this.filename
      this.dossierFournissuerService.adddossier(dossier).subscribe(res => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Dossier ajouté avec succées'
            },
            duration: 3000
          });
          this.router.navigate(['/listeDossier'])
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
  } 
  }
  calculemontant() {
    let value = this.formFournisseur.controls.mtdevise.value * this.formFournisseur.controls.tconversion.value
    this.formFournisseur.controls.mtdinar.setValue(value);
  }
}
