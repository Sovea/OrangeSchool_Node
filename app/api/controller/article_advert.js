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
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    var _this = this;
    return _asyncToGenerator(function* () {
      const page = _this.get('page') || 1;
      const size = _this.get('size') || 10;
      const name = _this.get('name') || '';

      const model = _this.model('article_ad');
      const data = yield model.field(['id', 'ad_position_id', 'media_type', 'name', 'link', 'image_url', 'content', 'end_time', 'enabled']).where({ name: ['like', `%${name}%`] }).order(['id DESC']).page(page, size).countSelect();
      return _this.success(data);
    })();
  }

  infoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const id = _this2.get('id');
      const model = _this2.model('article_ad');
      const data = yield model.where({ id: id }).find();

      return _this2.success(data);
    })();
  }

};
//# sourceMappingURL=brand.js.map