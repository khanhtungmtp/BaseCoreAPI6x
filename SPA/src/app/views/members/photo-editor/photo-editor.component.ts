import { AuthService } from 'src/app/_core/_services/auth.service';

import { PhotoService } from 'src/app/_core/_services/photo.service';
import { Photo } from 'src/app/_core/_models/photo';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { CaptionConstants } from 'src/app/_core/_constants/message.enum';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  user = localStorage.getItem(LocalStorageContains.USER) ? JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) : '';
  @Input() photos: Photo[];
  // @Output() getMemberPhotoChanges = new EventEmitter<string>();
  public uploader: FileUploader;
  response: string;
  hasBaseDropZoneOver: boolean = false;
  baseUrl: string = environment.apiUrl;
  currentMain: Photo;
  constructor(
    private photoService: PhotoService,
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initilizeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initilizeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.user.id + '/Photos',
      authToken: 'Bearer ' + localStorage.getItem(LocalStorageContains.TOKEN),
      headers: [{ name: 'Accept', value: 'application/json' }],
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024, // 10Mb,

    })
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        // update image profile if new user change image first
        if (photo.isMain) {
          this.authService.changeMemberPhoto(res.url);
          this.authService.currentUser.photoUrl = res.url;
          localStorage.setItem(LocalStorageContains.USER, JSON.stringify(this.authService.currentUser));
        }
      }

    };

  }


  setMainPhotos(photo: Photo) {
    this.photoService.setMainPhoto(this.user.id, photo.id).subscribe({
      next: () => {
        // cho hinh hien tai ve failse
        this.currentMain = this.photos.filter(p => p.isMain == true)[0];
        this.currentMain.isMain = false;
        // cho hinh selected true
        photo.isMain = true;
        // update lai thong tin hinh anh, user current khi set main
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem(LocalStorageContains.USER, JSON.stringify(this.authService.currentUser));
        //  this.getMemberPhotoChanges.emit(photo.url);
        this.snotify.success(CaptionConstants.SUCCESS, 'Successfully set to Main');
      }, error: () => {
        this.snotify.error(CaptionConstants.ERROR, 'Cannot set main photo');
      }
    })
  }

  deletePhoto(photoid: number) {
    this.spinner.show();
    this.snotify.confirm('Are you sure you want do delete this photo', 'Pictures after deletion will be lost forever',
      () => {
        this.photoService.deletePhoto(this.user.id, photoid).subscribe({
          next: (res) => {
            this.photos.splice(this.photos.findIndex(p => p.id == photoid), 1);
            (CaptionConstants.SUCCESS, 'photo has been deleted');
            this.spinner.hide();
          },
          error: () => {
            this.snotify.error(CaptionConstants.ERROR, 'Cannot delete photo');
            this.spinner.hide();
          }
        });
      }, () => {
        this.spinner.hide();
      })

  }

}
