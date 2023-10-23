import {PackageJson} from 'type-fest';
import {validateResolutions} from '../../src/rules/resolutions';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('resolutions', () => {
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
