import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';

@Component({
  selector: 'app-ajouter-groupe',
  templateUrl: './ajouter-groupe.component.html',
  styleUrls: ['./ajouter-groupe.component.scss']
})
export class AjouterGroupeComponent implements OnInit {

  permissionslist: string[][] = [
  ['Créer', 'create'],
  ['Mettre à jour', 'update'],
  ['Supprimer', 'delete']];
form: FormGroup ;
constructor(
private userService: UserService,
private fb: FormBuilder,
private snackBar: MatSnackBar,
) {

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

ngOnInit() {
}

onSubmit() {

// create new groupe
if (!this.form.invalid) {
this.userService.createGroupe(this.form.value).subscribe(data => {
if (data.success) {
  this.snackBar.openFromComponent(SnackbarComponent, {
    data: {
      type: 'alert-success',
      text: 'Groupe has been added successfully'
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


}
