import { Component, OnInit } from '@angular/core';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {environment} from 'src/environments/environment'
import { GeneralService } from 'src/app/services/general.service';
import {FournisseurService} from 'src/app/services/fournisseur/fournisseur.service'
import {Router,ActivatedRoute} from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray, ValidationErrors } from '@angular/forms';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-addservices',
  templateUrl: './addservices.component.html',
  styleUrls: ['./addservices.component.scss']
})
export class AddservicesComponent implements OnInit {
  formservice: FormGroup;
  fournissuers = []
  fournissuersname = []
  listefournissuer : any;
  active:boolean=false;
  baseUrlImage = environment.baseUrlImage;
  imageSrc: string = "/uploads/28378e25-9f8b-4fe4-a69f-c91bbf3e815a.webp";
  previewURL: any = this.baseUrlImage + this.imageSrc;
  constructor(private generalService:GeneralService,private fournisseurService:FournisseurService,private router:Router,
    private prestatairedeservice:Prestatairedeservice , private fromBuilder :FormBuilder,private snackBar: MatSnackBar,    private authService: AuthService, ) {
    this.formservice = this.fromBuilder.group({
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
     this.listefournissuer = res.obj.filter(el => el.categorie=="service")
    })
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
  onAddMatiereSubmit(){
  let service = this.formservice.value;
    service.creatorId = this.authService.getIdfromToken();
    let four = [];
    for (let i = 0 ;i<this.fournissuersname.length;i++){
      console.log(this.fournissuersname[i]._id,this.fournissuersname[i])
      four.push({fournisseur:this.fournissuersname[i]._id , prix_ht :this.fournissuersname[i].prix_ht })
    }
    service.fournisseur = four;
    service.image  = this.imageSrc



    this.prestatairedeservice.posteService(service).subscribe(res =>{
      
      if (res.success) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'service a été téléchargée avec succès'},
          duration: 3000
       
        });

        this.router.navigate(['/services'], { queryParams: { type: "service" } })
      
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:res.msg},
          duration: 3000
        });
        
      }})
  }
  ajouterFournissuer(event){
    const val = this.formservice.controls.fournisseur.value;
    this.fournissuers.push(val);
    const fournissuer = this.listefournissuer.filter(el =>el._id == val)
    let fourobj = Object.assign(fournissuer[0] , {prix_ht:2})
       console.log("four",fourobj)
    this.fournissuersname.push(fourobj)

  }
  deleteservice(elem){
    this.fournissuersname = this.fournissuersname.filter(el =>el._id !==elem._id)
    this.fournissuers = this.fournissuers.filter(el =>el !==elem._id)
  }
  get ft() { return this.formservice.controls; }
}
