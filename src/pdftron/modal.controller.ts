export class ModalController {
  public constructor(
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService
  ) {
    // eslint-disable-next-line no-console
    console.log('ModalController#constructor');
  }

  public $close(result?: object): void {
    this.$uibModalInstance.close(result);
  }

  public $dismiss(): void {
    this.$uibModalInstance.dismiss();
  }
}
