import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ClientService} from '../../services/client/client.service'
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/services/product/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {


  public focus;
  //name,mat_fis,tel,adresse,num_tva,email,zone,active,commands_no,chiffre_affaire,createdAt
  displayedColumns: string[] = ['name','tel','email','zone','commands_no','createdAt', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  clients: any;
  client: any;
  deleteClient: any;
  clientsLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  
  constructor(private modalService: NgbModal,
    private clientService: ClientService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,private generalService:GeneralService) {

  }

  ngOnInit() {
    this.generalService.getCount('client').subscribe(res => {
      this.clientsLength = res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'client');
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadClientsPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadClientsPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadClientsPage())
      )
      .subscribe();
  }
  loadClientsPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'client')
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
  deleteClients()
  {
    this.clientService.deleteClient(this.deleteClient._id,false).subscribe(res=>{
      if(res.success)
      {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'client');
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Client has been deleted'},
          duration: 3000
        });
        
      }else{
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Problem deleting client'},
          duration: 3000
        });
      }
    })
  }

}
