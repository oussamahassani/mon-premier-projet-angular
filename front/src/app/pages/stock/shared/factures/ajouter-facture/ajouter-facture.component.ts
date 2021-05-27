import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ProductService } from 'src/app/services/product/product.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FactureService } from 'src/app/services/facture/facture.service';
import { GeneralService } from 'src/app/services/general.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { ReceptionService } from 'src/app/services/reception/reception.service';
@Component({
  selector: 'app-ajouter-facture',
  templateUrl: './ajouter-facture.component.html',
  styleUrls: ['./ajouter-facture.component.scss']
})
export class AjouterFactureComponent implements OnInit {
  ids;
  items: any;
  fournisseur: any;
  receptions: any = [];
  now = new Date();
  timbre = 0.600;
  name = "00000";
  mode = "";
  modes = ["Cash", "Chéque", "Banque", "Credit", "TPE"]
  statut = false;
  total = 0;
  totalTva = 0;
  frais = 0;
  category = "";
  constructor(private activatedRoute: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private commandapService: CommandapproService,
    private receptionService: ReceptionService,
    private productService: ProductService,
    private factureService: FactureService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private generalService: GeneralService) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.items = JSON.parse(params['items']);
      this.receptionService.getBonreceptionByIds(this.parsIds(this.items)).subscribe(res => {
        if (res.success) {
          this.receptions = res.obj;
            this.fournisseur = this.receptions[0].fournisseur;
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
    let bon_receptions = this.receptions.map(item => {
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
          categorie : this.category,
          fournisseur: this.fournisseur._id,
          creatorId: this.authService.getIdfromToken(),
          bon_receptions: bon_receptions,
          isReception:true,
          payement: payement
        }
        this.factureService.ajouterfacture(facture).subscribe(res => {
          if (res.success) {
            this.receptionService.payerReception(this.parsIds(this.items), res.obj).subscribe(res => {
              if (res.success) {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'La facture a été créer, bon reception mis à jour'
                  },
                  duration: 3000
                });
                this.router.navigate([this.category+'/factures'], { queryParams: { type:"interne" } })
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
        fournisseur: this.fournisseur._id,
        creatorId: this.authService.getIdfromToken(),
        bon_receptions: bon_receptions,
        payement: payement,
        isReception:true
      }
      this.factureService.ajouterfacture(facture).subscribe(res => {
        if (res.success) {
         
          this.receptionService.payerReception(this.parsIds(this.items), res.obj).subscribe(res => {
            if (res.success) {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-success',
                  text: 'La facture a été créer, livraison mise à jour'
                },
                duration: 3000
              });
              this.router.navigate([this.category+'/factures'], { queryParams: { type:"interne" } })
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
    for (let i = 0; i < this.receptions.length; i++) {
      this.total += this.receptions[i].total_ht;
      this.totalTva += this.receptions[i].total_tva;
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
    let doc ;
   
    doc = document.getElementById('facture').innerHTML
    
    document.body.innerHTML = doc;
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<'+'html'+'><'+'body'+'>');
    win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
    win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
    win.document.write('<h1 style="text-align:center">'+'Entreprise hayat : ajoutrer facture'+'<h1>');
    win.document.write(doc);
    win.document.write('<'+'/body'+'><'+'/html'+'>');
    setTimeout(() => {
      win.print()
     }, 1000);
    

  }

}
