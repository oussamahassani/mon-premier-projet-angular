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
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import { DemandeService } from 'src/app/services/demande/demande.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {saveAs} from 'file-saver';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-commandesappro',
  templateUrl: './commandesappro.component.html',
  styleUrls: ['./commandesappro.component.scss']
})
export class CommandesapproComponent implements OnInit {
  /**
   * name,
   * enCours,confirmed,canceled,date_liv,prix_ht,tva,creatorId,fournisseur
   * ,demande,recu,bonreception,active
    matieres,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
   */

  public focus;
  exporting = false;
  displayedColumns: string[] = ['num', 'fournisseur', 'total_ht', 'demandeur', 'responsable', 'createdAt', 'statut', 'action'];
  dataSource: GeneralDataSource;
  datasour : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  isLoading:boolean=true;
  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  commandes: any;
  commande: any;
  elem: any;
  deleteCommande: any;
  commandesLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  isAll: boolean = true;
  isConfirmed: boolean = false;
  isAttente: boolean = false;
  isCanceled: boolean = false;
  typeNumber = 0;
  demands: any;
  category : any;
  file="";
  query : any = {};
  exportedFile=false;
  selectedValue: any = '0';
  valeurtypedemande : any = "stock"
  constructor(private modalService: NgbModal,
    private commandeService: CommandapproService, private snackBar: MatSnackBar,
    private generalService: GeneralService, private demandService: DemandeService,
    private activatedRoute : ActivatedRoute,
     private userService: UserService,
     private router:Router) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];

      }

  ngOnInit(): void {
    this.query.categorie = this.category;
    this.init(this.query);
  }

  init(query : any = ""){
    // this.generalService.getCount('commandeap',query).subscribe(res => {
    //   this.commandesLength = res;
    // }, err => {
    // })
    this.commandeService.getCommands().subscribe(res => { console.log(res)
      this.isLoading = false;
    this.datasour =   new MatTableDataSource(res.obj.filter(el => el.categorie !=='services'))
    this.datasour.paginator = this.paginator;
    this.datasour.sort = this.sort;
  })
    
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
  deleteCommands() {
    this.commandeService.deleteCommande(this.deleteCommande._id, true).subscribe(res => {
      if (res.success) {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'commandeap', this.query);
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: 'Command has been deleted'
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

  filterResponsable(demand) {
    if(demand.confirmedBy)
      return demand.confirmedBy.fname + " " + demand.confirmedBy.lname;
      else 
        return 'En cours.'
  }
  filterDemandeur(demand) {
    if(demand.creatorId)
      return demand.creatorId.fname + " " + demand.creatorId.lname;
      else 
        return 'En cours.'
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
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "", 'commandeap', this.query);
  }


  navigateBon(id) {
    this.close();
    this.router.navigate(['/receptions/add-bon'], { queryParams: { id: id } });
  }


  exporter(type)
  {
    this.exporting = true;
    this.commandeService.exporter(type).subscribe(res=>{
      if(res)
      {
        saveAs(res,'liste_des_commandes.xlsx')
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Fichier crée avec succées, votre téléchargement commencera dans un instant'},
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
    this.commandeService.getCommands().subscribe(res => {
      let stock = res.obj.filter(el => el.categorie =='services')
     this.datasour = new MatTableDataSource(stock)
    })
  }
    else{
    this.valeurtypedemande="stock"
    this.commandeService.getCommands().subscribe(res => {
      let stock = res.obj.filter(el => el.categorie !=='services')
     this.datasour = new MatTableDataSource(stock)
    })
    }
  }
}
