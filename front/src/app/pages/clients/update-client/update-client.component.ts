import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  formClient: FormGroup;
  id;
  client:any;
  submitClient: boolean = false;
  isError:boolean=false;
  errorMsg:string="";
  
  constructor(private activatedRoute:ActivatedRoute,
    private clientService:ClientService,
    private generalService:GeneralService, 
    private snackBar: MatSnackBar) {
   }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.clientService.getClientById(this.id).subscribe(res=>{
        this.client=res;
      },err=>{
        this.snackBar.open("Problem getting Client", 'X', {
          duration: 3000
        });
      })
    })
  }
  get ft() { return this.formClient.controls; }
  updateClientSubmit()
  {
  
      if(this.validateClient())
      {
        this.client.updatedAt=new Date();
        this.clientService.updateClient(this.client,this.client._id).subscribe(res=>{
          if(res.success)
          {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Client has been updated successfully'},
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
      }else{
        this.isError=true;
        this.errorMsg="Remplir tous les champs requis";
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: 'Veuillez remplir tout les champs',
          duration: 3000
        });
      }
    
  }
  //name,mat_fis,tel,adresse,email,zone,active,commands_no,chiffre_affaire,createdA,updatedAt
  validateClient()
  {
    if(this.client.name && this.client.name.length>0 && 
      this.client.mat_fis && this.client.mat_fis.length>0 &&
      this.client.tel && this.client.tel>1000000 && this.client.tel < 99999999 &&
      this.client.adresse && this.client.adresse.length > 0 &&
      this.client.email && this.client.email.length>0 &&
      this.client.zone && this.client.zone.length >0)
    {
      return true;
    }else{
      
      return false;
    }
  }

}
