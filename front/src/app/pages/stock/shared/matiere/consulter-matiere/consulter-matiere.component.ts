import { Component, OnInit } from '@angular/core';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-consulter-matiere',
  templateUrl: './consulter-matiere.component.html',
  styleUrls: ['./consulter-matiere.component.scss']
})
export class ConsulterMatiereComponent implements OnInit {

  id;
  matiere: any;
  formMatiere: FormGroup;
  submitMatiere: boolean = false;
  baseUrlImage = environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc: string = "/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL: any;
  closeResult: string;
  users: any;
  tva = 0;

  matiereFournisseurs: any;

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
  chosenType = false;
  typeMatiere = "";
  category = "";
  fours = [];
  typeList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private matiereService: MatiereService,
    private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    
    private fournisseurService: FournisseurService) {
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
      stock: new FormControl(0),
      stock_securite: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      stock_max: new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      prix_achat:new FormControl(1,[
        Validators.required,
        Validators.min(1)
      ]),
      categorie:new FormControl("",[
        Validators.required
      ])

    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.matiereService.getMatiereById(this.id).subscribe(res => {
        this.matiere = res;
        this.tva = this.matiere.tva;
        this.initialFournisseurs();
        this.addRow()
        this.formMatiere.patchValue({
          reference: this.matiere.reference,
          designation: this.matiere.designation,
          stock: this.matiere.stock,
          mesure_securite: this.matiere.mesure_securite,
          norme_qualite: this.matiere.norme_qualite,
          stock_securite: this.matiere.stock_securite,
          stock_reel: this.matiere.stock_reel,
          stock_max: this.matiere.stock_max,
          prix_achat:this.matiere.prix_achat,
          prix_initial:this.matiere.prix_initial,
          categorie:this.matiere.categorie
        });
        this.imageSrc = this.matiere.image;
        this.previewURL = this.baseUrlImage + this.imageSrc;
      }, err => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de récuperation de la matiére'
          },
          duration: 3000
        });
      })
      
     


      this.searchRefCtrl.valueChanges.pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredFournisseur = [];
          this.isLoading = true;
        }),
        switchMap(value => this.fournisseurService.searchFournisseurRef(value, this.typeMatiere).pipe(
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
        switchMap(value => this.fournisseurService.searchFournisseurName(value, this.typeMatiere).pipe(
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
        switchMap(value => this.fournisseurService.searchFournisseurMatricule(value, this.typeMatiere).pipe(
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
      this.userService.getUsers().subscribe(res => {
        this.users = res;
      })
    })
  }
  get ft() { return this.formMatiere.controls; }
  getUser(user) {
    if (this.users) {
      let us = this.users.filter(x => x._id === user)[0];
      return us.fname + " " + us.lname;
    }
  }
  onUpdateMatiereSubmit() {
    this.submitMatiere = true;
    if (this.formMatiere.valid) {
      if (this.imageSrc && this.imageSrc.length > 0) {
        this.matiere = this.formMatiere.value;
        this.matiere.fournisseurs = this.matiereFournisseurs;
        this.matiere.image = this.imageSrc;
        this.matiere.creatorId = this.authService.getIdfromToken();

        console.log(this.matiere);
        this.matiereService.updateMatiere(this.matiere, this.id).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Matiere mise a jour avec succées'
              },
              duration: 3000
            });
            this.router.navigate(['/mp/matieres'],{ queryParams: { type: "matiere"} })
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
    } else {
      return;
    }
  }
  addImage(imageInputPic: any) {
    this.isUploading = true;
    this.isUploadingMsg = "Image  est en cours de téléchargement"
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
                text: 'Image a été téléchargée avec succès'
              },
              duration: 3000
            });
            this.imageSrc = res.name;
            this.isUploadingMsg = "Téléchargement terminé"
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: 'Problème lors du téléchargement de l image'
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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close() {
    this.modalService.dismissAll();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
    control.removeAt(index);
    this.fours.splice(index,1);
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
      ref: [''],
      mat_fis: [''],
      name: [''],
      tel: new FormControl({ value: '', disabled: true }),
      prix_ht: [1],
      isEditable: [true]
    });
  }

  initialFournisseurs() {
    this.fournisseurService.getFournisseursByType(this.category).subscribe(res => {
      if (res.success) {
        this.initFournisseurs = res.obj;
        this.filteredFournisseur = res.obj;
      } 
    })
    this.matiereFournisseurs = this.matiere.fournisseurs;
    console.log(this.matiere.fournisseurs);
    this.touchedRows = [];
      if (this.matiere.fournisseurs) {
        const control = this.fournisseurTable.get('tableRows') as FormArray;
        for (let i = 0; i < this.matiere.fournisseurs.length; i++) {
          let form = this._formBuilder.group({
            ref: [this.matiere.fournisseurs[i].fournisseur.ref],
            mat_fis: [this.matiere.fournisseurs[i].fournisseur.mat_fis],
            name: [this.matiere.fournisseurs[i].fournisseur.name],
            tel: new FormControl({ value: this.matiere.fournisseurs[i].fournisseur.tel, disabled: true }),
            prix_ht: this.matiere.fournisseurs[i].prix_ht,
            tva:this.tva,
            isEditable: [false]
          });
          control.push(form);
        }
      }
    
  }
  selectFournisseur(event, i) {
    let item: any = this.fournisseur.value;
    console.log(this.filteredFournisseur)
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
    this.initialFournisseurs();
  }


  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].fournisseur + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  showform(){
    console.log(this.formMatiere , this.matiereFournisseurs)
  }


}
