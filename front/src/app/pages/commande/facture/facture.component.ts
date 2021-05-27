import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ProductService } from 'src/app/services/product/product.service';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FactureService } from 'src/app/services/facture/facture.service';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {


  ids;
  items: any;
  client: any;
  livraisons: any = [];
  now = new Date();
  timbre = 0;
  name = "00000";
  mode = "";
  modes = ["Cash", "Chéque", "Banque", "Credit", "TPE"]
  statut = false;
  total = 0;
  totalTva = 0;
  frais = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private commandService: CommandeService,
    private livraisonService: LivraisonService,
    private productService: ProductService,
    private factureService: FactureService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private generalService: GeneralService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.items = JSON.parse(params['items']);


      this.livraisonService.getLivraisonByIds(this.parsIds(this.items)).subscribe(res => {
        if (res.success) {
          this.livraisons = res.obj;
          this.clientService.getClientById(this.livraisons[0].client).subscribe(res => {
            this.client = res;
          })
          this.factureService.getFactureNewName().subscribe(res => {
            if (res.success) {
              this.name = res.obj;
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
          this.calculTotal();
        } else {

        }
      })
    })
  }
  changerStatut(event) {
    if (event.target.value === "payed") {
      this.statut = true;
    } else {
      this.statut = false;
    }
  }
  changerMode(event) {
    this.mode = event.target.value;
  }
  submitFacture() {
    let bon_livraisons = this.livraisons.map(item => {
      return {
        numero: item.num,
        _id: item._id
      }
    })
    let payement = {};
    let facture = {};
    if (this.statut) {
      if (this.mode.length > 0) {
        payement = {
          paid_status: true,
          mode_paiement: this.mode,
          user: this.authService.getIdfromToken()
        }
        facture = {
          numero: this.name,
          ht: this.total - this.totalTva,
          tva: this.totalTva,
          timbre_fiscale: this.timbre,
          frais_livraison: this.frais,
          client: this.client._id,
          creatorId: this.authService.getIdfromToken(),
          bon_livraisons: bon_livraisons,
          payement: payement,
          isReception:false
        }
        this.factureService.ajouterfacture(facture).subscribe(res => {
          if (res.success) {
            this.livraisonService.payerLivraison(this.parsIds(this.items), res.obj).subscribe(res => {
              if (res.success) {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'La facture a été créer, livraison mise à jour'
                  },
                  duration: 3000
                });
                this.router.navigate(['/factures'])
              } else {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'Probléme de mise a jour livraison'
                  },
                  duration: 3000
                });
              }
            })
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Probléme de création de la facture'
              },
              duration: 3000
            });
          }
        })
      } else {
        //snack bar please choisir mode
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-warning',
            text: 'Veuillez choisir un mode de paiement'
          },
          duration: 3000
        });
      }
    } else {
      payement = {
        paid_status: false
      }
      facture = {
        numero: this.name,
        ht: this.total - this.totalTva,
        tva: this.totalTva,
        timbre_fiscale: this.timbre,
        frais_livraison: this.frais,
        client: this.client._id,
        creatorId: this.authService.getIdfromToken(),
        bon_livraisons: bon_livraisons,
        payement: payement,
        isReception:false
      }
      this.factureService.ajouterfacture(facture).subscribe(res => {
        if (res.success) {
         
          this.livraisonService.payerLivraison(this.parsIds(this.items), res.obj).subscribe(res => {
            if (res.success) {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-success',
                  text: 'La facture a été créer, livraison mise à jour'
                },
                duration: 3000
              });
            } else {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-success',
                  text: 'Probléme de mise a jour livraison'
                },
                duration: 3000
              });
            }
          })
        } else {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-success',
              text: 'Probléme de création de la facture'
            },
            duration: 3000
          });
        }
      })
    }
  }
  calculTotal() {
    for (let i = 0; i < this.livraisons.length; i++) {
      this.total += this.livraisons[i].total;
      this.totalTva += this.livraisons[i].tva;
      this.frais += this.livraisons[i].frais;
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
  printWindow()
  {
    window.print(); 
  }

}
