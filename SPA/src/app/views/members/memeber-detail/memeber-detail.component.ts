import { MessageConstants } from './../../../_core/_constants/message.enum';
import { NgxNotiflixService } from './../../../_core/_services/ngx-notiflix.service';
import { User } from './../../../_core/_models/user';
import { UserService } from './../../../_core/_services/user.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MemeberDetailComponent implements OnInit {
  user: User = <User>{};
  items!: GalleryItem[];
  imageData = [{
    srcUrl: '',
    previewUrl: ''
  }];
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private notiflix: NgxNotiflixService,
    public gallery: Gallery
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.getImages();
    // Creat gallery items
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
  }


  loadUser() {
    this.notiflix.showLoading();
    this.route.data.subscribe({
      next: (data) => {
        this.user = data['user']
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }

  getImages() {
    const imageUrls = [];
    const data = this.user.photos;
    for (let i = 0; i < data?.length; i++) {
      imageUrls.push({
        srcUrl: data[i].url!,
        previewUrl: data[i].url!
      })
    }
    return this.imageData = imageUrls;
  }

}
