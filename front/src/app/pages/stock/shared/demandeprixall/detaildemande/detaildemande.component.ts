import { Component, OnInit } from '@angular/core';
import { DemandePrixService } from 'src/app/services/demandeprix/demendeprix.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { environment } from 'src/environments/environment';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-detaildemande',
  templateUrl: './detaildemande.component.html',
  styleUrls: ['./detaildemande.component.scss']
})
export class DetaildemandeComponent implements OnInit {
  closeResult = '';
  demand : any  ;
  id : any    ;
  statut:any;
  fournissuers:any ;
  baseUrlImage=environment.baseUrlImage;
  selectedFile: ImageSnippet;
  matieres : any
  previewURL:any=this.baseUrlImage
  category : any;
  note : any;
  constructor(  private demandePrixService:DemandePrixService,private activatedRoute:ActivatedRoute ,
    private prestatairedeservice:Prestatairedeservice,
    private snackBar: MatSnackBar, private modalService: NgbModal , private matiereService : MatiereService) { }

  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.category = params['service']
      this.demandePrixService.getdemandebyid(this.id).subscribe(res=>{
   
        this.demand=res.obj;
          this.statut = res.obj.statut
            this.matieres = res.obj.matiere;
           this.fournissuers = res.obj.fournisseurs;
    })
  })

}
addImage(index , imageInputPic: any) {

  const file: File = imageInputPic.files[0];
  this.fournissuers[index].devis_envoiyer = file.name
 

  const reader = new FileReader();
  reader.addEventListener('load', (event: any) => {
    //this.previewURL = reader.result;
    this.selectedFile = new ImageSnippet(event.target.result, file);
    this.demandePrixService.postnewdevis(this.selectedFile.file).subscribe(
      (res) => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
           data: {
             type:'alert-success',
              text:res.msg},
            duration: 3000
           });
       
        } else {
           this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-danger',
             text:res.msg},
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
  this.modalService.open(content, { size: 'lg' , ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
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
changeprixdemande(i , event){
  if(this.category=='service')
  this.demand.service.fournisseurs[i].prix_ht= Number(event.target.value)
  else
this.demand.matiere.fournisseurs[i].prix_ht = Number(event.target.value)

console.log(i , event.target.value)
}
senddevis(){
console.log("service" , this.demand)
if(this.category =='stock')
  this.matiereService.updatemultiple({demande : this.demand.matiere}).subscribe(res => console.log(res))
else if(this.category =='service')
this.prestatairedeservice.updateService({fournisseurs:this.demand.service.fournisseurs},this.demand.service._id).subscribe(res => console.log(res))
  this.demandePrixService.updatedemande(this.id,{note : this.note ,fournisseurs :this.fournissuers}).subscribe(res => {
    if (res.success) {
    this.snackBar.openFromComponent(SnackbarComponent, {
     data: {
       type:'alert-success',
        text:res.msg},
      duration: 3000
     });
 
  } else {
     this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        type:'alert-danger',
       text:res.msg},
      duration: 3000
    })}
  })
}
consolelog(x){
  console.log("xyz", x)
}
changerStatut(event) {
  this.demandePrixService.updatedemande(this.demand._id, {statut : event.target.value}).subscribe(res =>   { if (res.success) {
    this.snackBar.openFromComponent(SnackbarComponent, {
     data: {
       type:'alert-success',
        text:"satut changer avec suceé"},
      duration: 3000
     });
 
  } else {
     this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        type:'alert-danger',
       text:res.msg},
      duration: 3000
    });

  } 
})
}
changedemailslivraison(i , event){
  if(this.category=='service')
  this.demand.service.fournisseurs[i].delais_de_livraison = event.target.value
  else
  this.demand.matiere.fournisseurs[i].delais_de_livraison = event.target.value
  console.log(i , event.target.value)
}
changemodaliterpayement(i , event){
  if(this.category=='service')
  this.demand.service.fournisseurs[i].modaliter_de_payement = event.target.value
  else
  this.demand.matiere.fournisseurs[i].modaliter_de_payement = event.target.value
  console.log(i , event.target.value)

}
}
