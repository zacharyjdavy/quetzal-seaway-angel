import { PlatformRef, StaticProvider } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ng2Module } from './ng2/ng2.module';
import { downgradeComponent, downgradeModule } from '@angular/upgrade/static';
import { AngularJSController } from './angularjs/angularjs.controller';
import { Ng2Component } from './ng2/ng2.component';
import angularJSTemplate from './angularjs/angularjs.html';

const bootstrapFn = async (extraProviders: StaticProvider[]) => {
  const platformRef: PlatformRef = platformBrowserDynamic(extraProviders);
  return await platformRef.bootstrapModule(Ng2Module);
};

// @ts-ignore
angular
  .module('fieldwireApp', ['ui.router', downgradeModule(bootstrapFn)])
  .controller('angularJSController', AngularJSController)
  .directive(
    'ng2',
    downgradeComponent({
      component: Ng2Component,
    }) as angular.IDirectiveFactory
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
    });

    $stateProvider.state({
      name: 'ng2',
      url: '/ng2',
      component: 'ng2',
    });
  });
