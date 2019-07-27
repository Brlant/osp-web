<style lang="scss">
  .dialog-template {
    $labelWidth: 180px;
    &.content-part {
      .content-left {
        width: $labelWidth;
      }
      .content-right {
        > h3 {
          left: $labelWidth;
        }
        left: $labelWidth;
      }
    }
  }
</style>
<template>
  <div class="content-part dialog-template">
    <div class="content-left">
      <h2 class="clearfix right-title">
        <slot name="title"></slot>
      </h2>
      <ul v-if="pageSets">
        <li class="list-style" v-for="(item, key) in pageSets" @click="selectTab(item, key)"
            v-bind:class="{ 'active' : index === key}"><span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="btn-group-lt-bm-part">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="content-right content-padding" @scroll="setIndex">
      <h3>{{title}}</h3>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'dialogTemplate',
    props: {
      pageSets: Array,
      indexClass: {
        type: String,
        default: 'index-tit'
      }
    },
    data () {
      return {
        index: 0,
        title: '',
        title_ele: [],
        titleOffsetTop: []
      };
    },
    methods: {
      selectTab (item, key) {
        this.index = key;
        this.title = item.name;
        this.setScrollTop(key);
        this.$emit('selectTab', item);
      },
      setIndex (e) {
        let event = e || window.event;
        let target = event.target || e.srcElement;

        !this.title_ele.length && (this.title_ele = target.getElementsByClassName(this.indexClass));
        if (!this.titleOffsetTop.length) {
          for (let i = 0; i < this.title_ele.length; i++) {
            this.titleOffsetTop.push(this.title_ele[i].offsetTop - 65);
          }
        }
        let scrollTop = target.scrollHeight - target.clientHeight;
        if (target.scrollTop === scrollTop) {
          return;
        }
        for (let i = 0; i < this.titleOffsetTop.length; i++) {
          if (target.scrollTop > this.titleOffsetTop[i] - 20) {
            this.index = i;
            this.title = this.pageSets[i].name;
            this.$emit('selectTab', this.pageSets[i]);
          }
        }
      },
      setScrollTop (index) {
        !this.title_ele.length && (this.title_ele = this.$el.getElementsByClassName(this.indexClass));
        let ele_warp = this.$el.getElementsByClassName('content-right')[0];
        let scrollTop = ele_warp.scrollHeight - ele_warp.clientHeight;
        let otp = this.title_ele[index].offsetTop - 65;
        ele_warp && (ele_warp.scrollTop = scrollTop > otp ? otp : scrollTop);
      }
    }
  };
</script>
