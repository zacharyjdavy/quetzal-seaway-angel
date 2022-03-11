import * as angular from 'angular';
import './application.base.js';
import 'zone.js';
import './polyfills.ts';
import { setAngularJSGlobal } from '@angular/upgrade/static';
import { UrlService } from '@uirouter/core';

// @ts-ignore
setAngularJSGlobal(angular);

// @ts-ignore
angular
  .module('fieldwireApp')
  .config([
    '$urlServiceProvider',
    ($urlService: UrlService) => $urlService.deferIntercept(),
  ]);

// @ts-ignore
angular.bootstrap(document.body, [], {
  strictDi: true,
});

function startUrlService() {
  setTimeout(() => {
    let urlService: UrlService | undefined;
    try {
      // @ts-ignore
      const injector: angular.auto.IInjectorService = angular
        .element(document.body)
        .injector();
      urlService = injector?.get('$urlService');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error in startUrlService:', error);
    }
    if (urlService) {
      urlService.listen();
      urlService.sync();
    } else {
      startUrlService();
    }
  });
}

startUrlService();
