import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { UserService } from 'src/app/services/user/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consulter-demand',
  templateUrl: './consulter-demand.component.html',
  styleUrls: ['./consulter-demand.component.scss']
})
export class ConsulterDemandComponent implements OnInit {

  id:any;
  demand:any;
  matieres:any;
  user:any;
  userone:any;
  closeResult: string;
  confirmed:boolean=false;
  category: string;
  constructor(private activatedRoute:ActivatedRoute,
    private demandService:DemandeService,
    private matiereService:MatiereService,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private router:Router,
    private userService:UserService,
    private modalService: NgbModal) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.demandService.getDemandeById(this.id).subscribe(res=>{
        this.demand=res;
        this.matiereService.getMatiereByIds(this.parsIds(this.demand.products)).subscribe(res => {
          if (res.success) {
            this.matieres = res.obj;
          } else {
  
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

  getMatAsked(mat_id)
  {
    return this.demand.products.filter(x=>x.id_produit===mat_id)[0].asked_quantite
  }

  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
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
            text:'Demande achat rejetée'},
          duration: 3000
        });
        
        this.router.navigate([this.category+'/demandes'])
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

}
