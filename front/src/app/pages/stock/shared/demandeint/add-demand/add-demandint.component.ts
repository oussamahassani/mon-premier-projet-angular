import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { DemandeintService } from 'src/app/services/demandeint/demandeint.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { DateAdapter } from '@angular/material/core';
import { LotService } from 'src/app/services/lot/lot.service';

@Component({
  selector: 'app-add-demandint',
  templateUrl: './add-demandint.component.html',
  styleUrls: ['./add-demandint.component.scss']
})
export class AddDemandintComponent implements OnInit {

  
  minDate = new Date();
  ids: any;
  matieres: any = [];
  demande_matieres: any = [];
  now = new Date();
  note = "Ex...";
  name = "00000";
  user:any;
  category: string;
  constructor(private activatedRoute: ActivatedRoute,
    private matiereService: MatiereService,
    private demandeService: DemandeintService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService:UserService,
    private _adapter: DateAdapter<any>) {
      this._adapter.setLocale('fr');
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
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
              designation: item.designation,
              stock: item.stock,
              stock_max:item.stock_max,
              stock_securite: item.stock_securite,
              mesure_securite: item.mesure_securite,
              categorie:item.categorie,
              norme_qualite: item.norme_qualite,
              asked_quantite: 1
            }

          })
          
          this.demandeService.getDemandeNewName().subscribe(res => {
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
        } else {

        }
      })
    })
    this.userService.getUserById(this.authService.getIdfromToken()).subscribe(res=>{
      this.user=res;
   })
  }



  submitDemande() {
    let mats=this.matieres.map(item => {
      return {
        id_produit: item._id,
        type_produit:item.categorie,
        asked_quantite: item.asked_quantite
      }
    })
    let demandeint = {
      num: this.name,
      creatorId: this.authService.getIdfromToken(),
      statut:"attente",
      note: this.note,
      categorie : this.category,
      products: mats
    };
    this.demandeService.ajouterDemande(demandeint).subscribe(res => {
      if (res.success) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'Demande créer avec succées'
          },
          duration: 3000
      });
      this.router.navigate([this.category+'/demandesint'])     
    } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'Probléme de création de la demande'
          },
          duration: 3000
        });
      }
    })



  }



  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  
}
