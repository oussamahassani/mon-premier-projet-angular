import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-update-groupe',
  templateUrl: './update-groupe.component.html',
  styleUrls: ['./update-groupe.component.scss']
})

export class UpdateGroupeComponent implements OnInit {
 id:string;
 public group:any;
 form:FormGroup;
 permissionslist: string[][] = [
  ['Créer', 'create'],
  ['Mettre à jour', 'update'],
  ['Supprimer', 'delete']];
  constructor(private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private generalService:GeneralService, 
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.form = this.fb.group({
        groupename: ['', Validators.required],
        clients: [''],
        products: [''],
        livraisons: [''],
        commands: [''],
        users: [''],
        factures: [''],
        groupes: [''],
        });
     }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.userService.getOneGroupe(this.id).subscribe(res=>{
        this.group = res ;
        this.form.patchValue({
          groupename : this.group.groupename,
          users      : this.filterItems(this.group.permissions, 'users'),
          clients    : this.filterItems(this.group.permissions, 'clients'),
          groupes    : this.filterItems(this.group.permissions, 'groupes'),
          products   : this.filterItems(this.group.permissions, 'products'),
          livraisons : this.filterItems(this.group.permissions, 'livraisons'),
          commands   : this.filterItems(this.group.permissions, 'commands'),
          factures   :this.filterItems(this.group.permissions, 'factures')
         });
      },err=>{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-danger',
            text: 'Problem getting Groupes'
          },
          duration: 3000
        });
      })
    })
  }

  onSubmit()
  {
    if (!this.form.invalid) {
      this.userService.updateGroupe(this.id, this.form.value).subscribe(data => {
       if (data.success) {
         this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type: 'alert-success',
            text: data.msg
          },
          duration: 3000
        });
       } else {
           
           this.snackBar.openFromComponent(SnackbarComponent, {
            data: {
              type: 'alert-danger',
              text: data.msg
            },
            duration: 3000
          });
       }
      });
     }
  }

  filterItems = (arr, query) => {
    return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };

}
