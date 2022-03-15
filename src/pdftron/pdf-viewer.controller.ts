import WebViewer, {
  Core,
  WebViewerInstance,
  WebViewerOptions,
} from '@pdftron/webviewer';
import { $q } from '@uirouter/core';
import PDFViewerTemplate from './pdf-viewer.component.html';
interface BeforeUnloadWindow {
  on(kind: 'beforeunload', fn: Function): void;
  off(kind: 'beforeunload', fn: Function): void;
}

export class PDFViewerController {
  public static $inject = [
    '$q',
    '$rootScope',
    '$window',
    // '$translate',
    '$filter',
    // 'FilepickerService',
    // 'ModalService',
    'FileService',
  ];

  public fileName?: string;
  public fileUrl?: string;
  public closeRequested?: boolean;
  public patchEntity?: Function;
  public doResize?: Function;
  public doClose?: Function;

  public forceViewOnly?: boolean;

  public viewerInstance?: WebViewerInstance;
  public viewerElement: HTMLElement = document.createElement('div');
  public documentViewer?: Core.DocumentViewer;
  public annotationManager?: Core.AnnotationManager;
  public isClosing = false;
  public isPrompting = false;
  public isSaving = false;
  public isPDFTronSetup = false;
  public isDocumentLoading = true;
  public pdfLoadingError = false;
  public annotationsChanged = false;
  private watchJQueryCollectionOff!: () => void;

  public constructor(
    private readonly $q: ng.IQService,
    private readonly $rootScope: ng.IRootScopeService,
    private readonly $window: ng.IWindowService,
    // private readonly $translate: ng.translate.ITranslateService,
    private readonly $filter: ng.IFilterService,
    // @ts-ignore
    // private readonly FilepickerService: FilepickerService,
    // @ts-ignore
    // private readonly ModalService: ModalService,
    // @ts-ignore
    private readonly FileService: FileService
  ) {
    // eslint-disable-next-line no-console
    console.log('PDFViewerController#constructor');
  }

  public $onInit(): void {
    this.watchJQueryCollectionOff = this.$rootScope.$watchCollection(
      () => $('.pdf-viewer-component').get(0),
      (componentElement) => {
        if (!this.isPDFTronSetup) {
          this.onTemplateLoad(componentElement);
          this.isPDFTronSetup = true;
        }
      }
    );
    ($(this.$window) as BeforeUnloadWindow).on(
      'beforeunload',
      this.beforeUnloadCheck
    );

    this.viewerElement.id = 'pdftron-viewer';
    this.viewerElement.style.height = '0';
    this.viewerElement.style.width = '0';
  }

  public $onChanges(changesObj: ng.IOnChangesObject): void {
    if (changesObj.closeRequested && changesObj.closeRequested.currentValue) {
      this.saveAndClose();
    }
    if (
      changesObj.fileUrl &&
      Boolean(changesObj.fileUrl.currentValue) &&
      this.isPDFTronSetup
    ) {
      this.loadDocument();
    }
  }

  public loadDocument(): void {
    this.isDocumentLoading = true;
    this.documentViewer
      ?.loadDocument(this.$filter<ng.IFilterJson>('urlEncode')(this.fileUrl), {
        onError: () => {
          this.isDocumentLoading = false;
          this.pdfLoadingError = true;
        },
        password: (passwordCallback) => {
          // this.ModalService.passwordPrompt(
          //   // this.$translate.instant('PASSWORD_REQUIRED'),
          //   // this.$translate.instant('PDF_PASSWORD_REQUIRED'),
          //   // this.$translate.instant('CONTINUE'),
          //   // this.$translate.instant('CANCEL')
          //   'PASSWORD_REQUIRED',
          //   'PDF_PASSWORD_REQUIRED',
          //   'CONTINUE',
          //   'CANCEL'
          // ).result.then((result: any) => {
          //   if (result) {
          //     passwordCallback(result.password);
          //   } else {
          //     this.isDocumentLoading = false;
          //     this.pdfLoadingError = true;
          //   }
          // });
          // eslint-disable-next-line no-console
          console.log('document viewer password callback', passwordCallback);
        },
      })
      .then(() => {
        this.isDocumentLoading = false;
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }

  public handlePDFPassword(passwordCallback: Function): void {
    // this.ModalService.passwordPrompt(
    //   // this.$translate.instant('PASSWORD_REQUIRED'),
    //   // this.$translate.instant('PDF_PASSWORD_REQUIRED'),
    //   // this.$translate.instant('CONTINUE'),
    //   // this.$translate.instant('CANCEL')
    //   'PASSWORD_REQUIRED',
    //   'PDF_PASSWORD_REQUIRED',
    //   'CONTINUE',
    //   'CANCEL'
    // ).result.then((result: any) => {
    //   if (result) {
    //     passwordCallback(result.password);
    //   } else {
    //     this.isDocumentLoading = false;
    //     this.pdfLoadingError = true;
    //   }
    // });
    // eslint-disable-next-line no-console
    console.log('PDFViewerController#handlePDFPassword', passwordCallback);
  }

  public $onDestroy(): void {
    this.watchJQueryCollectionOff?.();
    ($(this.$window) as BeforeUnloadWindow).off(
      'beforeunload',
      this.beforeUnloadCheck
    );
  }

  public onTemplateLoad(componentElement?: HTMLElement): void {
    if (this.isClosing) {
      this.watchJQueryCollectionOff?.();
    } else if (componentElement !== undefined) {
      this.doResize?.();

      const pdftronOptions = {
        path: '/webviewer',
        l: this.$window._ENV.PDFTRON_KEY,
        preloadWorker: 'pdf',
        documentType: 'pdf',
      };

      componentElement.appendChild(this.viewerElement);

      this.createWebViewer(pdftronOptions, this.viewerElement);
    }
  }

  public createWebViewer(
    pdftronOptions: WebViewerOptions,
    viewerElement: HTMLElement
  ): void {
    WebViewer(pdftronOptions, viewerElement).then(
      (webViewerInstance: WebViewerInstance) => {
        this.setupPDFTronOptions(webViewerInstance);
        viewerElement.style.height = '100%';
        viewerElement.style.width = '100%';
      }
    );
  }

  public getFileBlob(finishedWithDocument: boolean): ng.IPromise<ArrayBuffer> {
    if (this.annotationManager !== undefined) {
      return this.annotationManager.exportAnnotations().then((xfdfString) => {
        if (xfdfString && this.documentViewer !== undefined) {
          const pdfDoc = this.documentViewer.getDocument();

          return pdfDoc.getFileData({ xfdfString, finishedWithDocument });
        }
        return this.$q.reject('');
      });
    }

    return $q.reject('');
  }

  public createPDFBlob(arrayBuffer: ArrayBuffer): Blob {
    return new Blob([new Uint8Array(arrayBuffer)], {
      type: 'application/pdf',
    });
  }

  public downloadPdf(): void {
    this.getFileBlob(false).then((arrayBuffer) => {
      if (arrayBuffer) {
        this.FileService.saveBlob(
          this.createPDFBlob(arrayBuffer),
          this.fileName
        );
      }
    });
  }

  public saveChanges(finishedWithDocument: boolean): ng.IPromise<void> {
    if (this.annotationsChanged) {
      this.isSaving = true;
      return this.getFileBlob(finishedWithDocument)
        .then((arrayBuffer) => {
          if (arrayBuffer) {
            if (this.fileName === undefined) {
              return this.$q.resolve();
            }

            // return this.FilepickerService.storeBlob(
            //   this.createPDFBlob(arrayBuffer),
            //   this.fileName
            // ).then((InkBlob: { key: string; size: number }) => {
            //   this.patchEntity?.({
            //     fileUrl: `https://s3.amazonaws.com/tsvabqmdcirbjnxq/${InkBlob.key}`,
            //     fileSize: InkBlob.size,
            //   });
            // });
          } else {
            return this.$q.resolve();
          }
        })
        ?.then(() => {
          this.isSaving = false;
        });
    } else {
      return this.$q.resolve();
    }
  }

  public saveAndClose(): void {
    // let promise: ng.IPromise<void> = this.$q.resolve();
    const promise: ng.IPromise<void> = this.$q.resolve();
    // if (this.annotationsChanged) {
    //   this.isPrompting = true;
    //   // const i18n = this.$translate.instant([
    //   //   'SAVE_EDITS',
    //   //   'UNSAVED_EDITS_WARNING',
    //   // ]);
    //   promise = this.ModalService.action(
    //     'SAVE_EDITS',
    //     'UNSAVED_EDITS_WARNING',
    //     // i18n['SAVE_EDITS'],
    //     // i18n['UNSAVED_EDITS_WARNING'],
    //     [
    //       {
    //         className: 'btn-default',
    //         isDismiss: false,
    //         value: false,
    //         key: 'DISCARD',
    //       },
    //       {
    //         className: 'btn-primary',
    //         isDismiss: false,
    //         value: true,
    //         key: 'SAVE',
    //       },
    //     ],
    //     'pdf-viewer-confirm'
    //   ).result.then((value: boolean) => {
    //     if (value) {
    //       // return this.saveChanges(true);
    //     }
    //   });
    // }

    promise.finally(() => {
      this.isPrompting = false;
    });

    promise.then(() => {
      this.isClosing = true;
      this.doClose?.();
    });
  }

  public beforeUnloadCheck(evt?: Event): string | undefined {
    if (this.annotationsChanged) {
      // const warning = this.$translate.instant('UNSAVED_EDITS_WARNING');
      const warning = 'UNSAVED_EDITS_WARNING';
      if (evt) {
        evt.returnValue = true;
      } else if (this.$window.event) {
        this.$window.event.returnValue = true;
      }
      return warning;
    }
  }

  public setTools(): void {
    this.viewerInstance?.UI.disableTools([
      'AnnotationCreateSticky',
      'AnnotationCreateTextSquiggly',
      'AnnotationCreateTextStrikeout',
      'AnnotationCreateCallout',
      'AnnotationCreateLine',
      'AnnotationCreatePolyline',
      'AnnotationCreateStamp',
      'AnnotationCreateEllipse',
      'AnnotationCreatePolygon',
    ]);

    this.documentViewer
      ?.getTool('AnnotationCreateRectangle')
      .setStyles((currentStyle: any) => this.styleSetter(currentStyle));
    this.documentViewer
      ?.getTool('AnnotationCreateArrow')
      .setStyles((currentStyle: any) => this.styleSetter(currentStyle));
    this.documentViewer
      ?.getTool('AnnotationCreatePolygonCloud')
      .setStyles((currentStyle: any) => this.styleSetter(currentStyle));
    this.documentViewer
      ?.getTool('AnnotationCreateFreeHand')
      .setStyles(this.freeHandStyleSetter);
    this.documentViewer
      ?.getTool('AnnotationCreateFreeHand2')
      .setStyles(this.freeHandStyleSetter);
    this.documentViewer
      ?.getTool('AnnotationCreateFreeHand3')
      .setStyles(this.freeHandStyleSetter);
    this.documentViewer
      ?.getTool('AnnotationCreateFreeHand4')
      .setStyles(this.freeHandStyleSetter);
  }

  public setHeaderItems(): void {
    // Since pdftron is served from a different dir compared to our index file, the
    // image path needs to be fully-qualified or would end up looking at the wrong
    // place
    const customDownloadButton = {
      type: 'actionButton',
      img: `${this.$window.location.origin}/${image_path(
        'files/download-centered.svg'
      )}`,
      onClick: () => this.downloadPdf(),
      dataElement: 'customDownloadButton',
    };

    // Disable Ribbons and Buttons
    this.viewerInstance?.UI.disableElements([
      'annotationCommentButton',
      'noteReply',
      'downloadButton',
      'toolbarGroup-Edit',
      'toolbarGroup-Forms',
      'toolbarGroup-Insert',
    ]);

    //Set Default Ribbon Toolbar Group
    this.viewerInstance?.UI.setToolbarGroup('toolbarGroup-View', false);

    //Customize the header bars
    this.viewerInstance?.UI.setHeaderItems(function (header) {
      //Setup Default Header Ribbon Buttons
      header.getHeader('default').delete(2); //Remove View Control Overlay
      header.getHeader('default').push(customDownloadButton);

      // Setup Annotation Ribbon Tools
      let annotateButtons = header
        .getHeader('toolbarGroup-Annotate')
        .getItems();

      annotateButtons = [
        annotateButtons[0],
        {
          dataElement: 'highlightToolGroupButton',
          title: 'annotation.highlight',
          toolGroup: 'highlightTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'underlineToolGroupButton',
          title: 'annotation.underline',
          toolGroup: 'underlineTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'freeTextToolGroupButton',
          title: 'annotation.freetext',
          toolGroup: 'freeTextTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'freeHandToolGroupButton',
          title: 'annotation.freehand',
          toolGroup: 'freeHandTools',
          type: 'toolGroupButton',
        },
        ...annotateButtons.slice(10), //add Tool group selector, Undo, redo, Erase, spacer
      ];

      header.getHeader('toolbarGroup-Annotate').update(annotateButtons);

      // Setup Shape Ribbon Group Buttons
      let shapesButtons = header.getHeader('toolbarGroup-Shapes').getItems();

      //Set Shape Remove Annotate Buttons
      shapesButtons = [
        shapesButtons[0],
        {
          dataElement: 'freeHandToolGroupButton',
          title: 'annotation.freehand',
          toolGroup: 'freeHandTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'shapeToolGroupButton',
          title: 'annotation.rectangle',
          toolGroup: 'rectangleTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'polygonCloudToolGroupButton',
          title: 'annotation.polygonCloud',
          toolGroup: 'cloudTools',
          type: 'toolGroupButton',
        },
        {
          dataElement: 'arrowToolGroupButton',
          title: 'annotation.arrow',
          toolGroup: 'arrowTools',
          type: 'toolGroupButton',
        },
        ...shapesButtons.slice(10), //add Tool group selector, Undo, redo, Erase, spacer
      ];

      header.getHeader('toolbarGroup-Shapes').update(shapesButtons);

      // Add Fill and Sign Tools
      let signatureButtons = header
        .getHeader('toolbarGroup-FillAndSign')
        .getItems();

      signatureButtons = [
        signatureButtons[0],
        {
          dataElement: 'signatureToolGroupButton',
          img: 'icon-tool-signature',
          showColor: 'never',
          title: 'annotation.signature',
          toolGroup: 'signatureTools',
          type: 'toolGroupButton',
        },
        ...signatureButtons.slice(7), //add Tool group selector, Undo, redo, Erase, spacer
      ];

      header.getHeader('toolbarGroup-FillAndSign').update(signatureButtons);
    });
  }

  public setPdftronLanguage(): void {
    // The language enum that $translate returns does not match the enum the Pdftron's `setLanguage` function needs.
    // let lang = this.$translate.use();
    // if (lang === 'zh') {
    //   lang = 'zh_cn';
    // }
    // if (lang === 'pt') {
    //   lang = 'pt_br';
    // }
    // this.viewerInstance?.UI.setLanguage(lang);
    this.viewerInstance?.UI.setLanguage('en');
  }

  public onAnnotationsChanged = (
    _annotations: Core.Annotations.Annotation[],
    _action: string,
    info: Core.AnnotationManager.AnnotationChangedInfoObject
  ): void => {
    if (!info.imported) {
      this.annotationsChanged = true;
    }
  };

  public onFieldChanged = (_field: object, _value: string): void => {
    // Fields are not imported so all field changes should be marked as a change
    this.annotationsChanged = true;
  };

  public setOnAnnotationsChanged(): void {
    this.annotationManager?.addEventListener(
      'annotationChanged',
      this.onAnnotationsChanged
    );
    this.annotationManager?.addEventListener(
      'fieldChanged',
      this.onFieldChanged
    );
  }

  public setupPDFTronOptions(webViewerInstance: WebViewerInstance): void {
    this.viewerInstance = webViewerInstance;

    const { Core } = webViewerInstance;
    const { documentViewer, annotationManager } = Core;

    this.annotationManager = annotationManager;
    this.documentViewer = documentViewer;

    this.loadDocument();

    const requireMember =
      this.$rootScope.fieldwireData?.currentProject?._requireMember || false;

    if (this.forceViewOnly || !requireMember) {
      this.annotationManager?.enableReadOnlyMode();
    }

    this.annotationManager?.setCurrentUser(
      // this.$filter<ng.IFilterJson>('userInitials')(
      //   this.$rootScope.fieldwireData.currentUser
      // )
      'ZD'
    );

    if (requireMember) {
      this.annotationManager.promoteUserToAdmin();
    }

    this.setHeaderItems();
    this.setTools();
    this.setPdftronLanguage();
    this.setOnAnnotationsChanged();
  }

  private styleSetter(currentStyle: any): any {
    // Default Pdftron Red is #E44234
    // StrokeColor doesn't have a public constructor, so we need to modify the existing object.
    const color = currentStyle.StrokeColor || { R: 0, G: 0, B: 0 };
    color.R = 228;
    color.G = 66;
    color.B = 52;
    return { StrokeThickness: 3, StrokeColor: color };
  }

  private freeHandStyleSetter(): any {
    return { StrokeThickness: 3 };
  }
}
