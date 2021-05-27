import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ClientService } from 'src/app/services/client/client.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { InventaireService } from 'src/app/services/inventaire/inventaire.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-inventaires',
  templateUrl: './inventaires.component.html',
  styleUrls: ['./inventaires.component.scss']
})
export class InventairesComponent implements OnInit {

  public focus;
  /**num,resultat,perte_total,bonus_total,creatorId,note,date_inventaire,matieres */
  displayedColumns: string[] = ['num', 'total', 'creatorId', 'createdAt', 'resultat', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  category : any ;
  query : any = {};
  closeResult: string;
  error: string;
  inventaires: any;
  inventaire: any;
  users: any;
  elem: any;
  deleteInventaire: any;
  inventairesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  constructor(private userService: UserService, private modalService: NgbModal,
    private inventaireService: InventaireService, private snackBar: MatSnackBar,
    private activatedRoute : ActivatedRoute,
    private generalService: GeneralService) { 
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

    }

  ngOnInit(): void {
    this.query.categorie = this.category;
    this.init(this.query)
  }

  init(query : any = ""){
    this.generalService.getCount('inventaire',this.query).subscribe(res => {
      this.inventairesLength = res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'inventaire',query);
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
      } else {
        let index = this.activeSortHeader.indexOf(this.sort.active);
        if (this.sort.direction === "asc") {
          this.valueSortHeader[index] = 1;
        } else {
          this.valueSortHeader[index] = -1;
        }

      }
    }
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value, 'inventaire',this.query);
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


}
