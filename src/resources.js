import Notification from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});

function isNewReturnType(data) {
  let keys = Object.keys(data);
  if (keys.length !== 3) return false;
  return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  if(config.method === 'get') {
    config.paramsSerializer = params => {
      return qs.stringify(params, {indices: false});
    }
  }
  return config;
});

http.interceptors.response.use(response => {
  if (isNewReturnType(response.data)) {
    switch (response.data.code) {
      case 200 :
        return response.data;
      case 401:
        window.location.href = '#/login';
        return Promise.reject({response});
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        return Promise.reject({response});
      case 400:
        return Promise.reject({response});
      default:
        return Promise.reject({response});
    }
  } else {
    return response;
  }
}, error => {
  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  if (notice === '1' && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }
  if (!response || response.status === 500) {
    Notification.warning({
      message: '服务器太久没有响应, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    return Promise.reject(error);
  }
  if (response.status === 401) { //  Unauthorized, redirect to login
    let lastUrl = window.localStorage.getItem('lastUrl');
    if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
    }
    window.location.href = '#/login';
    return Promise.reject(error);
  }
  if (response.status === 403) {
    Notification.error({
      message: '您没有权限请求信息，请联系管理员。',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }

  if (response.status === 502) {
    Notification.error({
      message: '系统请求失败',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http;

// 接口角色管理
export const APIRule = resource('/admin/menus', http, {});

export const OauthClient = resource('/oauth-client-details', http, {
  getOneOauthClient: (id, params) => {
    return http.get('/oauth-client-details/org/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
  }
});

// 部门对象
export const Department = resource('/department', http, {
  getPage: (params) => {
    return http.get('/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('/department/members', {params});
  },
  queryStateNum: (params) => {
    return http.get('/department/member/count', {params});
  }
});

// 货主用户权限对象
export const OrgUser = resource('/dhs/user/org', http, {
  queryOrgInfo: (id, params) => {
    return http.get('/dhs/user/org/' + id, {params});
  },
  queryUsers: (id, params) => {
    return http.get('/dhs/user/org/' + id, {params});
  },
  updateOrgUser: (id, params) => {
    return http.put('/dhs/user/org/' + id, params);
  }
});

// 平台用户权限对象
export const User = resource('/dhs/user', http, {
  checkEmail: (email, userId, orgId) => {
    return http.get('/dhs/user/email', {
      params: {email: email, userId: userId, orgId: orgId}
    });
  },
  checkPhone: (phone, userId, orgId) => {
    return http.get('/dhs/user/phone', {
      params: {phone: phone, userId: userId, orgId: orgId}
    });
  },
  resetPsw: (Obj) => {
    return http.put('/dhs/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('/dhs/user/password/verifyMail', obj);
  },
  stopUser: (userId) => {
    return http.put(`/dhs/user/${userId}/stop`);
  },
  enableUser: (userId) => {
    return http.put(`/dhs/user/${userId}/enablement`);
  }
});

// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: () => {
    return http.get('/oms/access/menus/tree', {params: {objectId: 'openapi-system'}});
  },
  getOrgRoleList: (orgId, params) => {
    return http.get('/oms/access/org/' + orgId + '/role', {params});
  },
  getOrgRole: (orgId, params) => {
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  bandOrgRole: (obj) => {
    return http.post('/oms/access/bind/role', obj);
  },
  queryStateNum: (params) => {
    return http.get('/oms/access/platform/count', {params});
  },
  deleteBandingRole: (id) => {
    return http.delete('/oms/access/unbind/role/' + id, {});
  },
  addApiAccess: (params) => {
    return http.post('/oms/access/org', params);
  },
  queryApiAccess: (params) => {
    return http.get('/oms/access/org', {params});
  }
});

export const Auth = {
  checkLogin: () => {
    return http.get('/dhs/userinfo');
  },
  login: (data) => {
    return http.post('/dhs/login', data);
  },
  logout: () => {
    return http.get('/dhs/logout');
  },
  isLogin () {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/dhs-account/permissions', {params: {objectId: 'openapi-system'}});
  }
};

// 数据字典组对象
export const DictGroup = resource('/dictGroup', http, {
  checkGroupName: (groupName, groupId) => {
    return http.get('/dictGroup/name', {
      params: {groupName: groupName, groupId: groupId}
    });
  },
  checkItemKey: (key, itemId, groupId) => {
    return http.get('/dictItem/key', {
      params: {key: key, itemId: itemId, groupId: groupId}
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      http.get('/dictGroups').then(res => {
        let data = {};
        let groupItem;
        let item;
        for (let i = 0, len = res.data.length; i < len; i++) {
          groupItem = res.data[i];
          data[groupItem.group.name] = [];
          for (let j = 0, len1 = groupItem.items.length; j < len1; j++) {
            item = groupItem.items[j];
            data[groupItem.group.name].push({key: item.key, label: item.label});
          }
        }
        resolve(data);
      });
    });
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核组织基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
  },
  // 校验邮箱
  checkEmail: (email, userId) => {
    return http.get('/dhs/user/email', {
      params: {email: email, userId: userId}
    });
  },
  // 校验名字
  checkName: (name, orgId) => {
    return http.get('/orgs/name', {
      params: {name, orgId}
    });
  },
  // 校验身份证
  checkCreditCode: (creditCode, orgId) => {
    return http.get('/orgs/creditCode', {
      params: {creditCode, orgId}
    });
  },
  // 校验oms代码唯一性
  checkManufacturerCode: (code, orgId) => {
    return http.get('/orgs/manufacturerCode', {
      params: {code, orgId}
    });
  },
  // 校验管理员账户唯一性
  checkAdminAccount: (account, orgId) => {
    return http.get('/orgs/account', {
      params: {account, orgId}
    });
  },

  // 货主基本信息
  queryBaseInfo: (orgid) => {
    return http.get('/orgs/' + orgid);
  },
  // 删除客服人员
  deleteCus: (id) => {
    return http.delete('/cusService/' + id, {});
  },
  // 添加客服人员
  addCus: (obj) => {
    return http.post('/cusService', obj);
  },
  // 添加货主经营范围
  addOrgScope: (obj) => {
    return http.post('/orgScope', obj);
  },
  // 删除货主经营范围
  deleteOrgScope: (id) => {
    return http.delete('/orgScope/' + id);
  },
  // 查询其他客服人员
  queryOtherCus: (obj) => {
    return http.get('/cusService/orgs/' + obj.orgId + '/users', {obj});
  },
  // 新增受控法规
  addFg: (obj) => {
    return http.post('/bizLegislation', obj);
  },
  // 删除受控法规
  deleteFg: (id) => {
    return http.delete('/bizLegislation/' + id);
  }
});

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource (path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}
