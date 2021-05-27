import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { TypeMatService } from 'src/app/services/typemat/typemat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajouter-typemat',
  templateUrl: './ajouter-typemat.component.html',
  styleUrls: ['./ajouter-typemat.component.scss']
})
export class AjouterTypematComponent implements OnInit {

 
  formTypemat: FormGroup;
  submitTypemat: boolean = false;  
  typeMatiere = new FormControl();
  category: string;
  constructor(private _formBuilder: FormBuilder,
    private typematService: TypeMatService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    ){
      this.category = this.activatedRoute.parent.parent.snapshot.data['category'];
    this.formTypemat = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(){}

  onSubmit() {
    this.formTypemat.markAllAsTouched();
    this.submitTypemat = true;
    if (this.formTypemat.valid) {
      let famille = this.formTypemat.value;
      famille.category = this.category
        this.typematService.createTypemat(this.formTypemat.value).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Type ajouté avec succées'
              },
              duration: 3000
            });
            this.formTypemat.reset();
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
    } else {
      return;
    }
  }

}
