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
const xss = require("xss");
const fs = require('fs');
module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  ArticleInfoAction() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      const id = _this2.get('article_id');
      const model = _this2.model('post_article');
      var data = yield model.where({ article_id: id }).find();
      var new_article_view = data.article_view + 1;
      data.string_date = formatDate(data.article_post_time, "yyyy-MM-dd HH:mm:ss");
      yield model.where({ article_id: id }).update({ article_view: new_article_view });
      delete data.open_id;
      return _this2.success(data);
    })();
  }
  ArticleSearchAction() {
    var _this = this;
    return _asyncToGenerator(function* () {
      const model = _this.model("post_article");
      const page = _this.get('page') || 1;
      const size = _this.get('offset') || 20;
      const keyword = _this.get('keyword') || '';
      var data = [];
      data = yield model.field(['article_id', 'article_header', 'article_content', 'article_abstract', 'article_post_time', 'num_like', 'num_comment', 'article_type', 'article_view', 'username', 'head_img', 'user_id', 'thumbnail', 'on_top']).where({ article_header: ['like', `%${keyword}%`] }).order(['on_top DESC', 'article_id DESC']).page(page, size).select();
      return _this.success(data);
    })();
  }

  ArticleListAction() {
    var _this = this;
    return _asyncToGenerator(function* () {
      const model = _this.model("post_article");
      const page = _this.get('page') || 1;
      const size = _this.get('offset') || 20;
      const name = _this.get('name') || '';
      const article_type = _this.get('article_type') || 0;
      const user_id = _this.getLoginUserId() || 0;
      var data = [];
      var item;
      if (article_type < 5 && article_type != 0) {
        data = yield model.field(['article_id', 'article_header', 'article_content', 'article_abstract', 'article_post_time', 'num_like', 'num_comment', 'article_type', 'article_view', 'username', 'head_img', 'user_id', 'thumbnail', 'on_top']).where({ article_header: ['like', `%${name}%`], article_type: article_type }).order(['on_top DESC', 'article_id DESC']).page(page, size).select();
        for (item in data) {
          data[item].string_date = formatDate(data[item].article_post_time, "yyyy-MM-dd HH:mm:ss");
        }
      } else if (article_type == 5) {
        data = yield model.field(['article_id', 'article_header', 'article_content', 'article_abstract', 'article_post_time', 'num_like', 'num_comment', 'article_type', 'article_view', 'username', 'head_img', 'user_id', 'thumbnail', 'on_top']).where({ article_header: ['like', `%${name}%`], user_id: user_id }).order(['on_top DESC', 'article_id DESC']).page(page, size).select();
        for (item in data) {
          data[item].string_date = formatDate(data[item].article_post_time, "yyyy-MM-dd HH:mm:ss");
        }
      } else if (article_type == 0) {
        data = yield model.field(['article_id', 'article_header', 'article_content', 'article_abstract', 'article_post_time', 'num_like', 'num_comment', 'article_type', 'article_view', 'username', 'head_img', 'user_id', 'thumbnail', 'on_top']).where({ article_header: ['like', `%${name}%`] }).order(['on_top DESC', 'article_id DESC']).page(page, size).select();
        for (item in data) {
          data[item].string_date = formatDate(data[item].article_post_time, "yyyy-MM-dd HH:mm:ss");
        }
      }

      return _this.success(data);
    })();
  }
  ArticleLikeAction() {
    var _this = this;
    return _asyncToGenerator(function* () {
      const model = _this.model("post_article");
      const article_id = _this.get('article_id') || 0;
      const post_like = _this.get('post_like') || 1;
      var data = [];
      // model.transaction(function * (){
      const ArticleInfo = yield model.where({ article_id: article_id }).find();
      var new_num_like = post_like == 0 ? ArticleInfo.num_like + 1 : ArticleInfo.num_like - 1;
      if (new_num_like < 0) {
        new_num_like = 0;
      }
      data = yield model.where({ article_id: article_id }).update({ num_like: new_num_like });

      // });
      return _this.success(data);
    })();
  }
  ArticleDeleteAction() {
    var _this = this;
    this.allowMethods = 'POST';
    return _asyncToGenerator(function* () {
      const model = _this.model("post_article");
      const article_id = _this.post('article_id');
      const user_id = _this.getLoginUserId();
      var data = [];
      // model.transaction(function * (){
      const model1 = _this.model('comment_article').db(model.db());
      data = yield model.where({ article_id: article_id, user_id: user_id }).limit(1).delete();
      data = yield model1.where({ article_id: article_id }).delete();
      var good_pic;
      const model2 = _this.model('article_gallery').db(model.db());
      const good_pics = yield model2.field(['img_url']).where({ article_id: article_id }).select();
      yield model2.field(['img_url']).where({ article_id: article_id }).delete();
      for (good_pic in good_pics) {
        //fs.unlink删除文件
        console.log(good_pics[good_pic]);
        let temp_arr = good_pics[good_pic].img_url.toString().split("/");
        let temp_name = temp_arr.slice(-1);
        temp_name = think.ROOT_PATH + '/www/' + "static/upload/article/" + temp_name;
        console.log(temp_name);
        fs.unlink(temp_name, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log('删除文件成功');
        });
      }

      return _this.success(data);
      // })

    })();
  }
  ArticlePicAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const articleFile = _this.file('article_pic');
      if (think.isEmpty(articleFile)) {
        return _this.fail('保存失败');
      }
      const that = _this;
      const filename = 'static/upload/article/' + think.uuid(32) + '.jpg';
      const is = fs.createReadStream(articleFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www/' + filename);
      is.pipe(os);

      return that.success({
        name: 'article_pic',
        fileUrl: 'https://wjlpt.com/nideshop_api' + filename
      });
    })();
  }
  PostArticleAction() {
    this.allowMethods = 'POST';
    var _this = this;
    return _asyncToGenerator(function* () {
      const model = _this.model('post_article');
      var user_id = _this.getLoginUserId();
      var value = _this.post();
      value.article_header = xss(_this.post("article_header"));
      value.article_abstract = xss(_this.post("article_abstract"));
      value.article_content = xss(_this.post("article_content"));
      value.article_post_time = xss(_this.post("article_post_time"));
      value.article_type = xss(_this.post("article_type"));
      value.on_top = _this.post("on_top") || 0;
      console.log(value.images_url);
      var headimg_man = "https://sparrowoo.top/images/profile/Headimg_MaleIndex.jpeg";
      var headimg_woman = "https://sparrowoo.top/images/profile/Headimg_FeMaleIndex.jpeg";

      var userInfo = yield _this.model('user').where({ id: user_id }).find();
      value.user_id = user_id;
      value.open_id = userInfo.weixin_openid;
      value.num_like = 0;
      value.num_comment = 0;
      value.article_view = 0;
      value.username = userInfo.nickname;
      value.head_img = userInfo.avatar;
      if (value.article_type == 4) {
        value.username = userInfo.gender ? "某男同学" : "某女同学";
        value.head_img = userInfo.gender ? headimg_man : headimg_woman;
      }
      // model.transaction(function * (){
      const article_id = yield model.add(value);
      const model1 = _this.model('article_gallery').db(model.db());
      var each_item;
      for (each_item in value.images_url) {
        yield model1.add({ article_id: article_id, img_url: value.images_url[each_item] });
      }
      delete value.open_id;
      return _this.success(value);
      // });

    })();
  }

};
/**
 * 时间字符串转换
 * 
 */
function formatDate(date, format) {
  if (!date) return;
  if (!format) format = "yyyy-MM-dd";
  switch (typeof date) {
    case "string":
      date = new Date(date.replace(/-/, "/"));
      break;
    case "number":
      date = new Date(date);
      break;
  }
  if (!date instanceof Date) return;
  var dict = {
    "yyyy": date.getFullYear(),
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "H": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "MM": ("" + (date.getMonth() + 101)).substr(1),
    "dd": ("" + (date.getDate() + 100)).substr(1),
    "HH": ("" + (date.getHours() + 100)).substr(1),
    "mm": ("" + (date.getMinutes() + 100)).substr(1),
    "ss": ("" + (date.getSeconds() + 100)).substr(1)
  };
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]];
  });
}
//# sourceMappingURL=brand.js.map