import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {BrowserEvents} from "./shared/browser-events.service";
import {ContextMenu} from "./web-player/context-menu/context-menu.service";
import {ModalPlaceholderService} from "./shared/modal/modal-placeholder.service";
import {ToastService} from "./shared/toast/toast.service";
import {ToastComponent} from "./shared/toast/toast.component";
import {AppHttpClient} from "./shared/app-http-client.service";
import {Settings} from "./shared/settings.service";
import {PreviewApp} from "./shared/preview-app.service";
import {TitleService} from "./shared/title.service";
import * as svg4everybody from 'svg4everybody';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import "rxjs/add/operator/share";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/forkJoin";
import {NavigationEnd, Router} from "@angular/router";
import {PopularAlbumsComponent} from "./web-player/albums/popular-albums/popular-albums.component";
import {PopularAlbumsResolver} from "./web-player/albums/popular-albums/popular-albums-resolver.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    @ViewChild('modalPlaceholder', {read: ViewContainerRef}) modalPlaceholderRef;
    @ViewChild('contextMenuPlaceholder', {read: ViewContainerRef}) contextMenuPlaceholderRef;
    @ViewChild('appContent') appContentEl: ElementRef;
    @ViewChild(ToastComponent) toastComponent: ToastComponent;

    constructor(
        private browserEvents: BrowserEvents,
        private el: ElementRef,
        private renderer: Renderer2,
        private contextMenu: ContextMenu,
        private modalPlaceholder: ModalPlaceholderService,
        private toastService: ToastService,
        private http: AppHttpClient,
        private settings: Settings,
        private preview: PreviewApp,
        private title: TitleService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.browserEvents.subscribeToEvents(this.el.nativeElement, this.renderer);
        this.toastService.registerComponentInstance(this.toastComponent);
        this.contextMenu.registerViewContainerRef(this.contextMenuPlaceholderRef);
        this.modalPlaceholder.registerViewContainerRef(this.modalPlaceholderRef, this.appContentEl.nativeElement);
        this.settings.setHttpClient(this.http);
        this.preview.init();
        this.title.init();

        //google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }

        //svg icons polyfill
        svg4everybody();
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .filter(e => e instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }
}