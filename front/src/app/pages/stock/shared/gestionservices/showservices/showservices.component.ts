import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
@Component({
  selector: 'app-showservices',
  templateUrl: './showservices.component.html',
  styleUrls: ['./showservices.component.scss']
})
export class ShowservicesComponent implements OnInit {
  date_maximale = new FormControl(new Date());
  minDate = new Date();
  ids: any;
  services: any = [];
  demande_matieres: any = [];
  now = new Date();
  note = "Ex...";
  name = "00000";
  category: string;
  user:any;
  constructor(private activatedRoute: ActivatedRoute,
    private prestatairedeservice: Prestatairedeservice,
    private demandeService: DemandeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _adapter: DateAdapter<any>) {
      this._adapter.setLocale('fr');
      this.category = 'service';
     }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.ids = JSON.parse(params['items']);
      this.prestatairedeservice.geservicesByIds(this.parsIds(this.ids)).subscribe(res => {
        if (res.success) {
          this.services = res.obj;
          this.services = this.services.map(item => {
            return {
              _id: item._id,
              reference: item.num,
              designation: item.name,
              demandeEnCours: item.demandeEnCours,
              fournisseurs: item.fournisseurs,
              tva: item.tva,
              prix:item.total,
              image: item.image,
              creatorId: item.creatorId,
              categorie:'service',
              quantiter:1,
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
        }
      })
    })
  
      this.user=this.authService.getUserfromToken();
      console.log(this.user)
  }



  submitDemande() {
    let mats=this.services.map(item => {
      return {
        id_produit: item._id,
        type_produit:item.categorie,
        asked_quantite: item.quantiter
      }
    })
    let demande = {
      typedemande:"services",
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
        
        this.prestatairedeservice.commanderservice(this.parsIds(this.ids)).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'La demande a été créer, matiere mise à jour'
              },
              duration: 3000
            });
             this.router.navigate(['mp/demandes'])
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
