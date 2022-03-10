<style lang="scss">

.d-table {
  min-height: 500px;
}

@-webkit-keyframes bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0)
  }
  40% {
    -webkit-transform: scale(1)
  }
}

@keyframes bouncedelay {
  0%, 80%, 100% {
    transform: scale(0)
  }
  40% {
    transform: scale(1)
  }
}

.layer-loading {
  text-align: center;
  background: #f9f9f9;
  padding-top: 15rem;
  position: absolute;
  top: 65px;
  width: 100%;
  z-index: 2000;
  bottom: 0
}

.layer-loading > i {
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  background-color: #A6A6A6;
  display: inline-block;
  border-radius: 100%;
  margin: 0 2px;
  height: 18px;
  width: 18px
}

.layer-loading > i:nth-child(2) {
  -webkit-animation-delay: .2s;
  animation-delay: .2s
}

.layer-loading > i:nth-child(3) {
  -webkit-animation-delay: .4s;
  animation-delay: .4s
}

.btn-left-list-more {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;

  .el-button {
    border: none;
    color: #666;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;

    &:hover {
      color: #333
    }
  }
}

.min-div {
  height: 0;
  width: 0;
  display: inline;
  overflow: hidden;
  line-height: 0;
}

.app-body-org {
  padding-top: 0;

  .layer-loading {
    top: 0
  }
}

</style>
<template>
  <div class="app-body full-width">
    <app-header :to-route="toRoute" v-if="userType"></app-header>
    <div class="main-body container">
      <div class="layer-loading" v-show="loading"><i></i><i></i><i></i></div>
      <el-scrollbar tag="div" class="body_scroll">
        <transition name="scale" mode="out-in" appear>
          <div class="app-content-view">
            <router-view></router-view>
          </div>
        </transition>
      </el-scrollbar>
    </div>
    <attachmentDialog></attachmentDialog>
    <print-dialog></print-dialog>
  </div>
</template>

<script>
import AppHeader from './layout/app.header.vue';
import AppFooter from './layout/app.footer.vue';
import utils from '../tools/utils';
import attachmentDialog from './common/attachment/attachment.dialog.vue';
import {Auth} from '@/resources';
import printDialog from './common/print.loading.vue';

export default {
  data: () => ({
    transitionName: 'slide-left',
    toRoute: {},
    loading: true,
    needCheck: false
  }),
  computed: {
    userType() {
      return this.$store.state.user['userType'];
    },
    updatePassFlag() {
      return this.$store.state.user['updatePassFlag'];
    },
    days() {
      return this.$store.state.user['passwordRule'];
    },
    checkPwd() {
      return this.needCheck && this.updatePassFlag;
    },
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      return height + 'px';
    }
  },
  watch: {
    checkPwd(val) {
      if (val) {
        setTimeout(this.showTip,200);
      }
    }
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      vm.toRoute = to;
    });
  },
  beforeRouteUpdate(to, from, next) {
    utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
    this.toRoute = to;
    next();
  },
  components: {AppHeader, AppFooter, attachmentDialog, printDialog},
  methods: {
    // 显示安全提示
    showTip() {
      // 如果需要修改密码，给出提示：您当前登录密码使用已超过xx天，为保证您的账号安全，请立即修改。
      this.$alert('您当前登录密码使用已超过' + this.days + '天，为保证您的账号安全，请立即修改。', '安全提示', {
        confirmButtonText: '去修改', center: true, showClose: false
      }).then(() => {
        this.$router.replace("/resetpsw")
      }).catch(err => {
        console.log("加载alert异常", err)
      });

      this.needCheck = false;
    },
    setBodyHeight: function () {
      this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
    }
  },
  mounted: function () {
    window.localStorage.removeItem('noticeError');
    if (!this.$store.state.user || !this.$store.state.user.userId) {
      Auth.checkLogin().then(() => {
        let data = window.localStorage.getItem('user');
        if (!data) {
          Auth.logout().then(() => {
            this.$router.replace('/login');
          });
        }
        data = JSON.parse(data);
        this.$store.commit('initUser', data);
      }).catch(() => {
        Auth.logout().then(() => {
          this.$router.replace('/login');
        });
      });
    }
    Auth.permission().then(res => {
      this.$store.commit('initPermissions', res.data);

    }).then(() => {
      utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
      this.loading = false;
    });
    window.addEventListener('resize', (e) => {
      this.setBodyHeight();
    });
    this.setBodyHeight();

    this.needCheck = true;
    // 监听后退和地址栏变化
    window.addEventListener('popstate', (e) => {
      // 当用户手动后退或者修改地址栏的时候，重新触法一次密码校验
      let hash = e.currentTarget.location.hash;
      // 定义那些页面不需要安全提示
      let ext = hash.indexOf('login') !== -1 || hash.indexOf('resetpsw') !== -1 || hash.indexOf('forget') !== -1;
      if (ext) {
        console.log("popstate.location.hash",hash);
        return;
      }

      this.needCheck = true;
    });
  }
};
</script>
