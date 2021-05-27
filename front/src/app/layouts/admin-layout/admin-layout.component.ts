import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as io from 'socket.io-client'
import { environment } from '../../../environments/environment'
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  socket = io.connect(environment.baseUrlImage);
items=[];
@ViewChild('alertModal') alertModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private generalService:GeneralService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getStockAlert();
    this.socket.on('stockmin', function(message) {
       this.getStockAlert();
      }.bind(this));
  }


  collapseSide(){
    let sidebar = document.getElementById('sidenav-main');
    let mainContent = document.getElementById('main-content');
    let navToggle = document.getElementById('navToggle');
    let icon = document.getElementById('arrowIcon');
    if(navToggle.classList.contains('navToggle')){
    icon.classList.replace('fa-chevron-left','fa-chevron-right');
    navToggle.classList.replace('navToggle','leftSide');
    mainContent.classList.add('open');
    sidebar.classList.add('collapse');
    icon.style.marginLeft ="10px";
    sidebar.setAttribute('opacity','0');
    }else{
      icon.classList.replace('fa-chevron-right','fa-chevron-left');
      navToggle.classList.replace('leftSide','navToggle');
      mainContent.classList.remove('open');
      sidebar.classList.remove('collapse');
      icon.style.marginLeft ="0px";
      sidebar.setAttribute('opacity','1');
    }
  }

  getStockAlert(){
    this.generalService.getAlertStockMP().subscribe(res => {
      if(res.obj.length){
        res.obj[0].mat_ids.forEach((element, index) => {
          this.items[index] = {id : element} ;          
        });
        this.open()
      }
      
    }, err => {
      console.log(err);
    })

  }

  open() {
    this.modalService.open(this.alertModal, { ariaLabelledBy: 'modal-basic-title' })
  }
  close() {
    this.modalService.dismissAll();
  }


  grouperDemande() {  
    this.close();
    this.router.navigate(['/demandes/add-demande'], { queryParams: { items: JSON.stringify(this.items) } });
  } 

}
