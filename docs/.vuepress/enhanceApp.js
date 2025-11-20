// import vue from 'vue/dist/vue.esm.browser'
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // window.Vue = vue // 使页面中可以使用Vue构造函数 （使页面中的vue demo生效）

  // Mount CanvasBackground
  if (typeof window !== 'undefined') {
    import('./components/CanvasBackground.vue').then(module => {
      const CanvasBackground = module.default
      const canvasMountPoint = document.createElement('div')
      document.body.appendChild(canvasMountPoint)
      new Vue({
        render: h => h(CanvasBackground)
      }).$mount(canvasMountPoint)
    })
  }
}
