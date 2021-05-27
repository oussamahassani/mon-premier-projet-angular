import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ClientService } from 'src/app/services/client/client.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {

  public focus;
  //username,fname,lname,email,adress,image,gender,tel,active,zone,salaire,permissions,createdAt,updatedAt
  displayedColumns: string[] = ['name','client','date_liv','ttc','prix_ht','tva','createdAt','enCours', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  commandes: any;
  commande: any;
  clients:any;
  elem:any;
  deleteCommande: any;
  commandesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  constructor(private clientService:ClientService,private modalService: NgbModal,
    private commandeService: CommandeService, private snackBar: MatSnackBar,
    private generalService:GeneralService) { }

  ngOnInit(): void {
    this.generalService.getCount('commande').subscribe(res=>{
      this.commandesLength=res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'commande');
    this.clientService.getClients().subscribe(res=>{
      if(res.success)
      {
        this.clients=res.obj;
      }else{

      }
    })
  }

  getClientName(clientId)
  {
    if(this.clients)
    {
     return this.clients.filter(x=>x._id===clientId)[0].name;
    }
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadCommandesPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadCommandesPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadCommandesPage())
      )
      .subscribe();
  }
  loadCommandesPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'commande')
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
  deleteCommands()
  {
    this.commandeService.deleteCommande(this.deleteCommande._id,true).subscribe(res=>{
      if(res.success)
      {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'commande');
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Command has been deleted'},
          duration: 3000
        });
        
      }else{
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:res.msg},
          duration: 3000
        });
      }
    })
  }

  confirmCommand()
  {
    let commande=this.elem;
    commande.confirmed=true;
    commande.enCours=false;
    this.commandeService.changeStatut(commande,commande._id).subscribe(res=>{
      if(res.success)
      {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:"Command has been confirmed"},
          duration: 3000
        });
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



 

}
