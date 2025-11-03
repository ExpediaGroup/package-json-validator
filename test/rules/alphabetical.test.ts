import { PackageJson } from 'type-fest';
import { validateAlphabetical } from '../../src/rules/alphabetical';
import { afterEach, describe, expect, it, mock } from 'bun:test';

const getMultilineInputMock = mock(() => ['dependencies', 'devDependencies']);
const setFailedMock = mock();
mock.module('@actions/core', () => ({
  getMultilineInput: getMultilineInputMock,
  setFailed: setFailedMock
}));

describe('alphabetical', () => {
  afterEach(() => {
    mock.clearAllMocks();
  });

  it('should fail when dependencies are not in alphabetical order', () => {
    const packageJson: PackageJson = {
      dependencies: {
        'a-package': '1.2.3',
        'c-package': '1.2.3',
        'b-package': '1.2.3'
      },
      devDependencies: {
        'c-package': '1.2.3',
        'd-package': '1.2.3',
        'e-package': '1.2.3'
      }
    };
    validateAlphabetical(packageJson);
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should fail when devDependencies are not in alphabetical order', () => {
    const packageJson: PackageJson = {
      dependencies: {
        'a-package': '1.2.3',
        'b-package': '1.2.3',
        'c-package': '1.2.3'
      },
      devDependencies: {
        'd-package': '1.2.3',
        'c-package': '1.2.3',
        'e-package': '1.2.3'
      }
    };
    validateAlphabetical(packageJson);
    expect(setFailedMock).toHaveBeenCalled();
  });

  it('should not fail when dependencies are in alphabetical order', () => {
    const packageJson: PackageJson = {
      dependencies: {
        'a-package': '1.2.3',
        'b-package': '1.2.3',
        'c-package': '1.2.3'
      },
      devDependencies: {
        'c-package': '1.2.3',
        'd-package': '1.2.3',
        'e-package': '1.2.3'
      }
    };
    validateAlphabetical(packageJson);
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
