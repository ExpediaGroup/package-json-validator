import {PackageJson} from 'type-fest';
import * as core from '@actions/core';
import { validateAlphabetical } from '../../src/rules/alphabetical';
import { getMultilineInput } from '@actions/core';

jest.mock('@actions/core');

(getMultilineInput as jest.Mock).mockReturnValue(['dependencies', 'devDependencies']);

describe('alphabetical', () => {
    it('should fail when dependencies are not in alphabetical order', () => {
        const packageJson: PackageJson = {
            dependencies: {
                'a-package': '1.2.3',
                'c-package': '1.2.3',
                'b-package': '1.2.3',
            },
            devDependencies: {
                'c-package': '1.2.3',
                'd-package': '1.2.3',
                'e-package': '1.2.3',
            }
        };
        validateAlphabetical(packageJson);
        expect(core.setFailed).toHaveBeenCalled();
    });

    it('should fail when devDependencies are not in alphabetical order', () => {
        const packageJson: PackageJson = {
            dependencies: {
                'a-package': '1.2.3',
                'b-package': '1.2.3',
                'c-package': '1.2.3',
            },
            devDependencies: {
                'd-package': '1.2.3',
                'c-package': '1.2.3',
                'e-package': '1.2.3',
            }
        };
        validateAlphabetical(packageJson);
        expect(core.setFailed).toHaveBeenCalled();
    });

    it('should not fail when dependencies are in alphabetical order', () => {
        const packageJson: PackageJson = {
            dependencies: {
                'a-package': '1.2.3',
                'b-package': '1.2.3',
                'c-package': '1.2.3',
            },
            devDependencies: {
                'c-package': '1.2.3',
                'd-package': '1.2.3',
                'e-package': '1.2.3',
            }
        };
        validateAlphabetical(packageJson);
        expect(core.setFailed).not.toHaveBeenCalled();
    });
});
