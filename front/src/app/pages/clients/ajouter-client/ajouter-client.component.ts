import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { ClientService } from 'src/app/services/client/client.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-client',
  templateUrl: './ajouter-client.component.html',
  styleUrls: ['./ajouter-client.component.scss']
})
export class AjouterClientComponent implements OnInit {


  formClient: FormGroup;
  submitClient: boolean = false;
  client: any;
  constructor(private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private authService:AuthService,
    private router:Router) {
    this.formClient = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-Z ]*")
      ]),
      mat_fis: new FormControl('', [
        Validators.required
      ]),
      tel: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]{8}"),
        Validators.min(10000000),
        Validators.max(99999999)
      ]),
      adresse: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      zone: new FormControl('',[
        Validators.required
      ]),
      commands_no:new FormControl(0)


    });
  }

  ngOnInit(): void {
  }
  get ft() { return this.formClient.controls; }
  onAddClientSubmit() {
    this.submitClient = true;
    if (this.formClient.valid) {
     
        this.client = this.formClient.value;
        this.client.creatorId=this.authService.getIdfromToken();
        this.clientService.ajouterClient(this.client).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type: 'alert-success',
                text: 'Client has been added successfully'
              },
              duration: 3000
            });
            this.router.navigate(['/clients'])
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
    } else {
      return;
    }
  }


}
