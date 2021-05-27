import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

import { ClientService } from 'src/app/services/client/client.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { CommandsorService } from 'src/app/services/commandsor/commandsor.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { DemandeService } from 'src/app/services/demande/demande.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commandessor',
  templateUrl: './commandessor.component.html',
  styleUrls: ['./commandessor.component.scss'],
 
})
export class CommandessorComponent implements OnInit {
  /**
   * name,
   * enCours,confirmed,canceled,date_liv,prix_ht,tva,creatorId,fournisseur
   * ,demande,recu,bonreception,active
    matieres,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
   */

  public focus;
  displayedColumns: string[] = ['num', 'responsable', 'createdAt', 'action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  
  selectedValue: string;
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  commandes: any;
  commande: any;
  fournisseurs: any;
  elem: any;
  deleteCommande: any;
  commandesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  isAll: boolean = true;
  isConfirmed: boolean = false;
  isAttente: boolean = false;
  isCanceled: boolean = false;
  demands: any;
  category : any;
  query :any = {};
  BOexpanded:boolean=false;
  constructor(private fournisseurService: FournisseurService, private modalService: NgbModal,
    private commandeService: CommandsorService, private snackBar: MatSnackBar,
    private generalService: GeneralService, private demandService: DemandeService,
    private activatedRoute : ActivatedRoute,
     private router:Router) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

      }

  ngOnInit(): void {
    this.query.categorie = this.category;
    this.init(this.query);
   
  }

  init(query : any = ""){
    this.generalService.getCount('commandesor',this.query).subscribe(res => {
      this.commandesLength = res;
    }, err => {
    })
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'commandesor', query);
    this.demandService.getDemandes().subscribe(res => {
      if (res.success) {
        this.demands = res.obj;
      } else {

      }
    })
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value, 'commandesor', this.category)
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
 
  confirmCommand() {
    let commande = this.elem;
    commande.statut="Confirmed"
    this.commandeService.changeStatut(commande, commande._id).subscribe(res => {
      
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: "Prélèvement confirmée"
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
          query={statut:"Confirmed"}
        break;
        case 2:
          query={statut:"attente"}
        break;
        case 3:
          query={statut:"Canceled"}
        break;
    }
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'commandesor',query);
  }
 

  

}
