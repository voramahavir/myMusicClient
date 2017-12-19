import {EventEmitter, Injectable} from "@angular/core";
import {Localization} from "../types/models/Localization";
import {Settings} from "../settings.service";

@Injectable()
export class Translations {

    /**
     * Fired when active localization changes.
     */
    public localizationChange = new EventEmitter;

    /**
     * Currently active localization.
     */
    private localization: Localization = new Localization({lines: []});

    /**
     * Translations Service Constructor.
     */
    constructor(private settings: Settings) {}

    /**
     * Translate specified key.
     */
    public t(transKey: string, values = {}): string {
        if ( ! this.translationsEnabled()) return transKey;

        let translation = this.localization.lines[transKey] || transKey;

        //replace placeholders with specified values
        for (let key in values) {
            translation = translation.replace(':'+key, values[key]);
        }

        return translation;
    }

    /**
     * Get currently active localization.
     */
    public getActive(): Localization {
        return this.localization;
    }

    /**
     * Set active localization.
     */
    public setLocalization(localization: Localization) {
        if (this.localization.name === name) return;
        if ( ! localization || ! localization.lines) return;

        this.localization = localization;
        this.localizationChange.emit();
    }

    /**
     * Check if i18n functionality is enabled.
     */
    private translationsEnabled(): boolean {
        return this.settings.get('i18n.enable');
    }
}
