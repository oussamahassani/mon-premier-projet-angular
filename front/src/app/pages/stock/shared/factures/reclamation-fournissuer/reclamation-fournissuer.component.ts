import { Component, OnInit , ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-reclamation-fournissuer',
  templateUrl: './reclamation-fournissuer.component.html',
  styleUrls: ['./reclamation-fournissuer.component.scss']
})
export class ReclamationFournissuerComponent implements OnInit {
  displayedColumns: string[] = ['num','categorie','name','tel', 'active', 'action'];
  closeResult: string;
  id : any ;
  element : any;
  isLoading : any;
  fournissuer : any;
  datasour : any;
  mode_de_transfomtion = {"Email":false , "Telephone":false , "Courier":false}
  reclamtiontype={"marchandise_endomager":false,"livraison_non_conforme":false,"facture_eronee":false,"livraison_incomplete":false,"retard_de_livraison":false,"autre":false}
 description : any = "description ...";


  now = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fournisseurService: FournisseurService,  private snackBar: MatSnackBar,private modalService: NgbModal,
    private activatedRoute:ActivatedRoute ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
    this.fournisseurService.getFournisseurById(this.id).subscribe(res =>{console.log(res.obj.reclamtion)
      this.isLoading = false;
       this.fournissuer = res.obj
         this.datasour =   new MatTableDataSource(res.obj.reclamtion);
         this.datasour.sort = this.sort;
         this.datasour.paginator = this.paginator;
    })
  })
}
  open(content) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  envoyerreclamation(){
    const transformationobj = this.mode_de_transfomtion
    const reclamationobj = this.reclamtiontype
    let keys = Object.keys(transformationobj);
    let reclamationkeys = Object.keys(reclamationobj);
let filtered_transformation = keys.filter(function(key) {
    return transformationobj[key]
});
let filtered_reclamation= reclamationkeys.filter(function(key) {
  return reclamationobj[key]
});
const data  = {"description":this.description , "mode_de_transfomtion":filtered_transformation,"date":this.now ,"reclamtiontype":filtered_reclamation
}
this.fournisseurService.addreclamtion(this.id,data).subscribe(res => console.log(res))
    console.log(
      filtered_transformation,
      filtered_reclamation

)
  }
  terminer_reclamtions(element){
   this.element = element  }
   terminer_reclamtion(){
     this.element.statut="terminer"
this.fournisseurService.updatereclamtion(this.id,this.element).subscribe(res =>{
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

  }})
   }

imprimer_reclamation(element){
  const el = element
  const four = this.fournissuer
  console.log(el , four)
  var mywindow = window.open('', 'my div',  'height=672px ,width=480px');
  mywindow.document.write(`<html> <head>`);
  mywindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
  mywindow.document.write('</head><body style="font-size: 12px; max-width: 800px">');
 const imprime=`<h3 class="text-center"><strong>Fiche de Reclamation client </strong></h3>
        
  <div class="row ml-2">
      <div class="col-md-4">
          <p> Origin de reclamation </p>
          <p>Name :`+  four.name +`</p>
          <p>Telephone : `+ four.tel + `</p>
          <p>Email: ` + four.email + ` </p>
      </div>


  <p class="col-md-4">Mode de transmission : ` + el.mode_de_transfomtion + ` </p>

 <p class="col-md-4">Date `+ el.date + ` </p>
  </div>
  <div class="ml-5">
      <p> Object de reclamation : `+ el.reclamtiontype + `</p>
     
        <p><strong>Description</strong> :  ` +el.description +`</p>
   
      </div> `;
      mywindow.document.write(imprime);
      mywindow.document.write('</body></html>');
      setTimeout(() => {
        mywindow.print();
       }, 1000);
}
}

