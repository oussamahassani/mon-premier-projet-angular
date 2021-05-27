import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-demand',
  templateUrl: './add-demand.component.html',
  styleUrls: ['./add-demand.component.scss']
})
export class AddDemandComponent implements OnInit {

  date_maximale = new FormControl(new Date());
  minDate = new Date();
  ids: any;
  matieres: any = [];
  demande_matieres: any = [];
  now = new Date();
  note = "Ex...";
  name = "00000";
  category: string;
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
              stock_securite: item.stock_securite,
              stock_max:item.stock_max,
              demandeEnCours: item.demandeEnCours,
              fournisseurs: item.fournisseurs,
              tva: item.tva,
              prix_achat: item.prix_achat,
              nature_stock: item.nature_stock,
              image: item.image,
              creatorId: item.creatorId,
              categorie:item.categorie,
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
    let demande = {
      num: this.name,
      creatorId: this.authService.getIdfromToken(),
      statut:"devis",
      note: this.note,
      categorie : this.category,
      products: mats,
      isCommand:false
    };
    this.demandeService.ajouterDemande(demande).subscribe(res => {
      if (res.success) {
        
        this.matiereService.commanderMatiere(this.parsIds(this.ids)).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'La demande a été créer, matiere mise à jour'
              },
              duration: 3000
            });
             this.router.navigate([this.category+'/demandes'])
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Probléme de mise a jour matiere'
              },
              duration: 3000
            });
          }
        })
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
