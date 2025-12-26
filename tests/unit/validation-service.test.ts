import { expect } from 'chai';
import sinon from 'sinon';
import * as vscode from 'vscode';
import { ValidationService } from '../../src/services/validation-service';

describe('ValidationService', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('detects markdown documents', () => {
    const service = new ValidationService();
    const doc = { languageId: 'markdown', uri: vscode.Uri.file('/tmp/test.md') } as vscode.TextDocument;

    expect(service.isMarkdownFile(doc)).to.equal(true);
  });

  it('detects diff views', () => {
    const service = new ValidationService();
    const doc = { uri: vscode.Uri.parse('git:/tmp/test.md') } as vscode.TextDocument;

    expect(service.isDiffView(doc)).to.equal(true);
  });

  it('flags large files using fs.stat', async () => {
    const service = new ValidationService();
    sinon.stub(vscode.workspace.fs, 'stat').resolves({ size: 2_000_000 } as vscode.FileStat);

    const result = await service.isLargeFile(vscode.Uri.file('/tmp/large.md'), 1_048_576);
    expect(result).to.equal(true);
  });

  it('flags binary files based on null bytes', async () => {
    const service = new ValidationService();
    sinon.stub(vscode.workspace.fs, 'readFile').resolves(new Uint8Array([0, 1, 2]));

    const result = await service.isBinaryFile(vscode.Uri.file('/tmp/binary.md'));
    expect(result).to.equal(true);
  });
});
