import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LotService } from 'src/app/services/lot/lot.service';
import { InventaireService } from 'src/app/services/inventaire/inventaire.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-ajouter-inventaire',
  templateUrl: './ajouter-inventaire.component.html',
  styleUrls: ['./ajouter-inventaire.component.scss']
})
export class AjouterInventaireComponent implements OnInit {

  /** */
  inventaire: any;
  matieres: any;
  lots: any;
  user: any;
  total = 0;
  resultat = false;
  pourcentage = 0;
  category:any;
  constructor(private activatedRoute: ActivatedRoute,
    private lotService: LotService,
    private inventaireService: InventaireService,
    private matiereService: MatiereService,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

     }

  ngOnInit(): void {
    this.userService.getUserById(this.authService.getIdfromToken()).subscribe(res => {
      this.user = res;
    })
    this.activatedRoute.queryParams.subscribe(params => {
      this.inventaire = JSON.parse(params['inventaire']);
      this.lotService.getLotsByMatiere(this.parsMatiereIds(this.inventaire.products)).subscribe(res => {
        if (res.success) {
          this.lots = res.obj;
          this.matiereService.getMatiereByIds(this.parsMatiereIds(this.inventaire.products)).subscribe(res => {
            if (res.success) {
              this.matieres = res.obj;
              this.matieres = this.matieres.map(item => {
                return {
                  _id: item._id,
                  reference: item.reference,
                  designation: item.designation,
                  stock: item.stock,
                  stock_reel: item.stock,
                  categorie: item.categorie,
                  prix_achat: item.prix_achat,
                  lots: this.lots.filter(x => x.id_produit === item._id).map(itemlot => {
                    return {
                      code:itemlot.code,
                      id_lot: itemlot._id,
                      stock_reel: itemlot.quantite,
                      stock_theorique: itemlot.quantite
                    }
                  }),
                  lots_nbr: this.lots.filter(x => x.id_produit === item._id).length
                }

              })
            } else {

            }
          })

        } else {

        }
      })
    })
  }

  parsMatiereIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  changeLotQuantite(event) {
    this.total = 0;
    let nbrBonus = 0;
    let nbrPerte = 0;
    for (let matiere of this.matieres) {
      matiere.stock_reel = 0;
      for (let lot of matiere.lots) {
        matiere.stock_reel += lot.stock_reel;
        if (lot.stock_reel > lot.stock_theorique) {
          this.total += matiere.prix_achat * lot.stock_reel;
          nbrBonus++;
        } else {
          this.total -= matiere.prix_achat * lot.stock_reel;
          nbrPerte++;
        }
      }
    }
    if (this.total > 0) {
      this.resultat = true;
      this.pourcentage = nbrBonus * 100 / (nbrBonus + nbrPerte);
    } else {
      this.resultat = false;
      this.pourcentage = nbrPerte * 100 / (nbrBonus + nbrPerte);
      this.total = Math.abs(this.total);
    }
  }
  submitInventaire() {
    this.inventaire = {
      num: this.inventaire.num,
      resultat: this.resultat,
      total: this.total,
      pourcentage: this.pourcentage,
      creatorId: this.inventaire.creatorId,
      categorie : this.category,
      note: this.inventaire.note,
      periode_last: this.inventaire.periode_last,
      products: this.matieres.map(item => {
        return {
          id_produit: item._id,
          type_produit: item.categorie,
          lots: item.lots
        }
      })
    }
    this.inventaireService.ajouterinventaire(this.inventaire).subscribe(res1 => {
      if (res1.success) {
        this.lotService.updateReelTheoriqueMultiple(this.parsLotIds(this.getAllLots()), this.getAllLots()).subscribe(res => {
          if (res.success) {
            this.matiereService.updateReelTheoriqueMultiple(this.parsMatiereIds(this.inventaire.products), this.getStocks()).subscribe(res => {
              if (res.success) {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'Inventaire ajoutée avec succées, stock mis a jour'
                  },
                  duration: 3000
                });
                this.router.navigate([this.category+'/inventaires/consulter-inventaire'], { queryParams: { id: res1.obj } });
              } else {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-danger',
                    text: "Matiere :" + res.msg
                  },
                  duration: 3000
                });
              }
            })
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: "Lot :" + res.msg
              },
              duration: 3000
            });
          }
        })
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: "Inventaire :" + res1.msg
          },
          duration: 3000
        });
      }
    })

  }

  getAllLots() {
    let lots = [];
    for (let matiere of this.matieres) {
      for (let lot of matiere.lots) {
        lots.push(lot);
      }
    }
    return lots
  }
  parsLotIds(lots) {
    let ids = "";
    for (let i = 0; i < lots.length; i++) {
      ids += "" + lots[i].id_lot + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;

  }
  getStocks() {
    let stocks = []
    for (let matiere of this.matieres) {
      stocks.push({
        id_produit: matiere._id,
        stock_reel: matiere.stock_reel
      })
    }
    return stocks
  }

}
