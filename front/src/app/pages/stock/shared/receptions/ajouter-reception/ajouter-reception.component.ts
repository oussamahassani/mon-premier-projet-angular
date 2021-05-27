import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from 'src/app/services/lot/lot.service';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service';

@Component({
  selector: 'app-ajouter-reception',
  templateUrl: './ajouter-reception.component.html',
  styleUrls: ['./ajouter-reception.component.scss']
})
export class AjouterReceptionComponent implements OnInit {
  id;
  command: any;
  fournisseur: any;
  closeResult: string;
  now = new Date();
  matieres = [];
  frais = 0;
  name = "00000";
  note = "Ex...";
  statut = false;
  resultStatut = "attente";
  values = ["Reçu", "En Attente"];
  statutValue="En Attente";

  changedQte = false;
  changedPrix = false;
  foundCode = false;
  mouvementName = "";
  category = "";
  constructor(private activatedRoute: ActivatedRoute,
    private commandapService: CommandapproService,
    private fournisseurService: FournisseurService,
    private receptionService: ReceptionService,
    private matiereService: MatiereService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private modalService: NgbModal,
    private lotService: LotService,
    private mouvementService: MouvementService) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.commandapService.getCommandeById(this.id).subscribe(res => {
        this.command = res;
        this.getMatieres();
        this.fournisseur = this.command.fournisseur;
        this.receptionService.getReceptionNewName().subscribe(res => {
          if (res.success) {
            this.name = res.obj
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: 'Probléme de récuperation du numero'
              },
              duration: 3000
            });
          }
        })
        this.mouvementService.getMouvementNewName().subscribe(res => {
          if (res.success) {
            this.mouvementName = res.obj;
          }
        })
      }, (err) => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de récuperation du bon achat'
          },
          duration: 3000
        });
      })
    })
  }

  getMatieres() {
    this.matiereService.getMatiereByIds(this.parsIds(this.command.products)).subscribe(res => {
      if (res.success) {
        this.matieres = res.obj;
        this.matieres = this.matieres.map(item => {
          return {
            _id: item._id,
            reference: item.reference,
            designation: item.designation,
            stock: item.stock,
            stock_securite: item.stock_securite,
            stock_max: item.stock_max,
            demandeEnCours: item.demandeEnCours,
            isExpDate: item.isExpDate,
            fournisseurs: item.fournisseurs,
            categorie: item.categorie,
            tva: item.tva,
            prix_achat: this.command.products.filter(x => x.id_produit === item._id)[0].prix_ht,
            prix_initial:item.prix_initial,
            prix_cmp:item.prix_achat,
            nature_stock: item.nature_stock,
            creatorId: item.creatorId,
            asked_quantite: this.command.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
            livred_quantite: this.command.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
            date_expiration: new Date(),
            lots: [{
              code: "",
              quantite: this.command.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
              quantite_originale:this.command.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
              ht_unitaire: this.command.products.filter(x => x.id_produit === item._id)[0].prix_ht,
              note: "",
              isExpire: item.isExpDate,
              date_expiration: new Date(),
              is_comfirmed : true , 
              is_deranger:false
            }],
            lots_nbr: 1
          }

        })
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: "Probléme de récuperation des matiéres"
          },
          duration: 3000
        });
      }
    })

  }

  changerStatut(event) {
    this.statutValue=event.target.value;
    if (event.target.value === "Reçu") {
      this.statut = true;
      this.resultStatut = "Recu";
      
    } else {
      this.statut = false;
      this.resultStatut = "attente"
    }
  }
  submitReception() {
 
     
    this.lotService.verifyCodes(this.getLotCodes()).subscribe(res=>{
        if(res.success)
        {
          if(!res.obj)
          {
            let reception = {
              num: this.name,
              statut: this.resultStatut,
              total_ht: this.command.total_ht,
              total_tva: this.command.total_tva,
              categorie : this.category,
              fournisseur: this.command.fournisseur,
              creatorId: this.authService.getIdfromToken(),
              note: this.note,
              products: this.matieres.map(item => {
                return {
                  id_produit: item._id,
                  type_produit: item.categorie,
                  asked_quantite: item.asked_quantite,
                  livred_quantite: item.livred_quantite ,
                  ht_unitaire: item.prix_achat,
                  nbr_lot: item.lots_nbr,
                  lots: item.lots
                }
              })
            }
            this.receptionService.ajouterBonreception(reception).subscribe(res1 => {
              if (res1.success) {
                this.close();
                this.commandapService.recevoirCommande(this.command._id,res1.obj).subscribe(res => {
                if (this.statut) {
                    if (res.success) {
                      let lots = this.getLotsMatiere(res1.obj)
                      console.log("lots",lots)
                          this.lotService.ajouterMultipleLots(lots).subscribe(res => {
                            if (res.success) {
                              let mouvements = this.getMouvementMatiere(res.obj);
                         
                              this.mouvementService.ajouterMultipleMouvement(mouvements).subscribe(res => {
                                if (res.success) {
                                  //get stocks
                                  let stocks = this.getStockMatiere();
                                  console.log("stocks",stocks)
                                  this.matiereService.updateQuantiteReception(this.parsIds(this.command.products), stocks).subscribe(res => {
                                    if (res.success) {
                                      if(this.changedPrix)
                                      {
                                        let stocks = this.getStockMatiere();
                                        this.matiereService.updateFournisseursPrices(this.parsIds(this.command.products), stocks).subscribe(res=> {
                                          if(res.success)
                                          {
                                            this.snackBar.openFromComponent(SnackbarComponent, {
                                              data: {
                                                type: 'alert-success',
                                                text: "Bon de reception ajouté avec succées,stock et prix mis a jour"
                                              },
                                              duration: 3000
                                            });
                                            this.router.navigate([this.category+'/receptions'])
                                          }else{
                                            this.snackBar.openFromComponent(SnackbarComponent, {
                                              data: {
                                                type: 'alert-danger',
                                                text: "Matiere :" + res.msg
                                              },
                                              duration: 3000
                                            });
                                          }
                                        })
                                     
                                      }else{
                                        this.snackBar.openFromComponent(SnackbarComponent, {
                                          data: {
                                            type: 'alert-success',
                                            text: "Bon de reception ajouté avec succées"
                                          },
                                          duration: 3000
                                        });
                                        this.router.navigate([this.category+'/receptions'])
                                      }
                                      
                                      
                                     
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
      
                                  //for each matiere, => stock
                                  //this matiere update stock
      
                                } else {
                                  this.snackBar.openFromComponent(SnackbarComponent, {
                                    data: {
                                      type: 'alert-danger',
                                      text: "Mouvement: " + res.msg
                                    },
                                    duration: 3000
                                  });
      
                                }
                              })
                            } else {
                              this.snackBar.openFromComponent(SnackbarComponent, {
                                data: {
                                  type: 'alert-danger',
                                  text: "Lot: " + res.msg
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
      
      
      
                }else{
                  if(this.changedPrix)
                {
                  let stocks = this.getStockMatiere();
                  this.matiereService.updateFournisseursPrices(this.parsIds(this.command.products), stocks).subscribe(res=> {
                    if(res.success)
                    {
                      this.snackBar.openFromComponent(SnackbarComponent, {
                        data: {
                          type: 'alert-success',
                          text: "Bon de reception ajouté avec succées, prix mis a jour"
                        },
                        duration: 3000
                      });
                      this.router.navigate([this.category+'/receptions'])
                    }else{
                      this.snackBar.openFromComponent(SnackbarComponent, {
                        data: {
                          type: 'alert-danger',
                          text: "Matiere :" + res.msg
                        },
                        duration: 3000
                      });
                    }
                  })
               
                }else{
                  this.snackBar.openFromComponent(SnackbarComponent, {
                    data: {
                      type: 'alert-success',
                      text: "Bon de reception ajouté avec succées"
                    },
                    duration: 3000
                  });
                  this.router.navigate([this.category+'/receptions'])
                }
                }
                
              });
              } else {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-danger',
                    text: "Probléme d'ajout du bon de reception"
                  },
                  duration: 3000
                });
              }
            })
          }else{
            this.close()
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-warning',
                text: "Code de lot déjà existant"
              },
              duration: 3000
            });
          }
        }
      })
      
    


  }

  getLotCodes()
  {
    let codes = "";
    for (let i = 0; i < this.matieres.length; i++) {
      for (let lot of this.matieres[i].lots) {
        codes += "" + lot.code + ","
      }
    }
    codes = codes.substring(0, codes.length - 1);
    return codes;
  }

  getLotsMatiere(reception_id) {
    let lots = [];
    for (let matiere of this.matieres) {
      for (let lot of matiere.lots) {
        let body = {
          code: lot.code,
          creatorId: this.authService.getIdfromToken(),
          quantite: lot.quantite,
          ht_unitaire: matiere.prix_achat,
          note: lot.note,
          id_produit: matiere._id,
          type_produit: matiere.categorie,
          reception: reception_id,
          fournisseur: this.command.fournisseur,
          isExpire: lot.isExpire,
          date_expiration: lot.date_expiration,
          quantite_originale:lot.quantite
        }
        lots.push(body);
      }
    }
    return lots;
  }
  getMouvementMatiere(lot_ids) {
    let mouvements = [];
    let index = 1;
    let i = 0;
    for (let matiere of this.matieres) {
      for (let lot of matiere.lots) {

        mouvements.push(this.makeMouvement(matiere, lot_ids[i], lot, index));
        i++;
        index++;
      }
    }
    return mouvements;
  }
  makeMouvement(matiere, lot_id, lot, index) {
    let tot_now=matiere.prix_cmp * matiere.stock;
      let tot_livred=matiere.prix_achat * matiere.livred_quantite
      let qte_total=matiere.stock + matiere.livred_quantite;
    let mouvement = {
      num: "",
      id_lot: lot_id,
      quantite: lot.quantite,
      id_produit: matiere._id,
      type_produit: matiere.categorie,
      code_brbl: lot.reception,
      entree: true,
      prix_ref: matiere.prix_achat,
      prix_cmp: (tot_now+tot_livred)/qte_total,
      quantite_stock: matiere.stock
    }
    if (index == 1) {
      mouvement.num = this.mouvementName;
    } else {
      let x = this.mouvementName;
      let year_no = x.substr(x.length - 4, 4)
      let mouvement_no = x.substr(0, x.length - 4);
      let tmp = Number(mouvement_no) + 1;
      this.mouvementName = (tmp) + '' + year_no;
      mouvement.num = this.mouvementName;
    }
    return mouvement;
  }
  getStockMatiere() {
    let stocks = [];
   
    for (let mat of this.matieres) {
      let tot_now=mat.prix_cmp * mat.stock;
      let tot_livred=mat.prix_achat * mat.livred_quantite
      let qte_total=mat.stock + mat.livred_quantite;
        stocks.push({
          matiere_id: mat._id,
          quantite: mat.livred_quantite,
          prix_ht:mat.prix_achat,
          fournisseur:this.command.fournisseur,
          prix_achat: (tot_now+tot_livred) / qte_total
        })
    }
    return stocks;
  }

  printWindow() {
    let doc ;
   
    doc = document.getElementById('bonreception').innerHTML
    
    document.body.innerHTML = doc;
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<'+'html'+'><'+'body'+'>');
    win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
    win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
    win.document.write('<h1 style="text-align:center">'+'Entreprise hayat : bon reception facture'+'<h1>');
    win.document.write(doc);
    win.document.write('<'+'/body'+'><'+'/html'+'>');
    setTimeout(() => {
      win.print()
     }, 1000);

  }

  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
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

  changerPrix(event) {
    this.changedPrix = true;
    this.calculTotal();
  }
  changerQuantite(event) {
    this.changedQte = true;
    this.calculTotal()
  }

  
  changerNbrLot(event, index) {
    this.matieres[index].lots = [];
    let part = this.matieres[index].livred_quantite / this.matieres[index].lots_nbr;
    let restQuantite = 0;
    let isRest = false;
    if (part % 2 != 0) {
      isRest = true;
      part = Math.floor(part);
      let totalQuantite = part * this.matieres[index].lots_nbr;
      restQuantite = this.matieres[index].livred_quantite - totalQuantite;
    }

    for (let i = 0; i < this.matieres[index].lots_nbr; i++) {
      if (isRest) {
        if (i == 0) {
          this.matieres[index].lots.push({
            code: "",
            quantite: part + restQuantite,
            ht_unitaire: this.command.products.filter(x => x.id_produit === this.matieres[index]._id)[0].prix_ht,
            note: "",
            isExpire: this.matieres[index].isExpDate,
            date_expiration: new Date(),
            quantite_originale:part+restQuantite ,
            is_comfirmed : true,
            is_deranger:false
          })
        } else {
          this.matieres[index].lots.push({
            code: "",
            quantite: part,
            ht_unitaire: this.command.products.filter(x => x.id_produit === this.matieres[index]._id)[0].prix_ht,
            note: "",
            isExpire: this.matieres[index].isExpDate,
            date_expiration: new Date(),
            quantite_originale:part+restQuantite ,
            is_comfirmed : true,
            is_deranger:false
          })
        }
      } else {
        this.matieres[index].lots.push({
          code: "",
          quantite: part,
          ht_unitaire: this.command.products.filter(x => x.id_produit === this.matieres[index]._id)[0].prix_ht,
          note: "",
          isExpire: this.matieres[index].isExpDate,
          date_expiration: new Date(),
          quantite_originale:part+restQuantite ,
          is_comfirmed : true,
          is_deranger:false
        })
      }


    }

  }
  changeLotQuantite(event, index ) {
    if (event.target.value > 0) {
      this.matieres[index].livred_quantite = 0;
      for (let lo of this.matieres[index].lots) {
        this.matieres[index].livred_quantite += lo.quantite;
       lo.is_comfirmed = true
       lo.is_deranger=false
      }
      if (this.matieres[index].livred_quantite != this.matieres[index].asked_quantite) {
        this.changedQte = true;
      }
      this.calculTotal();
    }

  }
  changeCode(event, index) {
    let code = event.target.value;
    this.foundCode = false;
    for (let mat of this.matieres) {
      for (let i = 0; i < mat.lots.length; i++) {
        if (i != index) {
          if (code.length > 0 && code === mat.lots[i].code) {
            this.foundCode = true
          }
        }

      }
    }
  }
  calculTotal() {
    this.command.total_ht = 0;
    this.command.total_tva = 0;
    for (let i = 0; i < this.matieres.length; i++) {
      let prix = this.matieres[i].prix_achat;
      let qte = this.matieres[i].livred_quantite;
      this.command.total_ht += prix * qte;
      this.command.total_tva += ((prix * this.matieres[i].tva) / 100) * qte;

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

  parsIdsLot(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i]._id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

checkValue(event: any , i , j){
  console.log(event.source , j, i);
  if(event.checked === false)
  {
    const lo = this.matieres[i].lots[j]
      this.matieres[i].livred_quantite -= lo.quantite;



    if (this.matieres[i].livred_quantite != this.matieres[i].asked_quantite) {
      this.changedQte = true;
    }
  }
  else 
  {
    const lo = this.matieres[i].lots[j]
      this.matieres[i].livred_quantite += lo.quantite;
    if (this.matieres[i].livred_quantite != this.matieres[i].asked_quantite) {
      this.changedQte = true;
    }
  }
    this.calculTotal();
}

isderanger($event,i,j){

}
}