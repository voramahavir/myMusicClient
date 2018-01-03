import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Album} from "../../../shared/types/models/Album";
import {FilterablePage} from "../../filterable-page/filterable-page";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomePageComponent extends FilterablePage<Album> implements OnInit {
    data = {
      first: {
        index: 0,
        data: [],
        display: 3
      },
      second: {
        index: 0,
        data: [],
        display: 6
      },
      third: {
        index: 0,
        data: [],
        display: 6
      }
    };

    /**
     * PopularAlbumsComponent Constructor.
     */
    constructor(private route: ActivatedRoute) {
        super(['name', 'artist.name']);
    }

    ngOnInit() {
      this.route.data.subscribe((data: {albums: Album[]}) => {
        this.setHomeItems(data.albums);
        this.filteredItems['first'] = this.filteredItems[0];
        this.filteredItems['second'] = this.filteredItems[1];
        this.filteredItems['third'] = this.filteredItems[2];
        this.data.first.data = this.filteredItems['first'].slice(this.data.first.index, this.data.first.display);
        this.data.second.data = this.filteredItems['second'].slice(this.data.second.index, this.data.second.display);
        this.data.third.data = this.filteredItems['third'].slice(this.data.third.index, this.data.third.display);
      });
    }

    next(num) {
      this.data[num].index++;
      var filteredItems;
      if (num === 'first') {
        filteredItems = this.filteredItems['first'];
      } else if (num === 'second') {
        filteredItems = this.filteredItems['second'];
      } else {
        filteredItems = this.filteredItems['third'];
      }
      if (filteredItems.length > this.data[num].display && (this.data[num].index + this.data[num].display - 1) <= filteredItems.length) {
        this.data[num].data = filteredItems.slice(this.data[num].index, this.data[num].index + this.data[num].display);
      } else {
        this.data[num].index--;
      }
    }

    prev(num) {
      this.data[num].index--;
      var filteredItems;
      if (num === 'first') {
        filteredItems = this.filteredItems['first'];
      } else if (num === 'second') {
        filteredItems = this.filteredItems['second'];
      } else {
        filteredItems = this.filteredItems['third'];
      }
      if (this.data[num].index >= 0) {
        this.data[num].data = filteredItems.slice(this.data[num].index, this.data[num].index + this.data[num].display);
      } else {
        this.data[num].index++;
      }
    }
}
