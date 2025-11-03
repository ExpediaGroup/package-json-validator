import { validateKeys } from '../../src/rules/keys';
import dupedPackageJson from '../fixtures/duped-package.json';
import dupedScriptsPackageJson from '../fixtures/duped-scripts-package.json';
import dedupedPackageJson from '../fixtures/deduped-package.json';
import { afterEach, describe, expect, it, mock } from 'bun:test';

const getMultilineInputMock = mock(() => ['dependencies', 'devDependencies']);
const setFailedMock = mock();
mock.module('@actions/core', () => ({
  getMultilineInput: getMultilineInputMock,
  setFailed: setFailedMock
}));

describe('keys', () => {
  afterEach(() => {
    mock.clearAllMocks();
  });

  it('should fail when package.json contains duplicate keys in dependencies', () => {
    validateKeys(dupedPackageJson, 'test/fixtures/duped-package.json');
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should fail when package.json contains duplicate keys in scripts', () => {
    validateKeys(dupedScriptsPackageJson, 'test/fixtures/duped-scripts-package.json');
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should not fail when package.json contains no duplicate keys or scripts', () => {
    validateKeys(dedupedPackageJson, 'test/fixtures/deduped-package.json');
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
