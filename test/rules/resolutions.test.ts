import { PackageJson } from 'type-fest';
import { validateResolutions } from '../../src/rules/resolutions';
import { afterEach, describe, expect, it, mock, setSystemTime } from 'bun:test';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMultilineInputMock = mock((_: string) => [] as string[]);
const getInputMock = mock();
const infoMock = mock();
const setFailedMock = mock();
mock.module('@actions/core', () => ({
  getMultilineInput: getMultilineInputMock,
  info: infoMock,
  getInput: getInputMock,
  setFailed: setFailedMock
}));

describe('resolutions', () => {
  afterEach(() => {
    mock.clearAllMocks();
  });

  describe('resolutions only', () => {
    it('should fail when resolutions are present', () => {
      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          some: 'resolution'
        }
      };
      validateResolutions(packageJson);
      expect(setFailedMock).toHaveBeenCalled();
    });

    it('should not fail when resolutions are not present', () => {
      const packageJson: PackageJson = {
        dependencies: {}
      };
      validateResolutions(packageJson);
      expect(setFailedMock).not.toHaveBeenCalled();
    });
  });

  describe('ignore-resolutions', () => {
    it('should not fail when matching resolution is present in package.json and ignore list', () => {
      getMultilineInputMock.mockImplementationOnce((input: string) =>
        input === 'ignore-resolutions' ? ['@test/package-foo', '@test/package-bar'] : []
      );

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getMultilineInputMock).toHaveBeenCalledWith('ignore-resolutions');
      expect(setFailedMock).not.toHaveBeenCalled();
    });

    it('should fail when non-matching resolution is present in package.json and ignore list', () => {
      getMultilineInputMock.mockImplementationOnce(input =>
        input === 'ignore-resolutions' ? ['@test/package-foo', '@test/package-bar'] : []
      );

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution',
          '@test/package-wrong': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getMultilineInputMock).toHaveBeenCalledWith('ignore-resolutions');
      expect(setFailedMock).toHaveBeenCalledWith(
        'Resolutions contain packages not included in "ignore-resolutions". Please investigate the root cause of your dependency issues!'
      );
    });

    it('should not fail when resolutions are not present, but ignore list is', () => {
      getMultilineInputMock.mockImplementationOnce(input =>
        input === 'ignore-resolutions' ? ['@test/package'] : []
      );

      const packageJson: PackageJson = {
        dependencies: {}
      };
      validateResolutions(packageJson);
      expect(setFailedMock).not.toHaveBeenCalled();
    });
  });

  describe('ignore-resolutions-until', () => {
    it('should not fail when some resolutions are provided and ignore-resolutions-until is set with date in the future', () => {
      setSystemTime(new Date('2020-12-31'));
      getInputMock.mockImplementation(input =>
        input === 'ignore-resolutions-until' ? '2021-01-01' : ''
      );

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getInputMock).toHaveBeenCalledWith('ignore-resolutions-until');
      expect(getMultilineInputMock).not.toHaveBeenCalledWith('ignore-resolutions');

      expect(setFailedMock).not.toHaveBeenCalled();
      expect(infoMock).toHaveBeenCalledWith('Ignoring resolutions until 2021-01-01T00:00:00.000Z');
    });

    it('should fail when some resolutions are provided and ignore-resolutions-until is set with date in the past', () => {
      setSystemTime(new Date('2021-01-31'));
      getInputMock.mockImplementation(input =>
        input === 'ignore-resolutions-until' ? '2021-01-01' : ''
      );

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getInputMock).toHaveBeenCalledWith('ignore-resolutions-until');
      expect(getMultilineInputMock).toHaveBeenCalledWith('ignore-resolutions');

      expect(setFailedMock).toHaveBeenCalledWith(
        'Resolutions may not be set. Please investigate the root cause of your dependency issues!'
      );
      expect(infoMock).not.toHaveBeenCalledWith();
    });

    it('should fail when some resolutions are provided and ignore-resolutions-until is not set', () => {
      setSystemTime(new Date('2021-01-31'));
      getInputMock.mockImplementation(input => (input === 'ignore-resolutions-until' ? '' : ''));

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getInputMock).toHaveBeenCalledWith('ignore-resolutions-until');
      expect(getMultilineInputMock).toHaveBeenCalledWith('ignore-resolutions');

      expect(setFailedMock).toHaveBeenCalledWith(
        'Resolutions may not be set. Please investigate the root cause of your dependency issues!'
      );
      expect(infoMock).not.toHaveBeenCalledWith();
    });

    it('should not fail when matching resolution is present in package.json and ignore list, while ignore-resolutions-until is provided with date in the past', () => {
      setSystemTime(new Date('2021-01-31'));
      getInputMock.mockImplementation(input =>
        input === 'ignore-resolutions-until' ? '2021-01-01' : ''
      );
      getMultilineInputMock.mockImplementationOnce(input =>
        input === 'ignore-resolutions' ? ['@test/package-foo', '@test/package-bar'] : []
      );

      const packageJson: PackageJson = {
        dependencies: {},
        resolutions: {
          '@test/package-foo': 'resolution',
          '@test/package-bar': 'resolution'
        }
      };
      validateResolutions(packageJson);

      expect(getInputMock).toHaveBeenCalledWith('ignore-resolutions-until');
      expect(getMultilineInputMock).toHaveBeenCalledWith('ignore-resolutions');

      expect(setFailedMock).not.toHaveBeenCalled();
      expect(infoMock).not.toHaveBeenCalled();
    });
  });
});
