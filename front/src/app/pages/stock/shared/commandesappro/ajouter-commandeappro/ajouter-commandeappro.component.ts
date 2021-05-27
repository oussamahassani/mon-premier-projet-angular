import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { DateAdapter } from '@angular/material/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
@Component({
  selector: 'app-ajouter-commandeappro',
  templateUrl: './ajouter-commandeappro.component.html',
  styleUrls: ['./ajouter-commandeappro.component.scss']
})
export class AjouterCommandeapproComponent implements OnInit {
  closeResult: string;
  demandID: any;
  demand: any;
  matieres: any;
  demand_matieres: any;
  name: any;
  now = new Date();
  user: any;
  total_ht = 0;
  total_tva = 0;
  allFournisseurs: any = [];
  fournisseurs: any = [];
  date_livraison = new FormControl(new Date());
  minDate = new Date();
  doneSuccess: any = false;
  doneError: boolean = false;
  doneMsg = "";
  typedemande:any;
  lastName = "";
  commandsArray=[];
  category: string;
  mat:any;
  services: any = []
  constructor(private activatedRoute: ActivatedRoute,
    private demandService: DemandeService,
    private matiereService: MatiereService,
    private prestatairedeservice:Prestatairedeservice,
    private fournisseurService: FournisseurService,
    private authService: AuthService,
    private commandapService: CommandapproService,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    private _adapter: DateAdapter<any>) {
    this._adapter.setLocale('fr');
    this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.demandID = params['id'];
      this.demandService.getDemandeById(this.demandID).subscribe(res => {
        this.demand = res;
        console.log(res)
        this.typedemande=res.typedemande
        if(res.typedemande=='stock'){
        this.demand_matieres = this.demand.products;
        this.matiereService.getMatiereByIds(this.parsIds(this.demand.products)).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.matieres = res.obj.map(item => {
              return {
                _id: item._id,
                reference: item.reference,
                designation: item.designation,
                stock: item.stock,
                stock_securite: item.stock_securite,
                stock_max:item.stock_max,
                fournisseurs: item.fournisseurs.sort((a, b) => a.prix_ht - b.prix_ht), //list.sort((a, b) => (a.color > b.color) ? 1 : -1),
                tva: item.tva,
                prix_achat: item.prix_achat,
                nature_stock: item.nature_stock,
                creatorId: item.creatorId,
                asked_quantite: this.getAsked(item),
                chosenFournisseur: null,
                categorie:item.categorie
              }
            });

            this.getAllFournisseurs(this.matieres);
            this.fournisseurService.getFournisseurByIds(this.parseFournisseursIds(this.allFournisseurs)).subscribe(res => {
              if (res.success) {
                this.fournisseurs = res.obj;
              }
            })
          } 
        })
      }
      else if (res.typedemande=='services'){
        this.prestatairedeservice.geservicesByIds(this.parsIds(this.demand.products)).subscribe(res => {
          this.services = res.obj
          this.services.chosenFournisseur= null
        for (let i = 0; i < this.services.length; i++) {
          console.log(this.services[i].fournisseurs)
          for (let j = 0; j < this.services[i].fournisseurs.length; j++) {
     
              this.allFournisseurs.push(this.services[i].fournisseurs[j].fournisseur)
            
          }
        }
        this.fournisseurs= this.allFournisseurs
      })
    
    
    }
          this.user = this.demand.creatorId;
        this.commandapService.getCommandNewName().subscribe(res => {
          if (res.success) {
            this.lastName = res.obj;
          } 
        })
      }, (err) => {
         
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'Bon de commande ajoutés avec succées, demande mise a jour'
          },
          duration: 3000
      })
    })
  })
}




  getAsked(item) {
    return this.demand_matieres.filter(x => x.id_produit === item._id)[0].asked_quantite
  }

  getAllFournisseurs(matieres) {
    for (let i = 0; i < matieres.length; i++) {
      for (let j = 0; j < matieres[i].fournisseurs.length; j++) {
        if (this.allFournisseurs.filter(e => e.id === matieres[i].fournisseurs[j].fournisseur).length <= 0) {
          this.allFournisseurs.push(matieres[i].fournisseurs[j])
        }
      }
    }
    
  }


  notifyChange(matiere, event) {

    this.calculTotal();
  
  }

  notifyChangeservices(service, event) {

    this.calculserviceTotal();
  
  }
  sortfornissuer(event) {
    switch(event.target.value) {
      case 'prix':
        this.matieres[this.mat].fournisseurs.sort((a,b) => a.prix_ht - b.prix_ht )
        // code block
        break;
      case 'modaliter':
        this.matieres[this.mat].fournisseurs.sort((a,b) => a.modaliter_de_payement - b.modaliter_de_payement )
        // code block
        break;
        case 'livraison':
          this.matieres[this.mat].fournisseurs.sort((a,b) => a.delais_de_livraison - b.delais_de_livraison )
      default:
        break;
    }
  }
  sortfornissuerservices(event) {
    switch(event.target.value) {
      case 'prix':
        this.services[this.mat].fournisseurs.sort((a,b) => a.total - b.total )
        // code block
        break;
      case 'modaliter':
        this.services[this.mat].fournisseurs.sort((a,b) => a.modaliter_de_payement - b.modaliter_de_payement )
        // code block
        break;
        case 'livraison':
          this.services[this.mat].fournisseurs.sort((a,b) => a.delais_de_livraison - b.delais_de_livraison )
      default:
        break;
    }
  }
  calculTotal() {
    this.total_ht = 0;
    this.total_tva = 0;
    for (let i = 0; i < this.matieres.length; i++) {
      if (this.matieres[i].chosenFournisseur) {
        let prix = this.matieres[i].fournisseurs.filter(x => x.fournisseur._id === this.matieres[i].chosenFournisseur)[0].prix_ht;
        let qte = this.matieres[i].asked_quantite;
        this.matieres[i].prix_achat = prix;
        this.total_ht += prix * qte;
        this.total_tva += ((prix * this.matieres[i].tva) / 100) * qte;
      }
    }

  }
  calculserviceTotal() {
    this.total_ht = 0;
    this.total_tva = 0;
  
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].chosenFournisseur) {
        console.log(this.services[i].chosenFournisseur)
        //let prix = this.services[i].fournisseurs.filter(x => x.fournisseur._id === this.services[i].chosenFournisseur)[0];
        //console.log(prix)
        let qte = 1;
        let prix =this.services[i].total ;
         this.total_ht += prix * qte;
         this.total_tva += ((prix * this.services[i].tva) / 100) * qte;
      }
    }

  }
  verifyFournisseur() {
    let isFourniseur = false;
    for (let i = 0; i < this.matieres.length; i++) {
      if (this.matieres[i].chosenFournisseur) {
        isFourniseur = true;
      } else {
        isFourniseur = false;
      }
    }
    return isFourniseur;
  }

  submitCommandservice(){
    let index = 1;
    const grouped = this.groupBy(this.services, services => services.chosenFournisseur);
    for (var [fournisseur, services] of grouped.entries()) {
      console.log(fournisseur);
      this.commandsArray.push(this.makeserviceCommand(services,fournisseur,index))
      index++;
    }
    this.commandapService.ajouterMultipleCommande(this.commandsArray).subscribe(res=>{
      if(res.success)
      { 
        this.demandService.recevoirdemande(this.demandID).subscribe(res=>{
          if(res.success)
          {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Bon de commande ajoutés avec succées, demande mise a jour'
              },
              duration: 3000
            });
            this.router.navigate([this.category+'/commandesap'])
          }else{

          }
        })
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme ajout de bon de commande'
          },
          duration: 3000
        });
      }
    })
  } 
  
  
  submitCommand() {
    let index = 1;
    if (this.verifyFournisseur()) {
      const grouped = this.groupBy(this.matieres, matiere => matiere.chosenFournisseur);
      for (var [fournisseur, matieres] of grouped.entries()) {
        console.log(fournisseur);
        this.commandsArray.push(this.makeCommand(matieres,fournisseur,index))
        index++;
      }

      this.commandapService.ajouterMultipleCommande(this.commandsArray).subscribe(res=>{
        if(res.success)
        { 
          this.demandService.recevoirdemande(this.demandID).subscribe(res=>{
            if(res.success)
            {
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  type: 'alert-success',
                  text: 'Bon de commande ajoutés avec succées, demande mise a jour'
                },
                duration: 3000
              });
              this.router.navigate([this.category+'/commandesap'])
            }else{

            }
          })
        }else{
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: 'Probléme ajout de bon de commande'
            },
            duration: 3000
          });
        }
      })
    } else {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type: 'alert-warning',
          text: 'Veuillez choisir un fournisseur pour chaque matiere'
        },
        duration: 3000
      });
    }
  }



  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }


  makeCommand(matieres, fournisseur, index) {
    let prix_ht = 0;
    let tva = 0;
    for (let i = 0; i < matieres.length; i++) {
      if (matieres[i].fournisseurs) {
        let prix = this.matieres[i].fournisseurs.filter(x => x.fournisseur._id === this.matieres[i].chosenFournisseur)[0].prix_ht;
        let qte = matieres[i].asked_quantite;
        matieres[i].prix_achat = prix;
        prix_ht += prix * qte;
        tva += ((prix * matieres[i].tva) / 100) * qte;
      }

    }
    if (index == 1) {
 
      let command = {
        num: this.lastName,
        statut:"attente",
        demand: this.demandID,
        total_ht: prix_ht,
        categorie : this.category,
        total_tva: tva,
        creatorId: this.authService.getIdfromToken(),
        fournisseur: fournisseur,
        products: matieres.map(x => {
          return {
            id_produit: x._id,
            asked_quantite: x.asked_quantite,
            type_produit:x.categorie,
            prix_ht: x.fournisseurs.filter(y => y.fournisseur._id === x.chosenFournisseur)[0].prix_ht
          }
        })
      }
      return command;
    } else {
      let x = this.lastName;
      let year_no = x.substr(x.length - 4, 4)
      let command_no = x.substr(0, x.length - 4);
      let tmp = Number(command_no) + 1;
      this.lastName = (tmp) + '' + year_no;
      let command = {
        num: this.lastName,
        statut:"attente",
        demand: this.demandID,
        total_ht: prix_ht,
        total_tva: tva,
        creatorId: this.authService.getIdfromToken(),
        fournisseur: fournisseur,
        products: matieres.map(x => {
          return {
            id_produit: x._id,
            asked_quantite: x.asked_quantite,
            type_produit:x.categorie,
            prix_ht: x.fournisseurs.find(y => y.fournisseur._id === fournisseur).prix_ht
          }
        })
      }
      return command;

    }


  }

  parsIdsCommands(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i]._id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  parseFournisseursIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].fournisseur + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  open(content) {
    this.modalService.open(content, {size: 'lg' , ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  selectmat(mat){
    console.log(mat)
this.mat  =mat
  }
  confirmechoix(){
    console.log()
  }


  makeserviceCommand(services, fournisseur, index) {
    let prix_ht = 0;
    let tva = 0;
    for (let i = 0; i < services.length; i++) {
      if (services[i].fournisseurs) {
        let prix = this.services[i].total //this.matieres[i].fournisseurs.filter(x => x.fournisseur._id === this.services[i].chosenFournisseur)[0].prix_ht;
        let qte = 1;
        services[i].prix_achat = prix;
        prix_ht += this.services[i].total;
        tva += ((prix * services[i].tva) / 100) * qte;
      }

    }
    if (index == 1) {
 
      let command = {
        num: this.lastName,
        statut:"attente",
        demand: this.demandID,
        total_ht: prix_ht,
        categorie : 'services',
        total_tva: tva,
        creatorId: this.authService.getIdfromToken(),
        fournisseur: fournisseur,
        products: services.map(x => {
          return {
            id_produit: x._id,
            asked_quantite: '1',
            type_produit:'services',
            prix_ht:4
          
          }
        })
      }
      return command;
    } else {
      let x = this.lastName;
      let year_no = x.substr(x.length - 4, 4)
      let command_no = x.substr(0, x.length - 4);
      let tmp = Number(command_no) + 1;
      this.lastName = (tmp) + '' + year_no;
      let command = {
        num: this.lastName,
        statut:"attente",
        categorie : 'services',
        demand: this.demandID,
        total_ht: prix_ht,
        total_tva: tva,
        creatorId: this.authService.getIdfromToken(),
        fournisseur: fournisseur,
        products: services.map(x => {
          return {
            id_produit: x._id,
            asked_quantite: '1',
            type_produit:'services',
            prix_ht:4
          
          }
        })
      }
      return command;

    }


  }
}
