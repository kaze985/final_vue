module.exports = {
    devServer: {
        port: 8080, // 端口号
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000/api/',// 后端接口
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    lintOnSave: false
}
