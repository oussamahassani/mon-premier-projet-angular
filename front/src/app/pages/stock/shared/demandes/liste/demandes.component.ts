import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { UserService } from 'src/app/services/user/user.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { Router, ActivatedRoute } from '@angular/router';
import {saveAs} from 'file-saver';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {

  valeurtypedemande : string ='stock'
  exporting = false;
  datasour : any
  public focus;
  displayedColumns: string[] = ['num', 'creatorId', 'createdAt', 'statut', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  query:any={};
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  demandes: any;
  loading:any=false;
  demande: any;
  users: any;
  elem: any;
  deleteDemande: any;
  demandesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  isAll: boolean = true;
  isConfirmed: boolean = false;
  isAttente: boolean = false;
  isCanceled: boolean = false;
  selectedValue: any ='0';
  category: string;
  constructor(private userService: UserService, private modalService: NgbModal,
    private demandeService: DemandeService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,private router:Router) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {
    this.query.categorie = this.category;
   // this.init(this.query);
   this.loading=true
   this.demandeService.getDemandes().subscribe(res => {
     console.log(res.obj)
     let stock = res.obj.filter(el => el.typedemande =='stock')
    this.datasour = new MatTableDataSource(stock)
    this.datasour.sort = this.sort;
    this.datasour.paginator = this.paginator;
    this.loading=false
    })

  }
  init(query: any = ''){
    this.generalService.getCount('demande',this.query).subscribe(res => {
      this.demandesLength = res;
    }, err => {
    })
  
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'demande',query);
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    }, (err) => {

    })
  }
  getUserName(userId) {
    if (this.users) {
      let user = this.users.filter(x => x._id === userId)[0];
      return user.fname + " " + user.lname;
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
          this.loadDemandesPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDemandesPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadDemandesPage())
      )
      .subscribe();
  }
  loadDemandesPage() {
    if (this.sort.active) {
      let x = this.activeSortHeader.filter(x => x === this.sort.active);
      if (!x || x.length == 0) {
        this.activeSortHeader.push(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader.push(1)
        } else {
          this.valueSortHeader.push(-1);
        }
      } else {
        let index = this.activeSortHeader.indexOf(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader[index] = 1;
        } else {
          this.valueSortHeader[index] = -1;
        }

      }
    }
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value, 'demande',this.query);
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
  deleteDemandes() {
    this.demandeService.deleteDemande(this.deleteDemande._id, true).subscribe(res => {
      if (res.success) {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'demande',this.query);
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'demande has been deleted'
          },
          duration: 3000
        });

      } else {
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: res.msg
          },
          duration: 3000
        });
      }
    })
  }

  confirmDemande() {
    let demande = this.elem;
    demande.confirmed = true;
    demande.enAttente = false;
    demande.canceled = false;
    demande.done = false;
    this.demandeService.changeStatut(demande, demande._id).subscribe(res => {
      if (res.success) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: "demande has been confirmed"
          },
          duration: 3000
        });
      } else {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: res.msg
          },
          duration: 3000
        });
      }
    })
  }

  getType(n) {
    let query:any={};
    switch(n)
    {
      case 0:
        query={};
        break;
        case 1:
          this.query.statut= "Confirmed"
        break;
        case 2:
          this.query.statut= "attente"
        break;
        case 3:
          this.query.statut= "Canceled"
        break;
    }
     this.init(this.query);
  }

  navigateBon(id)
  {
    this.close();
    this.router.navigate([this.category+'/commandesap/add-commandeap'], { queryParams: { id: id } });
  }

  exporter(type)
  {
    this.exporting = true;
    this.demandeService.exporter(type).subscribe(res=>{
      if(res)
      {
        saveAs(res,'liste_des_demandes.xlsx')
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Fichier crée avec succée, votre téléchargement commencera dans un instant'},
          duration: 3000
        });
        
      }else{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Probléme de création'},
          duration: 3000
        });
      }
      this.exporting = false;
      this.close();
    }, err => {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type:'alert-danger',
          text:'Probléme de création'},
        duration: 3000
      });
      this.exporting = false;
      this.close();
    });
  }

  toggledtype(){
    if(this.valeurtypedemande=="stock"){
    this.valeurtypedemande="service"
    this.demandeService.getDemandes().subscribe(res => {
      console.log(res.obj)
      let stock = res.obj.filter(el => el.typedemande =='services')
     this.datasour = new MatTableDataSource(stock)
    })
  }
    else{
    this.valeurtypedemande="stock"
    this.demandeService.getDemandes().subscribe(res => {
      console.log(res.obj)
      let stock = res.obj.filter(el => el.typedemande =='stock')
     this.datasour = new MatTableDataSource(stock)
    })
    }
  }
}
