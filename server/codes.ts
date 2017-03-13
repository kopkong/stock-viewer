/**
 * Created by colin on 2017/3/8.
 */

const CODE = {
  LOGIN_FAIL                  : 1001,
  LOGIN_FAIL_PASSWORD_WRONG   : 1002,
  LOGIN_FAIL_USER_NOT_FOUND   : 1003,
  LOGIN_SUCCESS               : 1004,
};

const CODE_MESSAGE = {
  LOGIN_FAIL                  : '登陆失败',
  LOGIN_FAIL_PASSWORD_WRONG   : '密码错误',
  LOGIN_FAIL_USER_NOT_FOUND   : '用户不存在',
  LOGIN_SUCCESS               : '登陆成功',
};

export { CODE, CODE_MESSAGE };
