import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandapproService } from 'src/app/services/commandappro/commandappro.service';
import {Prestatairedeservice} from 'src/app/services/prestatairedeservice/prestatireservice.service'
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-commande-aproservice',
  templateUrl: './commande-aproservice.component.html',
  styleUrls: ['./commande-aproservice.component.scss']
})
export class CommandeAproserviceComponent implements OnInit {
  command: any;
  closeResult: string;
  category: string;
  services :any;
  
  constructor(
    private commandsapService: CommandapproService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private router:Router,
    private prestatairedeservice :Prestatairedeservice
  ) { }

  ngOnInit(): void {
  
  this.activatedRoute.queryParams.subscribe(params => {
    this.commandsapService.getCommandeById(params["id"]).subscribe(res => {
      this.command = res;
      this.prestatairedeservice.geservicesByIds(this.parsIds(this.command.products)).subscribe(res => {
        if (res.success) {
          this.services = res.obj;
        } 
      })
    })
  })
}

// getAskedprix(id)
// {
//  return this.command.products.filter(x=>x.id_produit===id)[0].prix_ht;
// }

parsIds(items) {
  let ids = "";
  for (let i = 0; i < items.length; i++) {
    ids += "" + items[i].id_produit + ","
  }
  ids = ids.substring(0, ids.length - 1);
  return ids;
}
confirmCommand() {
  this.command.statut="Confirmed"
  this.commandsapService.changeStatut(this.command, this.command._id).subscribe(res => {
    if (res.success) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type: 'alert-success',
          text: "Commande confirmée avec succées"
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
rejectCommand()
{
  this.command.statut="Canceled";
  this.commandsapService.changeStatut(this.command, this.command._id).subscribe(res => {
    if (res.success) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          type: 'alert-success',
          text: "Commande rejetée avec succées"
        },
        duration: 3000
      });
      this.router.navigate(['mp/commandesap'])
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
