import * as _ from 'lodash';
import { ModalController } from './modal.controller';

export class PDFViewerModalController extends ModalController {
  public static $inject = [
    '$q',
    '$window',
    'displayName',
    'fileName',
    'fileUrl',
    'patchEntity',
    'forceViewOnly',
    '$uibModalInstance',
  ];

  public closeRequested = false;
  private readonly debouncedWindowResize: () => void;

  // @ts-ignore
  public constructor(
    protected readonly $q: ng.IQService,
    protected readonly $window: ng.IWindowService,
    public readonly displayName: string,
    protected fileName: string,
    protected fileUrl: string,
    public readonly patchEntity: (
      fileUrl: string,
      fileSize: number
    ) => ng.IPromise<void>,
    public readonly forceViewOnly: boolean,
    $uibModalInstance: ng.ui.bootstrap.IModalInstanceService
  ) {
    // eslint-disable-next-line no-console
    console.log('PDFViewerModalController#constructor');
    super($uibModalInstance);
    this.debouncedWindowResize = _.debounce(() => this.doResize(), 200);
  }

  public $onInit(): void {
    $(this.$window).on('resize', this.debouncedWindowResize);
  }

  public $onDestroy(): void {
    $(this.$window).off('resize', this.debouncedWindowResize);
  }

  public requestClose(): void {
    this.closeRequested = true;
  }

  public doResize(): void {
    $('.pdf-viewer-modal .modal-content').height(
      this.$window.innerHeight * 0.92
    );
  }

  public doClose(): void {
    this.$close();
  }
}
