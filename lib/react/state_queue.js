// 处理异步 setState
import {renderComponent} from '../react-dom/diff'

const setStateQueue = []
// 因为同一个组件可能会多次添加到队列中，我们需要另一个队列保存所有组件，不同之处是，这个队列内不会有重复的组件
const renderQueue = []

const defer = (fn) => {
    return requestAnimationFrame(fn) 
}

export const enqueueSetState = (stateChange, component) => {
    if (setStateQueue.length === 0) {
        // flush在所有同步任务后执行, 这里的执行时机可以优化【requestAnimationFrame, requestIdleCallback, promise等】
        defer(flush)
    }
    setStateQueue.push({
        stateChange,
        component
    })
    // 如果renderQueue里没有当前组件，则添加到队列中
    if (!renderQueue.some( item => item === component)) {
        renderQueue.push( component );
    }
}

// 清空队列
const flush = () => {
    let item
    let component
    while (item = setStateQueue.shift()) {
        const { stateChange, component } = item
        // 如果没有prevState，则将当前的state作为初始的prevState
        if ( !component.prevState ) {
            component.prevState = Object.assign({}, component.state)
        }
        // 如果stateChange是一个方法，也就是setState的第二种形式
        if ( typeof stateChange === 'function' ){
            Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            Object.assign(component.state, stateChange)
        }
        component.prevState = component.state
    }
    while (component = renderQueue.shift()) {
        renderComponent( component );
    } 
}
