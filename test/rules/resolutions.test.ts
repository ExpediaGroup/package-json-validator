import {PackageJson} from 'type-fest';
import {validateResolutions} from '../../src/rules/resolutions';
import * as core from '@actions/core';

jest.mock('@actions/core');

beforeEach(() => {
    // N.B: Ensure we return empty array to match the default behavior of getMultilineInput
    (core.getMultilineInput as jest.Mock).mockImplementation(()=> []);
})

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
