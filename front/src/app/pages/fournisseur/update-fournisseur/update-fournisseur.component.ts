import { Component, OnInit } from '@angular/core';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { countryList } from 'src/app/services/countries';
import { stateGroups } from 'src/app/services/cities';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-update-fournisseur',
  templateUrl: './update-fournisseur.component.html',
  styleUrls: ['./update-fournisseur.component.scss']
})
export class UpdateFournisseurComponent implements OnInit {

  id;
  fournisseur: any;
  formFournisseur: FormGroup;
  matieres: any;
  baseUrlImage = environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc: string = "/uploads/a40bc09d-2832-479c-957c-6a9322c62c01.webp";
  previewURL: any = this.baseUrlImage + this.imageSrc;

  typeList: any = [
    {
      ref: "mp",
      name: "Matiere premiére"
    },
    {
      ref: "prm",
      name: "Piéces de rechange machine"
    },
    {
      ref: "prv",
      name: "Piéces de rechange véhicule"
    },
    {
      ref: "pl",
      name: "Produits laboratoires"
    },
    {
      ref: "fb",
      name: "Fournitures de bureau"
    },
    {
      ref: "tv",
      name: "Tenues de travail"
    },
    {
      ref: "pa",
      name: "Palettes"
    },
    {
      ref: "cb",
      name: "Carburant"
    },
    {
      ref: "ar",
      name: "Achats récurrent"
    },
    {ref:'service',
    name:"service"}
  ]
  types: string[] = ["Fournisseur Local", "Fournisseur Etranger"]
  type = "";
  countries = countryList;
  stateGroups = stateGroups;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private matiereService: MatiereService) {
    this.formFournisseur = this._formBuilder.group({
      ref:new FormControl('',[
        Validators.required
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
      mat_fis: new FormControl('', [
        Validators.required
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
      categorie: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl(null, [
        Validators.required
      ]),
      place: new FormControl('', [
        Validators.required
      ])


    });
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.fournisseurService.getFournisseurById(this.id).subscribe(res => {
        if (res.success) {
          this.fournisseur = res.obj;
          this.formFournisseur.patchValue({
            ref:this.fournisseur.ref,
            name: this.fournisseur.name,
            mat_fis:this.fournisseur.mat_fis,
            tel:this.fournisseur.tel,
            adresse:this.fournisseur.adresse,
            email:this.fournisseur.email,
            note: this.fournisseur.note,
            categorie:this.fournisseur.categorie,
            type:this.fournisseur.type,
            place:this.fournisseur.place
           });
           this.imageSrc=this.fournisseur.logo
           this.previewURL= this.baseUrlImage + this.imageSrc;
           
          this.matiereService.getMatiereByFournisseur(this.fournisseur._id).subscribe(res => {
            if (res.success) {
              this.matieres = res.obj;
            } else {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-danger',
                  text: 'Probléme de récuperation des matiéres'
                },
                duration: 3000
              });
            }
          })
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: 'Probléme de récuperation du fournisseur'
            },
            duration: 3000
          });
        }
      })
    })
  }
  get ft() { return this.formFournisseur.controls; }

  onUpdateFournisseurSubmit() {
    if (this.formFournisseur.valid) {
      this.fournisseur = this.formFournisseur.value;
      this.fournisseur.creatorId = this.authService.getIdfromToken();
      this.fournisseur.logo=this.imageSrc;
      this.fournisseurService.updateFournisseur(this.fournisseur, this.id).subscribe(res => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Fournisseur mis a jour avec succées'
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

  getPrice(id) {
    let fourns = this.matieres.filter(x => x._id === id)[0].fournisseurs;
    return fourns.filter(x => x.fournisseur === this.fournisseur._id)[0].prix_ht
  }

}
