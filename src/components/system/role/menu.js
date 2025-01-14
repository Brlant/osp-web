export default [{
  'id': 'api-account-config',
  'parentId': null,
  'label': 'API账户管理',
  'sort': 1,
  'children': [{
    'id': 'api-user-role-manager',
    'parentId': 'api-account-config',
    'label': '接口角色管理',
    'sort': 2,
    'children': [{
      'id': 'api-access-role-add',
      'parentId': 'api-user-role-manager',
      'label': '新增角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-access-role-watch',
      'parentId': 'api-user-role-manager',
      'label': '查看角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-access-role-delete',
      'parentId': 'api-user-role-manager',
      'label': '删除角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-access-role-start',
      'parentId': 'api-user-role-manager',
      'label': '启用角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-access-role-edit',
      'parentId': 'api-user-role-manager',
      'label': '编辑角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-access-role-stop',
      'parentId': 'api-user-role-manager',
      'label': '停用角色',
      'sort': null,
      'children': null,
      'leaf': true
    }],
    'leaf': false
  }, {
    'id': 'api-account-manager',
    'parentId': 'api-account-config',
    'label': 'API账户管理',
    'sort': 1,
    'children': [{
      'id': 'api-unbind-org-user-role',
      'parentId': 'api-account-manager',
      'label': '删除授权角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-manufacture-oauth-client-details-url',
      'parentId': 'api-account-manager',
      'label': '编辑API账号推送地址',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-manufacture-oauth-client-details-add',
      'parentId': 'api-account-manager',
      'label': '新增API账号',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-manufacture-oauth-client-details-remark',
      'parentId': 'api-account-manager',
      'label': '编辑API账号备注',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-manufacture-oauth-client-details-secret',
      'parentId': 'api-account-manager',
      'label': '编辑API账号secret',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-bind-org-user-role',
      'parentId': 'api-account-manager',
      'label': '新增授权角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'api-manufacture-oauth-client-details-reset',
      'parentId': 'api-account-manager',
      'label': '重置API账号',
      'sort': null,
      'children': null,
      'leaf': true
    }],
    'leaf': false
  }],
  'leaf': false
}, {
  'id': 'system-config',
  'parentId': null,
  'label': '系统设置',
  'sort': 2,
  'children': [
    {
    'id': 'access-role-manager',
    'parentId': 'openapi-system-config',
    'label': '角色管理',
    'sort': 2,
    'children': [{
      'id': 'access-role-edit',
      'parentId': 'openapi-user-role-manager',
      'label': '编辑角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'openapi-access-role-stop',
      'parentId': 'openapi-user-role-manager',
      'label': '停用角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'access-role-add',
      'parentId': 'openapi-user-role-manager',
      'label': '新增角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'access-role-watch',
      'parentId': 'openapi-user-role-manager',
      'label': '查看角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'openapi-access-role-start',
      'parentId': 'openapi-user-role-manager',
      'label': '启用角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'openapi-access-role-delete',
      'parentId': 'openapi-user-role-manager',
      'label': '删除角色',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'openapi-access-platfrom-permission-export',
      'parentId': 'openapi-user-role-manager',
      'label': '平台角色权限导出',
      'sort': null,
      'children': null,
      'leaf': true
    }, {
      'id': 'openapi-access-platfrom-role-export',
      'parentId': 'openapi-user-role-manager',
      'label': '平台用户角色分配导出',
      'sort': null,
      'children': null,
      'leaf': true
    }],
    'leaf': false
  },
    {
      'id': 'mdm-org-user-manager',
      'parentId': 'system-config',
      'label': '单位用户管理',
      'sort': 1,
      'children': [{
        'id': 'mdm-manufacture-oms-org-user-watch',
        'parentId': 'mdm-org-user-manager',
        'label': '查看单位用户',
        'sort': null,
        'children': null,
        'leaf': true
      }, {
        'id': 'mdm-manufacture-oms-org-user-edit',
        'parentId': 'mdm-org-user-manager',
        'label': '编辑单位用户',
        'sort': null,
        'children': null,
        'leaf': true
      }, {
        'id': 'mdm-manufacture-oms-org-user-add',
        'parentId': 'mdm-org-user-manager',
        'label': '新增单位用户',
        'sort': null,
        'children': null,
        'leaf': true
      }],
      'leaf': false
    }],
    'leaf': false
}, {'id': 'openapi-request-log', 'parentId': null, 'label': '请求日志', 'sort': 3, 'children': null, 'leaf': true}];
