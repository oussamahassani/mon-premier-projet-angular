import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventaireService } from 'src/app/services/inventaire/inventaire.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { UserService } from 'src/app/services/user/user.service';
import { LotService } from 'src/app/services/lot/lot.service';
@Component({
  selector: 'app-consulter-inventaire',
  templateUrl: './consulter-inventaire.component.html',
  styleUrls: ['./consulter-inventaire.component.scss']
})
export class ConsulterInventaireComponent implements OnInit {

 
  id;
  inventaire:any;
  user: any;
  lots:any;
  matieres: any = [];
  name = "00000";
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private inventaireService:InventaireService,
    private matiereService:MatiereService,
    private lotService:LotService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.inventaireService.getinventaireById(this.id).subscribe(res=>{
        this.inventaire=res;
        this.userService.getUserById(this.inventaire.creatorId).subscribe(res=>{
          this.user=res;
        })
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
                    stock_reel: item.stock_reel,
                    categorie: item.categorie,
                    prix_achat: item.prix_achat,
                    lots:this.getLotsFromInventaire(item._id),
                    lots_nbr: this.getLotsFromInventaire(item._id).length
                  }
  
                })
              } else {
  
              }
            })
  
          } else {
  
          }
        })
       
        
      })

     
    })
  }



 




  getLotsFromInventaire(mat_id)
  {
    for(let prod of this.inventaire.products)
    {
       if(prod.id_produit===mat_id)
       {
         return prod.lots.map(item=>{
           return {
             id_lot:item.id_lot,
             stock_reel:item.stock_reel,
             stock_theorique:item.stock_theorique,
             ht_unitaire:this.lots.filter(x=>x._id===item.id_lot)[0].ht_unitaire
           }
         })
       }
    }
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].matiere_id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

  printWindow()
  {
    window.print(); 
  }
  calculCMP(element) {
    let total = 0;
    if (element.lots && element.lots.length > 0) {
      for (let i = 0; i < element.lots.length; i++) {
        total =total+ element.lots[i].stock_reel * element.lots[i].ht_unitaire
      }
      return total / element.lots.length;
    } else {
        return element.prix_achat
    }
    
  }

  parsMatiereIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }

}
