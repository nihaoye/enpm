# enpm
1. 参考cnpm做的一个npm同步包服务器(因为cnpm不支持部署在内网环境，而enpm就是为内网环境考虑设计的)。
因为cnpm的更新机制是通过包名同步这个包的所有版本，这样整个更新会很慢，而且最终的npm包的量非常大，所以利用eggjs重新写了同步包的逻辑(故取名enpm，顺便练习一下eggjs框架应用)
目前是同步包的单个版本信息，如果这个包有依赖的话同步这个包的对应的版本(cnpm是同步依赖包的所有的版本)
2. 目前只完成了同步包这块的逻辑，至于对接npm工具的部分后续会完成
3. 每次外网同步的包和每次同步执行sql脚本都会记录起来，执行同步完毕后只需要把对应的包文件和sql脚本拷贝进内网增量更新即可(尚未完成)


## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org