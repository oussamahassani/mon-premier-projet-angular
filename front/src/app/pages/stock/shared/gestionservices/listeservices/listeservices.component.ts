import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-listeservices',
  templateUrl: './listeservices.component.html',
  styleUrls: ['./listeservices.component.scss']
})
export class ListeservicesComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  fourfiltre:any;
  dataSource:any;
  isLoading:boolean=false;
  exporting:boolean=false;
  focus:any;
  delete_service: any;
  closeResult:any;
  displayedColumns: string[] 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedItems=[];
  seenData = [];
  type:any;
  allservice:any;
  activeFilter: any = 'all';

  constructor(private activatedRoute: ActivatedRoute,private modalService: NgbModal,private router: Router,
    private prestatairedeservice:Prestatairedeservice,private snackBar: MatSnackBar, ) { }

  ngOnInit(): void {
    this.prestatairedeservice.getService().subscribe(res => {
      console.log(res)
      this.allservice = res
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.sort=this.sort;
      this.seenData = res

      this.dataSource.paginator = this.paginator
    })
    this.activatedRoute.queryParams.subscribe(params => {
      
      if (params["type"]) {
        switch (params["type"]) {
          case "service":
            this.displayedColumns = ['ref','categorie','name','type','tel','active','action'];
            this.type="service"
            break;
        case "achat":
              this.displayedColumns = ['checked','ref','categorie','name','type','tel','active'];
              this.type="achat"
              break;
        }
      }
      
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
  exporter(type)
  {
    this.exporting = true;
    this.prestatairedeservice.exporter(type).subscribe(res=>{
      console.log("result",res)
      if(res)
      {
        saveAs(res,'liste_des_services.xlsx')
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Fichier crée avec succée'},
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

    }, err => {
       this.snackBar.openFromComponent(SnackbarComponent, {
         data: {
        type:'alert-danger',
           text:'Probléme de création'},
         duration: 3000
       });
      this.exporting = false;

    });
  }

  deleteservice(){
    this.close()
    this.prestatairedeservice.deleteservice(this.delete_service._id,{active:false}).subscribe(res => {
      if(res.success)
      {
        this.prestatairedeservice.getService().subscribe(res => {
          this.dataSource=new MatTableDataSource(res);
          this.dataSource.sort=this.sort;
          this.dataSource.paginator = this.paginator
        }
        )
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'services  suprimer avec succée'},
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

  toggleAll(event: MatCheckboxChange) { 

    if ( event.checked ) {
       this.seenData.forEach(row => {
          this.selectedItems.push(row)
          });
    } else {
       this.selectedItems.length = 0 ;
    }
    console.log(this.selectedItems)
  }
  toggle(item,event: MatCheckboxChange) {
    if (event.checked) {
     this.selectedItems.push(item);
   } else {
     const index = this.selectedItems.indexOf(item);
     if (index >= 0) {
       this.selectedItems.splice(index, 1);
     }
   }
 }
   exists(item) {
     return this.selectedItems.indexOf(item) > -1;
   };
  
   isIndeterminate() {
     return (this.selectedItems.length > 0 && !this.isChecked());
   };
  
   isChecked() {
     return this.selectedItems.length === this.seenData.length && this.seenData.length > 0;
   };
   checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
    
  grouperDemande() {
    let items = this.selectedItems.map(item => {
      return {
        id: item._id
      }
    })
    this.router.navigate(['/mp/demandes/add-demandeservice'], { queryParams: { items: JSON.stringify(items) } });  }


    rechrche(event){
      const val = event.target.value;
      this.dataSource =   new MatTableDataSource(this.allservice.filter(el => el.total.toString().includes(val) ||el.tva.toString().includes(val)
       || el.num.includes(val) || el.name.includes(val)))
    }
    filtre() {
      console.log( this.activeFilter , this.allservice)
    if (this.activeFilter === 'all')
      this.dataSource=new MatTableDataSource(this.allservice);
  else if (this.activeFilter === 'true') {
    let filter = this.allservice.filter(el => el.active==true)
    this.dataSource=new MatTableDataSource(filter);
  } else   {
    let filter = this.allservice.filter(el => el.active==false)
    this.dataSource=new MatTableDataSource(filter);
  } 
}
}
