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
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

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
      permissions: ['', Validators.required],
      image: '',

    });
    //permissions
    //image
  }

  ngOnInit(): void {
    this.userService.getUserById(this.authService.getIdfromToken()).subscribe(res=>{
      this.formUser.patchValue({
        username:res.username,
        fname:res.fname,
        lname:res.lname,
        email:res.email,
        adress:res.adress,
        gender:res.gender,
        tel:res.tel,
        zone:res.zone,
        salaire:res.salaire,
        permissions: res.permissions,
        image: res.image
       });
       this.previewURL=this.imageUrl+res.image;
    })
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
  }

  addImage(imageInputPic: any) {
    this.isUploading = true;
    this.isUploadingMsg = "Image is uploading"
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
                text:'Image has been uploaded successfully'},
              duration: 3000
            });
            this.imageSrc = res.name;
            this.isUploadingMsg = "Upload finished"
          } else {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-danger',
                text:'Problem uploading image'},
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

  onUpdateUserSubmit()
  {
    this.formUser.controls['image'].setValue(this.imageSrc);
    if(this.formUser.valid)
    {
      this.userService.updateUser(this.formUser.value,this.authService.getIdfromToken()).subscribe(res=>{
          if(res.success)
          {
            this.snackBar.openFromComponent(SnackbarComponent, {
              data: {
                type:'alert-success',
                text:res.msg},
              duration: 3000
            });
          }else{

          }
      })
    }
  }

}
