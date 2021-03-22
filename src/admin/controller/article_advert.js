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
  
    storeAction() {
      var _this3 = this;
  
      return _asyncToGenerator(function* () {
        if (!_this3.isPost) {
          return false;
        }
  
        const values = _this3.post();
        const id = _this3.post('id');
  
        const model = _this3.model('article_ad');
        values.enabled = values.enabled ? 1 : 0;
        if (id > 0) {
          yield model.where({ id: id }).update(values);
        } else {
          delete values.id;
          yield model.add(values);
        }
        return _this3.success(values);
      })();
    }
  
    destoryAction() {
      var _this4 = this;
  
      return _asyncToGenerator(function* () {
        const id = _this4.post('id');
        const good_pics = yield _this4.model('article_ad').where({ id: id }).select();
        yield _this4.model('article_ad').where({ id: id }).limit(1).delete();
        // TODO 删除图片
        var good_pic;
        for(good_pic in good_pics){
          //fs.unlink删除文件
          console.log(good_pics[good_pic]);
          let temp_arr =  good_pics[good_pic].image_url.toString().split("/");
          let temp_name = temp_arr.slice(-1);
          temp_name = think.ROOT_PATH + '/www/' + "static/upload/advert/"+temp_name;
          console.log(temp_name);
          fs.unlink(temp_name,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('删除文件成功');
          })
    
          }
        return _this4.success();
      })();
    }
  
  };
  //# sourceMappingURL=brand.js.map