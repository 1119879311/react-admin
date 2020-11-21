const path = require("path")
const cracoLess = require("craco-less")
const addPath = dir => path.join(__dirname,dir);
module.exports = {
    style:{
        postcss:{
            plugins:[ ]
        }
    },
    webpack:{
        alias:{
            "@":addPath("src")
        }
    },
    babel:{
        plugins:[
            ["import",{ libraryName: 'antd', style: true }]
        ]
    },
    plugins:[
        {
            plugin: cracoLess,
            options: {
              lessLoaderOptions: {
                lessOptions: {
                  modifyVars: { '@primary-color': '#1890ff' },
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