import { expect } from 'chai';
import AbstractConfig from './abstract-config';
import { EXTENSION_BIT_CONFIG_PREFIX } from '../../constants';

const rawExtension1 = {
  myKey: 'myVal',
  _bit_pathToLoadFrom: '/myExtensionPath',
  _bit_disabled: false,
  _bit_files: {
    myFile: 'myFilePath'
  }
};

const rawExtension2 = {
  myKey2: 'myVal2',
  _bit_pathToLoadFrom: '/myExtensionPath2',
  _bit_disabled: false,
  _bit_files: {
    myFile2: 'myFilePath2'
  }
};

describe('extensions transformation', () => {
  describe('from extension to raw extension', () => {
    let rawExtension;
    before(() => {
      const extension = {
        rawConfig: {
          myKey: 'myVal'
        },
        options: {
          pathToLoadFrom: '/myExtensionPath',
          disabled: false
        },
        files: {
          myFile: 'myFilePath'
        }
      };
      rawExtension = AbstractConfig.transformExtensionToRawExtension(extension);
    });
    it('should have bit options with correct prefix', () => {
      expect(rawExtension).to.have.property(`${EXTENSION_BIT_CONFIG_PREFIX}pathToLoadFrom`, '/myExtensionPath');
      expect(rawExtension).to.have.property(`${EXTENSION_BIT_CONFIG_PREFIX}disabled`, false);
    });
    it('should have the raw config', () => {
      expect(rawExtension).to.have.property('myKey', 'myVal');
    });
    it('should have the files', () => {
      const filesKeyName = `${EXTENSION_BIT_CONFIG_PREFIX}files`;
      expect(rawExtension).to.have.property(filesKeyName);
      expect(rawExtension[filesKeyName]).to.have.property('myFile', 'myFilePath');
    });
    it('should not have the extension keys (rawConfig / options)', () => {
      expect(rawExtension).to.not.have.property('rawConfig');
      expect(rawExtension).to.not.have.property('options');
      expect(rawExtension).to.not.have.property('files');
    });
  });
  describe('from raw extension to extension', () => {
    let extension;
    before(() => {
      extension = AbstractConfig.transformRawExtensionToExtension(rawExtension1);
    });
    it('should have bit options with correct values', () => {
      expect(extension).to.have.property('options');
      expect(extension.options).to.have.property('pathToLoadFrom', '/myExtensionPath');
      expect(extension.options).to.have.property('disabled', false);
    });
    it('should have the raw config', () => {
      expect(extension).to.have.property('rawConfig');
      expect(extension.rawConfig).to.have.property('myKey', 'myVal');
    });
    it('should have the config files', () => {
      expect(extension).to.have.property('files');
      expect(extension.files).to.have.property('myFile', 'myFilePath');
    });
    it('should not have the original raw extension keys', () => {
      expect(extension).to.not.have.property('myKey');
      expect(extension).to.not.have.property('_bit_pathToLoadFrom');
      expect(extension).to.not.have.property('_bit_disabled');
      expect(extension).to.not.have.property('_bit_files');
    });
  });
  describe('transform all raw extensions to extensions', () => {
    const rawExtensions = {
      ext1: rawExtension1,
      ext2: rawExtension2
    };
    let extensions;
    before(() => {
      extensions = AbstractConfig.transformAllRawExtensionsToExtensions(rawExtensions);
    });
    it('should have all extensions entries', () => {
      expect(extensions).to.have.property('ext1');
      expect(extensions).to.have.property('ext2');
    });
    it('should have bit options with correct values', () => {
      expect(extensions.ext1).to.have.property('options');
      expect(extensions.ext1.options).to.have.property('pathToLoadFrom', '/myExtensionPath');
      expect(extensions.ext1.options).to.have.property('disabled', false);
      expect(extensions.ext2).to.have.property('options');
      expect(extensions.ext2.options).to.have.property('pathToLoadFrom', '/myExtensionPath2');
      expect(extensions.ext2.options).to.have.property('disabled', false);
    });
    it('should have the raw config', () => {
      expect(extensions.ext1).to.have.property('rawConfig');
      expect(extensions.ext1.rawConfig).to.have.property('myKey', 'myVal');
      expect(extensions.ext2).to.have.property('rawConfig');
      expect(extensions.ext2.rawConfig).to.have.property('myKey2', 'myVal2');
    });
    it('should have the config files', () => {
      expect(extensions.ext1).to.have.property('files');
      expect(extensions.ext2).to.have.property('files');
      expect(extensions.ext1.files).to.have.property('myFile', 'myFilePath');
      expect(extensions.ext2.files).to.have.property('myFile2', 'myFilePath2');
    });
    it('should not have the original raw extension keys', () => {
      expect(extensions.ext1).to.not.have.property('myKey');
      expect(extensions.ext1).to.not.have.property('_bit_pathToLoadFrom');
      expect(extensions.ext1).to.not.have.property('_bit_disabled');
      expect(extensions.ext1).to.not.have.property('_bit_files');
      expect(extensions.ext2).to.not.have.property('myKey');
      expect(extensions.ext2).to.not.have.property('_bit_pathToLoadFrom');
      expect(extensions.ext2).to.not.have.property('_bit_disabled');
      expect(extensions.ext2).to.not.have.property('_bit_files');
    });
  });
  describe('transform all extensions to raw extensions', () => {
    const rawExtensions = {
      ext1: rawExtension1,
      ext2: rawExtension2
    };
    let rawExtensionsCalculated;
    before(() => {
      const extensions = AbstractConfig.transformAllRawExtensionsToExtensions(rawExtensions);
      rawExtensionsCalculated = AbstractConfig.transformAllExtensionsToRawExtensions(extensions);
    });
    it('should transform correct', () => {
      expect(rawExtensionsCalculated).to.deep.equal(rawExtensions);
    });
  });
});
