import { Component, OnInit } from '@angular/core';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { DemandePrixService } from 'src/app/services/demandeprix/demendeprix.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import jsPDF from 'jspdf';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { filter, timeInterval } from 'rxjs/operators';
import swal from 'sweetalert2';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { ShowallComponent } from '../showall/showall.component';
@Component({
  selector: 'app-demandeprix',
  templateUrl: './demandeprix.component.html',
  styleUrls: ['./demandeprix.component.scss']
})
export class DemandeprixComponent implements OnInit {
  emailcontenu : string ;
  closeResult: string;
  matieres : any ;
  selectedfournisseur : any =  {} ;
 numerocommande = "";
 changedat : boolean =  false;
 quantiterdemander : any = 10
 prixproposer : any = 1
 montant_ht_proposer : number = 0
 montant_tva_proposer : number =0
 fournisseur : any ;
 Modaliter : boolean= false;
 now = new Date();
 numberdate =30
 datereception = new Date();
 user: any;
 selected: any;
 products:any;
 demand: any;
 valuemodaliter : any ;
 idurl:any;
 token:any;
 categorie : any ;
  constructor(private matiereService: MatiereService , private authService : AuthService,
    private snackBar: MatSnackBar,private activatedRoute: ActivatedRoute,
    private demandeService: DemandeService,
    private prestatairedeservice:Prestatairedeservice,
    private demandePrixService:DemandePrixService ,private router:Router, private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
 
    this.emailcontenu = 'bonjour vous trouvez ici une piece joint de demande de prix'
    this.datereception.setDate(this.datereception.getDate()+ 30);
 this.token  = this.authService.getUserfromToken()

   console.log(this.token)
   this.getnumerocommande()
//  this.matiereService.getMatieres().subscribe(res => {
//   this.matieres = res.obj
//  })
 this.activatedRoute.queryParams.subscribe(params => {
 this.idurl=params["id"];
 this.categorie =params["categorie"] ;

console.log('categ', this.categorie)
    this.demandeService.getDemandesByIds(params["id"]).subscribe(res => {
this.products= res.obj[0].products
      console.log(res.obj)
      let ids = "";
      for (let i = 0; i < res.obj[0].products.length; i++) {
        ids += "" + res.obj[0].products[i].id_produit + ","
      }
      ids = ids.substring(0, ids.length - 1);
      console.log(ids)
      if(this.categorie=="stock")
      this.matiereService.getMatiereByIds(ids).subscribe(res => {
        this.matieres = res.obj
  })
  else if (this.categorie=="service")
  {
   this.prestatairedeservice.geservicesByIds(ids).subscribe(res => {
     console.log(res)
    this.matieres = res.obj
   })
  }
})


})
  }

  submitdemande(): void {
    if(Object.keys(this.selectedfournisseur).length !== 0)
    {
    this.selectedfournisseur.num=this.numerocommande;
    this.selectedfournisseur.statut="en cours"
    this.selectedfournisseur.categorie=this.categorie
    if(this.categorie=='service'){
    this.selectedfournisseur.service=this.selectedfournisseur._id
    }
    this.selectedfournisseur.creatorId= this.authService.getUserfromToken()._id
    this.selectedfournisseur.asked_prix=this.prixproposer
    this.selectedfournisseur.asked_quantite=this.quantiterdemander
    this.selectedfournisseur.prix_ht = this.montant_ht_proposer
    this.selectedfournisseur.tva = this.montant_tva_proposer
    this.selectedfournisseur.datereception = this.datereception
    this.selectedfournisseur.modaliter_de_payement = this.valuemodaliter

   
    this.demandePrixService.addnrewdemande(this.selectedfournisseur).subscribe(res =>{
      if (res.success) {
        this.demandeService.updateDemande({demandeprix : true} , this.idurl).subscribe(res => {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-success',
               text:'demande de prix a eté ajouter avec succeé'},
             duration: 3000
            });
          
          if(this.matieres.length > 1){
            setTimeout(()=>{                        
              swal.fire({
                title: "voulez vous ajouter un autre demande de prix?",
                icon: 'info',
                text: "vous avez ajouter un demande pour le produit",
                showConfirmButton: true,
                showCancelButton: true     
              })
              .then((willDelete) => {
          
                  if(willDelete.value){
                    window.location.reload();
                  }else{
                    this.router.navigate(['/Demandedeparix'])
                  }
            
         
           })
         }, 3000);
        
    }
    else {
      this.router.navigate(['/Demandedeparix'])
    }
    })
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
  }
  getnumerocommande(){
  this.demandePrixService.getlasts().subscribe(res => {
    if (res.success) {
      this.numerocommande = res.obj;
    } 
  })
}
  notifyChange(event) {
let matiereselected = this.matieres.filter(el => el._id == event.target.value)
    this.selectedfournisseur = matiereselected[0]
    this.calculeprix()
    console.log(this.selectedfournisseur , this.selected)
    let productslected = this.products.filter(el => el.id_produit == event.target.value )
    this.quantiterdemander = productslected[0].asked_quantite
  }
  

calculeprix() {
 this.montant_ht_proposer =  this.quantiterdemander * this.prixproposer;

this.montant_tva_proposer  =  this.montant_ht_proposer * this.selectedfournisseur.tva / 100
}
isEmptyObject(obj) {
  return (obj && (Object.keys(obj).length === 0));
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
imprimerlademade(){
  let todaynw = new Date(); 
 
  let dd = todaynw.getDate(); 
  let mm = todaynw.getMonth() +1; 

  let yyyy = todaynw.getFullYear(); 
  if (dd < 10) { 
      dd = 0 + dd; 
  } 
  if (mm < 10) { 
      mm = 0 + mm; 
  } 
  let today = dd + '/' + mm + '/' + yyyy; 
  let time = new Date().getTime();
  let date = new Date(time).toString()
  let nameproduct = ''
  let typeachat = ''
  if( this.categorie=="stock") {
  nameproduct =this.selectedfournisseur.designation
  typeachat ='matiere'
}
  else {
  nameproduct =this.selectedfournisseur.name
  typeachat ='services'
  }



  var mywindow = window.open('', 'my div',  'height=672px ,width=480px');
  mywindow.document.write(`<html> <head>`);
  /*optional stylesheet*/ 
  mywindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
  mywindow.document.write('</head><body style="font-size: 12px; max-width: 800px">');
  let   printContents = `
  <div class='d-flex justify-content-between'> <div class='col-md-6'>
  <h4>Email  ` + this.token.email +
 
  ` </h4><h4>Entreprise hayet</h4>
  </h4>  
  <h4>Responsable d'achat `+ this.token.username + `</h4></div><div class='col-md-6'>
  <img src="https://scontent.ftun6-1.fna.fbcdn.net/v/t1.18169-9/26219124_1812258532151597_7647060633203914479_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=lR8o2YVMhm8AX-Ak4dm&_nc_ht=scontent.ftun6-1.fna&oh=2a61b6dcf8fb186d80e70b800cf8af87&oe=60BE9F3A" alt="logohayat width="200" height="150" />
  <br><h4>Tunisie le : ` + today +
     `</h4></div></div>
           <hr> ` ;
           printContents+=`<div><h2>Object  : Demande  De Devis</h2> 
           <h3>N° commande` + this.numerocommande + `</h3>
           <h3>Prevu pour le ` + this.datereception.getDate() +'/' +this.datereception.getMonth() + '/'+  this.datereception.getFullYear();  + `</h3></div>
           Notre societé Hayat  est  actuellement en   projet ,nous souhaite  avoir une idée des tarifs que vous appliquez pour ce type de `+typeachat +` .
           je vous saurai gré de bien vouloir me dresser un devis chiffré et m’indiquer une estimation de la date de livraison pour la liste suivants:`;
     printContents += `
            <table class="table">
              <thead>
       
                    <th scope="col"><strong>quantiter demander  </strong></th>
                    <th scope="col" ><strong>designation</strong></th>
                              
              </thead>
              <tbody>
              <tr class="table-success " style="border:none">
            <td style="border:none">` + this.quantiterdemander+  `</td> 
            <td style="border:none">` +nameproduct+  `</td> 
  
            </tr></tbody></table>
          
                      <hr><h6>cree le  ` + today  +
                      ` </h6><h6>Cachet et signature </h6>`;
                   
                      
                                
            mywindow.document.write(printContents);
            mywindow.document.write('</body></html>');
            setTimeout(() => {
              mywindow.print();
             }, 1000);
  console.log(this.selectedfournisseur)
}
importer(){
  const listemail = this.selectedfournisseur.fournisseurs.map(el => el.fournisseur.email)


 this.demandePrixService.postemail({message:this.emailcontenu,date_reception:this.datereception,quantiterdemander:this.quantiterdemander,
  
  emailfrom:this.token.email,name:this.token.email,desigination:this.selectedfournisseur.designation,modaliter:this.valuemodaliter ,email :listemail }).subscribe(res =>{
    console.log(res)
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

  } } )
}
changedate(event){
  this.changedat =!this.changedat
}
keyPress(event){
  this.datereception = new Date();
    const value=event.target.value
    this.numberdate= event.target.value
    this.datereception.setDate(this.datereception.getDate()+ Number(value));
}
changemodaliter(){
  this.Modaliter = !this.Modaliter

}
onchangemodaliter(event){
 
    const value=event.target.value
      this.valuemodaliter = value ;
}
openPDF(){
  let dd = this.now.getDate(); 
  let mm =  this.now.getMonth() +1; 

  let yyyy =  this.now.getFullYear(); 
  if (dd < 10) { 
      dd = 0 + dd; 
  } 
  if (mm < 10) { 
      mm = 0 + mm; 
  } 
  let today = dd + '/' + mm + '/' + yyyy; 
  let datereception = this.datereception.getDate() + "/" + this.datereception.getMonth() +1 +"/" +this.now.getFullYear(); 
  let modaliter = "non définit"
if(this.valuemodaliter!==undefined){
  modaliter =this.valuemodaliter
}
let nameproduct = ''
let typeachat = ''
if( this.categorie=="stock") {
nameproduct =this.selectedfournisseur.designation
typeachat ='matiere'
}
else {
nameproduct =this.selectedfournisseur.name
typeachat ='services'
}
let  text = `Entreprise hayet 
Responsable d'achat `+ this.token.username +`
 Tunisie le : ` + today ;
         text+=`
                                             Object : Demande  De Devis
 N° commande` + this.numerocommande + `
Prevu pour le ` + this.datereception.getDate() +'/' +this.datereception.getMonth() + '/'+  this.datereception.getFullYear()+
`
Modaliter de payement : `+ modaliter ;    
let textdescription=`
 
Notre societé Hayat  est  actuellement en   projet ,nous souhaite  avoir une idée des tarifs  
que vous appliquez pour ce type de `+typeachat+`, je vous saurai gré de bien vouloir me dresser 
un devis chiffré et m’indiquer une estimation de la date de livraison 
pour la liste suivants:`;
let  tab = `
                       quantiter demander                      designation        
                          
                      `+ this.quantiterdemander  `             `+ nameproduct;
  
         
let fin = `Cree le  ` + today  +
 `Cachet et signature `;
 let img = new Image()
 img.src = 'https://scontent.ftun6-1.fna.fbcdn.net/v/t1.18169-9/26219124_1812258532151597_7647060633203914479_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=lR8o2YVMhm8AX-Ak4dm&_nc_ht=scontent.ftun6-1.fna&oh=2a61b6dcf8fb186d80e70b800cf8af87&oe=60BE9F3A'
 
 let offsetY = 5.797777777777778;
 let lineHeight = 9.49111111111111;
     const doc = new jsPDF();
     doc.addImage(img, 'png', 120, 10, 80, 50)
     doc.setFontSize(14);
     doc.text(text,10, 10 + lineHeight * 0 + offsetY);
     doc.setFontSize(13);
     doc.text( textdescription, 10, 10 + lineHeight * 5 + offsetY);
     doc.setFontSize(16);
     doc.text( tab, 10,  10 + lineHeight * 9 + offsetY);
     doc.setFontSize(14);
     doc.text( fin, 10, lineHeight *14 + offsetY);
     doc.save("demande prix.pdf");
   
  }
}
