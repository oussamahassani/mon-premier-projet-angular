import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray, ValidationErrors } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { TypeMatService } from 'src/app/services/typemat/typemat.service';
import { LotService } from 'src/app/services/lot/lot.service';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-ajouter-matiere',
  templateUrl: './ajouter-matiere.component.html',
  styleUrls: ['./ajouter-matiere.component.scss']
})
export class AjouterMatiereComponent implements OnInit {

  formMatiere: FormGroup;
  submitMatiere: boolean = false;
  baseUrlImage = environment.baseUrlImage;
  matiere: any;
  selectedFile: ImageSnippet;
  imageSrc: string = "/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL: any = this.baseUrlImage + this.imageSrc;
  matiereFournisseurs=[];


  fournisseurTable: FormGroup;
  control: FormArray;
  touchedRows: any;
  initFournisseurs: any;
  filteredFournisseur: any;
  searchNameCtrl = new FormControl();
  searchMatriculeCtrl = new FormControl();
  searchRefCtrl = new FormControl();
  fournisseur = new FormControl();
  isLoading = false;
  errorMsg: string;
  tva = 0;
  natures = ["Pieces", "Kg", "Gr", "Litre"];

  chosenType = true;
  typeMatiere = "";
  typeList:any = [];
  mouvementName="";
  category="";
  fours = [];
  constructor(private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private matiereService: MatiereService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private fournisseurService: FournisseurService,
    private typematService: TypeMatService,
    private lotService: LotService,
    private mouvementService: MouvementService,
    private activatedRoute: ActivatedRoute) {
    this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
    this.fournisseurTable = this._formBuilder.group({
      tableRows: this._formBuilder.array([])
    });
    this.formMatiere = this._formBuilder.group({
      reference: new FormControl('', [
        Validators.required
      ]),
      designation: new FormControl('', [
        Validators.required
      ]),
      mesure_securite: new FormControl(''),
      norme_qualite: new FormControl(''),
      stock: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      stock_securite: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      stock_max: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      nature_stock: new FormControl('', [Validators.required]),
      famille: new FormControl('', [Validators.required]),
      prix_achat: new FormControl('0', [
      //  Validators.min(0),
        Validators.required
      ]),
      tva: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      isExpDate: new FormControl(true, [
        Validators.required
      ]),
      fodec: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initialFournisseurs();
    this.typematService.getTypes(this.category).subscribe(res => {
      if (res.success) {
        this.typeList = res.obj;
      }
    })
    this.mouvementService.getMouvementNewName().subscribe(res => {
      if (res.success) {
        this.mouvementName = res.obj;
      } else {

      }
    })
    this.touchedRows = [];
    this.addRow();

    this.searchRefCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredFournisseur = [];
        this.isLoading = true;
      }),
      switchMap(value => this.fournisseurService.searchFournisseurMatricule(value, this.category).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ))
    )
      .subscribe(data => {
        if (!data.success) {
          this.errorMsg = data.msg;
          this.filteredFournisseur = [];
        } else {
          this.errorMsg = "";
          this.filteredFournisseur = data.obj;
        }
      });
    this.searchNameCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredFournisseur = [];
        this.isLoading = true;
      }),
      switchMap(value => this.fournisseurService.searchFournisseurName(value, this.category).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ))
    )
      .subscribe(data => {
        if (!data.success) {
          this.errorMsg = data.msg;
          this.filteredFournisseur = [];
        } else {
          this.errorMsg = "";
          this.filteredFournisseur = data.obj;
        }
      });
    this.searchMatriculeCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredFournisseur = [];
        this.isLoading = true;
      }),
      switchMap(value => this.fournisseurService.searchFournisseurMatricule(value, this.category).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ))
    )
      .subscribe(data => {
        if (!data.success) {
          this.errorMsg = data.msg;
          this.filteredFournisseur = [];
        } else {
          this.errorMsg = "";
          this.filteredFournisseur = data.obj;
        }
      });
  }
  get ft() { return this.formMatiere.controls; }
  onAddMatiereSubmit() {
    this.submitMatiere = true;
    if (this.formMatiere.valid) {

      if (this.matiereFournisseurs && this.matiereFournisseurs.length > 0) {

        this.matiere = this.formMatiere.value;
        this.matiere.image = this.imageSrc;
        this.matiere.fournisseurs = this.matiereFournisseurs;
        this.matiere.categorie = this.category;
        this.matiere.stock_reel = this.matiere.stock;
        this.matiere.creatorId = this.authService.getIdfromToken();
        this.matiereService.ajouterMatiere(this.matiere).subscribe(res1 => {
          if (res1.success) {

            let lot = {
              code: "lot0" + res1.obj,
              quantite: this.matiere.stock,
              ht_unitaire: this.matiere.prix_achat,
              note: "Premier lot existant",
              id_produit: res1.obj,
              type_produit: this.matiere.categorie,
              isExpire: this.matiere.isExpDate,
              creatorId: this.authService.getIdfromToken(),
              quantite_originale: this.matiere.stock,
              date_expiration: new Date()
            }
            this.lotService.ajouterLot(lot).subscribe(res => {
              if (res.success) {
                let mouvement = {
                  num: this.mouvementName,
                  id_lot: res.obj,
                  quantite: this.matiere.stock,
                  id_produit: res1.obj,
                  type_produit: this.matiere.categorie,
                  entree: true,
                  prix_ref: this.matiere.prix_achat,
                  prix_cmp: this.matiere.prix_achat,
                  quantite_stock: this.matiere.stock
                }
                this.mouvementService.ajouterMouvement(mouvement).subscribe(res => {
                  if (res.success) {
                    this.snackBar.openFromComponent(SnackbarComponent, {
                      data: {
                        type: 'alert-success',
                        text: 'Matiere ajoutée avec succées'
                      },
                      duration: 3000
                    });
                    this.router.navigate([this.category+'/matieres'], { queryParams: { type: "matiere" } })
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
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: res1.msg
              },
              duration: 3000
            });
          }
        })
      }
    } else {
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
                type: 'alert-success',
                text: 'Image téléchargée avec succées'
              },
              duration: 3000
            });
            this.imageSrc = res.name;
            this.isUploadingMsg = "Upload finished"
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: 'Probleme de telechargement image'
              },
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

  //Fournisseur search
  ngAfterViewInit() {
    this.control = this.fournisseurTable.get('tableRows') as FormArray;
  }
  addRow() {
    this.fournisseur.reset();
    const control = this.fournisseurTable.get('tableRows') as FormArray;
    let form = this.initiateForm();
    control.push(form);
  }
  deleteRow(index: number) {
    const control = this.fournisseurTable.get('tableRows') as FormArray;
    this.fours.splice(index,1);
    control.removeAt(index);
  }
  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }
  get getFormControls() {
    const control = this.fournisseurTable.get('tableRows') as FormArray;
    return control;
  }
  submitForm() {
    const control = this.fournisseurTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
  }
  initiateForm(): FormGroup {
    return this._formBuilder.group({
      ref:[''],
      name: [''],
      prix_ht: [1],
      isEditable: [true]
    });
  }

  initialFournisseurs() {
    this.fournisseurService.getFournisseursByType(this.category).subscribe(res => {
      if (res.success) {
        console.log('listefournisseur',res.obj)
        this.initFournisseurs = res.obj //.filter(el => el.prestataire==false);
        this.filteredFournisseur = res.obj //.filter(el => el.prestataire==false);
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:"Probléme de récupération de  du fournisseur. Contactez votre administrateur."},
          duration: 3000
        });
      }
    })
  }
  selectFournisseur(event, i) {
    let item: any = this.fournisseur.value;
    this.fours.push(item._id);
    if (this.matiereFournisseurs && this.matiereFournisseurs.length > 0) {
      this.matiereFournisseurs.push({
        fournisseur: item._id,
        prix_ht: (this.fournisseurTable.get('tableRows') as FormArray).at(i).get("prix_ht").value
      })
    } else {
      this.matiereFournisseurs = [];
      this.matiereFournisseurs.push({
        fournisseur: item._id,
        prix_ht: (this.fournisseurTable.get('tableRows') as FormArray).at(i).get("prix_ht").value
      })
    }
    (this.fournisseurTable.get('tableRows') as FormArray).at(i).patchValue({
      ref: item.ref,
      mat_fis: item.mat_fis,
      name: item.name,
      tel: item.tel,
      prix_ht: (this.fournisseurTable.get('tableRows') as FormArray).at(i).get("prix_ht").value,
      tva: this.tva,
      isEditable: [false]
    })
  }
  changePrix(i) {
    let mat_fis = (this.fournisseurTable.get('tableRows') as FormArray).at(i).get("mat_fis").value;
    if (this.matiereFournisseurs && this.matiereFournisseurs.length > 0) {
      let index = this.matiereFournisseurs.findIndex(x => x.mat_fis === mat_fis);
      if (index != -1) {
        this.matiereFournisseurs[index].prix_ht = (this.fournisseurTable.get('tableRows') as FormArray).at(i).get("prix_ht").value;
      }
    }

  }

  changeType(event) {
    this.typeMatiere = event.target.value;
    this.chosenType = true;

  }

}
