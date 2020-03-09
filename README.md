# coco-admin-vue

Container load business administration.

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
