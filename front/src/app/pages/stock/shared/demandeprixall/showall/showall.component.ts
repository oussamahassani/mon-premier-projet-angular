import { Component,ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DemandePrixService } from 'src/app/services/demandeprix/demendeprix.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {AuthService} from 'src/app/services/auth/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-showall',
  templateUrl: './showall.component.html',
  styleUrls: ['./showall.component.scss']
})
export class ShowallComponent implements OnInit {
  selectedValue : any = 0
  datasour : any
  valeurtypedemande : any = 'stock' 
  isLoading = true;
  closeResult: string;
  allelement : any
  token:any;
  selectmatiere:any;
  emailcontenu:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['num','asked_quantite','matiere','creatorId','datelicraison_prevu','createdAt','statut','action'];
  constructor(private demandePrixService:DemandePrixService ,private modalService: NgbModal,private snackBar: MatSnackBar,private authService : AuthService) { }

  ngOnInit(): void {
    this.emailcontenu = 'bonjour vous trouvez ici une piece joint de demande de prix'
    this.token  = this.authService.getUserfromToken()
    this.demandePrixService.getalldemande().subscribe(res => {
   
      this.allelement= res.obj
         this.isLoading = false;
         let stock = res.obj.filter(el => el.categorie =='stock')
         this.datasour =   new MatTableDataSource(stock);
         this.datasour.sort = this.sort;
         this.datasour.paginator = this.paginator;
     
       if(!res.success) {
         this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
           text:'Problème lors du téléchargement de l image'},
          duration: 3000
        });
  
      }
  
    }, error => this.isLoading = false
  
    )
  }
  getType(x){
    this.isLoading = true;
      switch(x)
      {
          case 1:
            this.demandePrixService.getalldemande().subscribe(res => {
              this.isLoading = false;
              this.datasour =   new MatTableDataSource(res.obj);
              this.datasour.sort = this.sort;
              this.datasour.paginator = this.paginator;
            })
            
          break;
          case 2:
            this.demandePrixService.getalldemande().subscribe(res => {
              this.isLoading = false;
              this.datasour =   new MatTableDataSource(res.obj.filter(el => el.statut=="en cours" ));
              this.datasour.sort = this.sort;
              this.datasour.paginator = this.paginator;
            })
          break;
          case 3:
            this.demandePrixService.getalldemande().subscribe(res => {
              this.isLoading = false;
              this.datasour =   new MatTableDataSource(res.obj.filter(el => el.statut=="terminer" ));
              this.datasour.sort = this.sort;
              this.datasour.paginator = this.paginator;
            })
          break;
      }

    
  }
  rechrche(event){
const val = event.target.value;
this.datasour =   new MatTableDataSource(this.allelement.filter(el => el.num.includes(val) ||el.asked_quantite.toString().includes(val)  ));
if(val ==""){
this.demandePrixService.getalldemande().subscribe(res => {
     this.isLoading = false;
     this.datasour =   new MatTableDataSource(res.obj);
   
 
  })
}
}

imprimerlademade(element){
  console.log(element)
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
  let day_prevu = new Date(element.datelicraison_prevu).getDate()
  let month_prevu = new Date(element.datelicraison_prevu).getMonth() +1; 
  let years_prevu = new Date(element.datelicraison_prevu).getFullYear(); 

  var mywindow = window.open('', 'my div',  'height=672px ,width=480px');
  mywindow.document.write(`<html> <head>`);
  /*optional stylesheet*/ 
  mywindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
  mywindow.document.write('</head><body style="font-size: 12px; max-width: 1000px">');
  let   printContents = `
  <div class='d-flex justify-content-between'> <div>
  <h4>Entreprise hayet</h4>
  <h4>Tunisie le : ` + today +` </h4>
  <h4>Responsable d'achat:  `+ this.token.username + `</h4>
    <h4>email:  `+ this.token.email + `</h4>
  </div><div>
  <img src="https://scontent.ftun6-1.fna.fbcdn.net/v/t1.18169-9/26219124_1812258532151597_7647060633203914479_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=lR8o2YVMhm8AX-Ak4dm&_nc_ht=scontent.ftun6-1.fna&oh=2a61b6dcf8fb186d80e70b800cf8af87&oe=60BE9F3A" alt="logohayat width="200" height="150" />
  </div></div>
           <hr> ` ;
           printContents+=`<div><h2 class="text-center">Object  : Demande  De Devis</h2> 
           <h3>N° commande     ` + element.num + `</h3>
           <h3>Prevu pour le   ` + day_prevu +'/' +month_prevu + '/'+  years_prevu  + `</h3></div>`;
         
     printContents += `  Notre societé Hayat  est  actuellement en   projet ,nous souhaite  avoir une idée des tarifs que vous appliquez pour ce type de matiere.
     je vous saurai gré de bien vouloir me dresser un devis chiffré et m’indiquer une estimation de la date de livraison pour la liste suivants:
            <table class="table">
              <thead>
       
                    <th scope="col"><h3>quantiter demander  </h3></th>
                    <th scope="col" ><h3>designation</h3></th>
                              
              </thead>
              <tbody>
              <tr class="table-success " style="border:none">
            <td style="border:none"><h3>` + element.asked_quantite+  `</h3></td> 
            <td style="border:none"><h3>` + element.matiere.designation+  `</h3></td> 
  
            </tr></tbody></table>
           
                      <hr><h4>cree le  ` + today  +
                      ` </h6><h4>Cachet et signature </h6>`;
                   
                      
                                
            mywindow.document.write(printContents);
            mywindow.document.write('</body></html>');
            setTimeout(() => {
              mywindow.print();
             }, 1000);
}

open(content,element) {
  this.selectmatiere=element
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

openPDF(){
  let dd = new Date().getDate(); 
  let mm =  new Date().getMonth() +1; 

  let yyyy = new Date().getFullYear(); 
  if (dd < 10) { 
      dd = 0 + dd; 
  } 
  if (mm < 10) { 
      mm = 0 + mm; 
  } 
  let today = dd + '/' + mm + '/' + yyyy; 
  let day_prevu = new Date(this.selectmatiere.datelicraison_prevu).getDate()
  let month_prevu = new Date(this.selectmatiere.datelicraison_prevu).getMonth() +1; 
  let years_prevu = new Date(this.selectmatiere.datelicraison_prevu).getFullYear(); 
  let modaliter = "non définit"
if(this.selectmatiere.valuemodaliter!==undefined){
  modaliter =this.selectmatiere.valuemodaliter
}
let img = new Image()
img.src = 'https://scontent.ftun6-1.fna.fbcdn.net/v/t1.18169-9/26219124_1812258532151597_7647060633203914479_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=lR8o2YVMhm8AX-Ak4dm&_nc_ht=scontent.ftun6-1.fna&oh=2a61b6dcf8fb186d80e70b800cf8af87&oe=60BE9F3A'

let  text = `Entreprise hayet 
Responsable d'achat:  `+ this.token.username +`  
Email:    `+ this.token.email + `

 Tunisie le : ` + today ;
         text+=`
 Object:Demande  De Devis
 N° commande  ` + this.selectmatiere.num + `
Prevu pour le ` + day_prevu +'/' + month_prevu + '/'+  years_prevu +`
Modaliter de payement : `+this.selectmatiere.modaliter ;   
let textdescription=`
 
Notre societé Hayat  est  actuellement en   projet ,nous souhaite  avoir une idée des tarifs  
que vous appliquez pour ce type de matiere, je vous saurai gré de bien vouloir me dresser 
un devis chiffré et m’indiquer une estimation de la date de livraison 
pour la liste suivants:`;
 
       let  tab = `
                       quantiter demander                      designation        
                          
                      `+  this.selectmatiere.asked_quantite+  `                                      `+ this.selectmatiere.matiere.designation;
  
         
let fin = `Cree le  ` + today  +
 `
Cachet et signature `;
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


  postemail(){
    const listemail = this.selectmatiere.fournisseurs.map(el => el.fournisseur.email)
console.log(this.selectmatiere)
let valuemodaliter = this.selectmatiere.modaliter_de_payement
if(valuemodaliter == undefined)
valuemodaliter = "non encore définie"
let quantiterdemander = this.selectmatiere.asked_quantite
let date_reception = this.selectmatiere.datelicraison_prevu
let desigination = this.selectmatiere.matiere.designation
    this.demandePrixService.postemail({message:this.emailcontenu,date_reception:date_reception,quantiterdemander:quantiterdemander,
    emailfrom:this.token.email,name:this.token.email  ,desigination:desigination,   modaliter: valuemodaliter,email :listemail }).subscribe(res =>{
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

  toggledtype(){

    if(this.valeurtypedemande=="stock"){
    this.valeurtypedemande="service"
    this.demandePrixService.getalldemande().subscribe(res => {
      let stock = res.obj.filter(el => el.categorie =='service')
      console.log(stock)
     this.datasour = new MatTableDataSource(stock)
    })
  }
    else{
    this.valeurtypedemande="stock"
    this.demandePrixService.getalldemande().subscribe(res => {
      let stock = res.obj.filter(el => el.categorie !=='service')
     this.datasour = new MatTableDataSource(stock)
    })
    }
  }
}
