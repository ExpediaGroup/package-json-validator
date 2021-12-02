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
import { getDependencies } from '../../src/utils/getDependencies';
import { validateDependencies } from '../../src/utils/validateDependencies';

jest.mock('@actions/core');
jest.mock('../../src/utils/getDependencies');

describe('validateDependencies', () => {
  describe('no dependencies case', () => {
    const method = jest.fn();
    const extraInputName = 'extra input';
    const package1 = 'package1';
    const package2 = 'package2';
    const version1 = 'version1';
    const version2 = 'version2';
    beforeEach(() => {
      (getDependencies as jest.Mock).mockReturnValue({
        'package1': 'version1',
        'package2': 'version2',
      });
      (core.getMultilineInput as jest.Mock).mockReturnValue(extraInputName);
      validateDependencies(method, {}, extraInputName);
    })

    it('should call getMultilineInput', () => {
      expect(core.getMultilineInput).toHaveBeenCalledWith(extraInputName);
    });

    it('should call dependencySatisfiesAllowedRanges', () => {
      expect(method).toHaveBeenCalledWith(package1, version1, extraInputName);
      expect(method).toHaveBeenCalledWith(package2, version2, extraInputName);
    });
  })
});
