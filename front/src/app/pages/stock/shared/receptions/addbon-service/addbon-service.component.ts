import { Component, OnInit } from '@angular/core';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service'
@Component({
  selector: 'app-addbon-service',
  templateUrl: './addbon-service.component.html',
  styleUrls: ['./addbon-service.component.scss']
})
export class AddbonServiceComponent implements OnInit {
  id : any ;
  command:any;
  name:any="0000";
  note:any;
  now = new Date();
  fournisseur:any;
  mouvementName:any;
  closeResult:string="exemple"
  services :any;
  
  values = ["Recu", "attente"];
  statutValue="attente";
  changedPrix: boolean = false;
  constructor(private prestatairedeservice:Prestatairedeservice , private activatedRoute: ActivatedRoute,
    private commandapService: CommandapproService,
    private fournisseurService: FournisseurService,
    private receptionService: ReceptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    private mouvementService: MouvementService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.commandapService.getCommandeById(this.id).subscribe(res => {
        this.command = res;
        this.getservice();
        this.fournisseur = this.command.fournisseur;
        console.log(this.command.fournisseur)
        this.receptionService.getReceptionNewName().subscribe(res => {
          if (res.success) {
            this.name = res.obj
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: 'Probléme de récuperation du numero'
              },
              duration: 3000
            });
          }
        })
        this.mouvementService.getMouvementNewName().subscribe(res => {
          if (res.success) {
            this.mouvementName = res.obj;
          }
        })
      }, (err) => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de récuperation du bon achat'
          },
          duration: 3000
        });
      })
    })
  }
  getservice(){
    this.prestatairedeservice.geservicesByIds(this.parsIds(this.command.products)).subscribe(res =>  {this.services = res.obj ,
       console.log(res)})
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  changerPrix(event) {
    this.changedPrix = true;
    this.calculTotal();
  }
  calculTotal() {
    this.command.total_ht = 0;
    this.command.total_tva = 0;
    for (let i = 0; i < this.services.length; i++) {
      let prix = this.services[i].prix_achat;
      let qte = this.services[i].livred_quantite;
      this.command.total_ht += prix * qte;
      this.command.total_tva += ((prix * this.services[i].tva) / 100) * qte;

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
  submitReception() {
let reception = {
  num: this.name,
  statut: this.statutValue,
  total_ht: this.command.total_ht,
  total_tva: this.command.total_tva,
  categorie : 'service',
  fournisseur: this.command.fournisseur,
  creatorId: this.authService.getIdfromToken(),
  note: this.note,
  products: this.services.map(item => {
    return {
      id_produit: item._id,
      type_produit: 'service',
      asked_quantite: 1,
      livred_quantite: 1,
      ht_unitaire: item.total,
      nbr_lot:1,
      lots:[]
    }
  })
}
    this.receptionService.ajouterBonreception(reception).subscribe(res => {
      console.log(res)
      if (res.success) {
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: "Bon de reception ajouté avec succées"
          },
          duration: 3000
        });
        this.router.navigate(['mp/receptions'])
      }
    }
      )
  }
  }


