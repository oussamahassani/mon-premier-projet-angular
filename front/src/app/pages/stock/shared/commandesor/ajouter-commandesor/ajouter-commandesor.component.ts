import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeintService } from 'src/app/services/demandeint/demandeint.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { UserService } from 'src/app/services/user/user.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandsorService } from 'src/app/services/commandsor/commandsor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { DateAdapter } from '@angular/material/core';
import { LotService } from 'src/app/services/lot/lot.service';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service';

@Component({
  selector: 'app-ajouter-commandesor',
  templateUrl: './ajouter-commandesor.component.html',
  styleUrls: ['./ajouter-commandesor.component.scss']
})
export class AjouterCommandesorComponent implements OnInit {

  demandID: any;
  demand: any;
  matieres: any;
  demand_matieres: any;
  name: any;
  now = new Date();
  user: any;
  command: any;

  minDate = new Date();
  doneSuccess: any = false;
  doneError: boolean = false;
  doneMsg = "";
  lastName = "";
  note = "";
  commandsArray = [];
  lots: any;
  mouvementName = "";
  stocks: any = [];
  category:any;
  isStockInsuffisant = false;
  constructor(private activatedRoute: ActivatedRoute,
    private demandService: DemandeintService,
    private matiereService: MatiereService,
    private authService: AuthService,
    private commandapService: CommandsorService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _adapter: DateAdapter<any>, ) {
    this._adapter.setLocale('fr');
    this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.demandID = params['id'];
      this.demandService.getDemandeById(this.demandID).subscribe(res => {
        this.demand = res;
        this.demand_matieres = this.demand.products;
        this.user = this.demand.creatorId;

        this.matiereService.getMatiereByIds(this.parsIds(this.demand.products)).subscribe(res => {
          if (res.success) {
            this.matieres = res.obj.map(item => {
              return {
                _id: item._id,
                reference: item.reference,
                designation: item.designation,
                stock: item.stock,
                stock_securite: item.stock_securite,
                nature_stock: item.nature_stock,
                categorie: item.categorie,
                famille: item.famille,
                asked_quantite: this.getAsked(item),
              }
            });
            this.getStockInsuffisant();
          }
        });
      });
    });

    this.commandapService.getCommandNewName().subscribe(res => {
      if (res.success) {
        this.lastName = res.obj;
      } else {

      }
    });
  }


  getStockInsuffisant() {
    let isInsuffisant = false;
    for (let matiere of this.matieres) {
      if (matiere.asked_quantite > matiere.stock) {
        isInsuffisant = true;
      }
    }
    this.isStockInsuffisant = isInsuffisant;

  }

  submitCommand() {
    this.commandapService.ajouterCommande(this.makeCommand()).subscribe(res => {
      if (res.success) {
        this.demandService.recevoirdemande(this.demandID, res.obj).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: "Bon de prélèvement ajoutée avec succées, stock mis a jour"
              },
              duration: 3000
            });
            this.router.navigate([this.category+'/commandessor'])


          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: "Demande: " + res.msg
              },
              duration: 3000
            });
          }
        })
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: "Commande: " + res.msg
          },
          duration: 3000
        });
      }
    })
  }
  makeCommand() {
    return {
      num: this.lastName,
      demandeint: this.demandID,
      categorie:this.category,
      creatorId: this.authService.getIdfromToken(),
      products: this.matieres.map(matiere => {
        return {
          id_produit: matiere._id,
          type_produit: matiere.famille,
          asked_quantite: matiere.asked_quantite
        }
      })
    }
  }
  qteChanged() {
    this.getStockInsuffisant()
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  getAsked(item) {
    return this.demand_matieres.filter(x => x.id_produit === item._id)[0].asked_quantite
  }




}


