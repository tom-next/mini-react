/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vdom 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export const diff = (dom, vdom, container) => {
    // diff 
    const ret = diffNode(dom, vdom)
    if(container && ret.parentNode !== container) {
        container.appendChild(ret)
    }

    return ret
}

const diffNode = (dom, vdom) => {
    let result = dom
    if ( vdom === undefined || vdom === null || typeof vdom === 'boolean' ) {
        vdom = ''
    }
    if ( typeof vdom === 'number' ) {
        vdom = String( vdom )
    }
    // 对比文本节点
    if(typeof vdom === 'string') {
        // 当前 dom 是文本节点，则直接更新内容
        if(dom && dom.nodeType === 3) {
            if(dom.textContent !== vdom) {
                dom.textContent = vdom
            }
        } else {
            // 如果不是文本节点, 则新建一个文本节点 DOM, 并移除原来的
            result = document.createTextNode(vdom)
            if(dom && dom.parentNode) {
                dom.parentNode.replaceChild(result, dom)
            }
        }
        return result
    }         
    // 对比函数节点
    if(typeof vdom.tag === 'function') {
        return diffComponent(dom, vdom)
    }

    if(!dom || !isSameNodeType(dom, vdom)) {
        // 创建新的节点
        result = document.createElement( vdom.tag )
        if(dom) {
            // 将原来的子节点移到新节点下
            [...dom.childNodes].map((item) => {
                result.appendChild(item)
            })   
            if(dom.parentNode) {
                // 移除掉原来的DOM对象
                dom.parentNode.replaceChild( result, dom );    
            }
        }
    }

    if ( vdom.children && vdom.children.length > 0 || ( result.childNodes && result.childNodes.length > 0 ) ) {
        diffChildren( result, vdom.children );
    }
    
    diffAttributes(result, vdom)

    return result
}

// 对比属性
const diffAttributes = (dom, vdom) => {
    const old = {}    // 当前DOM的属性
    const attrs = vdom.attrs    // 虚拟DOM的属性

    for ( let i = 0; i < dom.attributes.length; i++ ) {
        const attr = dom.attributes[i]
        old[attr.name] = attr.value
    }

     // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
     for ( let name in old ) {
        if ( !(name in attrs) ) {
            setAttribute( dom, name, undefined );
        }
    }

    // 更新新的属性值
    for ( let name in attrs ) {
        if ( old[ name ] !== attrs[ name ] ) {
            setAttribute( dom, name, attrs[ name ] );
        }
    }

}

const diffChildren = (dom, vchildren) => {
    const domChildren = dom.childNodes
    const children = []

    const keyed = {}
    // 将有key的节点和没有key的节点分开
    if ( domChildren.length > 0 ) {
        for ( let i = 0; i < domChildren.length; i++ ) {
            const child = domChildren[ i ]
            const key = child.key
            if (key) {
                keyed[key] = child
            } else {
                children.push(child)
            }
        }
    }

    if (vchildren && vchildren.length > 0 ) {
        let min = 0;
        let childrenLen = children.length;
        for ( let i = 0; i < vchildren.length; i++ ) {
            const vchild = vchildren[i]
            const key = vchild.key
            let child
            // 如果有key，找到对应key值的节点
            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            // 如果没有key，则优先找类型相同的节点； min, j 的作用是减小遍历长度，
            // 在children数组尾部找到sameNodeType的之后就不会遍历到尾部，在children头部找到sameNodeType之后就不会来遍历头部
            } else if (min < childrenLen ) {
                for ( let j = min; j < childrenLen; j++ ) {
                    let c = children[j]
                    if ( c && isSameNodeType(c, vchild ) ) {
                        child = c
                        children[j] = undefined
                        if ( j === childrenLen - 1 ) {
                            childrenLen--
                        }
                        if ( j === min ) {
                            min++
                        }
                        break
                    }
                }
            }
            // 对比， child 为diff处理后的节点
            child = diffNode(child, vchild)
            // 拿到更新前的 dom
            const f = domChildren[i]
            // 对比之后的节点和之前做比较
            if (child && child !== dom && child !== f ) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child)
                // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了 
                } else if (child === f.nextSibling ) {
                    removeNode( f )
                // 将更新后的节点移动到正确的位置
                } else {
                    // insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f)
                }
            }

        }
    }
}

// 包含所有类型的节点
const isSameNodeType = ( dom, vdom ) => {
    if ( typeof vdom === 'string' || typeof vdom === 'number' ) {
        return dom.nodeType === 3;
    }

    if ( typeof vdom.tag === 'string' ) {
        return dom.nodeName.toLowerCase() === vdom.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vdom.tag;
}

const diffComponent = (dom, vdom) => {
    // 拿到上一次该节点的虚拟dom, 如果是 component 组件，就在对应的dom节点挂载一个vdom作为 _component, 用来判断之前是否存在
    let c = dom && dom._component
    let oldDom = dom

    // 如果组件类型没有变化，则重新set props
    if ( c && c.constructor === vdom.tag ) {
        setComponentProps( c, vdom.attrs )
        dom = c.base
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    } else {
        if(c) {
            // 销毁
            unmountComponent(c)
            oldDom = null
        }
        c = createComponent(vdom.tag, vdom.attrs)
        setComponentProps( c, vdom.attrs )
        dom = c.base

        if(oldDom && dom !== oldDom) {
            oldDom._component = null
            removeNode(oldDom)
        }
    }
    return dom
}

const setComponentProps = (component, props) => {
    if(!component.base) {
        component.componentWillMount && component.componentWillMount()
    }else if(component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props)
    }

    component.props = props

    renderComponent(component)
}

export const renderComponent = (component) => {
    let base
    const renderer = component.render()

    if (component.base && component.componentWillUpdate ) {
        component.componentWillUpdate();
    }
    // diff
    base = diffNode(component.base, renderer)
    // component.base = base
    // base._component = component
    console.log("444", component, component.base)
    if(component.base) {
        component.componentDidUpdate && component.componentDidUpdate()
    }else if(component.componentDidMount) {
        component.componentDidMount()
    }

    component.base = base
    base._component = component
}

const unmountComponent = (component) => {
    component.componentWillUnmount && component.componentWillUnmount()
    removeNode( component.base)
}

const removeNode = (dom) => {
    if ( dom && dom.parentNode ) {
        dom.parentNode.removeChild( dom );
    }
}

// 创建组件实例
const createComponent = (component, props) =>  {
    let inst
    if ( component.prototype && component.prototype.render ) {
        inst = new component( props )
    } else {
        inst = new Component( props )
        inst.constructor = component
        inst.render = function() {
            return this.constructor( props )
        }
    }
    return inst
}

const setAttribute = (dom, name, value) => {
    // 如果属性名是class，则改回className
    if ( name === 'className' ) name = 'class';

    // 如果属性名是onXXX，则是一个时间监听方法
    if ( /on\w+/.test( name ) ) {
        name = name.toLowerCase();
        dom[ name ] = value || '';
    // 如果属性名是style，则更新style对象
    } else if ( name === 'style' ) {
        if ( !value || typeof value === 'string' ) {
            node.style.cssText = value || '';
        } else if ( value && typeof value === 'object' ) {
            for ( let name in value ) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }
    // 普通属性则直接更新属性
    } else {
        if ( name in dom ) {
            dom[ name ] = value || '';
        }
        if ( value ) {
            dom.setAttribute( name, value );
        } else {
            dom.removeAttribute( name, value );
        }
    }
}