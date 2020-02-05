// import Component from '../react/component'
// import {isObject} from '../utils/index'
import {diff} from './diff'

// const isAttributes = (key) => !key.startsWith('on') && key !== 'children'
// const isClass = (o) => o.prototype instanceof Component

// const createComponent = (component, props) => {
//     let instance
//     if(isClass(component)) {
//         // 类方法
//         instance = new component(props)
//     } else {
//         // 函数
//         instance = new Component(props)
//         instance.constructor = component
//         instance.render = function() {
//             return this.constructor(props)
//         }
//     }
//     return instance
// }

// // 这里应该对 props 做严格区分
// const setAttribute = (element, props) => {
//     Object.keys(props).filter(e => isAttributes(e))
//             .forEach(k => {
//                 element[k] = props[k]
//             }) 
// }

// const handleEvent = (element, props) => {
//      // 有些元素上绑定了事件, 需要手动绑定
//     Object.keys(props).filter(e => e.startsWith('on'))
//      .forEach(k => {
//          // 先拿到事件名称
//          let eventType = k.toLowerCase().slice(2)
//         // 再绑定事件
//          element.addEventListener(eventType, props[k])
//      })
// }

// const setComponentProps = (component, props) => {
//     if(!component.base) {
//         component.componentWillMount && component.componentWillMount()
//     } else {
//         component.componentWillReceiveProps && component.componentWillReceiveProps(props)
//     }
//     component.props = props
//     return component
// }

// export const renderComponent = (component, container) => {
//     let base
//     const renderer = component.render()

//     if (component.base && component.componentWillUpdate ) {
//         component.componentWillUpdate()
//     }
//     // setState 传过来的时, container 为父节点
//     if(component.base && component.base.parentNode) {
//         container = component.base.parentNode
//     }
//     base = render(renderer, container)
    
//     if ( component.base ) {
//         component.componentDidUpdate && component.componentDidUpdate()
//     } else if ( component.componentDidMount ) {
//         component.componentDidMount()
//     }

//     // 更新父节点(否则会创建多个节点)
//     if ( component.base && component.base.parentNode ) {
//         component.base.parentNode.replaceChild( base, component.base );
//     }

//     // 更新当前渲染 component
//     component.base = base
//     base._component = component
//     return base
// }

// const _render = (vdom, container) => {
//     let {type, props} = vdom
//     let element
//     if(type === 'TEXT') {
//         element = document.createTextNode('')
//     }else if(typeof type === 'function'){
//         let instance = createComponent(type, props)
//         let component = setComponentProps(instance, props)
//         element = renderComponent(component, container)
//     }else {
//         element = document.createElement(type)
//     }

//     handleEvent(element, props)
//     setAttribute(element, props)

//     let children = props.children || []
//     // 递归处理
//     children.forEach(c => render(c, element))

//     // 把元素插入到页面中
//     container.appendChild(element)
//     return element
// }

const render = (vdom, container, dom) => {
    return diff(dom, vdom, container)
}

export default render