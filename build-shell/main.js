/**
 * 打包 shell
 */

const fs = require("fs");
const path = require("path");
const yaml = require('js-yaml');
const { execSync } = require('child_process');
const { program } = require('commander');

// 生成 require-config.js
const generatorRequireConfig = () => {
    const filePath = path.resolve(__dirname, "../require-config.js")
    console.log("正在生成：" + filePath);
    const constants = require(path.resolve(__dirname, "../serve/constants"));
    const dataConfig = require(path.resolve(__dirname, "../serve/data-config"));
    fs.writeFileSync(filePath, `
        // 此文件为系统生成请勿更改！！！ 

        const MAIN_STATUS = ${JSON.stringify(constants.MAIN_STATUS)};
        const dataConfig = ${JSON.stringify(dataConfig)};

        export const IMPORT_MAIN_STATUS = MAIN_STATUS;
        export const cinemaList = dataConfig;
    `)
    console.log("生成成功：" + filePath);
}

// vue 打包
const vueBuilder = () => {
    // 生成 
    generatorRequireConfig();
    // 打包 vue
    console.log("正在打包 vue");
    execSync("npm run vue:build");
    console.log("打包成功");
}

// rollup 编译
const rolupParse = () => {
    execSync(`rollup -c ${path.join(path.resolve(__dirname), "rollup.config.js")}`);
}

// electron 打包
const electronBuilder = async () => {
    console.log("正在打包桌面程序!");
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
    const packageName = packageJson.name;

    const fileContent = fs.readFileSync(path.resolve(__dirname, "../electron-builder.yml"), 'utf8');
    const ymalData = yaml.load(fileContent);

    const globalConfig = path.resolve(__dirname, "../serve/config");

    ymalData.appId = packageName;
    ymalData.productName = globalConfig.name;
    ymalData.directories.output = "dist_" + packageName;

    const output = yaml.dump(ymalData);
    fs.writeFileSync(path.resolve(__dirname, "../electron-builder.yml"), output);

    console.log("rollup 正在编译线程文件");
    rolupParse()
    console.log("编译完成");

    console.log("正在打包 Electron");
    execSync("npm run electron:builder")
    console.log("打包完成");
}

(async () => {

    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));

    program
        .name(packageJson.name + " 打包脚本")
        .description(packageJson.description)
        .version(packageJson.version);

    program
        .option('-b, --build-type <type>', 'what package! Vue OR Electron');

    program.parse();

    const options = program.opts();
    if (options.buildType) {
        const types = options.buildType.split(",");

        Array.isArray(types) && types.forEach(t => {
            if (t === "vue") {
                vueBuilder();
            }

            if (t === "electron") {
                electronBuilder();
            }
        })
        return;
    }

    generatorRequireConfig();

})();
