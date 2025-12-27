import { expect } from 'chai';
import sinon from 'sinon';
import * as vscode from 'vscode';
import { StateService } from '../../src/services/state-service';
import { ViewMode } from '../../src/types/state';

describe('StateService', () => {
  let clock: sinon.SinonFakeTimers;
  let statusStub: sinon.SinonStub;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: 1000 });
    statusStub = sinon.stub(vscode.window, 'setStatusBarMessage');
    const l10nStub = sinon.stub(vscode.l10n, 't') as sinon.SinonStub;
    l10nStub.callsFake((message: string) => message);
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it('creates default preview state on first access', () => {
    const service = new StateService();
    const uri = vscode.Uri.file('/tmp/sample.md');

    const state = service.getState(uri);

    expect(state.uri).to.equal(uri.toString());
    expect(state.mode).to.equal(ViewMode.Preview);
    expect(state.lastModeChange).to.equal(1000);
  });

  it('updates mode and timestamp', () => {
    const service = new StateService();
    const uri = vscode.Uri.file('/tmp/sample.md');
    const contextStub = sinon.stub(vscode.commands, 'executeCommand').resolves();

    service.getState(uri);
    clock.tick(1000);
    service.setMode(uri, ViewMode.Edit);

    const updated = service.getState(uri);
    expect(updated.mode).to.equal(ViewMode.Edit);
    expect(updated.lastModeChange).to.equal(2000);
    expect(
      contextStub.calledWith('setContext', 'markdownReader.editMode', true)
    ).to.equal(true);
    expect(statusStub.calledWith('Edit mode enabled')).to.equal(true);
  });

  it('clears state and recreates defaults', () => {
    const service = new StateService();
    const uri = vscode.Uri.file('/tmp/sample.md');
    sinon.stub(vscode.commands, 'executeCommand').resolves();

    service.getState(uri);
    service.setMode(uri, ViewMode.Edit);
    service.clear(uri);

    clock.tick(1000);
    const reset = service.getState(uri);
    expect(reset.mode).to.equal(ViewMode.Preview);
    expect(reset.lastModeChange).to.equal(2000);
  });

  it('maintains independent state per file', () => {
    const service = new StateService();
    const first = vscode.Uri.file('/tmp/first.md');
    const second = vscode.Uri.file('/tmp/second.md');
    sinon.stub(vscode.commands, 'executeCommand').resolves();

    service.setMode(first, ViewMode.Edit);
    service.setMode(second, ViewMode.Preview);

    expect(service.getState(first).mode).to.equal(ViewMode.Edit);
    expect(service.getState(second).mode).to.equal(ViewMode.Preview);
  });
});
