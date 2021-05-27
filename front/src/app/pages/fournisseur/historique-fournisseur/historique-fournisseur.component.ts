import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { FactureService } from 'src/app/services/facture/facture.service';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historique-fournisseur',
  templateUrl: './historique-fournisseur.component.html',
  styleUrls: ['./historique-fournisseur.component.scss']
})
export class HistoriqueFournisseurComponent implements OnInit {

  id;
  fournisseur: any;
  formFournisseur: FormGroup;
  submitFournisseur: boolean = false;
  commands: any;
  receptions: any;
  demands: any;
  factures: any;
  total_achat = 0;
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  constructor(private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private commandapService: CommandapproService,
    private factureService: FactureService,
    private receptionService: ReceptionService,
    private demandService: DemandeService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.fournisseurService.getFournisseurById(this.id).subscribe(res => {
        if (res.success) {
          this.fournisseur = res.obj;
          this.commandapService.getCommandeByFournisseur(this.id).subscribe(res => {
            if (res.success) {
              this.commands = res.obj.filter(x => x.statut === "Confirmed");
              this.receptionService.getReceptionByFournisseur(this.id).subscribe(res1 => {
                if (res1.success) {
                  this.receptions = res1.obj;
                  this.total_achat = this.calculTotal(this.receptions);

                } else {

                }
              })
              this.demandService.getDemandesByIds(this.parsIdsDemande(this.commands)).subscribe(res3 => {
                if (res3.success) {
                  this.demands = res3.obj;
                } else {

                }
              })
            }
          })
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: 'Probléme de récuperation du fournisseur'
            },
            duration: 3000
          });
        }

      })
    })
  }
  get ft() { return this.formFournisseur.controls; }
  onUpdateFournisseurSubmit() {
    this.submitFournisseur = true;
    if (this.formFournisseur.valid) {
      this.fournisseur = this.formFournisseur.value;
      this.fournisseur.creatorId = this.authService.getIdfromToken();
      this.fournisseurService.updateFournisseur(this.fournisseur, this.fournisseur._id).subscribe(res => {
        if (res.success) {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Fournisseur mis a jour avec succées'
            },
            duration: 3000
          });

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
      return;
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

  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  parsIdsReception(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].bonreception + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  parsIdsFacture(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].facture_id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  parsIdsDemande(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].demand + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  calculTotal(receptions) {
    let total = 0;
    let total_tva = 0;
    for (let i = 0; i < receptions.length; i++) {
      total += receptions[i].total_ht;
      total_tva += receptions[i].total_tva;
    }
    return total + total_tva;
  }
  getDemandNumber(id) {
    if (this.demands && this.demands.length > 0 && this.commands && this.commands.length > 0) {
      let items=this.commands.filter(x=>x.bonreception===id);
      if(items && items.length>0)
      {
        let demId=items[0].demand;
        return this.demands.filter(x => x._id === demId)[0].num;
      }else{
        return "-"
      } 
    } else {
      return "-"
    }
  }
  getCommandNumber(id) {
    if(this.commands && this.commands.length>0)
    {
       let items=this.commands.filter(x => x.bonreception === id);
       if(items && items.length>0)
       {
         return items[0].num
       }else{
         return "-"
       }
    }else{
      return "-"
    }
    
  }

  getReceptionFile(id) {
    if (this.receptions && this.receptions.length > 0) {
      let item = this.receptions.filter(x => x._id === id);
      if (item && item.length > 0) {
        if (item[0].justif_reception && item[0].justif_reception.length > 0) {
          return this.baseUrlImage + '' + item[0].justif_reception
        } else {
          return false;
        }
      } else {
        return "-"
      }

    }
  }
  getFactureFile(id) {
    if (this.receptions && this.receptions.length > 0) {
      let file = this.receptions.filter(x => x._id === id)[0].justif_facture;
      if (file && file.length > 0) {
        return this.baseUrlImage + '' + file;
      } else {
        return false
      }
    }
  }


}
