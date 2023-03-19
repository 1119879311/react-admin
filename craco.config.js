const path = require("path")
const cracoLess = require("craco-less")
const addPath = dir => path.join(__dirname,dir);
const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {whenProd} = require("@craco/craco")
module.exports = {
    style:{
        postcss:{
            plugins:[ ]
        }
    },
    webpack:{
        optimization: {
            splitChunks: {
              cacheGroups: {
                styles: {
                  name: 'styles',
                  test: /\.css$/,
                  chunks: 'all',
                  enforce: true,
                },
              },
            },
        },
        alias:{
            "@":addPath("src")
        },
        plugins:[
            ...whenProd(
                () => [
                    new uglifyjsWebpackPlugin({
                        uglifyOptions:{
                            warnings:false,
                           compress:{
                               drop_debugger:true,
                               drop_console:true
                           }
                        },
                    })
                ], []
              ),
           
        ],
        configure:(webpackConfig, { env, paths }) => {
             // 配置 splitChunks
            webpackConfig.optimization.splitChunks = {
                ...webpackConfig.optimization.splitChunks,
                ...{
                chunks: 'all',
                name: true,
                },
            }

            // 覆盖已经内置的 plugin 配置
            webpackConfig.plugins.map((plugin) => {
                whenProd(() => {
                if (plugin instanceof MiniCssExtractPlugin) {
                    Object.assign(plugin.options, {
                    filename: 'static/css/[name].css',
                    chunkFilename: 'static/css/[name].css',
                    ignoreOrder: true
                    })
                }
                })
                return plugin
            })
            return webpackConfig
        }
    },
    babel:{
        plugins:[
            ["import",{ libraryName: 'antd', style: true }],
            
        ]
    },
    plugins:[
        {
            plugin: cracoLess,
            options: {
              lessLoaderOptions: {
                lessOptions: {
                //   modifyVars: { '@primary-color': '#1890ff' },
                  javascriptEnabled: true,
                },
              },
            },
        },
        
       
    ],
    devServer:{
        proxy: {
            "/api": {
                // target: "http://baidu.com",  
                target: 'http://localhost:3001',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/api"
                }
            },
            "/theme": {
                // target: "http://baidu.com",  
                target: 'http://localhost:3001',
                changeOrigin: true,
                pathRewrite: {
                    "^/theme": "/theme"
                }
            }
        }
        
    }
}