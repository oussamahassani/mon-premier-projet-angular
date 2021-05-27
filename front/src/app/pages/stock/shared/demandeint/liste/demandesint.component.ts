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
import { DemandeintService } from 'src/app/services/demandeint/demandeint.service';
import { Router , ActivatedRoute  } from '@angular/router';
@Component({
  selector: 'app-demandesint',
  templateUrl: './demandesint.component.html',
  styleUrls: ['./demandesint.component.scss']
})
export class DemandesintComponent implements OnInit {

  /**
 num,done,confirmed,canceled,enAttente,demande,creatorId,note,date_maximale,
     matieres: [{
         matiere_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
         asked_quantite: { type: Number, required: true }
     }],
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now }
  */

  public focus;
  displayedColumns: string[] = ['num', 'creatorId','confirmedBy', 'createdAt', 'statut', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  query:any={};
  selectedValue: any = '0';
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  demandes: any;
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
  typeNumber=0;
  category: string;
  constructor(private userService: UserService, private modalService: NgbModal,
    private demandeService: DemandeintService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,private router:Router) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
     }

  ngOnInit(): void {
    this.query.categorie = this.category;
    this.init(this.query);

  }
  init(query: any = ''){
    this.generalService.getCount('demandeint',this.query).subscribe(res => {
      this.demandesLength = res;
    }, err => {
    })
  
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'demandeint',query);
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value, 'demandeint',this.query)
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
 



  getType(n) {
    switch(n)
    {
        case 1:
          this.query.statut="Confirmed";
        break;
        case 2:
          this.query.statut="attente";
        break;
        case 3:
          this.query.statut="Canceled";
        break;
    }
     this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'demandeint',this.query);
  }


  deleteDemandes() {
    this.demandeService.deleteDemande(this.deleteDemande._id, true).subscribe(res => {
      if (res.success) {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'demandeint',this.query);
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
}
