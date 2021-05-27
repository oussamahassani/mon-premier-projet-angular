import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { passValidation, RegionValidator } from 'src/app/services/validations';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil, take, startWith, map } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';
import { StateGroup, stateGroups } from 'src/app/services/cities';
import { AuthService } from 'src/app/services/auth/auth.service';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
export interface Agroupe {
  id: string;
  groupename: string;
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-ajouter-user',
  templateUrl: './ajouter-user.component.html',
  styleUrls: ['./ajouter-user.component.scss']
})
export class AjouterUserComponent implements OnInit {
  formUser: FormGroup;
  submitUser: boolean = false;
  user: any;
  selectedFile: ImageSnippet;
  imageUrl=environment.baseUrlImage;
  imageSrc: string = this.imageUrl+"/uploads/placeholder-image.webp";
  isUploading: boolean = false;
  isUploadingMsg: string = "";
  previewURL: any=this.imageUrl+"/uploads/placeholder-image.webp";
  isComm:boolean=false;

  stateGroups=stateGroups;
  stateGroupOptions: Observable<StateGroup[]>;
  permissionslist: Agroupe[];
  protected _onDestroy = new Subject<void>();
  public permissionsFilter: FormControl = new FormControl();
  public filteredpermissionslist: ReplaySubject<Agroupe[]> = new ReplaySubject<Agroupe[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;
  constructor(private _formBuilder: FormBuilder,
    private generalService: GeneralService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService:AuthService) {

    this.formUser = this._formBuilder.group({
      username: new FormControl('', [
        Validators.required
      ]),
      fname: new FormControl('', [
        Validators.required
      ]),
      lname: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      adress: new FormControl('', [
        Validators.required
      ]),
      gender: new FormControl(''),
      tel: new FormControl('', [
        Validators.required,
        Validators.min(10000000),
        Validators.max(99999999)
      ]),
      zone: new FormControl('',[
          RegionValidator
        ]),
      salaire: new FormControl(0),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      cpassword: new FormControl('', [
        Validators.required,
        passValidation
      ]),
      permissions: ['', Validators.required],
      image: '',

    });
    this.formUser.controls.password.valueChanges
      .subscribe(
        x => this.formUser.controls.cpassword.updateValueAndValidity()
      )
    //permissions
    //image
  }

  ngOnInit(): void {
    this.fetchGroupes();
    this.permissionsFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMulti();
      });
      
    this.stateGroupOptions = this.formUser.get('zone')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  fetchGroupes() {
    this.userService.getGroupes()
      .subscribe((res: Agroupe[]) => {
        this.permissionslist = res;
        this.filteredpermissionslist.next(this.permissionslist.slice());
      }, err => {
        console.log(err);
      });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }
  protected setInitialValue() {
    this.filteredpermissionslist
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Agroupe, b: Agroupe) => a && b && a.id === b.id;
      });
  }
  protected filterMulti() {
    if (!this.permissionslist) {
      return;
    }
    // get the search keyword
    let search = this.permissionsFilter.value;
    if (!search) {
      this.filteredpermissionslist.next(this.permissionslist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredpermissionslist.next(
      this.permissionslist.filter(permo => permo.groupename.toLowerCase().indexOf(search) > -1)
    );
  }
  selected(event) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    }
    //set zone as required
  }

  addImage(imageInputPic: any) {
    this.isUploading = true;
    this.isUploadingMsg = "image est en cours de téléchargement"
    const file: File = imageInputPic.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.previewURL = reader.result;
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.generalService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          if (res.success) {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:'Image a été téléchargée avec succès'},
              duration: 3000
            });
            this.imageSrc = res.name;
            this.isUploadingMsg = "Téléchargement terminé"
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problème lors du téléchargement de l image'},
              duration: 3000
            });
          }
        },
        (err) => {

        })
    });
    if (imageInputPic.files[0]) {
      reader.readAsDataURL(imageInputPic.files[0]);
    }

  }

  onAddUserSubmit()
  {
    this.formUser.controls['image'].setValue(this.imageSrc);
    if(this.formUser.valid)
    {
      this.user=this.formUser.value;
      this.user.creatorId=this.authService.getIdfromToken();
      this.userService.ajouterUser(this.user).subscribe(res=>{
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            type:'alert-success',
            text:res.msg},
          duration: 3000
        });
      })
    }
  }
}


