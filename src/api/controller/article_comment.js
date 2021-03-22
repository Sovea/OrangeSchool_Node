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
        delete data.open_id;
        return _this2.success(data);
      })();
    }
    CommentListAction() {
        var _this = this;
        return _asyncToGenerator(function* () {
            const user_id = _this.getLoginUserId();
            const model = _this.model("comment_article");
            const page = _this.get('page') || 1;
            const size = _this.get('offset') || 20;
            const name = _this.get('name') || '';
            const article_id = _this.get('article_id') || 0;
            var data = [];
            data = yield model.field(['id','article_id','comment_content','post_date','nickname','avatar','user_id']).where({article_id:article_id}).order(['id DESC']).page(page, size).select();
            return _this.success(data);
          })();
    }
    CommentDeleteAction() {
        var _this = this;
        this.allowMethods = 'POST';
        return _asyncToGenerator(function* () {
            const model = _this.model("post_article");
            const user_id = _this.getLoginUserId();
            const comment_id = _this.post('comment_id');
            var commentInfo = yield _this.model('comment_article').where({ id: comment_id }).find();
            var ArticleInfo = yield _this.model('post_article').where({ article_id: commentInfo.article_id }).find();
            var data = [];
            data = yield _this.model('comment_article').where({id:comment_id,user_id:user_id}).limit(1).delete();
            let new_num_comment = ArticleInfo.num_comment-1;
            if(new_num_comment < 0){
                new_num_comment=0;
            }
            data = yield model.where({article_id:commentInfo.article_id,user_id:user_id}).limit(1).update({num_comment:new_num_comment});
            return _this.success(data);
          })();
    }
    CommentPostAction() {
        this.allowMethods = 'POST';
        var _this = this;
        return _asyncToGenerator(function* () {
          var user_id = _this.getLoginUserId();
          var value = _this.post();
          value.comment_content = xss(_this.post("comment_content"));
          var userInfo = yield _this.model('user').where({ id: user_id }).find();
          var ArticleInfo = yield _this.model('post_article').where({ article_id: value.article_id }).find();
          value.open_id = userInfo.weixin_openid;
          value.nickname = userInfo.nickname;
          value.avatar = userInfo.avatar;
          value.user_id = user_id;
          var data = yield _this.model('comment_article').add(value);
          data = yield _this.model('post_article').where({ article_id: value.article_id }).update({num_comment:ArticleInfo.num_comment+1});
          return _this.success(data);
        })();
      }

  
  };
  //# sourceMappingURL=brand.js.map