// eslint-disable-next-line @typescript-eslint/no-extraneous-class
import { FileService } from '../pdftron/file.service';

export class AngularJSController implements ng.IController {
  public static $inject = ['FileService'];

  private attachment: any;

  public constructor(private readonly FileService: FileService) {
    this.attachment = {
      name: 'PS-144.pdf',
      original_url:
        'https://s3.amazonaws.com/tsvabqmdcirbjnxq/qvHDimMUqxZcQnsj/9jZM9B6FSwyMQRzJiZjj_PS-144.pdf',
      file_url:
        'https://d1ptbdmc5t1w9s.cloudfront.net/f0c8401acac80712ae90a0ff7968f03e/9jZM9B6FSwyMQRzJiZjj_PS-144.pdf',
      thumb_url: null,
      file_size: 3987,
      flattened_file_url: null,
      kind: 'file',
    };
  }

  /**
   * If the attachment is a PDF, opens the PDF viewer.
   * Otherwise, downloads the file.
   */
  public viewFile(): void {
    this.FileService.view(this.attachment, 'attachment', true);
  }
}
