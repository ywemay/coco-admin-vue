# vue-admin-template

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template


**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Requirements

[Node.js](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/) enabled (linux?) system.

## Build Setup

```bash
# clone the project
git clone https://github.com/ywemay/coco-admin-vue

# enter the project directory
cd coco-admin-vue

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

## Documentation

- [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html)
- [element](https://element.eleme.io/#/en-US/component/installation)
- [vue](https://vuejs.org/v2/guide/)
