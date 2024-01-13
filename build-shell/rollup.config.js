const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const json = require('@rollup/plugin-json')
const obfuscate = require('rollup-plugin-obfuscator');

module.exports = {
    input: path.resolve(__dirname, '../serve/core/section-download.js'), // 入口文件
    output: {
        file: path.resolve(__dirname, './section-download.js'), // 输出文件
        format: 'cjs', // 输出格式 amd / es / cjs / iife / umd / system
        // name: 'func',  // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
        sourcemap: false  // 生成bundle.js.map文件，方便调试
    },
    plugins: [json(), commonjs(), resolve({
        "preferBuiltins":true
    }), obfuscate({
        exclude: 'node_modules/**', // 排除node_modules目录下的文件  
        compact: true, // 压缩混淆代码  
        controlFlow: true, // 控制流混淆  
        reserved: ['console'] // 保留的变量和函数名  
    })],
}