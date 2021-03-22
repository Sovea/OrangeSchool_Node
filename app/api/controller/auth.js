function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  loginByWeixinAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const code = _this.post('code');
      const fullUserInfo = _this.post('userInfo');
      const clientIp = _this.ctx.ip;

      // 解释用户数据
      const { errno, errmsg, data: userInfo } = yield _this.service('weixin', 'api').login(code, fullUserInfo);
      if (errno !== 0) {
        return _this.fail(errno, errmsg);
      }

      // 根据openid查找用户是否已经注册
      let userId = yield _this.model('user').where({ weixin_openid: userInfo.openid }).getField('id', true);
      if (think.isEmpty(userId)) {
        // 注册
        userId = yield _this.model('user').add({
          username: '微信用户' + think.uuid(6),
          password: '',
          register_time: parseInt(new Date().getTime() / 1000),
          register_ip: clientIp,
          mobile: '',
          weixin_openid: userInfo.openid,
          avatar: userInfo.avatarUrl || '',
          gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
          nickname: userInfo.nickName
        });
      }

      // 查询用户信息
      const newUserInfo = yield _this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

      // 更新登录信息
      yield _this.model('user').where({ id: userId }).update({
        last_login_time: parseInt(new Date().getTime() / 1000),
        last_login_ip: clientIp
      });

      const TokenSerivce = _this.service('token', 'api');
      const sessionKey = yield TokenSerivce.create({ user_id: userId });

      if (think.isEmpty(sessionKey)) {
        return _this.fail('生成 token 失败');
      }

      return _this.success({ token: sessionKey, userInfo: newUserInfo });
    })();
  }

  logoutAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.success();
    })();
  }
};
//# sourceMappingURL=auth.js.map