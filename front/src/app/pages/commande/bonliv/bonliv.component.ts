import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ProductService } from 'src/app/services/product/product.service';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-bonliv',
  templateUrl: './bonliv.component.html',
  styleUrls: ['./bonliv.component.scss']
})
export class BonlivComponent implements OnInit {

  id;
  command: any;
  client:any;
  now=new Date();
  products=[];
  frais=0;
  name="00000";
  note="Ex...";
  statut=false;
  constructor(private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private commandService: CommandeService,
    private productService:ProductService,
    private livraisonService:LivraisonService,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private router:Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.commandService.getCommandeById(this.id).subscribe(res => {
        this.command = res;
        this.getProducts();
        this.clientService.getClientById(this.command.client).subscribe(res => {
           this.client=res;
        }, err => {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-danger',
              text:'Probléme de récuperation du client'},
            duration: 3000
          });
        })
        this.livraisonService.getLivraisonNewName().subscribe(res=>{
          if(res.success)
          {
           this.name=res.obj;
          }else{
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:res.msg},
              duration: 3000
            });
          }
        })

      }, err => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Problem de récuperation de la commande'},
          duration: 3000
        });
      })
    })
  }

  getProducts()
  {
    for(let i=0;i<this.command.products.length;i++)
    {
       this.productService.getProductById(this.command.products[i].product_id).subscribe(res=>{
          this.products.push({
            quantite:this.command.products[i].quantite,
            item:res
          });
       },(err)=>{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:"Probléme de récuperation des produits"},
          duration: 3000
        });
       })
    }
  }

  changerStatut(event)
  {
    if(event.target.value==="expediee")
    {
      this.statut=true;
    }else{
      this.statut=false;
    }
  }
  submitLivraison()
  {
  
      let livraison={
         num:this.name,
         delievered:this.statut,
         enAttente:!this.statut,
         products_no:this.products.length,
         total:this.command.prix_ht+this.command.tva+this.frais,
         command:this.command._id,
         client:this.command.client,
         creatorId:this.authService.getIdfromToken(),
         note:this.note,
         frais:this.frais,
         date_livraison:this.now,
         tva:this.command.tva
      }
      this.livraisonService.ajouterLivraison(livraison).subscribe(res=>{
          if(res.success)
          {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'La livraison a été ajoutée'},
              duration: 3000
            });
            this.commandService.livrerCommande(this.command._id,res.obj).subscribe(res=>{
              if(res.success)
              {
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type:'alert-success',
                    text:"Commande mise a jour"},
                  duration: 3000
                });
                this.router.navigate(['/livraison'])
              }else{
                this.snackBar.openFromComponent(SnackbarComponent, {
                  data: {
                    type:'alert-danger',
                    text:res.msg},
                  duration: 3000
                });
              }
            })
          }else{
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:res.msg},
              duration: 3000
            });
          }
      })
  
  }

  printWindow()
  {
    window.print(); 
  }

}
