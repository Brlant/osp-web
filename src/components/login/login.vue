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
  //用短信验证码登录
  .login-style {
    margin-bottom: 20px;

    .btn {
      color: deepskyblue;
      right: 40px;
      position: fixed;
      top: 90px;
      font-size: 16px;
    }
  }
  .flex {
    display: flex;
    .cursor {
      cursor: pointer;
    }
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }
</style>
<template>
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix"><img src="../../assets/img/logo_pic.png">开放接口平台</div>

<!--      <div class="login-style">-->
<!--        <el-button v-show="loginStyle === 0" class="btn" type="text" @click="changeLoginStyle(1)">用短信验证码登录</el-button>-->
<!--        <el-button v-show="loginStyle === 1" class="btn" type="text" @click="changeLoginStyle(0)">用短信验证码登录</el-button>-->
<!--      </div>-->

      <div style="padding:20px">
        <el-form v-show="loginStyle === 0" label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                 @submit.prevent="onSubmit" onsubmit="return false">
          <el-form-item label="系统代码" prop="orgCode">
          <oms-input v-model="user.orgCode"></oms-input>
          </el-form-item>
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
            <el-button type="primary" @click="onSubmit" style="display:block;width:100%;" native-type="submit">
              {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

          </el-form-item>
        </el-form>

        <!--手机验证码登录-->
<!--        <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"-->
<!--                 :model="user1" :rules="rules1"-->
<!--                 onsubmit="return false">-->
<!--          <el-form-item label="手机号" prop="phone">-->
<!--            <oms-input v-model="user1.phone" placeholder="请输入手机号"></oms-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="短信验证码" prop="validateCode">-->
<!--            <div style="display:flex">-->
<!--              <div style="width:320px;margin-right:50px">-->
<!--                <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>-->
<!--              </div>-->
<!--              <div style="line-height:0;">-->
<!--                <el-button :disabled="smsBtnDisabled" @click="sendSMS">{{ smsBtnText }}</el-button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-form-item>-->

<!--          <el-form-item label-width="80px">-->
<!--            <el-button type="primary" @click="phoneFormSubmit" style="display:block;width:100%;" native-type="submit">-->
<!--              {{ btnString }} <i class="el-icon-loading" v-show="loading"></i></el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->

        <!--        二次认证登录-->
        <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"
                 :model="user1" :rules="rules1"
                 onsubmit="return false">
          <div class="flex">
            <i class="el-icon-arrow-left cursor" @click="goBack"></i>
            <h3 class="title">二次认证</h3>
          </div>
          <el-form-item label="短信验证码" prop="validateCode">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>
              </div>
              <div style="line-height:0;">
                <el-button :disabled="smsBtnDisabled" style="width: 110px" @click="sendSMS">{{ smsBtnText }}</el-button>
              </div>
            </div>
          </el-form-item>

          <drag-verify
            ref="dragVerify"
            :isPassing.sync="isPassing"
            style="margin-bottom: 20px;width: 460px;"
            :width="460"
            text="请按住滑块,拖动到最右边"
            handlerIcon="el-icon-d-arrow-right"
            successIcon="el-icon-circle-check"
            background="#ccc"
            successText="验证通过"
            progressBarBg="#67c23a"
            @passcallback="handlePass"
            @passfail="handleFail"
          >
          </drag-verify>

        </el-form>
      </div>
    </el-card>
    <canvas id="backgroundCanvas"></canvas>
    <app-footer></app-footer>
  </div>

</template>

<script>
  import {Auth, LogisticsCenter,http} from '../../resources';
  import AppFooter from '../layout/app.footer.vue';
  import {base64} from '@dtop/dtop-web-common';
  import dragVerify from "vue-drag-verify2";
  export default {
    name: 'login',
    components: {AppFooter,dragVerify},
    data: () => {
      return ({
        // 登录方式：0-账号密码登录，1-手机验证码登录
        loginStyle: 0,
        user: {
          username: '',
          password: '',
          validateCode: '',
          type: 1,
          orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
        },
        loading: false,
        codeUrl: '',
        showCode: false,
        btnString: '登录',
        rules: {
          orgCode: [
            {required: true, message: '请输入系统代码', trigger: ['blur', 'change']}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        logisticsCenters: [],
        //短信验证
        user1: {
          phone: '',
          validateCode: '',
          type: 0
        },
        rules1: {
          phone: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入手机号'));
                } else {
                  if (!/^1[0-9]{10}$/.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                  }else {
                    callback();
                  }
                }
              }, trigger: 'blur'
            }
          ],
          validateCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          // password: [
          //   {required: true, message: '请输入密码', trigger: 'blur'}
          // ]
        },
        maxTimes: 60,
        leftTime: 0,
        smsBtnText: '获取验证码',
        isPassing: false,
      });
    },
    computed: {
      // smsBtnDisabled() {
      //   return !/^1[0-9]{10}$/.test(this.user1.phone) || this.leftTime > 0;
      // }
      smsBtnDisabled() {
        return this.leftTime > 0;
      }
    },
    methods: {
      //切换
      changeLoginStyle(loginStyle) {
        this.loginStyle = loginStyle;
      },
      sendSMS: function () {
        this.leftTime = this.maxTimes;
        this.setTimer();
        http.post('/sendSms', {phone: this.user1.phone}).then(response => {// 验证
          this.$notify.info({
            message: '发送成功'
          });
        }, () => {
          this.$notify.error({
            message: '发送失败,请联系管理员'
          });
        });
      },
      setTimer: function () {
        if (this.leftTime > 0) {
          this.leftTime = this.leftTime - 1;
          this.smsBtnText = this.leftTime + 's';
          setTimeout(() => {
            this.setTimer();
          }, 1000);
        } else {
          this.smsBtnText = '重新发送';
        }
      },
      phoneFormSubmit() {
        this.$refs['phoneForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登陆中..';
            this.loading = true;
            Auth.loginByPhone(this.user1).then(response => {
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initCode', this.user.orgCode);
              this.$store.commit('initUser', response.data);
              this.$nextTick(function () {
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
      // 二次验证登录
      handlePass() {
        console.log('验证成功')
      },

      // 验证失败
      handleFail() {
        this.resetDragVerify();
      },
      // 还原至未验证通过状态
      resetDragVerify() {
        this.isPassing = false;
        this.$refs.dragVerify.reset();
      },
      goBack() {
        this.loginStyle = 0;
        this.user1 = {
          validateCode:null,
        }
        this.$refs.phoneForm.resetFields();
        this.handleFail();
      },
      onSubmit(){
        this.loginStyle = 1;
      },
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
