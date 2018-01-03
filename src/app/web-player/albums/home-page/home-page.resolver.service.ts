import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Album} from "../../../shared/types/models/Album";
import {WebPlayerState} from "../../web-player-state.service";
import {Albums} from "../albums.service";

@Injectable()
export class HomePageResolver implements Resolve<Array<Album[]>> {
    constructor(
        private albums: Albums,
        private router: Router,
        private state: WebPlayerState,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Array<Album[]>> {
        return this.albums.getAll()[0].toPromise().then(albums => {
            let a = [];
            a.push(albums);
            return this.albums.getAll()[1].toPromise().then(albums => {
                a.push(albums);
                return this.albums.getAll()[2].toPromise().then(albums => {
                    this.state.loading = false;
                    a.push(albums);
                    return a;
                });
            });
        }).catch(() => {
            this.state.loading = false;
        });
    }
}