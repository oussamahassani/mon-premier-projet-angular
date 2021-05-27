import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product/product.service';
import { debounceTime, tap, switchMap, finalize, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-commande',
  templateUrl: './ajouter-commande.component.html',
  styleUrls: ['./ajouter-commande.component.scss']
})
export class AjouterCommandeComponent implements OnInit, AfterViewInit {


  clients: any;
  selectedClient: any;
  theSelect:any;
  productTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  products: any;

  initProducts: any;
  filteredProducts: any;
  searchProductCtrl = new FormControl();
  searchCodeCtrl = new FormControl();
  product = new FormControl();
  isLoading = false;
  errorMsg: string;

  //commande
  prix_ht = 0;
  prix_ttc = 0;
  tva = 0;
  date_livraison = new FormControl(new Date());
  minDate = new Date();
  commandProducts: any = [];
  command:any;
  constructor(private clientService: ClientService,
    private fb: FormBuilder,
    private productService: ProductService,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private commandService:CommandeService,
    private router:Router) {
    this.productTable = this.fb.group({
      tableRows: this.fb.array([])
    });
  }

  ngOnInit() {
    this.touchedRows = [];
    this.addRow();
    this.initialProducts();
    this.clientService.getClients().subscribe(res => {
      if (res.success) {
        this.clients = res.obj;
      } else {

      }
    })
    this.searchProductCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredProducts = [];
        this.isLoading = true;
      }),
      switchMap(value => this.productService.searchProducts(value).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ))
    )
      .subscribe(data => {
        if (!data.success) {
          this.errorMsg = data.msg;
          this.filteredProducts = [];
        } else {
          this.errorMsg = "";
          this.filteredProducts = data.obj;
        }
      });
    this.searchCodeCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredProducts = [];
        this.isLoading = true;
      }),
      switchMap(value => this.productService.searchProductsCode(value).pipe(
        finalize(() => {
          this.isLoading = false
        })
      ))
    )
      .subscribe(data => {
        if (!data.success) {
          this.errorMsg = data.msg;
          this.filteredProducts = [];
        } else {
          this.errorMsg = "";
          this.filteredProducts = data.obj;
        }
      });




  }
  ngAfterViewInit() {
    this.control = this.productTable.get('tableRows') as FormArray;
  }
  addRow() {
    const control = this.productTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }
  deleteRow(index: number) {
    const control = this.productTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveProductDetails() {
    //add to array
    
  }
  get getFormControls() {
    const control = this.productTable.get('tableRows') as FormArray;
    return control;
  }
  submitForm() {
    const control = this.productTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);

  }
  initiateForm(): FormGroup {
    return this.fb.group({
      code: [''],
      name: [''],
      qte: [1],
      stock: new FormControl({ value: '', disabled: true }),
      prix: new FormControl({ value: '', disabled: true }),
      tva: new FormControl({ value: '', disabled: true }),
      promo: new FormControl({ value: '', disabled: true }),
      remise: [''],
      isEditable: [true]
    });
  }
  selectClient(val) {
    this.selectedClient = this.clients.filter(x => x._id === val)[0];
    this.theSelect=this.clients.filter(x => x._id === val)[0]._id;
  }
  initialProducts() {
    this.productService.getProducts().subscribe(res => {
      if (res.success) {
        this.initProducts = res.obj;
        this.filteredProducts = res.obj;
      } else {

      }
    })
  }
  selectProduct(event, i) {
    let item: any = this.product.value;
    if (this.commandProducts && this.commandProducts.length > 0) {
      this.commandProducts.push({
        product_id: item._id,
        quantite: (this.productTable.get('tableRows') as FormArray).at(i).get("qte").value,
        prix: item.prix,
        tva: item.tva,
        promo: item.promo,
        remise: item.remise,
        code:item.code
      })
      this.calcCommandPrice();
    } else {
      this.commandProducts = [];
      this.commandProducts.push({
        product_id: item._id,
        quantite: (this.productTable.get('tableRows') as FormArray).at(i).get("qte").value,
        prix: item.prix,
        tva: item.tva,
        promo: item.promo,
        remise: item.remise,
        code:item.code
      })
      this.calcCommandPrice();
    }
    (this.productTable.get('tableRows') as FormArray).at(i).patchValue({
      code: item.code,
      name: item.name,
      qte: (this.productTable.get('tableRows') as FormArray).at(i).get("qte").value,
      stock: item.stock,
      prix: item.prix,
      tva: item.tva,
      promo: item.promo,
      remise: item.remise,
      isEditable: [false]
    })
  }
  changeQuantite(i) {
    let code = (this.productTable.get('tableRows') as FormArray).at(i).get("code").value;
    if (this.commandProducts && this.commandProducts.length > 0) {
      let index = this.commandProducts.findIndex(x => x.code === code);
      if(index!=-1)
      {
      this.commandProducts[index].quantite = (this.productTable.get('tableRows') as FormArray).at(i).get("qte").value;
      this.calcCommandPrice();
      }
    }

  }
  calcCommandPrice() {
    this.prix_ht=0;
    this.tva=0;
    this.prix_ttc=0;
    if (this.commandProducts && this.commandProducts.length > 0) {
      for (let i = 0; i < this.commandProducts.length; i++) {
        this.prix_ht += (this.commandProducts[i].prix - ((this.commandProducts[i].prix * this.commandProducts[i].remise) / 100) - this.commandProducts[i].promo) * this.commandProducts[i].quantite
        this.tva += ((this.commandProducts[i].prix * this.commandProducts[i].tva) / 100) * this.commandProducts[i].quantite;
        this.prix_ttc += (this.commandProducts[i].prix + ((this.commandProducts[i].prix * this.commandProducts[i].tva) / 100) - ((this.commandProducts[i].prix * this.commandProducts[i].remise) / 100) - this.commandProducts[i].promo) * this.commandProducts[i].quantite;
      }
    } else {
      this.prix_ht = 0;
      this.prix_ttc = 0;
      this.tva = 0;
    }
  }

  submitCommand()
  {
    if(this.selectedClient)
    {
    this.command={
       canceled:false,
       confirmed:false,
       enCours:true,
       date_liv:this.date_livraison.value,
       liv:false,
       prix_ht:this.prix_ht,
       tva:this.tva,
       products:[],
       creatorId:this.authService.getIdfromToken(),
       client:this.selectedClient._id
    }
    this.command.products=this.commandProducts.map(obj=>{
      return {
        product_id:obj.product_id,
        quantite:obj.quantite
      };
    })
    if(this.command.products && this.command.products.length>0)
    {
      this.commandService.ajouterCommande(this.command).subscribe(res=>{
        if(res.success)
        {
          this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type:'alert-success',
              text:'Command has been added'},
            duration: 3000
          });
          this.router.navigate(['/commandes'])
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
          type:'alert-warning',
          text:"Le nombre de produit doit être supérieur a 0"},
        duration: 3000
      });
    }
  }
    

  }


}
