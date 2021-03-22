function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }return step("next");
    });
  };
}

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  brandPicAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const brandFile = _this.file('brand_pic');
      if (think.isEmpty(brandFile)) {
        return _this.fail('保存失败');
      }
      const that = _this;
      const filename = 'static/upload/brand/' + think.uuid(32) + '.jpg';
      const is = fs.createReadStream(brandFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'brand_pic',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }
  adPicAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const advertFile = _this.file('ad_pic');
      if (think.isEmpty(advertFile)) {
        return _this.fail('保存失败');
      }
      const that = _this;
      const filename = 'static/upload/advert/' + think.uuid(32) + '.jpg';
      const is = fs.createReadStream(advertFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'ad_pic',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }
  article_adPicAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const advertFile = _this.file('ad_pic');
      if (think.isEmpty(advertFile)) {
        return _this.fail('保存失败');
      }
      const that = _this;
      const filename = 'static/upload/article_advert/' + think.uuid(32) + '.jpg';
      const is = fs.createReadStream(advertFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'ad_pic',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }
  brandNewPicAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const brandFile = _this2.file('brand_new_pic');
      if (think.isEmpty(brandFile)) {
        return _this2.fail('保存失败');
      }
      const that = _this2;
      const filename = '/static/upload/brand/' + think.uuid(32) + '.jpg';

      const is = fs.createReadStream(brandFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'brand_new_pic',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }

  categoryWapBannerPicAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const imageFile = _this3.file('wap_banner_pic');
      if (think.isEmpty(imageFile)) {
        return _this3.fail('保存失败');
      }
      const that = _this3;
      const filename = '/static/upload/category/' + think.uuid(32) + '.jpg';

      const is = fs.createReadStream(imageFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'wap_banner_url',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }

  topicThumbAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const imageFile = _this4.file('scene_pic_url');
      if (think.isEmpty(imageFile)) {
        return _this4.fail('保存失败');
      }
      const that = _this4;
      const filename = '/static/upload/topic/' + think.uuid(32) + '.jpg';

      const is = fs.createReadStream(imageFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'scene_pic_url',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }
};
//# sourceMappingURL=upload.js.map