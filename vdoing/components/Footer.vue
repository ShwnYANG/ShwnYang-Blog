<template>
  <div class="footer">
    <div class="icons" v-if="social && social.icons">
      <a
        :href="item.link"
        :title="item.title"
        :class="['iconfont', item.iconClass]"
        v-for="(item, index) in social.icons"
        :key="index"
        target="_blank"
      ></a>
    </div>

    <div class="site-data">
      <span id="busuanzi_container_site_pv">
        总访问量 <span id="busuanzi_value_site_pv"></span> 次
      </span>
      <span class="split">|</span>
      <span id="busuanzi_container_site_uv">
        访客数 <span id="busuanzi_value_site_uv"></span> 人
      </span>
    </div>

    <div class="footer-text">
      <span>{{ footer.copyright }}</span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    social() {
      return this.$themeConfig.social
    },
    footer() {
      return this.$themeConfig.footer
    }
  }
}
</script>

<style lang='stylus'>
// $mobileSidebarWidth = $sidebarWidth * 0.82
.footer
  padding 5rem 1.5rem 2.5rem
  text-align center
  color #666
  box-sizing border-box
  font-size 0.85rem
  transition all 0.2s ease
  > span
    line-height 1.5rem
  .icons
    margin-bottom 12px
    .iconfont
      padding 0 10px
      font-size 1.3rem
  a
    color inherit
    &:hover
      color $accentColor
@media (min-width ($MQMobile + 1px))
  .sidebar-open .footer
    width auto
    padding-left: ($sidebarWidth + 1.5rem)
@media (min-width 1520px)
  .have-rightmenu .footer
    padding-right: ($rightMenuWidth + 1.5rem)
.no-sidebar .footer
  width auto
  padding-left 1.5rem
  .site-data
    padding 0.3rem 1rem
    font-size 0.85rem
    color var(--textColor)
    .split
      margin 0 0.5rem
    #busuanzi_value_site_pv,
    #busuanzi_value_site_uv
      font-weight bold
      color $accentColor
</style>
