const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const MEGAMENU_DATA_SOURCE_FILENAME = 'megamenu/index.yml'
const MEGAMENU_CACHE_FILENAME = 'megamenu.json';

const chai = require('chai');
const CURRENT_MEGAMENU_DATA = require('../../../../platform/site-wide/mega-menu/mega-menu-link-data.json');

function writeToCache(buildOptions, megaMenuData) {
  const megamenuDataCacheFileName = path.join(buildOptions.cacheDirectory, MEGAMENU_CACHE_FILENAME);
  const serialized = JSON.stringify(megaMenuData, null, 4);

  fs.ensureDirSync(buildOptions.cacheDirectory);
  fs.writeFileSync(megamenuDataCacheFileName, serialized);
}

function createMegaMenu(buildOptions) {
  return (files, metalsmith, done) => {
    const fragmentsRoot = metalsmith.path(buildOptions.contentFragments);
    const megaMenuDataSourceFile = path.join(fragmentsRoot, MEGAMENU_DATA_SOURCE_FILENAME);
    const megaMenuFile = fs.readFileSync(megaMenuDataSourceFile);
    const megaMenuData = yaml.safeLoad(megaMenuFile);

    console.log('comparing megamenu data structures....');
    chai.expect(CURRENT_MEGAMENU_DATA).to.be.deep.equal(megaMenuData, 'The data is not equal!');
    console.log('Looks good!')
    writeToCache(buildOptions, megaMenuData);
    done();
  };
}

module.exports = createMegaMenu;
