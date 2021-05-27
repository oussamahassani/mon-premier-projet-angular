import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';
import { DateAdapter } from '@angular/material/core';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-sortie-production',
  templateUrl: './sortie-production.component.html',
  styleUrls: ['./sortie-production.component.scss']
})
export class SortieProductionComponent implements OnInit {

  date_maximale = new FormControl(new Date());
  minDate = new Date();
  ids: any;
  matieres: any = [];
  demande_matieres: any = [];
  now = new Date();
  note = "Ex...";
  name = "00000";
  user:any;
  constructor(private activatedRoute: ActivatedRoute,
    private matiereService: MatiereService,
    private demandeService: DemandeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService:UserService,
    private _adapter: DateAdapter<any>) {
      this._adapter.setLocale('fr');
     }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.ids = JSON.parse(params['items']);
      this.matiereService.getMatiereByIds(this.parsIds(this.ids)).subscribe(res => {
        if (res.success) {
          this.matieres = res.obj;
          this.matieres = this.matieres.map(item => {
            return {
              _id: item._id,
              reference: item.reference,
              label: item.label,
              stock: item.stock,
              stock_securite: item.stock_securite,
              stock_max:item.stock_max,
              tva: item.tva,
              prix_achat: item.prix_achat,
              nature_stock: item.nature_stock,
              retirer_quantite: 1
            }

          })
          
         
        } else {

        }
      })
    })
    this.userService.getUserById(this.authService.getIdfromToken()).subscribe(res=>{
      this.user=res;
   })
  }



  submitSortie() {
    let lots=this.getLotsMatiere();
    this.matiereService.ajouterLotSortie(this.parsMatiereIds(this.matieres), lots).subscribe(res => {
      if (res.success) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: "Lot de sortie ajouté avec succées"
          },
          duration: 3000
        });
        this.router.navigate(['/mp/matieres'])
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: "Probléme d'ajout des lots"
          },
          duration: 3000
        });
      }
    })
  }


  getLotsMatiere() {
    let lots=[];
    for (let matiere of this.matieres) {
      let body = {
        matiere_id:matiere._id,
        quantite: matiere.retirer_quantite,
        ht_unitaire: matiere.prix_achat,
        tva: matiere.tva,
        note: this.note,
        date_sortie: this.now,
        user:this.authService.getIdfromToken()
      }
      lots.push(body);
    
    }
    return lots;
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  parsMatiereIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i]._id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

}
