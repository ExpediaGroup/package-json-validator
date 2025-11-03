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

import { dependencySatisfiesAllowedRanges } from '../../src/rules/ranges';
import { afterEach, describe, expect, it, mock } from 'bun:test';

const getMultilineInputMock = mock(() => ['dependencies', 'devDependencies']);
const setFailedMock = mock();
mock.module('@actions/core', () => ({
  getMultilineInput: getMultilineInputMock,
  setFailed: setFailedMock
}));

describe('dependencySatisfiesAllowedRanges', () => {
  afterEach(() => {
    mock.clearAllMocks();
  });

  const packageName = 'some-package';

  describe('no allowed version ranges case', () => {
    const allowedVersionRanges: string[] = [];

    describe('exact version case', () => {
      const version = '1.2.3';

      it('should call core info', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });

    describe('caret version case', () => {
      const version = '^1.2.3';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).toHaveBeenCalled();
      });
    });

    describe('canary version case', () => {
      const version = '0.0.2-canary.323.0';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('some allowed version ranges case', () => {
    const allowedVersionRanges = ['^', '>=', '*'];

    describe('exact version case', () => {
      const version = '1.2.3';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });

    describe('caret version case', () => {
      const version = '^1.2.3';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });

    describe('>= version case', () => {
      const version = '>=1.2.3';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });

    describe('tilde version case', () => {
      const version = '~1.2.3';

      it('should call core setFailed', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).toHaveBeenCalled();
      });
    });

    describe('star version case', () => {
      const version = '*';

      it('should not call core setFailed', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });

    describe('canary version case', () => {
      const version = '0.0.2-canary.323.0';

      it('should return expected result', () => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges);
        expect(setFailedMock).not.toHaveBeenCalled();
      });
    });
  });
});
