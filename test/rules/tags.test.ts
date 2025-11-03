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

import { dependencySatisfiesAllowedTags } from '../../src/rules/tags';
import { afterEach, describe, expect, it, mock } from 'bun:test';

const getMultilineInputMock = mock();
const setFailedMock = mock();
mock.module('@actions/core', () => ({
  getMultilineInput: getMultilineInputMock,
  setFailed: setFailedMock
}));

describe('dependencySatisfiesAllowedTags', () => {
  afterEach(() => {
    mock.clearAllMocks();
  });

  const packageName = 'some-package';
  const allowedTags = ['canary'];

  it('clean version case', () => {
    const version = '1.2.3';

    dependencySatisfiesAllowedTags(packageName, version, allowedTags);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it('caret version case', () => {
    const version = '^1.2.3';

    dependencySatisfiesAllowedTags(packageName, version, allowedTags);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it('canary tag case', () => {
    const version = '0.0.2-canary.323.0';

    dependencySatisfiesAllowedTags(packageName, version, allowedTags);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it('caret canary tag case', () => {
    const version = '^0.0.2-canary.323.0';

    dependencySatisfiesAllowedTags(packageName, version, allowedTags);
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it('invalid tag case', () => {
    const version = '0.0.2-invalid.323.0';

    dependencySatisfiesAllowedTags(packageName, version, allowedTags);
    expect(setFailedMock).toHaveBeenCalled();
  });
});
