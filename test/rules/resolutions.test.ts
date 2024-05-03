import {PackageJson} from 'type-fest';
import {validateResolutions} from '../../src/rules/resolutions';
import * as core from '@actions/core';

// Inputs
jest.mock('@actions/core');
beforeEach(() => {
    // N.B: Ensure we return empty array to match the default behavior of getMultilineInput
    (core.getMultilineInput as jest.Mock).mockImplementation(()=> []);
})

// Timers
beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(() => {
    jest.useRealTimers();
});

describe('resolutions only', () => {
    it('should fail when resolutions are present',  () => {
        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                some: 'resolution'
            }
        };
        validateResolutions(packageJson);
        expect(core.setFailed).toHaveBeenCalled();
    });

    it('should not fail when resolutions are not present',  () => {
        const packageJson: PackageJson = {
            dependencies: {}
        };
        validateResolutions(packageJson);
        expect(core.setFailed).not.toHaveBeenCalled();
    });
});

describe('ignore-resolutions', () => {
    it('should not fail when matching resolution is present in package.json and ignore list',  () => {
        (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions' ? [
            "@test/package-foo",
            "@test/package-bar",
        ] : []);

        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution'
            }
        };
        validateResolutions(packageJson);

        expect(core.getMultilineInput).toHaveBeenCalledWith("ignore-resolutions");
        expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('should fail when non-matching resolution is present in package.json and ignore list',  () => {
        (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions' ? [
            "@test/package-foo",
            "@test/package-bar",
        ] : []);

        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution',
                "@test/package-wrong": 'resolution'
            }
        };
        validateResolutions(packageJson);

        expect(core.getMultilineInput).toHaveBeenCalledWith("ignore-resolutions");
        expect(core.setFailed).toHaveBeenCalledWith('Resolutions contain packages not included in "ignore-resolutions". Please investigate the root cause of your dependency issues!');
    });

    it('should not fail when resolutions are not present, but ignore list is',  () => {
        (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions' ? ["@test/package"] : []);

        const packageJson: PackageJson = {
            dependencies: {}
        };
        validateResolutions(packageJson);
        expect(core.setFailed).not.toHaveBeenCalled();
    });
})

describe("ignore-resolutions-until", () => {
    it('should not fail when some resolutions are provided and ignore-resolutions-until is set with date in the future',  () => {
        // 1. Arrange
        jest.setSystemTime(new Date("2020-12-31"));
        (core.getInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions-until' ? "2021-01-01" : "");

        // 2. Act
        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution'
            }
        };
        validateResolutions(packageJson);

        // 3. Assert
        expect(core.getInput).toHaveBeenCalledWith("ignore-resolutions-until");
        expect(core.getMultilineInput).not.toHaveBeenCalledWith("ignore-resolutions");

        expect(core.setFailed).not.toHaveBeenCalled();
        expect(core.info).toHaveBeenCalledWith("Ignoring resolutions until 2021-01-01T00:00:00.000Z");
    });

      it('should fail when some resolutions are provided and ignore-resolutions-until is set with date in the past',  () => {
        // 1. Arrange
        jest.setSystemTime(new Date("2021-01-31"));
        (core.getInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions-until' ? "2021-01-01" : "");

        // 2. Act
        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution'
            }
        };
        validateResolutions(packageJson);

        // 3. Assert
        expect(core.getInput).toHaveBeenCalledWith("ignore-resolutions-until");
        expect(core.getMultilineInput).toHaveBeenCalledWith("ignore-resolutions");

        expect(core.setFailed).toHaveBeenCalledWith('Resolutions may not be set. Please investigate the root cause of your dependency issues!');
        expect(core.info).not.toHaveBeenCalledWith();
    });

    it('should fail when some resolutions are provided and ignore-resolutions-until is not set',  () => {
        // 1. Arrange
        jest.setSystemTime(new Date("2021-01-31"));
        (core.getInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions-until' ? "" : "");

        // 2. Act
        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution'
            }
        };
        validateResolutions(packageJson);

        // 3. Assert
        expect(core.getInput).toHaveBeenCalledWith("ignore-resolutions-until");
        expect(core.getMultilineInput).toHaveBeenCalledWith("ignore-resolutions");

        expect(core.setFailed).toHaveBeenCalledWith('Resolutions may not be set. Please investigate the root cause of your dependency issues!');
        expect(core.info).not.toHaveBeenCalledWith();
    });

    it('should not fail when matching resolution is present in package.json and ignore list, while ignore-resolutions-until is provided with date in the past',  () => {
        // 1. Arrange
        jest.setSystemTime(new Date("2021-01-31"));
        (core.getInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions-until' ? "2021-01-01" : "");
        (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'ignore-resolutions' ? [
            "@test/package-foo",
            "@test/package-bar",
        ] : []);

        // 2. Act
        const packageJson: PackageJson = {
            dependencies: {},
            resolutions: {
                "@test/package-foo": 'resolution',
                "@test/package-bar": 'resolution'
            }
        };
        validateResolutions(packageJson);

        // 3. Assert
        expect(core.getInput).toHaveBeenCalledWith("ignore-resolutions-until");
        expect(core.getMultilineInput).toHaveBeenCalledWith("ignore-resolutions");

        expect(core.setFailed).not.toHaveBeenCalled()
        expect(core.info).not.toHaveBeenCalled()
    });
});
