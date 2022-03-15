import { PlatformRef, StaticProvider } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ng2Module } from './ng2/ng2.module';
import { downgradeComponent, downgradeModule } from '@angular/upgrade/static';
import { AngularJSController } from './angularjs/angularjs.controller';
import { Ng2Component } from './ng2/ng2.component';
import angularJSTemplate from './angularjs/angularjs.html';
import { FileService } from './pdftron/file.service';
import PDFViewerTemplate from './pdftron/pdf-viewer.html';
import { PDFViewerController } from './pdftron/pdf-viewer.controller';

const bootstrapFn = async (extraProviders: StaticProvider[]) => {
  const platformRef: PlatformRef = platformBrowserDynamic(extraProviders);
  return await platformRef.bootstrapModule(Ng2Module);
};

// @ts-ignore
angular
  .module('fieldwireApp', [
    'ui.router',
    'ui.bootstrap',
    downgradeModule(bootstrapFn),
  ])
  .controller('angularJSController', AngularJSController)
  .directive(
    'ng2',
    downgradeComponent({
      component: Ng2Component,
    }) as angular.IDirectiveFactory
  )
  .service('FileService', FileService)
  .component('pdfViewer', {
    template: PDFViewerTemplate,
    controller: PDFViewerController,
    bindings: {
      fileName: '<',
      fileUrl: '<',
      closeRequested: '<',
      patchEntity: '&',
      doResize: '&',
      doClose: '&',
      forceViewOnly: '<',
    },
  })
  .filter('toImagePath', () => {
    return (input: string = '') => {
      return image_path(input);
    };
  })
  .filter(
    'urlEncode',
    () =>
      function (url: string) {
        if (!url || !/cloudfront|s3.amazonaws.com/.test(url)) {
          return url;
        }

        const lastIndex = url.lastIndexOf('/');

        const host = url.substring(0, lastIndex + 1);
        const path = url.substring(lastIndex + 1);

        return host + encodeURIComponent(path);
      }
  )
  .config(function ($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state({
      name: 'root',
      url: '/',
      template: `
        <h1>Home</h1>
      `,
    });

    $stateProvider.state({
      name: 'angularjs',
      url: '/angularjs',
      controller: 'angularJSController',
      template: angularJSTemplate,
      controllerAs: '$ctrl',
    });

    $stateProvider.state({
      name: 'ng2',
      url: '/ng2',
      component: 'ng2',
    });
  });
