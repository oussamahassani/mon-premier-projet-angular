import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralDataSource } from 'src/app/services/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { TypeMatService } from 'src/app/services/typemat/typemat.service';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';

@Component({
  selector: 'app-typeMat',
  templateUrl: './typemat.component.html',
  styleUrls: ['./typemat.component.scss']
})
export class TypeMatComponent implements OnInit {


  public focus;
  //name,mat_fis,tel,adresse,num_tva,email,zone,active,commands_no,chiffre_affaire,createdAt
  displayedColumns: string[] = ['name','statut','action'];
  dataSource: GeneralDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  closeResult: string;
  baseUrlImage = environment.baseUrlImage;
  error: string;
  typeMats: any;
  typeMat: any;
  deleteTypeMat: any;
  typeMatsLength: Number = 0;
  activeSortHeader = [];
  valueSortHeader = [];
  commands:any=[];
  fourCommandName="";
  isCommand:boolean=false;
  category: string;
  query : any = {};
  
  constructor(private modalService: NgbModal,
    private typeMatService: TypeMatService, private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,private generalService:GeneralService,
    private commandapService:CommandapproService,
    private router:Router
    ) {
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];


  }

  ngOnInit() {
    this.query.category = this.category;
    this.init(this.query);
  }

  init(query : any = ""){
    this.generalService.getCount('typeMat',query).subscribe(res => {
      this.typeMatsLength = res;
    });
    this.dataSource = new GeneralDataSource(this.generalService);
    this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'typeMat',query);
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadTypeMatsPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTypeMatsPage())
      )
      .subscribe();
    this.paginator.page
      .pipe(
        tap(() => this.loadTypeMatsPage())
      )
      .subscribe();
  }
  loadTypeMatsPage() {
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
    this.dataSource.loadItems(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, this.activeSortHeader, this.valueSortHeader, this.input.nativeElement.value,'typeMat',this.query);
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
  deletetypeMats()
  {
    this.typeMatService.deleteTypemat(this.deleteTypeMat._id,false).subscribe(res=>{
      if(res.success)
      {
        this.paginator.pageIndex = 0;
        this.dataSource.loadItems(0, 5, this.activeSortHeader, this.valueSortHeader, "",'typeMat',this.query);
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:'Typet a été désactivé'},
          duration: 3000
        });
        
      }else{
        this.close();
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-danger',
            text:'Probléme de suppression'},
          duration: 3000
        });
      }
    })
  }

  displayTypeMat(elem)
  {
    this.fourCommandName=elem.name;
    this.isCommand=true;
    if(elem.commands && elem.commands.length>0)
    {
      this.commandapService.getCommandByIds(this.parsIds(elem.commands)).subscribe(res=>{
        if(res.success)
        {
             this.commands=res.obj;
        }else{
  
        }
      })
    }else{
      this.commands=[];
    }    
  }
  
  parsIds(items) {
    let ids = "";
    for (let i = 0; i < items.length; i++) {
      ids += "" + items[i].id + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  }
}

