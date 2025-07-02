/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as core from '@actions/core';
import { PackageJson } from 'type-fest';
import { getDependencies } from '../../src/utils/get-dependencies';

jest.mock('@actions/core');

describe('getDependencies', () => {
  describe('dependencies exist case', () => {
    let result: unknown;
    const dependencies = {
      'some-package': '1.2.3'
    };
    const packageJson: PackageJson = {
      name: 'my-package-json',
      dependencies
    }

    beforeEach(() => {
      (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'dependency-types' ? ['dependencies'] : []);
      result = getDependencies(packageJson);
    });

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
      expect(result).toEqual(dependencies);
    });
  });

  describe('multiple dependencies case', () => {
    let result: unknown;
    const packageJson: PackageJson = {
      name: 'my-package-json',
      dependencies: {
        'some-package': '1.2.3',
        'some-package-2': '4.5.6'
      },
      devDependencies: {
        'some-other-package': '1.2.3',
        'some-other-package-2': '4.5.6'
      }
    }

    beforeEach(() => {
      (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'dependency-types' ? ['dependencies', 'devDependencies'] : []);
      result = getDependencies(packageJson);
    });

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
      expect(result).toEqual({
        'some-package': '1.2.3',
        'some-package-2': '4.5.6',
        'some-other-package': '1.2.3',
        'some-other-package-2': '4.5.6'
      });
    });
  });

  describe('dependencies do not exist case', () => {
    const packageJson: PackageJson = {
      name: 'my-package-json'
    }

    it('should return expected result', () => {
      expect(() => getDependencies(packageJson)).toThrow()
      expect(core.setFailed).toHaveBeenCalled();
    });
  });

  describe('ignore dependencies case', () => {
    let result: unknown;
    const packageJson: PackageJson = {
      name: 'my-package-json',
      dependencies: {
        'some-package': '1.2.3',
        'some-package-to-ignore': '4.5.6'
      },
      devDependencies: {
        'some-other-package': '1.2.3',
        'some-other-package-2': '4.5.6'
      }
    }

    beforeEach(() => {
      (core.getMultilineInput as jest.Mock).mockImplementation(input => input === 'dependency-types' ? ['dependencies', 'devDependencies'] : ['some-package-to-ignore']);
      result = getDependencies(packageJson);
    });

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
      expect(result).toEqual({
        'some-package': '1.2.3',
        'some-other-package': '1.2.3',
        'some-other-package-2': '4.5.6'
      });
    });
  });
});
