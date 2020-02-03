const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title 是指生成的 html 文件的 title 值
            title: 'webpack plugin demo',
            // filename 指定生成的 html 文件名称
            // 生成的文件默认放在 output.path 配置项的目录
            filename: 'index.html',
            // 使用当前目录下的 index.html 作为模板
            template: path.resolve(__dirname, 'index.html')
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000,
        open: true
    },
    devtool: 'source-map',
}