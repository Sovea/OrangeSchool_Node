function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

      const model = _this.model('goods');
      const data = yield model.where({ name: ['like', `%${name}%`] }).order(['id DESC']).page(page, size).countSelect();

      return _this.success(data);
    })();
  }
  usergoodsAction(){
    var _this = this;

    return _asyncToGenerator(function* () {
      const page = _this.get('page') || 1;
      const size = _this.get('size') || 10;
      const name = _this.get('name') || '';

      const model = _this.model('goods');
      const data = yield model.where({ name: ['like', `%${name}%`],promotion_desc:["=","二手交易","or","以物换物"]}).order(['id DESC']).page(page, size).countSelect();

      return _this.success(data);
    })();
  }
  infoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const id = _this2.get('id');
      const model = _this2.model('goods');
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
      const model = _this3.model('goods');
      const model2 = _this3.model('goods_gallery');
      const img_url = _this3.post('img_url');
      var img;
      delete values.img_url;
      console.log(img_url);
      values.is_on_sale = values.is_on_sale ? 1 : 0;
      values.is_new = values.is_new ? 1 : 0;
      values.is_hot = values.is_hot ? 1 : 0;
      if (id > 0) {
        var temp_data = yield _this3.model('user_goods').where({ goods_id: id }).find();
        if(temp_data.id){
          yield _this3.model('user_goods').where({ id: temp_data.id }).update({good_status:values.is_on_sale});
        }
        yield model.where({ id: id }).update(values);
        yield _this3.model('product').add({goods_number:values.goods_number,retail_price:values.retail_price});
      } else {
        delete values.id;
        yield model.add(values);
        var good_id = yield model.max('id');
        values.id = good_id;
        yield model.where({ id: good_id }).update({goods_sn:good_id,primary_product_id:good_id});
        yield _this3.model('product').add({goods_id:good_id,goods_specification_ids:"",goods_sn:good_id,goods_number:values.goods_number,retail_price:values.retail_price});
        for(img in img_url){
          console.log(img);
          yield model2.add({goods_id:good_id,img_url:img_url[img],img_desc:"",sort_order:values.sort_order});
        }
        
      }
      return _this3.success(values);
    })();
  }

  destoryAction() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      const id = _this4.post('id');
      var value = yield _this4.model('goods').where({ id: id }).limit(1).find();
      if(value.promotion_desc=="二手交易"||value.promotion_desc=="以物换物"){
        yield _this4.model('user_goods').where({ goods_id: id }).limit(1).delete();
      }
      yield _this4.model('goods').where({ id: id }).limit(1).delete();
      var good_pic;
      const good_pics = yield _this4.model('goods_gallery').field(['img_url']).where({ goods_id: id }).select();
      for(good_pic in good_pics){
      //fs.unlink删除文件
      console.log(good_pics[good_pic]);
      let temp_arr =  good_pics[good_pic].img_url.toString().split("/");
      let temp_name = temp_arr.slice(-1);
      temp_name = think.ROOT_PATH + '/www/' + "static/upload/good/"+temp_name;
      console.log(temp_name);
      fs.unlink(temp_name,function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('删除文件成功');
      })

      }
      yield _this4.model('goods_gallery').where({ goods_id: id }).delete();
      // TODO 删除图片
      return _this4.success();
    })();
  }
};
//# sourceMappingURL=goods.js.map