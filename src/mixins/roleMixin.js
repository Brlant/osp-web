import {Access} from '@/resources';
import {APIRule} from '../resources';
import menuTree from '@/components/system/role/menu';
export default {
  mounted() {

  },
  methods: {
    getRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allMenuList;
        if (noCache === false && menu && menu.data.length) {
          resolve(menu);
        } else {
          let res = {
            data: menuTree
          };
          this.$store.commit('initPermList', res);
          resolve(res);
          let getParentIds = (menus, parentsIds) => {
            menus.forEach(i => {
              if (i.children) {
                parentsIds.push(i.id);
                getParentIds(i.children, parentsIds);
              }
            });
          };
          let setParentIds = (menus) => {
            let parentIds = [];
            getParentIds(menus, parentIds);
            this.$store.commit('initMenuParentIds', parentIds);
          };
          setParentIds(res.data);
        }
      });
    },
    getApiRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allApiMenuList;
        if (noCache === false && menu && menu.length) {
          resolve(menu);
        } else {
          APIRule.query().then(res => {
            let menuMap = [];
            res.data.forEach(val => {
              let isLeaf = '';
              if (val.childMenus) {
                isLeaf = true;
              } else {
                isLeaf = false;
              }
              let childs = [];
              val.childMenus.forEach(child => {
                let childData = {
                  id: child.id,
                  label: child.name,
                  leaf: false,
                  parentId: child.parentId,
                  children: []
                };
                childs.push(childData);
              });
              let menu = {
                id: val.id,
                label: val.name,
                leaf: isLeaf,
                parentId: val.parentId,
                children: childs
              };
              menuMap.push(menu);
            });
            res.data = menuMap;
            this.$store.commit('initApiPermList', JSON.parse(JSON.stringify(res)));
            resolve(res);
            let getParentIds = (menus, parentsIds) => {
              if (!Array.isArray(menus)) {
                return;
              }
              menus.forEach(i => {
                if (i.children) {
                  parentsIds.push(i.id);
                  getParentIds(i.children, parentsIds);
                }
              });
            };
            let setParentIds = (menus) => {
              let parentIds = [];
              getParentIds(menus, parentIds);
              this.$store.commit('initApiMenuParentIds', parentIds);
            };
            setParentIds(res.data);
          });
        }
      });
    }
  }
};
