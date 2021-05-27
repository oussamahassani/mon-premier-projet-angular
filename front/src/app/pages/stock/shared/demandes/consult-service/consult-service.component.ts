import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { UserService } from 'src/app/services/user/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
@Component({
  selector: 'app-consult-service',
  templateUrl: './consult-service.component.html',
  styleUrls: ['./consult-service.component.scss']
})
export class ConsultdemandeServiceComponent implements OnInit {
  id:any;
  demand:any;
  services:any;
  user:any;
  userone:any;
  closeResult: string;
  confirmed:boolean=false;
  constructor(private activatedRoute:ActivatedRoute,
    private demandService:DemandeService,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private router:Router,
    private userService:UserService,
    private modalService: NgbModal,
    private prestatairedeservice:Prestatairedeservice) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.demandService.getDemandeById(this.id).subscribe(res=>{
        this.demand=res;
        this.prestatairedeservice.geservicesByIds(this.parsIds(this.demand.products)).subscribe(res => {
          console.log(res.obj)
          if (res.success) {
            this.services = res.obj;
          } 
        })
         if(this.demand.statut==='Confirmed' || this.demand.statut==='Canceled')
         {
           this.user = this.demand.confirmedBy;
         }
         this.userone = this.demand.creatorId;

      })

     
    })
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
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

  rejectDemande()
  {
     this.demand.statut="Canceled"
    let x={
      statut:"Canceled",
      note:this.demand.note,
      confirmedBy:this.authService.getIdfromToken()
    }                 
    this.demandService.changeStatut(x,this.demand._id).subscribe(res=>{
       if(res.success)
       {
        //demande mise a jour
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Demande  achat service  rejetée'},
          duration: 3000
        });
        
        this.router.navigate(['mp/demandes'])
       }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Probléme de mise a jour de la demande'},
          duration: 3000
        });
       }
    })
  }
  confirmDemande(){
    this.demand.statut="Confirmed";
   let x={
     statut:"Confirmed",
      confirmedBy:this.authService.getIdfromToken(),
      note:this.demand.note
   }                 
   this.demandService.changeStatut(x,this.demand._id).subscribe(res=>{
      if(res.success)
      {
       this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type:'alert-success',
          text:'Demande achat a été confirmée'},
        duration: 3000
      });
      this.confirmed=true;
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Probléme de mise a jour de la demande'},
          duration: 3000
        });
      }
   })
  }
}
