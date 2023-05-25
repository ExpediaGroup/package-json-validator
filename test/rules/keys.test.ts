import {validateKeys} from '../../src/rules/keys';
import * as core from '@actions/core';
import { getMultilineInput } from '@actions/core';
import dupedPackageJson from '../fixtures/duped-package.json';
import dedupedPackageJson from '../fixtures/deduped-package.json';

jest.mock('@actions/core');
(getMultilineInput as jest.Mock).mockReturnValue(['dependencies', 'devDependencies']);

describe('keys', () => {
    it('should fail when package.json contains duplicate keys in dependencies', () => {
        validateKeys(dupedPackageJson, 'test/fixtures/duped-package.json');
        expect(core.setFailed).toHaveBeenCalled();
    });

    it('should not fail when package.json contains no duplicate keys', () => {
        validateKeys(dedupedPackageJson, 'test/fixtures/deduped-package.json');
        expect(core.setFailed).not.toHaveBeenCalled();
    });
});
