import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { stateGroups } from 'src/app/services/cities';
import {countryList} from 'src/app/services/countries';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-ajouter-fournisseur',
  templateUrl: './ajouter-fournisseur.component.html',
  styleUrls: ['./ajouter-fournisseur.component.scss']
})
export class AjouterFournisseurComponent implements OnInit {

  formFournisseur: FormGroup;
  fournisseur: any;
  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc:string="/uploads/a40bc09d-2832-479c-957c-6a9322c62c01.webp";
  previewURL:any=this.baseUrlImage+this.imageSrc;

   typeList:any=[
     {ref:"mp",
      name:"Matiere premiére"},
      {ref:"prm",
      name:"Piéces de rechange machine"},
      {ref:"prv",
      name:"Piéces de rechange véhicule"},
      {ref:"pl",
      name:"Produits laboratoires"},
      {ref:"fb",
      name:"Fournitures de bureau"},
      {ref:"tv",
       name:"Tenues de travail"},
      {ref:"pa",
      name:"Palettes"},
      {ref:"cb",
      name:"Carburant"},
      {ref:"ar",
       name:"Achats récurrent"},
       {ref:'service',
        name:"service"
       }
   ]
  ref:string="";
  
  types:string[]=["Fournisseur Local","Fournisseur Etranger"]
  type="";
  countries=countryList;
  stateGroups=stateGroups;

  constructor(private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private fournisseurService: FournisseurService,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private router:Router) {
    this.formFournisseur = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/)
      ]),
      mat_fis: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^/s /]+$/)
      ]),
      tel: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]{8}")
      ]),
      adresse: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      note: new FormControl(''),
      categorie :new FormControl('',[
        Validators.required
      ]),
      type: new FormControl(null,[
        Validators.required
      ]),
      place: new FormControl('',[
        Validators.required
      ]),
      prestataire: new FormControl(false)

    });
  }

  ngOnInit(): void {
    this.fournisseurService.getFournisseurNewName().subscribe(res=>{
      if(res.success)
      {
       this.ref=res.obj;
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:"Probléme de récupération de la référence du fournisseur. Contactez votre administrateur."},
          duration: 3000
        });
      }
    })
  }
  get ft() { return this.formFournisseur.controls; }
  
  onAddFournisseurSubmit() {
    if (this.formFournisseur.valid) {
   
        this.fournisseur = this.formFournisseur.value;
        this.fournisseur.logo=this.imageSrc;
        this.fournisseur.ref=this.ref;
        this.fournisseur.creatorId=this.authService.getIdfromToken();
        this.fournisseur.total_achat=0;
        this.fournisseurService.ajouterFournisseur(this.fournisseur).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Fournisseur ajouté avec succées'
              },
              duration: 3000
            });
            this.router.navigate(['/fournisseurs'])
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
      return;
    }
  }
 
  addImage(imageInputPic: any) {
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
                text:'Image a été téléchargée avec succès'},
              duration: 3000
            });
            this.imageSrc = res.name;
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problème lors du téléchargement de l image'},
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
