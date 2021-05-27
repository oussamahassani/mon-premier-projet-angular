import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

import { CommandsorService } from 'src/app/services/commandsor/commandsor.service';

@Component({
  selector: 'app-consulter-commandesor',
  templateUrl: './consulter-commandesor.component.html',
  styleUrls: ['./consulter-commandesor.component.scss']
})
export class ConsulterCommandesorComponent implements OnInit {
  //commandessor/consulter-commandesor
  id;
  command: any;
  user: any;
  matieres: any;
  constructor(private commandsorService: CommandsorService,
    private activatedRoute: ActivatedRoute,
    private matiereService: MatiereService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.commandsorService.getCommandeById(this.id).subscribe(res => {
        this.command = res;
        this.matiereService.getMatiereByIds(this.parsIds(this.command.products)).subscribe(res => {
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
                asked_quantite: this.getAsked(item._id),
              }
            });
          }
        });
          
            this.user = this.command.creatorId;
          
          
        
      })
    })

  }


  getAsked(id) {
    return this.command.products.filter(x => x.id_produit === id)[0].asked_quantite
  }
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
  printWindow() {
    let doc ;
   
doc = document.getElementById('bon').innerHTML

document.body.innerHTML = doc;
let win = window.open();
self.focus();
win.document.open();
win.document.write('<'+'html'+'><'+'body'+'>');
win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">');
win.document.write('</head><body style="font-size: 12px; max-width: 800px">');
win.document.write('<h1 style="text-align:center">'+'Entreprise hayat bon de prélèvement'+'<h1>');
win.document.write(doc);
win.document.write('<'+'/body'+'><'+'/html'+'>');
setTimeout(() => {
  win.print()
 }, 1000);

  }
}
