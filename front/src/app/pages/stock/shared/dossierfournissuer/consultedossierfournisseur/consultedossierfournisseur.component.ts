import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {devises} from 'src/app/services/devis'
import {DossierFournissuerService} from 'src/app/services/dossierservice/dossier.service'
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-consultedossierfournisseur',
  templateUrl: './consultedossierfournisseur.component.html',
  styleUrls: ['./consultedossierfournisseur.component.scss']
})
export class ConsultedossierfournisseurComponent implements OnInit {
  formFournisseur: FormGroup;
  fournissuer:any;
  devies  = devises;
  id : any;
  creator:any;
  previewURL   = environment.baseUrlImage
  constructor(private ActivatedRoute:ActivatedRoute, private dossierFournissuerService:DossierFournissuerService, private _formBuilder: FormBuilder ,private snackBar: MatSnackBar, private router:Router) {  this.formFournisseur = this._formBuilder.group({
   
    exp :new FormControl('',[
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

  get ft() { return this.formFournisseur.controls; }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe(params => {
  this.id = params['id'];
    this.dossierFournissuerService.getonedossier(this.id).subscribe(res => {
      this.fournissuer = res.fournisseur
      this.creator = res.creatorId
      this.formFournisseur.patchValue(res)
      console.log(res)
    })
  })
}
  dossierupdateSubmit(){
    this.dossierFournissuerService.updateone(this.id , this.formFournisseur.value).subscribe(res => {
      if (res.success) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'Dossier mise ajour avec succées'
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
    }
      )

  }
  calculemontant() {
    let value = this.formFournisseur.controls.mtdevise.value * this.formFournisseur.controls.tconversion.value
    this.formFournisseur.controls.mtdinar.setValue(value);
  }
}
