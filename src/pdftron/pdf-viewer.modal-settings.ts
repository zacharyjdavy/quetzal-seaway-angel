import { PDFViewerModalController } from './pdf-viewer.modal.controller';
import PDFViewerModalTemplate from './pdf-viewer.modal.html';
import { ModalSettings } from './modal-settings';

export class PDFViewerModalSettings extends ModalSettings {
  public constructor(
    displayName: string,
    fileName: string,
    fileUrl: string,
    patchEntity: (url: string, size: number) => ng.IPromise<void>,
    forceViewOnly: boolean = false
  ) {
    // eslint-disable-next-line no-console
    console.log('PDFViewerModalSettings#constructor');
    super(
      PDFViewerModalTemplate,
      PDFViewerModalController,
      { displayName, fileName, fileUrl, patchEntity, forceViewOnly },
      'pdf-viewer-modal modal-large',
      false,
      true,
      'static'
    );
  }
}
