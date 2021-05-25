import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { en } from './en';
import { nl } from './nl';

@Injectable()
export class TranslationService {
    private availableLanguages = { en, nl };

    get window(): Window {
        return this.document.defaultView;
    }

    constructor(@Inject(DOCUMENT) readonly document: any, public service: TranslateService) {
        Object.keys(this.availableLanguages).forEach((language) => {
            this.service.setTranslation(language, this.availableLanguages[language], true);
        });
        let browserLanguages = window.navigator.languages;
        let firstSupportedBrowserLanguage = browserLanguages.find((item) => Object.keys(this.availableLanguages).some((key) => key == item));
        service.use(firstSupportedBrowserLanguage || 'nl');
    }

    changeLanguage(lang: string) {
        this.service.use(lang);
    }

    loadCustomMessages(lang: string, messagesJson) {
        this.service.setTranslation(lang, messagesJson, true);
    }

    getTranslation(key: string, params?: Object) {
        return this.service.instant(key, params);
    }
}
