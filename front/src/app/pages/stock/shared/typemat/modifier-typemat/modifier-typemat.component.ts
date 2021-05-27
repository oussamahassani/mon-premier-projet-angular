import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { TypeMatService } from 'src/app/services/typemat/typemat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modifier-typemat',
  templateUrl: './modifier-typemat.component.html',
  styleUrls: ['./modifier-typemat.component.scss']
})
export class ModifierTypematComponent implements OnInit {
  
  closeResult: string;
  id = '';
  formTypemat: FormGroup;
  submitTypemat: boolean = false;  
  typeMatiere = new FormControl();
  constructor(
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private typematService: TypeMatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
    ){
    this.formTypemat = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      if(!this.id)
        this.router.navigate(['mp/famille']);
      this.typematService.getTypeById(this.id).subscribe(res => {
        if(res.name){
        this.formTypemat.patchValue({
          name: res.name
        });
      } else{
        
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Famille introuvable'
          },
          duration: 3000
        });
        this.router.navigate(['mp/famille']);
      }
        
      }, err => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Probléme de récuperation de la famille'
          },
          duration: 3000
        });
        this.router.navigate(['mp/famille']);
      })
    })

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  close() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    this.formTypemat.markAllAsTouched();
    this.submitTypemat = true;
    if (this.formTypemat.valid) {
        this.typematService.updateTypemat(this.formTypemat.value,this.id).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Type modifié avec succées'
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
          this.submitTypemat = false;
        })
    } 
    this.close();

  }

}
