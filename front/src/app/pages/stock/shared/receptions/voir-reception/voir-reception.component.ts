import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceptionService } from 'src/app/services/reception/reception.service';
import { GeneralService } from 'src/app/services/general.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { LotService } from 'src/app/services/lot/lot.service';
import { MouvementService } from 'src/app/services/mouvement/mouvement.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-voir-reception',
  templateUrl: './voir-reception.component.html',
  styleUrls: ['./voir-reception.component.scss']
})
export class VoirReceptionComponent implements OnInit {

  @ViewChild('docModal') private docModal;
  id;
  reception: any;
  command: any;
  statut = "";
  statutValue = true;
  matieres: any = [];
  values = ["Reçu", "En Attente"];
  now = new Date();
  justificatif = "";
  closeResult: string;

  baseUrlImage = environment.baseUrlImage;
  selectedFile: ImageSnippet;
  imageSrc: string = "/uploads/a5a1f9b8-cecf-46a0-9e54-849f6599dc5a.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL: any = this.baseUrlImage + this.imageSrc;
  foundCode = false;
  mouvementName = "";
  category = "";
  constructor(private activatedRoute: ActivatedRoute,
    private receptionService: ReceptionService,
    private commandapService: CommandapproService,
    private matiereService: MatiereService,
    private snackBar: MatSnackBar,
    private demandService: DemandeService,
    private router: Router,
    private _lightbox: Lightbox,
    private generalService: GeneralService,
    private lotService: LotService,
    private mouvementService: MouvementService,
    private authService: AuthService,
    private modalService: NgbModal) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.receptionService.getBonreceptionById(this.id).subscribe(res => {
        this.reception = res;
        if (this.reception.statut === "Recu") {
          this.statut = "Reçu";
          this.statutValue = true;
          this.justificatif = this.reception.justificatif_reception;
        } else {
          this.statut = "En Attente";
          this.statutValue = false;
          this.mouvementService.getMouvementNewName().subscribe(res => {
            if (res.success) {
              this.mouvementName = res.obj;
            }
          })
        }
        this.commandapService.getCommandeByReception(this.reception._id).subscribe(res => {
          if (res.success) {
            this.command = res.obj;
            this.getMatieres();
          } else {

          }

        })
      }, err => {
        this.snackBar.open("Problem getting Client", 'X', {
          duration: 3000
        });
      })
    })
  }

  getMatieres() {
    this.matiereService.getMatiereByIds(this.parsIds(this.reception.products)).subscribe(res => {
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
            prix_initial: item.prix_initial,
            prix_achat: this.reception.products.filter(x => x.id_produit === item._id)[0].ht_unitaire,
            prix_cmp: item.prix_achat,
            nature_stock: item.nature_stock,
            creatorId: item.creatorId,
            asked_quantite: this.reception.products.filter(x => x.id_produit === item._id)[0].asked_quantite,
            livred_quantite: this.reception.products.filter(x => x.id_produit === item._id)[0].livred_quantite,
            date_expiration: new Date(),
            lots: this.reception.products.filter(x => x.id_produit === item._id)[0].lots,
            lots_nbr: this.reception.products.filter(x => x.id_produit === item._id)[0].lots.length
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
    console.log(this.matieres)
    if (event.target.value === "Reçu") {
      this.lotService.verifyCodesRecu(this.getLotCodes()).subscribe(res => {
        if (res.success) {
          if (!res.obj) {
            this.statutValue = true;
            this.reception.statut = "Recu"
            this.receptionService.changeStatut(this.reception, this.reception._id).subscribe(res1 => {
              if (res1.success) {
                this.commandapService.recevoirCommande(this.command._id, this.reception._id).subscribe(res => {
                  if (res.success) {
                    let lots = this.getLotsMatiere(this.reception._id)
                
                    this.lotService.ajouterMultipleLots(lots).subscribe(res => {
                      if (res.success) {
                        let mouvements = this.getMouvementMatiere(res.obj);
                      let mouvemonetfinal = mouvements.filter(el => el.is_comfirmed==true)
                     console.log("mouvemonetfinal",mouvemonetfinal , mouvements)
                        this.mouvementService.ajouterMultipleMouvement(mouvemonetfinal).subscribe(res => {
                          if (res.success) {
                            //get stocks
                            let stocks = this.getStockMatiere();
                            this.matiereService.updateQuantiteReception(this.parsIds(this.reception.products), stocks).subscribe(res => {
                              if (res.success) {
                                this.snackBar.openFromComponent(SnackbarComponent, {
                                  data: {
                                    type: 'alert-success',
                                    text: "Bon de reception ajouté avec succées, stock mis a jour"
                                  },
                                  duration: 3000
                                });
                                this.router.navigate([this.category+'/receptions'])
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
                })

              } else {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-danger',
                    text: res1.msg
                  },
                  duration: 3000
                });
              }
            })
          } else {
            this.close()
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-warning',
                text: "Code de lot déjà existant"
              },
              duration: 3000
            });
          }
        } else {
          this.close()
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-warning',
              text: "Lot: " + res.msg
            },
            duration: 3000
          });
        }
      })
    } else {
      this.statutValue = false;
    }
  }


  printWindow() {
    window.print();
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
          quantite_originale: lot.quantite ,
          is_comfirmed : lot.is_comfirmed ,
          is_deranger:lot.is_deranger
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
    let mouvement = {
      num: "",
      id_lot: lot_id,
      quantite: lot.quantite,
      id_produit: matiere._id,
      type_produit: matiere.categorie,
      code_brbl: lot.reception,
      is_comfirmed : lot.is_comfirmed ,
      entree: true,
      prix_ref: matiere.prix_achat,
      prix_cmp: (matiere.prix_cmp * matiere.stock) + (matiere.prix_achat * matiere.livred_quantite) / (matiere.stock + matiere.livred_quantite),
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
      stocks.push({
        matiere_id: mat._id,
        quantite: mat.livred_quantite,
        prix_achat: (mat.prix_cmp * mat.stock) + (mat.prix_achat * mat.livred_quantite) / (mat.stock + mat.livred_quantite)
      })
    }
    return stocks;
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

  voirImage(src) {
    this.justificatif = src;
    this.open(this.docModal);
  }
  addReceptionFile(imageInputPic: any, elementId) {
    this.isUploading = true;
    this.isUploadingMsg = "Image is uploading"
    const file: File = imageInputPic.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.previewURL = reader.result;
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.generalService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          if (res.success) {
            this.justificatif = res.name;
            this.open(this.docModal);
            this.receptionService.ajouterJustificatifReception(res.name, elementId).subscribe(res => {
              if (res.success) {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'Justificatif ajouté avec succées'
                  },
                  duration: 3000
                });

              } else {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type: 'alert-success',
                    text: 'Probléme ajout de justificatif'
                  },
                  duration: 3000
                });
              }
            })


          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-danger',
                text: 'Problem uploading image'
              },
              duration: 3000
            });
          }
        },
        (err) => {

        })
    });
    if (imageInputPic.files[0]) {
      reader.readAsDataURL(imageInputPic.files[0]);
    }
  }
  facturerbonreception(element) {
    let items = [{ id: element._id }]
    this.router.navigate([this.category+'/commandesap/add-facture'], { queryParams: { items: JSON.stringify(items) } });
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
  getLotCodes() {
    let codes = "";
    for (let i = 0; i < this.matieres.length; i++) {
      for (let lot of this.matieres[i].lots) {
        codes += "" + lot.code + ","
      }
    }
    codes = codes.substring(0, codes.length - 1);
    return codes;
  }

testprintpdf () {
let doc ;
   
doc = document.getElementById('bon').innerHTML

document.body.innerHTML = doc;
let win = window.open();
self.focus();
win.document.open();
win.document.write('<'+'html'+'><'+'body'+'>');
win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
win.document.write('<h1 style="text-align:center">'+'Entreprise hayat bon de reception'+'<h1>');
win.document.write(doc);
win.document.write('<'+'/body'+'><'+'/html'+'>');
setTimeout(() => {
  win.print()
 }, 1000);


}
}