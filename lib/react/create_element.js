import {isObject} from '../utils/index'

// const createTextElement = (text) => {
//     // 一般来说, 元素的 tagName 是全大写的形式
//     let type = 'TEXT'
//     let props = {
//         nodeValue: text,
//     }
//     let c = createElement(type, props)
//     return c
// }

// const _createElement = (type, props, ...children) => {
//     let newProps = Object.assign({}, props)
//     // 把 children 也放到 props 里面, 一起处理
//     if (children.length === 0) {
//         newProps.children = []
//     } else {
//         let l = children.map(c => {
//             if (isObject(c)) {
//                 // 元素节点
//                 return c
//             } else {
//                 // 文本节点
//                 let r = createTextElement(c)
//                 return r
//             }
//         })
//         newProps.children = l
//     }
//     return {
//         type: type,
//         props: newProps,
//     }
// }

// 这里直接返回一个对象即可
const createElement = (tag, attrs = {}, ...children) => {
    return {
        tag,
        attrs,
        children,
        key: attrs && attrs.key || null
    }
}

export default createElement
