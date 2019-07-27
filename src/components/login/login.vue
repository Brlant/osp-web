<style lang="scss" scoped="">
  @import "../../assets/scss/mixins";

  body {
    background: #f5f5f5
  }

  .main-card-box {
    width: 550px;
  }

  .logo-part {
    text-align: center;
    line-height: 80px;
    font-size: 40px;

    img {
      margin-right: 10px;
      vertical-align: middle;
      margin-top: -20px;
    }

    color: #189aca
  }

  #backgroundCanvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
<template>
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix"><img src="../../assets/img/logo_pic.png">开放接口平台</div>

      <div style="padding:20px">
        <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                 @submit.prevent="done" onsubmit="return false">
          <!--<el-form-item label="系统代码" prop="orgCode">-->
          <!--<oms-input v-model="user.orgCode"></oms-input>-->
          <!--</el-form-item>-->
          <el-form-item label="用户名" prop="username">
            <oms-input v-model="user.username" placeholder="手机号/邮箱/用户名"></oms-input>
          </el-form-item>
          <el-form-item label="密码" style="position:relative" prop="password">
            <oms-input v-model="user.password" type="password" placeholder="请输入密码"></oms-input>
            <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
          </el-form-item>
          <el-form-item label="验证码" v-show="showCode">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <oms-input v-model="user.validateCode"></oms-input>
              </div>
              <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height:36px"></div>
            </div>
          </el-form-item>

          <el-form-item label-width="80px">
            <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
              {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <canvas id="backgroundCanvas"></canvas>
    <app-footer></app-footer>
  </div>

</template>

<script>
  import {Auth, LogisticsCenter} from '../../resources';
  import AppFooter from '../layout/app.footer.vue';
  import {base64} from '@dtop/dtop-web-common';

  export default {
    name: 'login',
    components: {AppFooter},
    data: () => {
      return ({
        user: {
          username: 'jayzch@qq.com',
          password: '123456',
          validateCode: '',
          type: 0,
          orgCode: ''
        },
        loading: false,
        codeUrl: '',
        showCode: false,
        btnString: '登录',
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        logisticsCenters: []
      });
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登陆中..';
            this.loading = true;
            let user = Object.assign({}, this.user, {encryptionPsw: base64(this.user.password)});
            delete user.password;
            Auth.login(user).then(response => {
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initCode', this.user.orgCode);
              this.$store.commit('initUser', response.data);
              this.$nextTick(function () {
                if (userId === response.data.userId) {
                  let lastUrl = window.localStorage.getItem('lastUrl');
                  if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
                    window.localStorage.removeItem('lastUrl');
                    window.location.href = lastUrl;
                    return lastUrl;
                  }
                }
                this.$router.push('/');
              });
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              this.btnString = '登陆';
              this.loading = false;
            });
          }
        });

      },
      getCode: function () {
        this.showCode = true;
        this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
      }
    },
    mounted: function () {
      this.$store.commit('initPermissions', []);
      // document.addEventListener('touchmove', function (e) {
      //   e.preventDefault();
      // });
      var c, x, pr, w, h, f, q, m, r, u, v, z;
      c = document.getElementById('backgroundCanvas');
      x = c.getContext('2d');
      pr = 1;
      w = window.innerWidth;
      h = window.innerHeight;
      f = 90;
      m = Math;
      r = 0;
      u = m.PI * 2;
      v = m.cos;
      z = m.random;
      c.width = w * pr;
      c.height = h * pr;
      x.scale(pr, pr);
      x.globalAlpha = 0.6;

      function i() {
        x.clearRect(0, 0, w, h);
        q = [{x: 0, y: h * 0.7 + f}, {x: 0, y: h * 0.7 - f}];
        while (q[1].x < w + f) d(q[0], q[1]);
      }

      function d(i, j) {
        var k, n;
        x.beginPath();
        x.moveTo(i.x, i.y);
        x.lineTo(j.x, j.y);
        k = j.x + (z() * 2 - 0.25) * f;
        n = y(j.y);
        x.lineTo(k, n);
        x.closePath();
        r -= u / -50;
        x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16);
        x.fill();
        q[0] = q[1];
        q[1] = {x: k, y: n};
      }

      function y(p) {
        var t = p + (z() * 2 - 1.1) * f;
        return (t > h || t < 0) ? y(p) : t;
      }

//       document.onclick = i
//       document.ontouchstart = i;
      i();
    }
  };
</script>
