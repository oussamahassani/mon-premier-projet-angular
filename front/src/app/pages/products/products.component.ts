import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ActivatedRoute } from '@angular/router';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';
import { GeneralDataSource } from 'src/app/services/general';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {


  public focus;
  displayedColumns: string[] = ['image', 'code', 'name','ttc', 'prix','tva', 'stock', 'createdAt', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  products: any;
  product: any;
  deleteProduct: any;
  prodQte: any;
  productsLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  constructor(private modalService: NgbModal,
    private productService: ProductService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,private generalService:GeneralService) {

  }

  ngOnInit() {
    this.productService.getProductsNumber().subscribe(res => {
      this.productsLength = res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'product');
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductsPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductsPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadProductsPage())
      )
      .subscribe();
  }
  loadProductsPage() {
    if (this.sort.active) {
      let x = this.activeSortHeader.filter(x => x === this.sort.active);
      if (!x || x.length == 0) {
        this.activeSortHeader.push(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader.push(1)
        } else {
          this.valueSortHeader.push(-1);
        }
      }else{
        let index=this.activeSortHeader.indexOf(this.sort.active);
        if(this.sort.direction === "asc")
        {
          this.valueSortHeader[index]=1;
        }else{
          this.valueSortHeader[index]=-1;
        }
        
      }
    }
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'product')
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
  deleteProduit()
  {
    this.productService.deleteProduct(this.deleteProduct._id,false).subscribe(res=>{
      if(res.success)
      {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'product');
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Product has been deleted'},
          duration: 3000
        });
        
      }else{
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Problem deleting product'},
          duration: 3000
        });
      }
    })
  }


}
