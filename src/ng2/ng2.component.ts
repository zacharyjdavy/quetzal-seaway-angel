import { Component, Inject } from '@angular/core';
import template from './ng2.component.html';
import { Attachment } from '../pdftron/attachment';
import { FileService } from '../pdftron/file.service';

@Component({
  selector: 'ng2',
  template,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Ng2Component {
  private attachment: any;

  public constructor(@Inject('FileService') private fileService: FileService) {
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

  public viewFile(): void {
    // eslint-disable-next-line no-console
    console.log('Ng2Component#viewFile');
    this.fileService.view(this.attachment, 'attachment', true);
  }
}
