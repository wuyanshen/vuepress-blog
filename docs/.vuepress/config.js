//项目的核心配置文件，所有菜单，栏目相关配置都在这

// .vuepress/config.js
module.exports = {
    title: '吴彦燊',
    description: '有道无术，术尚可求，有术无道，止于术',
    dest: './dist', //默认在.vuepress目录下
    port: 3003,
    head: [
        ['link', { rel: 'icon', href: '/img/favicon.ico' }]
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        logo: '/img/logo.jpg',
        nav: require('./nav.js'),
        sidebar: require('./sidebar.js'),
        lastUpdated: '更新时间',
    }
}