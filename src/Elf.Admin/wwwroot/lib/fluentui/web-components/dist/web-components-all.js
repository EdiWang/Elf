const FluentDesignSystem = Object.freeze({
  prefix: "fluent",
  shadowRootMode: "open",
  registry: globalThis.customElements
});

function isCustomElement(tagSuffix) {
  return (element) => {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    return element.tagName.toLowerCase().endsWith(tagSuffix);
  };
}
function isHTMLElement(...args) {
  return args.every((arg) => arg instanceof HTMLElement);
}

const AccordionItemSize = {
  small: "small",
  medium: "medium",
  large: "large",
  extraLarge: "extra-large"
};
const AccordionItemMarkerPosition = {
  start: "start",
  end: "end"
};
function isAccordionItem(element, tagName2 = "-accordion-item") {
  return isCustomElement(tagName2)(element);
}
const tagName$F = `${FluentDesignSystem.prefix}-accordion-item`;

let kernelMode;
const kernelAttr = "fast-kernel";
try {
    if (document.currentScript) {
        kernelMode = document.currentScript.getAttribute(kernelAttr);
    }
    else {
        const scripts = document.getElementsByTagName("script");
        const currentScript = scripts[scripts.length - 1];
        kernelMode = currentScript.getAttribute(kernelAttr);
    }
}
catch (e) {
    kernelMode = "isolate";
}
let KernelServiceId;
switch (kernelMode) {
    case "share": // share the kernel across major versions
        KernelServiceId = Object.freeze({
            updateQueue: 1,
            observable: 2,
            contextEvent: 3,
            elementRegistry: 4,
        });
        break;
    case "share-v2": // only share the kernel with other v2 instances
        KernelServiceId = Object.freeze({
            updateQueue: 1.2,
            observable: 2.2,
            contextEvent: 3.2,
            elementRegistry: 4.2,
        });
        break;
    default:
        // fully isolate the kernel from all other FAST instances
        const postfix = `-${Math.random().toString(36).substring(2, 8)}`;
        KernelServiceId = Object.freeze({
            updateQueue: `1.2${postfix}`,
            observable: `2.2${postfix}`,
            contextEvent: `3.2${postfix}`,
            elementRegistry: `4.2${postfix}`,
        });
        break;
}
/**
 * Determines whether or not an object is a function.
 * @public
 */
const isFunction = (object) => typeof object === "function";
/**
 * Determines whether or not an object is a string.
 * @public
 */
const isString = (object) => typeof object === "string";
/**
 * A function which does nothing.
 * @public
 */
const noop = () => void 0;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/* eslint-disable @typescript-eslint/ban-ts-comment */
(function ensureGlobalThis() {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return;
    }
    // @ts-ignore
    if (typeof commonjsGlobal !== "undefined") {
        // We're running in NodeJS
        // @ts-ignore
        commonjsGlobal.globalThis = commonjsGlobal;
    }
    else if (typeof self !== "undefined") {
        self.globalThis = self;
    }
    else if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        window.globalThis = window;
    }
    else {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        const result = new Function("return this")();
        result.globalThis = result;
    }
})();

// ensure FAST global - duplicated debug.ts
const propConfig = {
    configurable: false,
    enumerable: false,
    writable: false,
};
if (globalThis.FAST === void 0) {
    Reflect.defineProperty(globalThis, "FAST", Object.assign({ value: Object.create(null) }, propConfig));
}
/**
 * The FAST global.
 * @public
 */
const FAST = globalThis.FAST;
if (FAST.getById === void 0) {
    const storage = Object.create(null);
    Reflect.defineProperty(FAST, "getById", Object.assign({ value(id, initialize) {
            let found = storage[id];
            if (found === void 0) {
                found = initialize ? (storage[id] = initialize()) : null;
            }
            return found;
        } }, propConfig));
}
if (FAST.error === void 0) {
    Object.assign(FAST, {
        warn() { },
        error(code) {
            return new Error(`Error ${code}`);
        },
        addMessages() { },
    });
}
/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @public
 */
const emptyArray = Object.freeze([]);
/**
 * Do not change. Part of shared kernel contract.
 * @internal
 */
function createTypeRegistry() {
    const typeToDefinition = new Map();
    return Object.freeze({
        register(definition) {
            if (typeToDefinition.has(definition.type)) {
                return false;
            }
            typeToDefinition.set(definition.type, definition);
            return true;
        },
        getByType(key) {
            return typeToDefinition.get(key);
        },
        getForInstance(object) {
            if (object === null || object === void 0) {
                return void 0;
            }
            return typeToDefinition.get(object.constructor);
        },
    });
}
/**
 * Creates a function capable of locating metadata associated with a type.
 * @returns A metadata locator function.
 * @internal
 */
function createMetadataLocator() {
    const metadataLookup = new WeakMap();
    return function (target) {
        let metadata = metadataLookup.get(target);
        if (metadata === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);
            while (metadata === void 0 && currentTarget !== null) {
                metadata = metadataLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }
            metadata = metadata === void 0 ? [] : metadata.slice(0);
            metadataLookup.set(target, metadata);
        }
        return metadata;
    };
}
/**
 * Makes a type noop for JSON serialization.
 * @param type - The type to make noop for JSON serialization.
 * @internal
 */
function makeSerializationNoop(type) {
    type.prototype.toJSON = noop;
}

/**
 * The type of HTML aspect to target.
 * @public
 */
const DOMAspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0,
    /**
     * An attribute.
     */
    attribute: 1,
    /**
     * A boolean attribute.
     */
    booleanAttribute: 2,
    /**
     * A property.
     */
    property: 3,
    /**
     * Content
     */
    content: 4,
    /**
     * A token list.
     */
    tokenList: 5,
    /**
     * An event.
     */
    event: 6,
});
const createHTML$1 = html => html;
const fastTrustedType = globalThis.trustedTypes
    ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML: createHTML$1 })
    : { createHTML: createHTML$1 };
let defaultPolicy = Object.freeze({
    createHTML(value) {
        return fastTrustedType.createHTML(value);
    },
    protect(tagName, aspect, aspectName, sink) {
        return sink;
    },
});
const fastPolicy = defaultPolicy;
/**
 * Common DOM APIs.
 * @public
 */
const DOM = Object.freeze({
    /**
     * Gets the dom policy used by the templating system.
     */
    get policy() {
        return defaultPolicy;
    },
    /**
     * Sets the dom policy used by the templating system.
     * @param policy - The policy to set.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setPolicy(value) {
        if (defaultPolicy !== fastPolicy) {
            throw FAST.error(1201 /* Message.onlySetDOMPolicyOnce */);
        }
        defaultPolicy = value;
    },
    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element, attributeName, value) {
        value === null || value === undefined
            ? element.removeAttribute(attributeName)
            : element.setAttribute(attributeName, value);
    },
    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(element, attributeName, value) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
});

/**
 * The default UpdateQueue.
 * @public
 */
const Updates = FAST.getById(KernelServiceId.updateQueue, () => {
    const tasks = [];
    const pendingErrors = [];
    const rAF = globalThis.requestAnimationFrame;
    let updateAsync = true;
    function throwFirstError() {
        if (pendingErrors.length) {
            throw pendingErrors.shift();
        }
    }
    function tryRunTask(task) {
        try {
            task.call();
        }
        catch (error) {
            if (updateAsync) {
                pendingErrors.push(error);
                setTimeout(throwFirstError, 0);
            }
            else {
                tasks.length = 0;
                throw error;
            }
        }
    }
    function process() {
        const capacity = 1024;
        let index = 0;
        while (index < tasks.length) {
            tryRunTask(tasks[index]);
            index++;
            // Prevent leaking memory for long chains of recursive calls to `enqueue`.
            // If we call `enqueue` within a task scheduled by `enqueue`, the queue will
            // grow, but to avoid an O(n) walk for every task we execute, we don't
            // shift tasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 tasks off the queue.
            if (index > capacity) {
                // Manually shift all values starting at the index back to the
                // beginning of the queue.
                for (let scan = 0, newLength = tasks.length - index; scan < newLength; scan++) {
                    tasks[scan] = tasks[scan + index];
                }
                tasks.length -= index;
                index = 0;
            }
        }
        tasks.length = 0;
    }
    function enqueue(callable) {
        tasks.push(callable);
        if (tasks.length < 2) {
            updateAsync ? rAF(process) : process();
        }
    }
    return Object.freeze({
        enqueue,
        next: () => new Promise(enqueue),
        process,
        setMode: (isAsync) => (updateAsync = isAsync),
    });
});

/**
 * An implementation of {@link Notifier} that efficiently keeps track of
 * subscribers interested in a specific change notification on an
 * observable subject.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
class SubscriberSet {
    /**
     * Creates an instance of SubscriberSet for the specified subject.
     * @param subject - The subject that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    constructor(subject, initialSubscriber) {
        this.sub1 = void 0;
        this.sub2 = void 0;
        this.spillover = void 0;
        this.subject = subject;
        this.sub1 = initialSubscriber;
    }
    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    has(subscriber) {
        return this.spillover === void 0
            ? this.sub1 === subscriber || this.sub2 === subscriber
            : this.spillover.indexOf(subscriber) !== -1;
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    subscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.has(subscriber)) {
                return;
            }
            if (this.sub1 === void 0) {
                this.sub1 = subscriber;
                return;
            }
            if (this.sub2 === void 0) {
                this.sub2 = subscriber;
                return;
            }
            this.spillover = [this.sub1, this.sub2, subscriber];
            this.sub1 = void 0;
            this.sub2 = void 0;
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index === -1) {
                spillover.push(subscriber);
            }
        }
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    unsubscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.sub1 === subscriber) {
                this.sub1 = void 0;
            }
            else if (this.sub2 === subscriber) {
                this.sub2 = void 0;
            }
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index !== -1) {
                spillover.splice(index, 1);
            }
        }
    }
    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    notify(args) {
        const spillover = this.spillover;
        const subject = this.subject;
        if (spillover === void 0) {
            const sub1 = this.sub1;
            const sub2 = this.sub2;
            if (sub1 !== void 0) {
                sub1.handleChange(subject, args);
            }
            if (sub2 !== void 0) {
                sub2.handleChange(subject, args);
            }
        }
        else {
            for (let i = 0, ii = spillover.length; i < ii; ++i) {
                spillover[i].handleChange(subject, args);
            }
        }
    }
}
/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
class PropertyChangeNotifier {
    /**
     * Creates an instance of PropertyChangeNotifier for the specified subject.
     * @param subject - The object that subscribers will receive notifications for.
     */
    constructor(subject) {
        this.subscribers = {};
        this.subjectSubscribers = null;
        this.subject = subject;
    }
    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    notify(propertyName) {
        var _a, _b;
        (_a = this.subscribers[propertyName]) === null || _a === void 0 ? void 0 : _a.notify(propertyName);
        (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.notify(propertyName);
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    subscribe(subscriber, propertyToWatch) {
        var _a, _b;
        let subscribers;
        if (propertyToWatch) {
            subscribers =
                (_a = this.subscribers[propertyToWatch]) !== null && _a !== void 0 ? _a : (this.subscribers[propertyToWatch] = new SubscriberSet(this.subject));
        }
        else {
            subscribers =
                (_b = this.subjectSubscribers) !== null && _b !== void 0 ? _b : (this.subjectSubscribers = new SubscriberSet(this.subject));
        }
        subscribers.subscribe(subscriber);
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    unsubscribe(subscriber, propertyToUnwatch) {
        var _a, _b;
        if (propertyToUnwatch) {
            (_a = this.subscribers[propertyToUnwatch]) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriber);
        }
        else {
            (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.unsubscribe(subscriber);
        }
    }
}

/**
 * Describes how the source's lifetime relates to its controller's lifetime.
 * @public
 */
const SourceLifetime = Object.freeze({
    /**
     * The source to controller lifetime relationship is unknown.
     */
    unknown: void 0,
    /**
     * The source and controller lifetimes are coupled to one another.
     * They can/will be GC'd together.
     */
    coupled: 1,
});
/**
 * Common Observable APIs.
 * @public
 */
const Observable = FAST.getById(KernelServiceId.observable, () => {
    const queueUpdate = Updates.enqueue;
    const volatileRegex = /(:|&&|\|\||if|\?\.)/;
    const notifierLookup = new WeakMap();
    let watcher = void 0;
    let createArrayObserver = (array) => {
        throw FAST.error(1101 /* Message.needsArrayObservation */);
    };
    function getNotifier(source) {
        var _a;
        let found = (_a = source.$fastController) !== null && _a !== void 0 ? _a : notifierLookup.get(source);
        if (found === void 0) {
            Array.isArray(source)
                ? (found = createArrayObserver(source))
                : notifierLookup.set(source, (found = new PropertyChangeNotifier(source)));
        }
        return found;
    }
    const getAccessors = createMetadataLocator();
    class DefaultObservableAccessor {
        constructor(name) {
            this.name = name;
            this.field = `_${name}`;
            this.callback = `${name}Changed`;
        }
        getValue(source) {
            if (watcher !== void 0) {
                watcher.watch(source, this.name);
            }
            return source[this.field];
        }
        setValue(source, newValue) {
            const field = this.field;
            const oldValue = source[field];
            if (oldValue !== newValue) {
                source[field] = newValue;
                const callback = source[this.callback];
                if (isFunction(callback)) {
                    callback.call(source, oldValue, newValue);
                }
                getNotifier(source).notify(this.name);
            }
        }
    }
    class ExpressionNotifierImplementation extends SubscriberSet {
        constructor(expression, initialSubscriber, isVolatileBinding = false) {
            super(expression, initialSubscriber);
            this.expression = expression;
            this.isVolatileBinding = isVolatileBinding;
            this.needsRefresh = true;
            this.needsQueue = true;
            this.isAsync = true;
            this.first = this;
            this.last = null;
            this.propertySource = void 0;
            this.propertyName = void 0;
            this.notifier = void 0;
            this.next = void 0;
        }
        setMode(isAsync) {
            this.isAsync = this.needsQueue = isAsync;
        }
        bind(controller) {
            this.controller = controller;
            const value = this.observe(controller.source, controller.context);
            if (!controller.isBound && this.requiresUnbind(controller)) {
                controller.onUnbind(this);
            }
            return value;
        }
        requiresUnbind(controller) {
            return (controller.sourceLifetime !== SourceLifetime.coupled ||
                this.first !== this.last ||
                this.first.propertySource !== controller.source);
        }
        unbind(controller) {
            this.dispose();
        }
        observe(source, context) {
            if (this.needsRefresh && this.last !== null) {
                this.dispose();
            }
            const previousWatcher = watcher;
            watcher = this.needsRefresh ? this : void 0;
            this.needsRefresh = this.isVolatileBinding;
            let result;
            try {
                result = this.expression(source, context);
            }
            finally {
                watcher = previousWatcher;
            }
            return result;
        }
        // backwards compat with v1 kernel
        disconnect() {
            this.dispose();
        }
        dispose() {
            if (this.last !== null) {
                let current = this.first;
                while (current !== void 0) {
                    current.notifier.unsubscribe(this, current.propertyName);
                    current = current.next;
                }
                this.last = null;
                this.needsRefresh = this.needsQueue = this.isAsync;
            }
        }
        watch(propertySource, propertyName) {
            const prev = this.last;
            const notifier = getNotifier(propertySource);
            const current = prev === null ? this.first : {};
            current.propertySource = propertySource;
            current.propertyName = propertyName;
            current.notifier = notifier;
            notifier.subscribe(this, propertyName);
            if (prev !== null) {
                if (!this.needsRefresh) {
                    // Declaring the variable prior to assignment below circumvents
                    // a bug in Angular's optimization process causing infinite recursion
                    // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                    let prevValue;
                    watcher = void 0;
                    /* eslint-disable-next-line */
                    prevValue = prev.propertySource[prev.propertyName];
                    /* eslint-disable-next-line */
                    watcher = this;
                    if (propertySource === prevValue) {
                        this.needsRefresh = true;
                    }
                }
                prev.next = current;
            }
            this.last = current;
        }
        handleChange() {
            if (this.needsQueue) {
                this.needsQueue = false;
                queueUpdate(this);
            }
            else if (!this.isAsync) {
                this.call();
            }
        }
        call() {
            if (this.last !== null) {
                this.needsQueue = this.isAsync;
                this.notify(this);
            }
        }
        *records() {
            let next = this.first;
            while (next !== void 0) {
                yield next;
                next = next.next;
            }
        }
    }
    makeSerializationNoop(ExpressionNotifierImplementation);
    return Object.freeze({
        /**
         * @internal
         * @param factory - The factory used to create array observers.
         */
        setArrayObserverFactory(factory) {
            createArrayObserver = factory;
        },
        /**
         * Gets a notifier for an object or Array.
         * @param source - The object or Array to get the notifier for.
         */
        getNotifier,
        /**
         * Records a property change for a source object.
         * @param source - The object to record the change against.
         * @param propertyName - The property to track as changed.
         */
        track(source, propertyName) {
            watcher && watcher.watch(source, propertyName);
        },
        /**
         * Notifies watchers that the currently executing property getter or function is volatile
         * with respect to its observable dependencies.
         */
        trackVolatile() {
            watcher && (watcher.needsRefresh = true);
        },
        /**
         * Notifies subscribers of a source object of changes.
         * @param source - the object to notify of changes.
         * @param args - The change args to pass to subscribers.
         */
        notify(source, args) {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            getNotifier(source).notify(args);
        },
        /**
         * Defines an observable property on an object or prototype.
         * @param target - The target object to define the observable on.
         * @param nameOrAccessor - The name of the property to define as observable;
         * or a custom accessor that specifies the property name and accessor implementation.
         */
        defineProperty(target, nameOrAccessor) {
            if (isString(nameOrAccessor)) {
                nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
            }
            getAccessors(target).push(nameOrAccessor);
            Reflect.defineProperty(target, nameOrAccessor.name, {
                enumerable: true,
                get() {
                    return nameOrAccessor.getValue(this);
                },
                set(newValue) {
                    nameOrAccessor.setValue(this, newValue);
                },
            });
        },
        /**
         * Finds all the observable accessors defined on the target,
         * including its prototype chain.
         * @param target - The target object to search for accessor on.
         */
        getAccessors,
        /**
         * Creates a {@link ExpressionNotifier} that can watch the
         * provided {@link Expression} for changes.
         * @param expression - The binding to observe.
         * @param initialSubscriber - An initial subscriber to changes in the binding value.
         * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
         */
        binding(expression, initialSubscriber, isVolatileBinding = this.isVolatileBinding(expression)) {
            return new ExpressionNotifierImplementation(expression, initialSubscriber, isVolatileBinding);
        },
        /**
         * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
         * on every evaluation of the value.
         * @param expression - The binding to inspect.
         */
        isVolatileBinding(expression) {
            return volatileRegex.test(expression.toString());
        },
    });
});
/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
function observable(target, nameOrAccessor) {
    Observable.defineProperty(target, nameOrAccessor);
}
/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
function volatile(target, name, descriptor) {
    return Object.assign({}, descriptor, {
        get() {
            Observable.trackVolatile();
            return descriptor.get.apply(this);
        },
    });
}
const contextEvent = FAST.getById(KernelServiceId.contextEvent, () => {
    let current = null;
    return {
        get() {
            return current;
        },
        set(event) {
            current = event;
        },
    };
});
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
const ExecutionContext = Object.freeze({
    /**
     * A default execution context.
     */
    default: {
        index: 0,
        length: 0,
        get event() {
            return ExecutionContext.getEvent();
        },
        eventDetail() {
            return this.event.detail;
        },
        eventTarget() {
            return this.event.target;
        },
    },
    /**
     * Gets the current event.
     * @returns An event object.
     */
    getEvent() {
        return contextEvent.get();
    },
    /**
     * Sets the current event.
     * @param event - An event object.
     */
    setEvent(event) {
        contextEvent.set(event);
    },
});

/**
 * Captures a binding expression along with related information and capabilities.
 *
 * @public
 */
class Binding {
    /**
     * Creates a binding.
     * @param evaluate - Evaluates the binding.
     * @param policy - The security policy to associate with this binding.
     * @param isVolatile - Indicates whether the binding is volatile.
     */
    constructor(evaluate, policy, isVolatile = false) {
        this.evaluate = evaluate;
        this.policy = policy;
        this.isVolatile = isVolatile;
    }
}

class OneWayBinding extends Binding {
    createObserver(subscriber) {
        return Observable.binding(this.evaluate, subscriber, this.isVolatile);
    }
}
/**
 * Creates an standard binding.
 * @param expression - The binding to refresh when changed.
 * @param policy - The security policy to associate with th binding.
 * @param isVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding configuration.
 * @public
 */
function oneWay(expression, policy, isVolatile = Observable.isVolatileBinding(expression)) {
    return new OneWayBinding(expression, policy, isVolatile);
}

class OneTimeBinding extends Binding {
    createObserver() {
        return this;
    }
    bind(controller) {
        return this.evaluate(controller.source, controller.context);
    }
}
makeSerializationNoop(OneTimeBinding);
/**
 * Creates a one time binding
 * @param expression - The binding to refresh when signaled.
 * @param policy - The security policy to associate with th binding.
 * @returns A binding configuration.
 * @public
 */
function oneTime(expression, policy) {
    return new OneTimeBinding(expression, policy);
}

let DefaultStyleStrategy;
function reduceStyles(styles) {
    return styles
        .map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x])
        .reduce((prev, curr) => prev.concat(curr), []);
}
/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
class ElementStyles {
    /**
     * Creates an instance of ElementStyles.
     * @param styles - The styles that will be associated with elements.
     */
    constructor(styles) {
        this.styles = styles;
        this.targets = new WeakSet();
        this._strategy = null;
        this.behaviors = styles
            .map((x) => x instanceof ElementStyles ? x.behaviors : null)
            .reduce((prev, curr) => (curr === null ? prev : prev === null ? curr : prev.concat(curr)), null);
    }
    /**
     * Gets the StyleStrategy associated with these element styles.
     */
    get strategy() {
        if (this._strategy === null) {
            this.withStrategy(DefaultStyleStrategy);
        }
        return this._strategy;
    }
    /** @internal */
    addStylesTo(target) {
        this.strategy.addStylesTo(target);
        this.targets.add(target);
    }
    /** @internal */
    removeStylesFrom(target) {
        this.strategy.removeStylesFrom(target);
        this.targets.delete(target);
    }
    /** @internal */
    isAttachedTo(target) {
        return this.targets.has(target);
    }
    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    withBehaviors(...behaviors) {
        this.behaviors =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
        return this;
    }
    /**
     * Sets the strategy that handles adding/removing these styles for an element.
     * @param strategy - The strategy to use.
     */
    withStrategy(Strategy) {
        this._strategy = new Strategy(reduceStyles(this.styles));
        return this;
    }
    /**
     * Sets the default strategy type to use when creating style strategies.
     * @param Strategy - The strategy type to construct.
     */
    static setDefaultStrategy(Strategy) {
        DefaultStyleStrategy = Strategy;
    }
    /**
     * Normalizes a set of composable style options.
     * @param styles - The style options to normalize.
     * @returns A singular ElementStyles instance or undefined.
     */
    static normalize(styles) {
        return styles === void 0
            ? void 0
            : Array.isArray(styles)
                ? new ElementStyles(styles)
                : styles instanceof ElementStyles
                    ? styles
                    : new ElementStyles([styles]);
    }
}
/**
 * Indicates whether the DOM supports the adoptedStyleSheets feature.
 */
ElementStyles.supportsAdoptedStyleSheets = Array.isArray(document.adoptedStyleSheets) &&
    "replace" in CSSStyleSheet.prototype;

const registry$1 = createTypeRegistry();
/**
 * Instructs the css engine to provide dynamic styles or
 * associate behaviors with styles.
 * @public
 */
const CSSDirective = Object.freeze({
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry$1.getForInstance,
    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry$1.getByType,
    /**
     * Defines a CSSDirective.
     * @param type - The type to define as a directive.
     */
    define(type) {
        registry$1.register({ type });
        return type;
    },
});

function handleChange(directive, controller, observer) {
    controller.source.style.setProperty(directive.targetAspect, observer.bind(controller));
}
/**
 * Enables bindings in CSS.
 *
 * @public
 */
class CSSBindingDirective {
    /**
     * Creates an instance of CSSBindingDirective.
     * @param dataBinding - The binding to use in CSS.
     * @param targetAspect - The CSS property to target.
     */
    constructor(dataBinding, targetAspect) {
        this.dataBinding = dataBinding;
        this.targetAspect = targetAspect;
    }
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(add) {
        add(this);
        return `var(${this.targetAspect})`;
    }
    /**
     * Executed when this behavior is attached to a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    addedCallback(controller) {
        var _a;
        const element = controller.source;
        if (!element.$cssBindings) {
            element.$cssBindings = new Map();
            const setAttribute = element.setAttribute;
            element.setAttribute = (attr, value) => {
                setAttribute.call(element, attr, value);
                if (attr === "style") {
                    element.$cssBindings.forEach((v, k) => handleChange(k, v.controller, v.observer));
                }
            };
        }
        const observer = (_a = controller[this.targetAspect]) !== null && _a !== void 0 ? _a : (controller[this.targetAspect] = this.dataBinding.createObserver(this, this));
        observer.controller = controller;
        controller.source.$cssBindings.set(this, { controller, observer });
    }
    /**
     * Executed when this behavior's host is connected.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback(controller) {
        handleChange(this, controller, controller[this.targetAspect]);
    }
    /**
     * Executed when this behavior is detached from a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    removedCallback(controller) {
        if (controller.source.$cssBindings) {
            controller.source.$cssBindings.delete(this);
        }
    }
    /**
     * Called when a subject this instance has subscribed to changes.
     * @param subject - The subject of the change.
     * @param args - The event args detailing the change that occurred.
     *
     * @internal
     */
    handleChange(_, observer) {
        handleChange(this, observer.controller, observer);
    }
}
CSSDirective.define(CSSBindingDirective);

const marker$1 = `${Math.random().toString(36).substring(2, 8)}`;
let varId = 0;
const nextCSSVariable = () => `--v${marker$1}${++varId}`;
function collectStyles(strings, values) {
    const styles = [];
    let cssString = "";
    const behaviors = [];
    const add = (behavior) => {
        behaviors.push(behavior);
    };
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];
        if (isFunction(value)) {
            value = new CSSBindingDirective(oneWay(value), nextCSSVariable()).createCSS(add);
        }
        else if (value instanceof Binding) {
            value = new CSSBindingDirective(value, nextCSSVariable()).createCSS(add);
        }
        else if (CSSDirective.getForInstance(value) !== void 0) {
            value = value.createCSS(add);
        }
        if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }
            styles.push(value);
        }
        else {
            cssString += value;
        }
    }
    cssString += strings[strings.length - 1];
    if (cssString.trim() !== "") {
        styles.push(cssString);
    }
    return {
        styles,
        behaviors,
    };
}
/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
const css = ((strings, ...values) => {
    const { styles, behaviors } = collectStyles(strings, values);
    const elementStyles = new ElementStyles(styles);
    return behaviors.length ? elementStyles.withBehaviors(...behaviors) : elementStyles;
});
class CSSPartial {
    constructor(styles, behaviors) {
        this.behaviors = behaviors;
        this.css = "";
        const stylesheets = styles.reduce((accumulated, current) => {
            if (isString(current)) {
                this.css += current;
            }
            else {
                accumulated.push(current);
            }
            return accumulated;
        }, []);
        if (stylesheets.length) {
            this.styles = new ElementStyles(stylesheets);
        }
    }
    createCSS(add) {
        this.behaviors.forEach(add);
        if (this.styles) {
            add(this);
        }
        return this.css;
    }
    addedCallback(controller) {
        controller.addStyles(this.styles);
    }
    removedCallback(controller) {
        controller.removeStyles(this.styles);
    }
}
CSSDirective.define(CSSPartial);
css.partial = (strings, ...values) => {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
};

const bindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
const bindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
const repeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
const repeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
const elementBoundaryStartMarker = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
const elementBoundaryEndMarker = /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;
function isComment$1(node) {
    return node && node.nodeType === Node.COMMENT_NODE;
}
/**
 * Markup utilities to aid in template hydration.
 * @internal
 */
const HydrationMarkup = Object.freeze({
    attributeMarkerName: "data-fe-b",
    attributeBindingSeparator: " ",
    contentBindingStartMarker(index, uniqueId) {
        return `fe-b$$start$$${index}$$${uniqueId}$$fe-b`;
    },
    contentBindingEndMarker(index, uniqueId) {
        return `fe-b$$end$$${index}$$${uniqueId}$$fe-b`;
    },
    repeatStartMarker(index) {
        return `fe-repeat$$start$$${index}$$fe-repeat`;
    },
    repeatEndMarker(index) {
        return `fe-repeat$$end$$${index}$$fe-repeat`;
    },
    isContentBindingStartMarker(content) {
        return bindingStartMarker.test(content);
    },
    isContentBindingEndMarker(content) {
        return bindingEndMarker.test(content);
    },
    isRepeatViewStartMarker(content) {
        return repeatViewStartMarker.test(content);
    },
    isRepeatViewEndMarker(content) {
        return repeatViewEndMarker.test(content);
    },
    isElementBoundaryStartMarker(node) {
        return isComment$1(node) && elementBoundaryStartMarker.test(node.data.trim());
    },
    isElementBoundaryEndMarker(node) {
        return isComment$1(node) && elementBoundaryEndMarker.test(node.data);
    },
    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     */
    parseAttributeBinding(node) {
        const attr = node.getAttribute(this.attributeMarkerName);
        return attr === null
            ? attr
            : attr.split(this.attributeBindingSeparator).map(i => parseInt(i));
    },
    /**
     * Parses the ViewBehaviorFactory index from string data. Returns
     * the binding index or null if the index cannot be retrieved.
     */
    parseContentBindingStartMarker(content) {
        return parseIndexAndIdMarker(bindingStartMarker, content);
    },
    parseContentBindingEndMarker(content) {
        return parseIndexAndIdMarker(bindingEndMarker, content);
    },
    /**
     * Parses the index of a repeat directive from a content string.
     */
    parseRepeatStartMarker(content) {
        return parseIntMarker(repeatViewStartMarker, content);
    },
    parseRepeatEndMarker(content) {
        return parseIntMarker(repeatViewEndMarker, content);
    },
    /**
     * Parses element Id from element boundary markers
     */
    parseElementBoundaryStartMarker(content) {
        return parseStringMarker(elementBoundaryStartMarker, content.trim());
    },
    parseElementBoundaryEndMarker(content) {
        return parseStringMarker(elementBoundaryEndMarker, content);
    },
});
function parseIntMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : parseInt(match[1]);
}
function parseStringMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : match[1];
}
function parseIndexAndIdMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : [parseInt(match[1]), match[2]];
}
/**
 * @internal
 */
const Hydratable = Symbol.for("fe-hydration");
function isHydratable(value) {
    return value[Hydratable] === Hydratable;
}

const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
const interpolationStart = `${marker}{`;
const interpolationEnd = `}${marker}`;
const interpolationEndLength = interpolationEnd.length;
let id$1 = 0;
/** @internal */
const nextId = () => `${marker}-${++id$1}`;
/**
 * Common APIs related to markup generation.
 * @public
 */
const Markup = Object.freeze({
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    interpolation: (id) => `${interpolationStart}${id}${interpolationEnd}`,
    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    attribute: (id) => `${nextId()}="${interpolationStart}${id}${interpolationEnd}"`,
    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    comment: (id) => `<!--${interpolationStart}${id}${interpolationEnd}-->`,
});
/**
 * Common APIs related to content parsing.
 * @public
 */
const Parser = Object.freeze({
    /**
     * Parses text content or HTML attribute content, separating out the static strings
     * from the directives.
     * @param value - The content or attribute string to parse.
     * @param factories - A list of directives to search for in the string.
     * @returns A heterogeneous array of static strings interspersed with
     * directives or null if no directives are found in the string.
     */
    parse(value, factories) {
        const parts = value.split(interpolationStart);
        if (parts.length === 1) {
            return null;
        }
        const result = [];
        for (let i = 0, ii = parts.length; i < ii; ++i) {
            const current = parts[i];
            const index = current.indexOf(interpolationEnd);
            let literal;
            if (index === -1) {
                literal = current;
            }
            else {
                const factoryId = current.substring(0, index);
                result.push(factories[factoryId]);
                literal = current.substring(index + interpolationEndLength);
            }
            if (literal !== "") {
                result.push(literal);
            }
        }
        return result;
    },
});

const registry = createTypeRegistry();
/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
const HTMLDirective = Object.freeze({
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry.getForInstance,
    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry.getByType,
    /**
     * Defines an HTMLDirective based on the options.
     * @param type - The type to define as a directive.
     * @param options - Options that specify the directive's application.
     */
    define(type, options) {
        options = options || {};
        options.type = type;
        registry.register(options);
        return type;
    },
    /**
     *
     * @param directive - The directive to assign the aspect to.
     * @param value - The value to base the aspect determination on.
     * @remarks
     * If a falsy value is provided, then the content aspect will be assigned.
     */
    assignAspect(directive, value) {
        if (!value) {
            directive.aspectType = DOMAspect.content;
            return;
        }
        directive.sourceAspect = value;
        switch (value[0]) {
            case ":":
                directive.targetAspect = value.substring(1);
                directive.aspectType =
                    directive.targetAspect === "classList"
                        ? DOMAspect.tokenList
                        : DOMAspect.property;
                break;
            case "?":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.booleanAttribute;
                break;
            case "@":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.event;
                break;
            default:
                directive.targetAspect = value;
                directive.aspectType = DOMAspect.attribute;
                break;
        }
    },
});
/**
 * A base class used for attribute directives that don't need internal state.
 * @public
 */
class StatelessAttachedAttributeDirective {
    /**
     * Creates an instance of RefDirective.
     * @param options - The options to use in configuring the directive.
     */
    constructor(options) {
        this.options = options;
    }
    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    createHTML(add) {
        return Markup.attribute(add(this));
    }
    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior() {
        return this;
    }
}
makeSerializationNoop(StatelessAttachedAttributeDirective);

class HydrationTargetElementError extends Error {
    constructor(
    /**
     * The error message
     */
    message, 
    /**
     * The Compiled View Behavior Factories that belong to the view.
     */
    factories, 
    /**
     * The node to target factory.
     */
    node) {
        super(message);
        this.factories = factories;
        this.node = node;
    }
}
function isComment(node) {
    return node.nodeType === Node.COMMENT_NODE;
}
function isText(node) {
    return node.nodeType === Node.TEXT_NODE;
}
/**
 * Returns a range object inclusive of all nodes including and between the
 * provided first and last node.
 * @param first - The first node
 * @param last - This last node
 * @returns
 */
function createRangeForNodes(first, last) {
    const range = document.createRange();
    range.setStart(first, 0);
    // The lastIndex should be inclusive of the end of the lastChild. Obtain offset based
    // on usageNotes:  https://developer.mozilla.org/en-US/docs/Web/API/Range/setEnd#usage_notes
    range.setEnd(last, isComment(last) || isText(last) ? last.data.length : last.childNodes.length);
    return range;
}
function isShadowRoot(node) {
    return node instanceof DocumentFragment && "mode" in node;
}
/**
 * Maps {@link CompiledViewBehaviorFactory} ids to the corresponding node targets for the view.
 * @param firstNode - The first node of the view.
 * @param lastNode -  The last node of the view.
 * @param factories - The Compiled View Behavior Factories that belong to the view.
 * @returns - A {@link ViewBehaviorTargets } object for the factories in the view.
 */
function buildViewBindingTargets(firstNode, lastNode, factories) {
    const range = createRangeForNodes(firstNode, lastNode);
    const treeRoot = range.commonAncestorContainer;
    const walker = document.createTreeWalker(treeRoot, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return range.comparePoint(node, 0) === 0
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        },
    });
    const targets = {};
    const boundaries = {};
    let node = (walker.currentNode = firstNode);
    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                targetElement(node, factories, targets);
                break;
            }
            case Node.COMMENT_NODE: {
                targetComment(node, walker, factories, targets, boundaries);
                break;
            }
        }
        node = walker.nextNode();
    }
    range.detach();
    return { targets, boundaries };
}
function targetElement(node, factories, targets) {
    // Check for attributes and map any factories.
    const attrFactoryIds = HydrationMarkup.parseAttributeBinding(node);
    if (attrFactoryIds !== null) {
        for (const id of attrFactoryIds) {
            if (!factories[id]) {
                throw new HydrationTargetElementError(`HydrationView was unable to successfully target factory on ${node.nodeName} inside ${node.getRootNode().host.nodeName}. This likely indicates a template mismatch between SSR rendering and hydration.`, factories, node);
            }
            targetFactory(factories[id], node, targets);
        }
        node.removeAttribute(HydrationMarkup.attributeMarkerName);
    }
}
function targetComment(node, walker, factories, targets, boundaries) {
    if (HydrationMarkup.isElementBoundaryStartMarker(node)) {
        skipToElementBoundaryEndMarker(node, walker);
        return;
    }
    if (HydrationMarkup.isContentBindingStartMarker(node.data)) {
        const parsed = HydrationMarkup.parseContentBindingStartMarker(node.data);
        if (parsed === null) {
            return;
        }
        const [index, id] = parsed;
        const factory = factories[index];
        const nodes = [];
        let current = walker.nextSibling();
        node.data = "";
        const first = current;
        // Search for the binding end marker that closes the binding.
        while (current !== null) {
            if (isComment(current)) {
                const parsed = HydrationMarkup.parseContentBindingEndMarker(current.data);
                if (parsed && parsed[1] === id) {
                    break;
                }
            }
            nodes.push(current);
            current = walker.nextSibling();
        }
        if (current === null) {
            const root = node.getRootNode();
            throw new Error(`Error hydrating Comment node inside "${isShadowRoot(root) ? root.host.nodeName : root.nodeName}".`);
        }
        current.data = "";
        if (nodes.length === 1 && isText(nodes[0])) {
            targetFactory(factory, nodes[0], targets);
        }
        else {
            // If current === first, it means there is no content in
            // the view. This happens when a `when` directive evaluates false,
            // or whenever a content binding returns null or undefined.
            // In that case, there will never be any content
            // to hydrate and Binding can simply create a HTMLView
            // whenever it needs to.
            if (current !== first && current.previousSibling !== null) {
                boundaries[factory.targetNodeId] = {
                    first,
                    last: current.previousSibling,
                };
            }
            // Binding evaluates to null / undefined or a template.
            // If binding revaluates to string, it will replace content in target
            // So we always insert a text node to ensure that
            // text content binding will be written to this text node instead of comment
            const dummyTextNode = current.parentNode.insertBefore(document.createTextNode(""), current);
            targetFactory(factory, dummyTextNode, targets);
        }
    }
}
/**
 * Moves TreeWalker to element boundary end marker
 * @param node - element boundary start marker node
 * @param walker - tree walker
 */
function skipToElementBoundaryEndMarker(node, walker) {
    const id = HydrationMarkup.parseElementBoundaryStartMarker(node.data);
    let current = walker.nextSibling();
    while (current !== null) {
        if (isComment(current)) {
            const parsed = HydrationMarkup.parseElementBoundaryEndMarker(current.data);
            if (parsed && parsed === id) {
                break;
            }
        }
        current = walker.nextSibling();
    }
}
function targetFactory(factory, node, targets) {
    if (factory.targetNodeId === undefined) {
        // Dev error, this shouldn't ever be thrown
        throw new Error("Factory could not be target to the node");
    }
    targets[factory.targetNodeId] = node;
}

var _a;
function removeNodeSequence(firstNode, lastNode) {
    const parent = firstNode.parentNode;
    let current = firstNode;
    let next;
    while (current !== lastNode) {
        next = current.nextSibling;
        if (!next) {
            throw new Error(`Unmatched first/last child inside "${lastNode.getRootNode().host.nodeName}".`);
        }
        parent.removeChild(current);
        current = next;
    }
    parent.removeChild(lastNode);
}
class DefaultExecutionContext {
    constructor() {
        /**
         * The index of the current item within a repeat context.
         */
        this.index = 0;
        /**
         * The length of the current collection within a repeat context.
         */
        this.length = 0;
    }
    /**
     * The current event within an event handler.
     */
    get event() {
        return ExecutionContext.getEvent();
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven() {
        return this.index % 2 === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd() {
        return this.index % 2 !== 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst() {
        return this.index === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast() {
        return this.index === this.length - 1;
    }
    /**
     * Returns the typed event detail of a custom event.
     */
    eventDetail() {
        return this.event.detail;
    }
    /**
     * Returns the typed event target of the event.
     */
    eventTarget() {
        return this.event.target;
    }
}
/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
class HTMLView extends DefaultExecutionContext {
    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    constructor(fragment, factories, targets) {
        super();
        this.fragment = fragment;
        this.factories = factories;
        this.targets = targets;
        this.behaviors = null;
        this.unbindables = [];
        /**
         * The data that the view is bound to.
         */
        this.source = null;
        /**
         * Indicates whether the controller is bound.
         */
        this.isBound = false;
        /**
         * Indicates how the source's lifetime relates to the controller's lifetime.
         */
        this.sourceLifetime = SourceLifetime.unknown;
        /**
         * The execution context the view is running within.
         */
        this.context = this;
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
    }
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node) {
        node.appendChild(this.fragment);
    }
    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const end = this.lastChild;
            if (node.previousSibling === end)
                return;
            const parentNode = node.parentNode;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove() {
        const fragment = this.fragment;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }
    onUnbind(behavior) {
        this.unbindables.push(behavior);
    }
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    bind(source, context = this) {
        if (this.source === source) {
            return;
        }
        let behaviors = this.behaviors;
        if (behaviors === null) {
            this.source = source;
            this.context = context;
            this.behaviors = behaviors = new Array(this.factories.length);
            const factories = this.factories;
            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const behavior = factories[i].createBehavior();
                behavior.bind(this);
                behaviors[i] = behavior;
            }
        }
        else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }
            this.isBound = false;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }
        this.isBound = true;
    }
    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind() {
        if (!this.isBound || this.source === null) {
            return;
        }
        this.evaluateUnbindables();
        this.source = null;
        this.context = this;
        this.isBound = false;
    }
    evaluateUnbindables() {
        const unbindables = this.unbindables;
        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }
        unbindables.length = 0;
    }
    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    static disposeContiguousBatch(views) {
        if (views.length === 0) {
            return;
        }
        removeNodeSequence(views[0].firstChild, views[views.length - 1].lastChild);
        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}
makeSerializationNoop(HTMLView);
Observable.defineProperty(HTMLView.prototype, "index");
Observable.defineProperty(HTMLView.prototype, "length");
const HydrationStage = {
    unhydrated: "unhydrated",
    hydrating: "hydrating",
    hydrated: "hydrated",
};
/** @public */
class HydrationBindingError extends Error {
    constructor(
    /**
     * The error message
     */
    message, 
    /**
     * The factory that was unable to be bound
     */
    factory, 
    /**
     * A DocumentFragment containing a clone of the
     * view's Nodes.
     */
    fragment, 
    /**
     * String representation of the HTML in the template that
     * threw the binding error.
     */
    templateString) {
        super(message);
        this.factory = factory;
        this.fragment = fragment;
        this.templateString = templateString;
    }
}
class HydrationView extends DefaultExecutionContext {
    constructor(firstChild, lastChild, sourceTemplate, hostBindingTarget) {
        super();
        this.firstChild = firstChild;
        this.lastChild = lastChild;
        this.sourceTemplate = sourceTemplate;
        this.hostBindingTarget = hostBindingTarget;
        this[_a] = Hydratable;
        this.context = this;
        this.source = null;
        this.isBound = false;
        this.sourceLifetime = SourceLifetime.unknown;
        this.unbindables = [];
        this.fragment = null;
        this.behaviors = null;
        this._hydrationStage = HydrationStage.unhydrated;
        this._bindingViewBoundaries = {};
        this._targets = {};
        this.factories = sourceTemplate.compile().factories;
    }
    get hydrationStage() {
        return this._hydrationStage;
    }
    get targets() {
        return this._targets;
    }
    get bindingViewBoundaries() {
        return this._bindingViewBoundaries;
    }
    /**
     * no-op. Hydrated views are don't need to be moved from a documentFragment
     * to the target node.
     */
    insertBefore(node) {
        // No-op in cases where this is called before the view is removed,
        // because the nodes will already be in the document and just need hydrating.
        if (this.fragment === null) {
            return;
        }
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const end = this.lastChild;
            if (node.previousSibling === end)
                return;
            const parentNode = node.parentNode;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Appends the view to a node. In cases where this is called before the
     * view has been removed, the method will no-op.
     * @param node - the node to append the view to.
     */
    appendTo(node) {
        if (this.fragment !== null) {
            node.appendChild(this.fragment);
        }
    }
    remove() {
        const fragment = this.fragment || (this.fragment = document.createDocumentFragment());
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            if (!next) {
                throw new Error(`Unmatched first/last child inside "${end.getRootNode().host.nodeName}".`);
            }
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    bind(source, context = this) {
        var _b, _c;
        if (this.hydrationStage !== HydrationStage.hydrated) {
            this._hydrationStage = HydrationStage.hydrating;
        }
        if (this.source === source) {
            return;
        }
        let behaviors = this.behaviors;
        if (behaviors === null) {
            this.source = source;
            this.context = context;
            try {
                const { targets, boundaries } = buildViewBindingTargets(this.firstChild, this.lastChild, this.factories);
                this._targets = targets;
                this._bindingViewBoundaries = boundaries;
            }
            catch (error) {
                if (error instanceof HydrationTargetElementError) {
                    let templateString = this.sourceTemplate.html;
                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }
                    error.templateString = templateString;
                }
                throw error;
            }
            this.behaviors = behaviors = new Array(this.factories.length);
            const factories = this.factories;
            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const factory = factories[i];
                if (factory.targetNodeId === "h" && this.hostBindingTarget) {
                    targetFactory(factory, this.hostBindingTarget, this._targets);
                }
                // If the binding has been targeted or it is a host binding and the view has a hostBindingTarget
                if (factory.targetNodeId in this.targets) {
                    const behavior = factory.createBehavior();
                    behavior.bind(this);
                    behaviors[i] = behavior;
                }
                else {
                    let templateString = this.sourceTemplate.html;
                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }
                    throw new HydrationBindingError(`HydrationView was unable to successfully target bindings inside "${(_c = ((_b = this.firstChild) === null || _b === void 0 ? void 0 : _b.getRootNode()).host) === null || _c === void 0 ? void 0 : _c.nodeName}".`, factory, createRangeForNodes(this.firstChild, this.lastChild).cloneContents(), templateString);
                }
            }
        }
        else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }
            this.isBound = false;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }
        this.isBound = true;
        this._hydrationStage = HydrationStage.hydrated;
    }
    unbind() {
        if (!this.isBound || this.source === null) {
            return;
        }
        this.evaluateUnbindables();
        this.source = null;
        this.context = this;
        this.isBound = false;
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }
    onUnbind(behavior) {
        this.unbindables.push(behavior);
    }
    evaluateUnbindables() {
        const unbindables = this.unbindables;
        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }
        unbindables.length = 0;
    }
}
_a = Hydratable;
makeSerializationNoop(HydrationView);

function isContentTemplate(value) {
    return value.create !== undefined;
}
function updateContent(target, aspect, value, controller) {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }
    // If the value has a "create" method, then it's a ContentTemplate.
    if (isContentTemplate(value)) {
        target.textContent = "";
        let view = target.$fastView;
        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            if (isHydratable(controller) &&
                isHydratable(value) &&
                controller.bindingViewBoundaries[this.targetNodeId] !== undefined &&
                controller.hydrationStage !== HydrationStage.hydrated) {
                const viewNodes = controller.bindingViewBoundaries[this.targetNodeId];
                view = value.hydrate(viewNodes.first, viewNodes.last);
            }
            else {
                view = value.create();
            }
        }
        else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (target.$fastTemplate !== value) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }
                view = value.create();
            }
        }
        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(controller.source, controller.context);
            view.insertBefore(target);
            target.$fastView = view;
            target.$fastTemplate = value;
        }
        else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(controller.source, controller.context);
        }
    }
    else {
        const view = target.$fastView;
        // If there is a view and it's currently composed into
        // the DOM, then we need to remove it.
        if (view !== void 0 && view.isComposed) {
            view.isComposed = false;
            view.remove();
            if (view.needsBindOnly) {
                view.needsBindOnly = false;
            }
            else {
                view.unbind();
            }
        }
        target.textContent = value;
    }
}
function updateTokenList(target, aspect, value) {
    var _a;
    const lookup = `${this.id}-t`;
    const state = (_a = target[lookup]) !== null && _a !== void 0 ? _a : (target[lookup] = { v: 0, cv: Object.create(null) });
    const classVersions = state.cv;
    let version = state.v;
    const tokenList = target[aspect];
    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);
        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];
            if (currentName === "") {
                continue;
            }
            classVersions[currentName] = version;
            tokenList.add(currentName);
        }
    }
    state.v = version + 1;
    // If this is the first call to add classes, there's no need to remove old ones.
    if (version === 0) {
        return;
    }
    // Remove classes from the previous version.
    version -= 1;
    for (const name in classVersions) {
        if (classVersions[name] === version) {
            tokenList.remove(name);
        }
    }
}
const sinkLookup = {
    [DOMAspect.attribute]: DOM.setAttribute,
    [DOMAspect.booleanAttribute]: DOM.setBooleanAttribute,
    [DOMAspect.property]: (t, a, v) => (t[a] = v),
    [DOMAspect.content]: updateContent,
    [DOMAspect.tokenList]: updateTokenList,
    [DOMAspect.event]: () => void 0,
};
/**
 * A directive that applies bindings.
 * @public
 */
class HTMLBindingDirective {
    /**
     * Creates an instance of HTMLBindingDirective.
     * @param dataBinding - The binding configuration to apply.
     */
    constructor(dataBinding) {
        this.dataBinding = dataBinding;
        this.updateTarget = null;
        /**
         * The type of aspect to target.
         */
        this.aspectType = DOMAspect.content;
    }
    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add) {
        return Markup.interpolation(add(this));
    }
    /**
     * Creates a behavior.
     */
    createBehavior() {
        var _a;
        if (this.updateTarget === null) {
            const sink = sinkLookup[this.aspectType];
            const policy = (_a = this.dataBinding.policy) !== null && _a !== void 0 ? _a : this.policy;
            if (!sink) {
                throw FAST.error(1205 /* Message.unsupportedBindingBehavior */);
            }
            this.data = `${this.id}-d`;
            this.updateTarget = policy.protect(this.targetTagName, this.aspectType, this.targetAspect, sink);
        }
        return this;
    }
    /** @internal */
    bind(controller) {
        var _a;
        const target = controller.targets[this.targetNodeId];
        const isHydrating = isHydratable(controller) &&
            controller.hydrationStage &&
            controller.hydrationStage !== HydrationStage.hydrated;
        switch (this.aspectType) {
            case DOMAspect.event:
                target[this.data] = controller;
                target.addEventListener(this.targetAspect, this, this.dataBinding.options);
                break;
            case DOMAspect.content:
                controller.onUnbind(this);
            // intentional fall through
            default:
                const observer = (_a = target[this.data]) !== null && _a !== void 0 ? _a : (target[this.data] = this.dataBinding.createObserver(this, this));
                observer.target = target;
                observer.controller = controller;
                if (isHydrating &&
                    (this.aspectType === DOMAspect.attribute ||
                        this.aspectType === DOMAspect.booleanAttribute)) {
                    observer.bind(controller);
                    // Skip updating target during bind for attributes
                    break;
                }
                this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
                break;
        }
    }
    /** @internal */
    unbind(controller) {
        const target = controller.targets[this.targetNodeId];
        const view = target.$fastView;
        if (view !== void 0 && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }
    /** @internal */
    handleEvent(event) {
        const controller = event.currentTarget[this.data];
        if (controller.isBound) {
            ExecutionContext.setEvent(event);
            const result = this.dataBinding.evaluate(controller.source, controller.context);
            ExecutionContext.setEvent(null);
            if (result !== true) {
                event.preventDefault();
            }
        }
    }
    /** @internal */
    handleChange(binding, observer) {
        const target = observer.target;
        const controller = observer.controller;
        this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
    }
}
HTMLDirective.define(HTMLBindingDirective, { aspected: true });

const targetIdFrom = (parentId, nodeIndex) => `${parentId}.${nodeIndex}`;
const descriptorCache = {};
// used to prevent creating lots of objects just to track node and index while compiling
const next = {
    index: 0,
    node: null,
};
function tryWarn(name) {
    if (!name.startsWith("fast-")) {
        FAST.warn(1204 /* Message.hostBindingWithoutHost */, { name });
    }
}
const warningHost = new Proxy(document.createElement("div"), {
    get(target, property) {
        tryWarn(property);
        const value = Reflect.get(target, property);
        return isFunction(value) ? value.bind(target) : value;
    },
    set(target, property, value) {
        tryWarn(property);
        return Reflect.set(target, property, value);
    },
});
class CompilationContext {
    constructor(fragment, directives, policy) {
        this.fragment = fragment;
        this.directives = directives;
        this.policy = policy;
        this.proto = null;
        this.nodeIds = new Set();
        this.descriptors = {};
        this.factories = [];
    }
    addFactory(factory, parentId, nodeId, targetIndex, tagName) {
        var _a, _b;
        if (!this.nodeIds.has(nodeId)) {
            this.nodeIds.add(nodeId);
            this.addTargetDescriptor(parentId, nodeId, targetIndex);
        }
        factory.id = (_a = factory.id) !== null && _a !== void 0 ? _a : nextId();
        factory.targetNodeId = nodeId;
        factory.targetTagName = tagName;
        factory.policy = (_b = factory.policy) !== null && _b !== void 0 ? _b : this.policy;
        this.factories.push(factory);
    }
    freeze() {
        this.proto = Object.create(null, this.descriptors);
        return this;
    }
    addTargetDescriptor(parentId, targetId, targetIndex) {
        const descriptors = this.descriptors;
        if (targetId === "r" || // root
            targetId === "h" || // host
            descriptors[targetId]) {
            return;
        }
        if (!descriptors[parentId]) {
            const index = parentId.lastIndexOf(".");
            const grandparentId = parentId.substring(0, index);
            const childIndex = parseInt(parentId.substring(index + 1));
            this.addTargetDescriptor(grandparentId, parentId, childIndex);
        }
        let descriptor = descriptorCache[targetId];
        if (!descriptor) {
            const field = `_${targetId}`;
            descriptorCache[targetId] = descriptor = {
                get() {
                    var _a;
                    return ((_a = this[field]) !== null && _a !== void 0 ? _a : (this[field] = this[parentId].childNodes[targetIndex]));
                },
            };
        }
        descriptors[targetId] = descriptor;
    }
    createView(hostBindingTarget) {
        const fragment = this.fragment.cloneNode(true);
        const targets = Object.create(this.proto);
        targets.r = fragment;
        targets.h = hostBindingTarget !== null && hostBindingTarget !== void 0 ? hostBindingTarget : warningHost;
        for (const id of this.nodeIds) {
            targets[id]; // trigger locator
        }
        return new HTMLView(fragment, this.factories, targets);
    }
}
function compileAttributes(context, parentId, node, nodeId, nodeIndex, includeBasicValues = false) {
    const attributes = node.attributes;
    const directives = context.directives;
    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = Parser.parse(attrValue, directives);
        let result = null;
        if (parseResult === null) {
            if (includeBasicValues) {
                result = new HTMLBindingDirective(oneTime(() => attrValue, context.policy));
                HTMLDirective.assignAspect(result, attr.name);
            }
        }
        else {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            result = Compiler.aggregate(parseResult, context.policy);
        }
        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result, parentId, nodeId, nodeIndex, node.tagName);
        }
    }
}
function compileContent(context, node, parentId, nodeId, nodeIndex) {
    const parseResult = Parser.parse(node.textContent, context.directives);
    if (parseResult === null) {
        next.node = node.nextSibling;
        next.index = nodeIndex + 1;
        return next;
    }
    let currentNode;
    let lastNode = (currentNode = node);
    for (let i = 0, ii = parseResult.length; i < ii; ++i) {
        const currentPart = parseResult[i];
        if (i !== 0) {
            nodeIndex++;
            nodeId = targetIdFrom(parentId, nodeIndex);
            currentNode = lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
        }
        if (isString(currentPart)) {
            currentNode.textContent = currentPart;
        }
        else {
            currentNode.textContent = " ";
            HTMLDirective.assignAspect(currentPart);
            context.addFactory(currentPart, parentId, nodeId, nodeIndex, null);
        }
        lastNode = currentNode;
    }
    next.index = nodeIndex + 1;
    next.node = lastNode.nextSibling;
    return next;
}
function compileChildren(context, parent, parentId) {
    let nodeIndex = 0;
    let childNode = parent.firstChild;
    while (childNode) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        const result = compileNode(context, parentId, childNode, nodeIndex);
        childNode = result.node;
        nodeIndex = result.index;
    }
}
function compileNode(context, parentId, node, nodeIndex) {
    const nodeId = targetIdFrom(parentId, nodeIndex);
    switch (node.nodeType) {
        case 1: // element node
            compileAttributes(context, parentId, node, nodeId, nodeIndex);
            compileChildren(context, node, nodeId);
            break;
        case 3: // text node
            return compileContent(context, node, parentId, nodeId, nodeIndex);
        case 8: // comment
            const parts = Parser.parse(node.data, context.directives);
            if (parts !== null) {
                context.addFactory(
                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                Compiler.aggregate(parts), parentId, nodeId, nodeIndex, null);
            }
            break;
    }
    next.index = nodeIndex + 1;
    next.node = node.nextSibling;
    return next;
}
function isMarker(node, directives) {
    return (node &&
        node.nodeType == 8 &&
        Parser.parse(node.data, directives) !== null);
}
const templateTag = "TEMPLATE";
/**
 * Common APIs related to compilation.
 * @public
 */
const Compiler = {
    /**
     * Compiles a template and associated directives into a compilation
     * result which can be used to create views.
     * @param html - The html string or template element to compile.
     * @param factories - The behavior factories referenced by the template.
     * @param policy - The security policy to compile the html with.
     * @remarks
     * The template that is provided for compilation is altered in-place
     * and cannot be compiled again. If the original template must be preserved,
     * it is recommended that you clone the original and pass the clone to this API.
     * @public
     */
    compile(html, factories, policy = DOM.policy) {
        let template;
        if (isString(html)) {
            template = document.createElement(templateTag);
            template.innerHTML = policy.createHTML(html);
            const fec = template.content.firstElementChild;
            if (fec !== null && fec.tagName === templateTag) {
                template = fec;
            }
        }
        else {
            template = html;
        }
        if (!template.content.firstChild && !template.content.lastChild) {
            template.content.appendChild(document.createComment(""));
        }
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
        const fragment = document.adoptNode(template.content);
        const context = new CompilationContext(fragment, factories, policy);
        compileAttributes(context, "", template, /* host */ "h", 0, true);
        if (
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        isMarker(fragment.firstChild, factories) ||
            // Or if there is only one node and a directive, it means the template's content
            // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
            // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
            (fragment.childNodes.length === 1 && Object.keys(factories).length > 0)) {
            fragment.insertBefore(document.createComment(""), fragment.firstChild);
        }
        compileChildren(context, fragment, /* root */ "r");
        next.node = null; // prevent leaks
        return context.freeze();
    },
    /**
     * Sets the default compilation strategy that will be used by the ViewTemplate whenever
     * it needs to compile a view preprocessed with the html template function.
     * @param strategy - The compilation strategy to use when compiling templates.
     */
    setDefaultStrategy(strategy) {
        this.compile = strategy;
    },
    /**
     * Aggregates an array of strings and directives into a single directive.
     * @param parts - A heterogeneous array of static strings interspersed with
     * directives.
     * @param policy - The security policy to use with the aggregated bindings.
     * @returns A single inline directive that aggregates the behavior of all the parts.
     */
    aggregate(parts, policy = DOM.policy) {
        if (parts.length === 1) {
            return parts[0];
        }
        let sourceAspect;
        let isVolatile = false;
        let bindingPolicy = void 0;
        const partCount = parts.length;
        const finalParts = parts.map((x) => {
            if (isString(x)) {
                return () => x;
            }
            sourceAspect = x.sourceAspect || sourceAspect;
            isVolatile = isVolatile || x.dataBinding.isVolatile;
            bindingPolicy = bindingPolicy || x.dataBinding.policy;
            return x.dataBinding.evaluate;
        });
        const expression = (scope, context) => {
            let output = "";
            for (let i = 0; i < partCount; ++i) {
                output += finalParts[i](scope, context);
            }
            return output;
        };
        const directive = new HTMLBindingDirective(oneWay(expression, bindingPolicy !== null && bindingPolicy !== void 0 ? bindingPolicy : policy, isVolatile));
        HTMLDirective.assignAspect(directive, sourceAspect);
        return directive;
    },
};

// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex = 
/* eslint-disable-next-line no-control-regex, max-len */
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
const noFactories = Object.create(null);
/**
 * Inlines a template into another template.
 * @public
 */
class InlineTemplateDirective {
    /**
     * Creates an instance of InlineTemplateDirective.
     * @param template - The template to inline.
     */
    constructor(html, factories = noFactories) {
        this.html = html;
        this.factories = factories;
    }
    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add) {
        const factories = this.factories;
        for (const key in factories) {
            add(factories[key]);
        }
        return this.html;
    }
}
/**
 * An empty template partial.
 */
InlineTemplateDirective.empty = new InlineTemplateDirective("");
HTMLDirective.define(InlineTemplateDirective);
function createHTML(value, prevString, add, definition = HTMLDirective.getForInstance(value)) {
    if (definition.aspected) {
        const match = lastAttributeNameRegex.exec(prevString);
        if (match !== null) {
            HTMLDirective.assignAspect(value, match[2]);
        }
    }
    return value.createHTML(add);
}
/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
class ViewTemplate {
    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param factories - The directives that will be connected to placeholders in the html.
     * @param policy - The security policy to use when compiling this template.
     */
    constructor(html, factories = {}, policy) {
        this.policy = policy;
        this.result = null;
        this.html = html;
        this.factories = factories;
    }
    /**
     * @internal
     */
    compile() {
        if (this.result === null) {
            this.result = Compiler.compile(this.html, this.factories, this.policy);
        }
        return this.result;
    }
    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget) {
        return this.compile().createView(hostBindingTarget);
    }
    /**
     * Returns a directive that can inline the template.
     */
    inline() {
        return new InlineTemplateDirective(isString(this.html) ? this.html : this.html.innerHTML, this.factories);
    }
    /**
     * Sets the DOMPolicy for this template.
     * @param policy - The policy to associated with this template.
     * @returns The modified template instance.
     * @remarks
     * The DOMPolicy can only be set once for a template and cannot be
     * set after the template is compiled.
     */
    withPolicy(policy) {
        if (this.result) {
            throw FAST.error(1208 /* Message.cannotSetTemplatePolicyAfterCompilation */);
        }
        if (this.policy) {
            throw FAST.error(1207 /* Message.onlySetTemplatePolicyOnce */);
        }
        this.policy = policy;
        return this;
    }
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source, host, hostBindingTarget) {
        const view = this.create(hostBindingTarget);
        view.bind(source);
        view.appendTo(host);
        return view;
    }
    /**
     * Creates a template based on a set of static strings and dynamic values.
     * @param strings - The static strings to create the template with.
     * @param values - The dynamic values to create the template with.
     * @param policy - The DOMPolicy to associated with the template.
     * @returns A ViewTemplate.
     * @remarks
     * This API should not be used directly under normal circumstances because constructing
     * a template in this way, if not done properly, can open up the application to XSS
     * attacks. When using this API, provide a strong DOMPolicy that can properly sanitize
     * and also be sure to manually sanitize all static strings particularly if they can
     * come from user input.
     */
    static create(strings, values, policy) {
        let html = "";
        const factories = Object.create(null);
        const add = (factory) => {
            var _a;
            const id = (_a = factory.id) !== null && _a !== void 0 ? _a : (factory.id = nextId());
            factories[id] = factory;
            return id;
        };
        for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
            const currentString = strings[i];
            let currentValue = values[i];
            let definition;
            html += currentString;
            if (isFunction(currentValue)) {
                currentValue = new HTMLBindingDirective(oneWay(currentValue));
            }
            else if (currentValue instanceof Binding) {
                currentValue = new HTMLBindingDirective(currentValue);
            }
            else if (!(definition = HTMLDirective.getForInstance(currentValue))) {
                const staticValue = currentValue;
                currentValue = new HTMLBindingDirective(oneTime(() => staticValue));
            }
            html += createHTML(currentValue, currentString, add, definition);
        }
        return new ViewTemplate(html + strings[strings.length - 1], factories, policy);
    }
}
makeSerializationNoop(ViewTemplate);
/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
const html = ((strings, ...values) => {
    if (Array.isArray(strings) && Array.isArray(strings.raw)) {
        return ViewTemplate.create(strings, values);
    }
    throw FAST.error(1206 /* Message.directCallToHTMLTagNotAllowed */);
});
html.partial = (html) => {
    return new InlineTemplateDirective(html);
};

/**
 * The runtime behavior for template references.
 * @public
 */
class RefDirective extends StatelessAttachedAttributeDirective {
    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    bind(controller) {
        controller.source[this.options] = controller.targets[this.targetNodeId];
    }
}
HTMLDirective.define(RefDirective);
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
const ref = (propertyName) => new RefDirective(propertyName);

const selectElements = (value) => value.nodeType === 1;
/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
const elements = (selector) => selector
    ? value => value.nodeType === 1 && value.matches(selector)
    : selectElements;
/**
 * A base class for node observation.
 * @public
 * @remarks
 * Internally used by the SlottedDirective and the ChildrenDirective.
 */
class NodeObservationDirective extends StatelessAttachedAttributeDirective {
    /**
     * The unique id of the factory.
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        this._controllerProperty = `${value}-c`;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(controller) {
        const target = controller.targets[this.targetNodeId];
        target[this._controllerProperty] = controller;
        this.updateTarget(controller.source, this.computeNodes(target));
        this.observe(target);
        controller.onUnbind(this);
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(controller) {
        const target = controller.targets[this.targetNodeId];
        this.updateTarget(controller.source, emptyArray);
        this.disconnect(target);
        target[this._controllerProperty] = null;
    }
    /**
     * Gets the data source for the target.
     * @param target - The target to get the source for.
     * @returns The source.
     */
    getSource(target) {
        return target[this._controllerProperty].source;
    }
    /**
     * Updates the source property with the computed nodes.
     * @param source - The source object to assign the nodes property to.
     * @param value - The nodes to assign to the source object property.
     */
    updateTarget(source, value) {
        source[this.options.property] = value;
    }
    /**
     * Computes the set of nodes that should be assigned to the source property.
     * @param target - The target to compute the nodes for.
     * @returns The computed nodes.
     * @remarks
     * Applies filters if provided.
     */
    computeNodes(target) {
        let nodes = this.getNodes(target);
        if ("filter" in this.options) {
            nodes = nodes.filter(this.options.filter);
        }
        return nodes;
    }
}

const slotEvent = "slotchange";
/**
 * The runtime behavior for slotted node observation.
 * @public
 */
class SlottedDirective extends NodeObservationDirective {
    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    observe(target) {
        target.addEventListener(slotEvent, this);
    }
    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target) {
        target.removeEventListener(slotEvent, this);
    }
    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target) {
        return target.assignedNodes(this.options);
    }
    /** @internal */
    handleEvent(event) {
        const target = event.currentTarget;
        this.updateTarget(this.getSource(target), this.computeNodes(target));
    }
}
HTMLDirective.define(SlottedDirective);
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
function slotted(propertyOrOptions) {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = { property: propertyOrOptions };
    }
    return new SlottedDirective(propertyOrOptions);
}

const booleanMode = "boolean";
const reflectMode = "reflect";
/**
 * Metadata used to configure a custom attribute's behavior.
 * @public
 */
const AttributeConfiguration = Object.freeze({
    /**
     * Locates all attribute configurations associated with a type.
     */
    locate: createMetadataLocator(),
});
/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        return value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
            ? false
            : true;
    },
};
function toNumber(value) {
    if (value === null || value === undefined) {
        return null;
    }
    const number = value * 1;
    return isNaN(number) ? null : number;
}
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
const nullableNumberConverter = {
    toView(value) {
        const output = toNumber(value);
        return output ? output.toString() : output;
    },
    fromView: toNumber,
};
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
class AttributeDefinition {
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(Owner, name, attribute = name.toLowerCase(), mode = reflectMode, converter) {
        this.guards = new Set();
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        if (mode === booleanMode && converter === void 0) {
            this.converter = booleanConverter;
        }
    }
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    setValue(source, newValue) {
        const oldValue = source[this.fieldName];
        const converter = this.converter;
        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }
        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;
            this.tryReflectToAttribute(source);
            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }
            source.$fastController.notify(this.name);
        }
    }
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source) {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }
    /** @internal */
    onAttributeChangedCallback(element, value) {
        if (this.guards.has(element)) {
            return;
        }
        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }
    tryReflectToAttribute(element) {
        const mode = this.mode;
        const guards = this.guards;
        if (guards.has(element) || mode === "fromView") {
            return;
        }
        Updates.enqueue(() => {
            guards.add(element);
            const latestValue = element[this.fieldName];
            switch (mode) {
                case reflectMode:
                    const converter = this.converter;
                    DOM.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
                    break;
                case booleanMode:
                    DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }
            guards.delete(element);
        });
    }
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(Owner, ...attributeLists) {
        const attributes = [];
        attributeLists.push(AttributeConfiguration.locate(Owner));
        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];
            if (list === void 0) {
                continue;
            }
            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];
                if (isString(config)) {
                    attributes.push(new AttributeDefinition(Owner, config));
                }
                else {
                    attributes.push(new AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
                }
            }
        }
        return attributes;
    }
}
function attr(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }
        AttributeConfiguration.locate($target.constructor).push(config);
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}

const defaultShadowOptions = { mode: "open" };
const defaultElementOptions = {};
const fastElementBaseTypes = new Set();
const fastElementRegistry = FAST.getById(KernelServiceId.elementRegistry, () => createTypeRegistry());
/**
 * Defines metadata for a FASTElement.
 * @public
 */
class FASTElementDefinition {
    constructor(type, nameOrConfig = type.definition) {
        var _a;
        this.platformDefined = false;
        if (isString(nameOrConfig)) {
            nameOrConfig = { name: nameOrConfig };
        }
        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        this.registry = (_a = nameOrConfig.registry) !== null && _a !== void 0 ? _a : customElements;
        const proto = type.prototype;
        const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};
        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
            Observable.defineProperty(proto, current);
        }
        Reflect.defineProperty(type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });
        this.attributes = attributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;
        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                    ? void 0
                    : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
        this.styles = ElementStyles.normalize(nameOrConfig.styles);
        fastElementRegistry.register(this);
    }
    /**
     * Indicates if this element has been defined in at least one registry.
     */
    get isDefined() {
        return this.platformDefined;
    }
    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     * @remarks
     * This operation is idempotent per registry.
     */
    define(registry = this.registry) {
        const type = this.type;
        if (!registry.get(this.name)) {
            this.platformDefined = true;
            registry.define(this.name, type, this.elementOptions);
        }
        return this;
    }
    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrDef - The name of the element to define or a config object
     * that describes the element to define.
     */
    static compose(type, nameOrDef) {
        if (fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)) {
            return new FASTElementDefinition(class extends type {
            }, nameOrDef);
        }
        return new FASTElementDefinition(type, nameOrDef);
    }
    /**
     * Registers a FASTElement base type.
     * @param type - The type to register as a base type.
     * @internal
     */
    static registerBaseType(type) {
        fastElementBaseTypes.add(type);
    }
}
/**
 * Gets the element definition associated with the specified type.
 * @param type - The custom element type to retrieve the definition for.
 */
FASTElementDefinition.getByType = fastElementRegistry.getByType;
/**
 * Gets the element definition associated with the instance.
 * @param instance - The custom element instance to retrieve the definition for.
 */
FASTElementDefinition.getForInstance = fastElementRegistry.getForInstance;

/**
 * An extension of MutationObserver that supports unobserving nodes.
 * @internal
 */
class UnobservableMutationObserver extends MutationObserver {
    /**
     * Creates an instance of UnobservableMutationObserver.
     * @param callback - The callback to invoke when observed nodes are changed.
     */
    constructor(callback) {
        function handler(mutations) {
            this.callback.call(null, mutations.filter(record => this.observedNodes.has(record.target)));
        }
        super(handler);
        this.callback = callback;
        this.observedNodes = new Set();
    }
    observe(target, options) {
        this.observedNodes.add(target);
        super.observe(target, options);
    }
    unobserve(target) {
        this.observedNodes.delete(target);
        if (this.observedNodes.size < 1) {
            this.disconnect();
        }
    }
}
/**
 * Bridges between ViewBehaviors and HostBehaviors, enabling a host to
 * control ViewBehaviors.
 * @public
 */
Object.freeze({
    /**
     * Creates a ViewBehaviorOrchestrator.
     * @param source - The source to to associate behaviors with.
     * @returns A ViewBehaviorOrchestrator.
     */
    create(source) {
        const behaviors = [];
        const targets = {};
        let unbindables = null;
        let isConnected = false;
        return {
            source,
            context: ExecutionContext.default,
            targets,
            get isBound() {
                return isConnected;
            },
            addBehaviorFactory(factory, target) {
                var _a, _b, _c, _d;
                const compiled = factory;
                compiled.id = (_a = compiled.id) !== null && _a !== void 0 ? _a : nextId();
                compiled.targetNodeId = (_b = compiled.targetNodeId) !== null && _b !== void 0 ? _b : nextId();
                compiled.targetTagName = (_c = target.tagName) !== null && _c !== void 0 ? _c : null;
                compiled.policy = (_d = compiled.policy) !== null && _d !== void 0 ? _d : DOM.policy;
                this.addTarget(compiled.targetNodeId, target);
                this.addBehavior(compiled.createBehavior());
            },
            addTarget(nodeId, target) {
                targets[nodeId] = target;
            },
            addBehavior(behavior) {
                behaviors.push(behavior);
                if (isConnected) {
                    behavior.bind(this);
                }
            },
            onUnbind(unbindable) {
                if (unbindables === null) {
                    unbindables = [];
                }
                unbindables.push(unbindable);
            },
            connectedCallback(controller) {
                if (!isConnected) {
                    isConnected = true;
                    behaviors.forEach(x => x.bind(this));
                }
            },
            disconnectedCallback(controller) {
                if (isConnected) {
                    isConnected = false;
                    if (unbindables !== null) {
                        unbindables.forEach(x => x.unbind(this));
                    }
                }
            },
        };
    },
});

const defaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};
const isConnectedPropertyName = "isConnected";
const shadowRoots = new WeakMap();
function getShadowRoot(element) {
    var _a, _b;
    return (_b = (_a = element.shadowRoot) !== null && _a !== void 0 ? _a : shadowRoots.get(element)) !== null && _b !== void 0 ? _b : null;
}
let elementControllerStrategy;
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
class ElementController extends PropertyChangeNotifier {
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element, definition) {
        super(element);
        this.boundObservables = null;
        this.needsInitialization = true;
        this.hasExistingShadowRoot = false;
        this._template = null;
        this.stage = 3 /* Stages.disconnected */;
        /**
         * A guard against connecting behaviors multiple times
         * during connect in scenarios where a behavior adds
         * another behavior during it's connectedCallback
         */
        this.guardBehaviorConnection = false;
        this.behaviors = null;
        /**
         * Tracks whether behaviors are connected so that
         * behaviors cant be connected multiple times
         */
        this.behaviorsConnected = false;
        this._mainStyles = null;
        /**
         * This allows Observable.getNotifier(...) to return the Controller
         * when the notifier for the Controller itself is being requested. The
         * result is that the Observable system does not need to create a separate
         * instance of Notifier for observables on the Controller. The component and
         * the controller will now share the same notifier, removing one-object construct
         * per web component instance.
         */
        this.$fastController = this;
        /**
         * The view associated with the custom element.
         * @remarks
         * If `null` then the element is managing its own rendering.
         */
        this.view = null;
        this.source = element;
        this.definition = definition;
        const shadowOptions = definition.shadowOptions;
        if (shadowOptions !== void 0) {
            let shadowRoot = element.shadowRoot;
            if (shadowRoot) {
                this.hasExistingShadowRoot = true;
            }
            else {
                shadowRoot = element.attachShadow(shadowOptions);
                if (shadowOptions.mode === "closed") {
                    shadowRoots.set(element, shadowRoot);
                }
            }
        }
        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable operate.
        // Later, in the connect callback, we'll re-apply the values.
        const accessors = Observable.getAccessors(element);
        if (accessors.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));
            for (let i = 0, ii = accessors.length; i < ii; ++i) {
                const propertyName = accessors[i].name;
                const value = element[propertyName];
                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }
    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    get isConnected() {
        Observable.track(this, isConnectedPropertyName);
        return this.stage === 1 /* Stages.connected */;
    }
    /**
     * The context the expression is evaluated against.
     */
    get context() {
        var _a, _b;
        return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.context) !== null && _b !== void 0 ? _b : ExecutionContext.default;
    }
    /**
     * Indicates whether the controller is bound.
     */
    get isBound() {
        var _a, _b;
        return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.isBound) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    get sourceLifetime() {
        var _a;
        return (_a = this.view) === null || _a === void 0 ? void 0 : _a.sourceLifetime;
    }
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template() {
        var _a;
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            const definition = this.definition;
            if (this.source.resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = this.source.resolveTemplate();
            }
            else if (definition.template) {
                // 3. Default to the static definition.
                this._template = (_a = definition.template) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._template;
    }
    set template(value) {
        if (this._template === value) {
            return;
        }
        this._template = value;
        if (!this.needsInitialization) {
            this.renderTemplate(value);
        }
    }
    /**
     * The main set of styles used for the component, independent
     * of any dynamically added styles.
     */
    get mainStyles() {
        var _a;
        // 1. Styles overrides take top precedence.
        if (this._mainStyles === null) {
            const definition = this.definition;
            if (this.source.resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._mainStyles = this.source.resolveStyles();
            }
            else if (definition.styles) {
                // 3. Default to the static definition.
                this._mainStyles = (_a = definition.styles) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._mainStyles;
    }
    set mainStyles(value) {
        if (this._mainStyles === value) {
            return;
        }
        if (this._mainStyles !== null) {
            this.removeStyles(this._mainStyles);
        }
        this._mainStyles = value;
        if (!this.needsInitialization) {
            this.addStyles(value);
        }
    }
    /**
     * Registers an unbind handler with the controller.
     * @param behavior - An object to call when the controller unbinds.
     */
    onUnbind(behavior) {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.onUnbind(behavior);
    }
    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior) {
        var _a, _b;
        const targetBehaviors = (_a = this.behaviors) !== null && _a !== void 0 ? _a : (this.behaviors = new Map());
        const count = (_b = targetBehaviors.get(behavior)) !== null && _b !== void 0 ? _b : 0;
        if (count === 0) {
            targetBehaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this);
            if (behavior.connectedCallback &&
                !this.guardBehaviorConnection &&
                (this.stage === 1 /* Stages.connected */ || this.stage === 0 /* Stages.connecting */)) {
                behavior.connectedCallback(this);
            }
        }
        else {
            targetBehaviors.set(behavior, count + 1);
        }
    }
    /**
     * Removes the behavior from the component.
     * @param behavior - The behavior to remove.
     * @param force - Forces removal even if this behavior was added more than once.
     */
    removeBehavior(behavior, force = false) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }
        const count = targetBehaviors.get(behavior);
        if (count === void 0) {
            return;
        }
        if (count === 1 || force) {
            targetBehaviors.delete(behavior);
            if (behavior.disconnectedCallback && this.stage !== 3 /* Stages.disconnected */) {
                behavior.disconnectedCallback(this);
            }
            behavior.removedCallback && behavior.removedCallback(this);
        }
        else {
            targetBehaviors.set(behavior, count - 1);
        }
    }
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : this.source;
            target.append(styles);
        }
        else if (!styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.addBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : source;
            target.removeChild(styles);
        }
        else if (styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.removeStylesFrom(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.removeBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    connect() {
        if (this.stage !== 3 /* Stages.disconnected */) {
            return;
        }
        this.stage = 0 /* Stages.connecting */;
        this.bindObservables();
        this.connectBehaviors();
        if (this.needsInitialization) {
            this.renderTemplate(this.template);
            this.addStyles(this.mainStyles);
            this.needsInitialization = false;
        }
        else if (this.view !== null) {
            this.view.bind(this.source);
        }
        this.stage = 1 /* Stages.connected */;
        Observable.notify(this, isConnectedPropertyName);
    }
    bindObservables() {
        if (this.boundObservables !== null) {
            const element = this.source;
            const boundObservables = this.boundObservables;
            const propertyNames = Object.keys(boundObservables);
            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                element[propertyName] = boundObservables[propertyName];
            }
            this.boundObservables = null;
        }
    }
    connectBehaviors() {
        if (this.behaviorsConnected === false) {
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                this.guardBehaviorConnection = true;
                for (const key of behaviors.keys()) {
                    key.connectedCallback && key.connectedCallback(this);
                }
                this.guardBehaviorConnection = false;
            }
            this.behaviorsConnected = true;
        }
    }
    disconnectBehaviors() {
        if (this.behaviorsConnected === true) {
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                for (const key of behaviors.keys()) {
                    key.disconnectedCallback && key.disconnectedCallback(this);
                }
            }
            this.behaviorsConnected = false;
        }
    }
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    disconnect() {
        if (this.stage !== 1 /* Stages.connected */) {
            return;
        }
        this.stage = 2 /* Stages.disconnecting */;
        Observable.notify(this, isConnectedPropertyName);
        if (this.view !== null) {
            this.view.unbind();
        }
        this.disconnectBehaviors();
        this.stage = 3 /* Stages.disconnected */;
    }
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name, oldValue, newValue) {
        const attrDef = this.definition.attributeLookup[name];
        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.source, newValue);
        }
    }
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(type, detail, options) {
        if (this.stage === 1 /* Stages.connected */) {
            return this.source.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
        }
        return false;
    }
    renderTemplate(template) {
        var _a;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const element = this.source;
        const host = (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            this.view = null;
        }
        else if (!this.needsInitialization || this.hasExistingShadowRoot) {
            this.hasExistingShadowRoot = false;
            // If there was previous custom rendering, we need to clear out the host.
            for (let child = host.firstChild; child !== null; child = host.firstChild) {
                host.removeChild(child);
            }
        }
        if (template) {
            // If a new template was provided, render it.
            this.view = template.render(element, host, element);
            this.view.sourceLifetime =
                SourceLifetime.coupled;
        }
    }
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element) {
        const controller = element.$fastController;
        if (controller !== void 0) {
            return controller;
        }
        const definition = FASTElementDefinition.getForInstance(element);
        if (definition === void 0) {
            throw FAST.error(1401 /* Message.missingElementDefinition */);
        }
        return (element.$fastController = new elementControllerStrategy(element, definition));
    }
    /**
     * Sets the strategy that ElementController.forCustomElement uses to construct
     * ElementController instances for an element.
     * @param strategy - The strategy to use.
     */
    static setStrategy(strategy) {
        elementControllerStrategy = strategy;
    }
}
makeSerializationNoop(ElementController);
// Set default strategy for ElementController
ElementController.setStrategy(ElementController);
/**
 * Converts a styleTarget into the operative target. When the provided target is an Element
 * that is a FASTElement, the function will return the ShadowRoot for that element. Otherwise,
 * it will return the root node for the element.
 * @param target
 * @returns
 */
function normalizeStyleTarget(target) {
    var _a;
    if ("adoptedStyleSheets" in target) {
        return target;
    }
    else {
        return ((_a = getShadowRoot(target)) !== null && _a !== void 0 ? _a : target.getRootNode());
    }
}
// Default StyleStrategy implementations are defined in this module because they
// require access to element shadowRoots, and we don't want to leak shadowRoot
// objects out of this module.
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
class AdoptedStyleSheetsStrategy {
    constructor(styles) {
        const styleSheetCache = AdoptedStyleSheetsStrategy.styleSheetCache;
        this.sheets = styles.map((x) => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }
            let sheet = styleSheetCache.get(x);
            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(x);
                styleSheetCache.set(x, sheet);
            }
            return sheet;
        });
    }
    addStylesTo(target) {
        addAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }
    removeStylesFrom(target) {
        removeAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }
}
AdoptedStyleSheetsStrategy.styleSheetCache = new Map();
let id = 0;
const nextStyleId = () => `fast-${++id}`;
function usableStyleTarget(target) {
    return target === document ? document.body : target;
}
/**
 * @internal
 */
class StyleElementStrategy {
    constructor(styles) {
        this.styles = styles;
        this.styleClass = nextStyleId();
    }
    addStylesTo(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = this.styles;
        const styleClass = this.styleClass;
        for (let i = 0; i < styles.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styles[i];
            element.className = styleClass;
            target.append(element);
        }
    }
    removeStylesFrom(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = target.querySelectorAll(`.${this.styleClass}`);
        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}
let addAdoptedStyleSheets = (target, sheets) => {
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, ...sheets];
};
let removeAdoptedStyleSheets = (target, sheets) => {
    target.adoptedStyleSheets = target.adoptedStyleSheets.filter((x) => sheets.indexOf(x) === -1);
};
if (ElementStyles.supportsAdoptedStyleSheets) {
    try {
        // Test if browser implementation uses FrozenArray.
        // If not, use push / splice to alter the stylesheets
        // in place. This circumvents a bug in Safari 16.4 where
        // periodically, assigning the array would previously
        // cause sheets to be removed.
        document.adoptedStyleSheets.push();
        document.adoptedStyleSheets.splice();
        addAdoptedStyleSheets = (target, sheets) => {
            target.adoptedStyleSheets.push(...sheets);
        };
        removeAdoptedStyleSheets = (target, sheets) => {
            for (const sheet of sheets) {
                const index = target.adoptedStyleSheets.indexOf(sheet);
                if (index !== -1) {
                    target.adoptedStyleSheets.splice(index, 1);
                }
            }
        };
    }
    catch (e) {
        // Do nothing if an error is thrown, the default
        // case handles FrozenArray.
    }
    ElementStyles.setDefaultStrategy(AdoptedStyleSheetsStrategy);
}
else {
    ElementStyles.setDefaultStrategy(StyleElementStrategy);
}
const deferHydrationAttribute = "defer-hydration";
const needsHydrationAttribute = "needs-hydration";
/**
 * An ElementController capable of hydrating FAST elements from
 * Declarative Shadow DOM.
 *
 * @beta
 */
class HydratableElementController extends ElementController {
    static hydrationObserverHandler(records) {
        for (const record of records) {
            HydratableElementController.hydrationObserver.unobserve(record.target);
            record.target.$fastController.connect();
        }
    }
    connect() {
        var _a, _b;
        // Initialize needsHydration on first connect
        if (this.needsHydration === undefined) {
            this.needsHydration =
                this.source.getAttribute(needsHydrationAttribute) !== null;
        }
        // If the `defer-hydration` attribute exists on the source,
        // wait for it to be removed before continuing connection behavior.
        if (this.source.hasAttribute(deferHydrationAttribute)) {
            HydratableElementController.hydrationObserver.observe(this.source, {
                attributeFilter: [deferHydrationAttribute],
            });
            return;
        }
        // If the controller does not need to be hydrated, defer connection behavior
        // to the base-class. This case handles element re-connection and initial connection
        // of elements that did not get declarative shadow-dom emitted, as well as if an extending
        // class
        if (!this.needsHydration) {
            super.connect();
            return;
        }
        if (this.stage !== 3 /* Stages.disconnected */) {
            return;
        }
        this.stage = 0 /* Stages.connecting */;
        this.bindObservables();
        this.connectBehaviors();
        const element = this.source;
        const host = (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
        if (this.template) {
            if (isHydratable(this.template)) {
                let firstChild = host.firstChild;
                let lastChild = host.lastChild;
                if (element.shadowRoot === null) {
                    // handle element boundary markers when shadowRoot is not present
                    if (HydrationMarkup.isElementBoundaryStartMarker(firstChild)) {
                        firstChild.data = "";
                        firstChild = firstChild.nextSibling;
                    }
                    if (HydrationMarkup.isElementBoundaryEndMarker(lastChild)) {
                        lastChild.data = "";
                        lastChild = lastChild.previousSibling;
                    }
                }
                this.view = this.template.hydrate(firstChild, lastChild, element);
                (_b = this.view) === null || _b === void 0 ? void 0 : _b.bind(this.source);
            }
            else {
                this.renderTemplate(this.template);
            }
        }
        this.addStyles(this.mainStyles);
        this.stage = 1 /* Stages.connected */;
        this.source.removeAttribute(needsHydrationAttribute);
        this.needsInitialization = this.needsHydration = false;
        Observable.notify(this, isConnectedPropertyName);
    }
    disconnect() {
        super.disconnect();
        HydratableElementController.hydrationObserver.unobserve(this.source);
    }
    static install() {
        ElementController.setStrategy(HydratableElementController);
    }
}
HydratableElementController.hydrationObserver = new UnobservableMutationObserver(HydratableElementController.hydrationObserverHandler);

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType) {
    const type = class extends BaseType {
        constructor() {
            /* eslint-disable-next-line */
            super();
            ElementController.forCustomElement(this);
        }
        $emit(type, detail, options) {
            return this.$fastController.emit(type, detail, options);
        }
        connectedCallback() {
            this.$fastController.connect();
        }
        disconnectedCallback() {
            this.$fastController.disconnect();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
    FASTElementDefinition.registerBaseType(type);
    return type;
}
function compose(type, nameOrDef) {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef);
    }
    return FASTElementDefinition.compose(this, type);
}
function define(type, nameOrDef) {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef).define().type;
    }
    return FASTElementDefinition.compose(this, type).define().type;
}
function from(BaseType) {
    return createFASTElement(BaseType);
}
/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from,
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define,
    /**
     * Defines metadata for a FASTElement which can be used to later define the element.
     * @public
     */
    compose,
});

function staticallyCompose(item) {
  if (!item) {
    return InlineTemplateDirective.empty;
  }
  if (typeof item === "string") {
    return new InlineTemplateDirective(item);
  }
  if ("inline" in item) {
    return item.inline();
  }
  return item;
}

class StartEnd {
}
function endSlotTemplate(options) {
  return html`<slot name=end ${ref("end")}>${staticallyCompose(options.end)}</slot>`.inline();
}
function startSlotTemplate(options) {
  return html`<slot name=start ${ref("start")}>${staticallyCompose(options.start)}</slot>`.inline();
}

function applyMixins(derivedCtor, ...baseCtors) {
  const derivedAttributes = AttributeConfiguration.locate(derivedCtor);
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
        );
      }
    });
    const baseAttributes = AttributeConfiguration.locate(baseCtor);
    baseAttributes.forEach((x) => derivedAttributes.push(x));
  });
}

var __defProp$O = Object.defineProperty;
var __getOwnPropDesc$O = Object.getOwnPropertyDescriptor;
var __decorateClass$O = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$O(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$O(target, key, result);
  return result;
};
class BaseAccordionItem extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.headinglevel = 2;
    this.expanded = false;
    this.disabled = false;
  }
}
__decorateClass$O([
  attr({
    attribute: "heading-level",
    mode: "fromView",
    converter: nullableNumberConverter
  })
], BaseAccordionItem.prototype, "headinglevel", 2);
__decorateClass$O([
  attr({ mode: "boolean" })
], BaseAccordionItem.prototype, "expanded", 2);
__decorateClass$O([
  attr({ mode: "boolean" })
], BaseAccordionItem.prototype, "disabled", 2);
__decorateClass$O([
  observable
], BaseAccordionItem.prototype, "expandbutton", 2);

var __defProp$N = Object.defineProperty;
var __getOwnPropDesc$N = Object.getOwnPropertyDescriptor;
var __decorateClass$N = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$N(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$N(target, key, result);
  return result;
};
class AccordionItem extends BaseAccordionItem {
  constructor() {
    super(...arguments);
    this.block = false;
  }
}
__decorateClass$N([
  attr
], AccordionItem.prototype, "size", 2);
__decorateClass$N([
  attr({ attribute: "marker-position" })
], AccordionItem.prototype, "markerPosition", 2);
__decorateClass$N([
  attr({ mode: "boolean" })
], AccordionItem.prototype, "block", 2);
applyMixins(AccordionItem, StartEnd);

const hidden = `:host([hidden]){display:none}`;
function display(displayValue) {
  return `${hidden}:host{display:${displayValue}}`;
}

const colorNeutralForeground1 = "var(--colorNeutralForeground1)";
const colorNeutralForeground1Hover = "var(--colorNeutralForeground1Hover)";
const colorNeutralForeground1Pressed = "var(--colorNeutralForeground1Pressed)";
const colorNeutralForeground1Selected = "var(--colorNeutralForeground1Selected)";
const colorNeutralForeground2 = "var(--colorNeutralForeground2)";
const colorNeutralForeground2Hover = "var(--colorNeutralForeground2Hover)";
const colorNeutralForeground2Pressed = "var(--colorNeutralForeground2Pressed)";
const colorNeutralForeground2Selected = "var(--colorNeutralForeground2Selected)";
const colorNeutralForeground2BrandHover = "var(--colorNeutralForeground2BrandHover)";
const colorNeutralForeground2BrandPressed = "var(--colorNeutralForeground2BrandPressed)";
const colorNeutralForeground2BrandSelected = "var(--colorNeutralForeground2BrandSelected)";
const colorNeutralForeground3 = "var(--colorNeutralForeground3)";
const colorNeutralForeground3Hover = "var(--colorNeutralForeground3Hover)";
const colorNeutralForeground3Pressed = "var(--colorNeutralForeground3Pressed)";
const colorNeutralForeground3Selected = "var(--colorNeutralForeground3Selected)";
const colorNeutralForeground3BrandHover = "var(--colorNeutralForeground3BrandHover)";
const colorNeutralForeground3BrandPressed = "var(--colorNeutralForeground3BrandPressed)";
const colorNeutralForeground3BrandSelected = "var(--colorNeutralForeground3BrandSelected)";
const colorNeutralForeground4 = "var(--colorNeutralForeground4)";
const colorNeutralForeground5 = "var(--colorNeutralForeground5)";
const colorNeutralForeground5Hover = "var(--colorNeutralForeground5Hover)";
const colorNeutralForeground5Pressed = "var(--colorNeutralForeground5Pressed)";
const colorNeutralForeground5Selected = "var(--colorNeutralForeground5Selected)";
const colorNeutralForegroundDisabled = "var(--colorNeutralForegroundDisabled)";
const colorBrandForegroundLink = "var(--colorBrandForegroundLink)";
const colorBrandForegroundLinkHover = "var(--colorBrandForegroundLinkHover)";
const colorBrandForegroundLinkPressed = "var(--colorBrandForegroundLinkPressed)";
const colorBrandForegroundLinkSelected = "var(--colorBrandForegroundLinkSelected)";
const colorNeutralForeground2Link = "var(--colorNeutralForeground2Link)";
const colorNeutralForeground2LinkHover = "var(--colorNeutralForeground2LinkHover)";
const colorNeutralForeground2LinkPressed = "var(--colorNeutralForeground2LinkPressed)";
const colorNeutralForeground2LinkSelected = "var(--colorNeutralForeground2LinkSelected)";
const colorCompoundBrandForeground1 = "var(--colorCompoundBrandForeground1)";
const colorCompoundBrandForeground1Hover = "var(--colorCompoundBrandForeground1Hover)";
const colorCompoundBrandForeground1Pressed = "var(--colorCompoundBrandForeground1Pressed)";
const colorNeutralForegroundOnBrand = "var(--colorNeutralForegroundOnBrand)";
const colorNeutralForegroundInverted = "var(--colorNeutralForegroundInverted)";
const colorNeutralForegroundInvertedHover = "var(--colorNeutralForegroundInvertedHover)";
const colorNeutralForegroundInvertedPressed = "var(--colorNeutralForegroundInvertedPressed)";
const colorNeutralForegroundInvertedSelected = "var(--colorNeutralForegroundInvertedSelected)";
const colorNeutralForegroundInverted2 = "var(--colorNeutralForegroundInverted2)";
const colorNeutralForegroundStaticInverted = "var(--colorNeutralForegroundStaticInverted)";
const colorNeutralForegroundInvertedLink = "var(--colorNeutralForegroundInvertedLink)";
const colorNeutralForegroundInvertedLinkHover = "var(--colorNeutralForegroundInvertedLinkHover)";
const colorNeutralForegroundInvertedLinkPressed = "var(--colorNeutralForegroundInvertedLinkPressed)";
const colorNeutralForegroundInvertedLinkSelected = "var(--colorNeutralForegroundInvertedLinkSelected)";
const colorNeutralForegroundInvertedDisabled = "var(--colorNeutralForegroundInvertedDisabled)";
const colorBrandForeground1 = "var(--colorBrandForeground1)";
const colorBrandForeground2 = "var(--colorBrandForeground2)";
const colorBrandForeground2Hover = "var(--colorBrandForeground2Hover)";
const colorBrandForeground2Pressed = "var(--colorBrandForeground2Pressed)";
const colorNeutralForeground1Static = "var(--colorNeutralForeground1Static)";
const colorBrandForegroundInverted = "var(--colorBrandForegroundInverted)";
const colorBrandForegroundInvertedHover = "var(--colorBrandForegroundInvertedHover)";
const colorBrandForegroundInvertedPressed = "var(--colorBrandForegroundInvertedPressed)";
const colorBrandForegroundOnLight = "var(--colorBrandForegroundOnLight)";
const colorBrandForegroundOnLightHover = "var(--colorBrandForegroundOnLightHover)";
const colorBrandForegroundOnLightPressed = "var(--colorBrandForegroundOnLightPressed)";
const colorBrandForegroundOnLightSelected = "var(--colorBrandForegroundOnLightSelected)";
const colorNeutralBackground1 = "var(--colorNeutralBackground1)";
const colorNeutralBackground1Hover = "var(--colorNeutralBackground1Hover)";
const colorNeutralBackground1Pressed = "var(--colorNeutralBackground1Pressed)";
const colorNeutralBackground1Selected = "var(--colorNeutralBackground1Selected)";
const colorNeutralBackground2 = "var(--colorNeutralBackground2)";
const colorNeutralBackground2Hover = "var(--colorNeutralBackground2Hover)";
const colorNeutralBackground2Pressed = "var(--colorNeutralBackground2Pressed)";
const colorNeutralBackground2Selected = "var(--colorNeutralBackground2Selected)";
const colorNeutralBackground3 = "var(--colorNeutralBackground3)";
const colorNeutralBackground3Hover = "var(--colorNeutralBackground3Hover)";
const colorNeutralBackground3Pressed = "var(--colorNeutralBackground3Pressed)";
const colorNeutralBackground3Selected = "var(--colorNeutralBackground3Selected)";
const colorNeutralBackground4 = "var(--colorNeutralBackground4)";
const colorNeutralBackground4Hover = "var(--colorNeutralBackground4Hover)";
const colorNeutralBackground4Pressed = "var(--colorNeutralBackground4Pressed)";
const colorNeutralBackground4Selected = "var(--colorNeutralBackground4Selected)";
const colorNeutralBackground5 = "var(--colorNeutralBackground5)";
const colorNeutralBackground5Hover = "var(--colorNeutralBackground5Hover)";
const colorNeutralBackground5Pressed = "var(--colorNeutralBackground5Pressed)";
const colorNeutralBackground5Selected = "var(--colorNeutralBackground5Selected)";
const colorNeutralBackground6 = "var(--colorNeutralBackground6)";
const colorNeutralBackground7 = "var(--colorNeutralBackground7)";
const colorNeutralBackground7Hover = "var(--colorNeutralBackground7Hover)";
const colorNeutralBackground7Pressed = "var(--colorNeutralBackground7Pressed)";
const colorNeutralBackground7Selected = "var(--colorNeutralBackground7Selected)";
const colorNeutralBackground8 = "var(--colorNeutralBackground8)";
const colorNeutralBackgroundInverted = "var(--colorNeutralBackgroundInverted)";
const colorNeutralBackgroundInvertedHover = "var(--colorNeutralBackgroundInvertedHover)";
const colorNeutralBackgroundInvertedPressed = "var(--colorNeutralBackgroundInvertedPressed)";
const colorNeutralBackgroundInvertedSelected = "var(--colorNeutralBackgroundInvertedSelected)";
const colorNeutralBackgroundStatic = "var(--colorNeutralBackgroundStatic)";
const colorNeutralBackgroundAlpha = "var(--colorNeutralBackgroundAlpha)";
const colorNeutralBackgroundAlpha2 = "var(--colorNeutralBackgroundAlpha2)";
const colorSubtleBackground = "var(--colorSubtleBackground)";
const colorSubtleBackgroundHover = "var(--colorSubtleBackgroundHover)";
const colorSubtleBackgroundPressed = "var(--colorSubtleBackgroundPressed)";
const colorSubtleBackgroundSelected = "var(--colorSubtleBackgroundSelected)";
const colorSubtleBackgroundLightAlphaHover = "var(--colorSubtleBackgroundLightAlphaHover)";
const colorSubtleBackgroundLightAlphaPressed = "var(--colorSubtleBackgroundLightAlphaPressed)";
const colorSubtleBackgroundLightAlphaSelected = "var(--colorSubtleBackgroundLightAlphaSelected)";
const colorSubtleBackgroundInverted = "var(--colorSubtleBackgroundInverted)";
const colorSubtleBackgroundInvertedHover = "var(--colorSubtleBackgroundInvertedHover)";
const colorSubtleBackgroundInvertedPressed = "var(--colorSubtleBackgroundInvertedPressed)";
const colorSubtleBackgroundInvertedSelected = "var(--colorSubtleBackgroundInvertedSelected)";
const colorTransparentBackground = "var(--colorTransparentBackground)";
const colorTransparentBackgroundHover = "var(--colorTransparentBackgroundHover)";
const colorTransparentBackgroundPressed = "var(--colorTransparentBackgroundPressed)";
const colorTransparentBackgroundSelected = "var(--colorTransparentBackgroundSelected)";
const colorNeutralBackgroundDisabled = "var(--colorNeutralBackgroundDisabled)";
const colorNeutralBackgroundDisabled2 = "var(--colorNeutralBackgroundDisabled2)";
const colorNeutralBackgroundInvertedDisabled = "var(--colorNeutralBackgroundInvertedDisabled)";
const colorNeutralStencil1 = "var(--colorNeutralStencil1)";
const colorNeutralStencil2 = "var(--colorNeutralStencil2)";
const colorNeutralStencil1Alpha = "var(--colorNeutralStencil1Alpha)";
const colorNeutralStencil2Alpha = "var(--colorNeutralStencil2Alpha)";
const colorBackgroundOverlay = "var(--colorBackgroundOverlay)";
const colorScrollbarOverlay = "var(--colorScrollbarOverlay)";
const colorBrandBackground = "var(--colorBrandBackground)";
const colorBrandBackgroundHover = "var(--colorBrandBackgroundHover)";
const colorBrandBackgroundPressed = "var(--colorBrandBackgroundPressed)";
const colorBrandBackgroundSelected = "var(--colorBrandBackgroundSelected)";
const colorCompoundBrandBackground = "var(--colorCompoundBrandBackground)";
const colorCompoundBrandBackgroundHover = "var(--colorCompoundBrandBackgroundHover)";
const colorCompoundBrandBackgroundPressed = "var(--colorCompoundBrandBackgroundPressed)";
const colorBrandBackgroundStatic = "var(--colorBrandBackgroundStatic)";
const colorBrandBackground2 = "var(--colorBrandBackground2)";
const colorBrandBackground2Hover = "var(--colorBrandBackground2Hover)";
const colorBrandBackground2Pressed = "var(--colorBrandBackground2Pressed)";
const colorBrandBackground3Static = "var(--colorBrandBackground3Static)";
const colorBrandBackground4Static = "var(--colorBrandBackground4Static)";
const colorBrandBackgroundInverted = "var(--colorBrandBackgroundInverted)";
const colorBrandBackgroundInvertedHover = "var(--colorBrandBackgroundInvertedHover)";
const colorBrandBackgroundInvertedPressed = "var(--colorBrandBackgroundInvertedPressed)";
const colorBrandBackgroundInvertedSelected = "var(--colorBrandBackgroundInvertedSelected)";
const colorNeutralCardBackground = "var(--colorNeutralCardBackground)";
const colorNeutralCardBackgroundHover = "var(--colorNeutralCardBackgroundHover)";
const colorNeutralCardBackgroundPressed = "var(--colorNeutralCardBackgroundPressed)";
const colorNeutralCardBackgroundSelected = "var(--colorNeutralCardBackgroundSelected)";
const colorNeutralCardBackgroundDisabled = "var(--colorNeutralCardBackgroundDisabled)";
const colorNeutralStrokeAccessible = "var(--colorNeutralStrokeAccessible)";
const colorNeutralStrokeAccessibleHover = "var(--colorNeutralStrokeAccessibleHover)";
const colorNeutralStrokeAccessiblePressed = "var(--colorNeutralStrokeAccessiblePressed)";
const colorNeutralStrokeAccessibleSelected = "var(--colorNeutralStrokeAccessibleSelected)";
const colorNeutralStroke1 = "var(--colorNeutralStroke1)";
const colorNeutralStroke1Hover = "var(--colorNeutralStroke1Hover)";
const colorNeutralStroke1Pressed = "var(--colorNeutralStroke1Pressed)";
const colorNeutralStroke1Selected = "var(--colorNeutralStroke1Selected)";
const colorNeutralStroke2 = "var(--colorNeutralStroke2)";
const colorNeutralStroke3 = "var(--colorNeutralStroke3)";
const colorNeutralStroke4 = "var(--colorNeutralStroke4)";
const colorNeutralStroke4Hover = "var(--colorNeutralStroke4Hover)";
const colorNeutralStroke4Pressed = "var(--colorNeutralStroke4Pressed)";
const colorNeutralStroke4Selected = "var(--colorNeutralStroke4Selected)";
const colorNeutralStrokeSubtle = "var(--colorNeutralStrokeSubtle)";
const colorNeutralStrokeOnBrand = "var(--colorNeutralStrokeOnBrand)";
const colorNeutralStrokeOnBrand2 = "var(--colorNeutralStrokeOnBrand2)";
const colorNeutralStrokeOnBrand2Hover = "var(--colorNeutralStrokeOnBrand2Hover)";
const colorNeutralStrokeOnBrand2Pressed = "var(--colorNeutralStrokeOnBrand2Pressed)";
const colorNeutralStrokeOnBrand2Selected = "var(--colorNeutralStrokeOnBrand2Selected)";
const colorBrandStroke1 = "var(--colorBrandStroke1)";
const colorBrandStroke2 = "var(--colorBrandStroke2)";
const colorBrandStroke2Hover = "var(--colorBrandStroke2Hover)";
const colorBrandStroke2Pressed = "var(--colorBrandStroke2Pressed)";
const colorBrandStroke2Contrast = "var(--colorBrandStroke2Contrast)";
const colorCompoundBrandStroke = "var(--colorCompoundBrandStroke)";
const colorCompoundBrandStrokeHover = "var(--colorCompoundBrandStrokeHover)";
const colorCompoundBrandStrokePressed = "var(--colorCompoundBrandStrokePressed)";
const colorNeutralStrokeDisabled = "var(--colorNeutralStrokeDisabled)";
const colorNeutralStrokeDisabled2 = "var(--colorNeutralStrokeDisabled2)";
const colorNeutralStrokeInvertedDisabled = "var(--colorNeutralStrokeInvertedDisabled)";
const colorTransparentStroke = "var(--colorTransparentStroke)";
const colorTransparentStrokeInteractive = "var(--colorTransparentStrokeInteractive)";
const colorTransparentStrokeDisabled = "var(--colorTransparentStrokeDisabled)";
const colorNeutralStrokeAlpha = "var(--colorNeutralStrokeAlpha)";
const colorNeutralStrokeAlpha2 = "var(--colorNeutralStrokeAlpha2)";
const colorStrokeFocus1 = "var(--colorStrokeFocus1)";
const colorStrokeFocus2 = "var(--colorStrokeFocus2)";
const colorNeutralShadowAmbient = "var(--colorNeutralShadowAmbient)";
const colorNeutralShadowKey = "var(--colorNeutralShadowKey)";
const colorNeutralShadowAmbientLighter = "var(--colorNeutralShadowAmbientLighter)";
const colorNeutralShadowKeyLighter = "var(--colorNeutralShadowKeyLighter)";
const colorNeutralShadowAmbientDarker = "var(--colorNeutralShadowAmbientDarker)";
const colorNeutralShadowKeyDarker = "var(--colorNeutralShadowKeyDarker)";
const colorBrandShadowAmbient = "var(--colorBrandShadowAmbient)";
const colorBrandShadowKey = "var(--colorBrandShadowKey)";
const colorPaletteRedBackground1 = "var(--colorPaletteRedBackground1)";
const colorPaletteRedBackground2 = "var(--colorPaletteRedBackground2)";
const colorPaletteRedBackground3 = "var(--colorPaletteRedBackground3)";
const colorPaletteRedBorderActive = "var(--colorPaletteRedBorderActive)";
const colorPaletteRedBorder1 = "var(--colorPaletteRedBorder1)";
const colorPaletteRedBorder2 = "var(--colorPaletteRedBorder2)";
const colorPaletteRedForeground1 = "var(--colorPaletteRedForeground1)";
const colorPaletteRedForeground2 = "var(--colorPaletteRedForeground2)";
const colorPaletteRedForeground3 = "var(--colorPaletteRedForeground3)";
const colorPaletteRedForegroundInverted = "var(--colorPaletteRedForegroundInverted)";
const colorPaletteGreenBackground1 = "var(--colorPaletteGreenBackground1)";
const colorPaletteGreenBackground2 = "var(--colorPaletteGreenBackground2)";
const colorPaletteGreenBackground3 = "var(--colorPaletteGreenBackground3)";
const colorPaletteGreenBorderActive = "var(--colorPaletteGreenBorderActive)";
const colorPaletteGreenBorder1 = "var(--colorPaletteGreenBorder1)";
const colorPaletteGreenBorder2 = "var(--colorPaletteGreenBorder2)";
const colorPaletteGreenForeground1 = "var(--colorPaletteGreenForeground1)";
const colorPaletteGreenForeground2 = "var(--colorPaletteGreenForeground2)";
const colorPaletteGreenForeground3 = "var(--colorPaletteGreenForeground3)";
const colorPaletteGreenForegroundInverted = "var(--colorPaletteGreenForegroundInverted)";
const colorPaletteDarkOrangeBackground1 = "var(--colorPaletteDarkOrangeBackground1)";
const colorPaletteDarkOrangeBackground2 = "var(--colorPaletteDarkOrangeBackground2)";
const colorPaletteDarkOrangeBackground3 = "var(--colorPaletteDarkOrangeBackground3)";
const colorPaletteDarkOrangeBorderActive = "var(--colorPaletteDarkOrangeBorderActive)";
const colorPaletteDarkOrangeBorder1 = "var(--colorPaletteDarkOrangeBorder1)";
const colorPaletteDarkOrangeBorder2 = "var(--colorPaletteDarkOrangeBorder2)";
const colorPaletteDarkOrangeForeground1 = "var(--colorPaletteDarkOrangeForeground1)";
const colorPaletteDarkOrangeForeground2 = "var(--colorPaletteDarkOrangeForeground2)";
const colorPaletteDarkOrangeForeground3 = "var(--colorPaletteDarkOrangeForeground3)";
const colorPaletteYellowBackground1 = "var(--colorPaletteYellowBackground1)";
const colorPaletteYellowBackground2 = "var(--colorPaletteYellowBackground2)";
const colorPaletteYellowBackground3 = "var(--colorPaletteYellowBackground3)";
const colorPaletteYellowBorderActive = "var(--colorPaletteYellowBorderActive)";
const colorPaletteYellowBorder1 = "var(--colorPaletteYellowBorder1)";
const colorPaletteYellowBorder2 = "var(--colorPaletteYellowBorder2)";
const colorPaletteYellowForeground1 = "var(--colorPaletteYellowForeground1)";
const colorPaletteYellowForeground2 = "var(--colorPaletteYellowForeground2)";
const colorPaletteYellowForeground3 = "var(--colorPaletteYellowForeground3)";
const colorPaletteYellowForegroundInverted = "var(--colorPaletteYellowForegroundInverted)";
const colorPaletteBerryBackground1 = "var(--colorPaletteBerryBackground1)";
const colorPaletteBerryBackground2 = "var(--colorPaletteBerryBackground2)";
const colorPaletteBerryBackground3 = "var(--colorPaletteBerryBackground3)";
const colorPaletteBerryBorderActive = "var(--colorPaletteBerryBorderActive)";
const colorPaletteBerryBorder1 = "var(--colorPaletteBerryBorder1)";
const colorPaletteBerryBorder2 = "var(--colorPaletteBerryBorder2)";
const colorPaletteBerryForeground1 = "var(--colorPaletteBerryForeground1)";
const colorPaletteBerryForeground2 = "var(--colorPaletteBerryForeground2)";
const colorPaletteBerryForeground3 = "var(--colorPaletteBerryForeground3)";
const colorPaletteMarigoldBackground1 = "var(--colorPaletteMarigoldBackground1)";
const colorPaletteMarigoldBackground2 = "var(--colorPaletteMarigoldBackground2)";
const colorPaletteMarigoldBackground3 = "var(--colorPaletteMarigoldBackground3)";
const colorPaletteMarigoldBorderActive = "var(--colorPaletteMarigoldBorderActive)";
const colorPaletteMarigoldBorder1 = "var(--colorPaletteMarigoldBorder1)";
const colorPaletteMarigoldBorder2 = "var(--colorPaletteMarigoldBorder2)";
const colorPaletteMarigoldForeground1 = "var(--colorPaletteMarigoldForeground1)";
const colorPaletteMarigoldForeground2 = "var(--colorPaletteMarigoldForeground2)";
const colorPaletteMarigoldForeground3 = "var(--colorPaletteMarigoldForeground3)";
const colorPaletteLightGreenBackground1 = "var(--colorPaletteLightGreenBackground1)";
const colorPaletteLightGreenBackground2 = "var(--colorPaletteLightGreenBackground2)";
const colorPaletteLightGreenBackground3 = "var(--colorPaletteLightGreenBackground3)";
const colorPaletteLightGreenBorderActive = "var(--colorPaletteLightGreenBorderActive)";
const colorPaletteLightGreenBorder1 = "var(--colorPaletteLightGreenBorder1)";
const colorPaletteLightGreenBorder2 = "var(--colorPaletteLightGreenBorder2)";
const colorPaletteLightGreenForeground1 = "var(--colorPaletteLightGreenForeground1)";
const colorPaletteLightGreenForeground2 = "var(--colorPaletteLightGreenForeground2)";
const colorPaletteLightGreenForeground3 = "var(--colorPaletteLightGreenForeground3)";
const colorPaletteAnchorBackground2 = "var(--colorPaletteAnchorBackground2)";
const colorPaletteAnchorBorderActive = "var(--colorPaletteAnchorBorderActive)";
const colorPaletteAnchorForeground2 = "var(--colorPaletteAnchorForeground2)";
const colorPaletteBeigeBackground2 = "var(--colorPaletteBeigeBackground2)";
const colorPaletteBeigeBorderActive = "var(--colorPaletteBeigeBorderActive)";
const colorPaletteBeigeForeground2 = "var(--colorPaletteBeigeForeground2)";
const colorPaletteBlueBackground2 = "var(--colorPaletteBlueBackground2)";
const colorPaletteBlueBorderActive = "var(--colorPaletteBlueBorderActive)";
const colorPaletteBlueForeground2 = "var(--colorPaletteBlueForeground2)";
const colorPaletteBrassBackground2 = "var(--colorPaletteBrassBackground2)";
const colorPaletteBrassBorderActive = "var(--colorPaletteBrassBorderActive)";
const colorPaletteBrassForeground2 = "var(--colorPaletteBrassForeground2)";
const colorPaletteBrownBackground2 = "var(--colorPaletteBrownBackground2)";
const colorPaletteBrownBorderActive = "var(--colorPaletteBrownBorderActive)";
const colorPaletteBrownForeground2 = "var(--colorPaletteBrownForeground2)";
const colorPaletteCornflowerBackground2 = "var(--colorPaletteCornflowerBackground2)";
const colorPaletteCornflowerBorderActive = "var(--colorPaletteCornflowerBorderActive)";
const colorPaletteCornflowerForeground2 = "var(--colorPaletteCornflowerForeground2)";
const colorPaletteCranberryBackground2 = "var(--colorPaletteCranberryBackground2)";
const colorPaletteCranberryBorderActive = "var(--colorPaletteCranberryBorderActive)";
const colorPaletteCranberryForeground2 = "var(--colorPaletteCranberryForeground2)";
const colorPaletteDarkGreenBackground2 = "var(--colorPaletteDarkGreenBackground2)";
const colorPaletteDarkGreenBorderActive = "var(--colorPaletteDarkGreenBorderActive)";
const colorPaletteDarkGreenForeground2 = "var(--colorPaletteDarkGreenForeground2)";
const colorPaletteDarkRedBackground2 = "var(--colorPaletteDarkRedBackground2)";
const colorPaletteDarkRedBorderActive = "var(--colorPaletteDarkRedBorderActive)";
const colorPaletteDarkRedForeground2 = "var(--colorPaletteDarkRedForeground2)";
const colorPaletteForestBackground2 = "var(--colorPaletteForestBackground2)";
const colorPaletteForestBorderActive = "var(--colorPaletteForestBorderActive)";
const colorPaletteForestForeground2 = "var(--colorPaletteForestForeground2)";
const colorPaletteGoldBackground2 = "var(--colorPaletteGoldBackground2)";
const colorPaletteGoldBorderActive = "var(--colorPaletteGoldBorderActive)";
const colorPaletteGoldForeground2 = "var(--colorPaletteGoldForeground2)";
const colorPaletteGrapeBackground2 = "var(--colorPaletteGrapeBackground2)";
const colorPaletteGrapeBorderActive = "var(--colorPaletteGrapeBorderActive)";
const colorPaletteGrapeForeground2 = "var(--colorPaletteGrapeForeground2)";
const colorPaletteLavenderBackground2 = "var(--colorPaletteLavenderBackground2)";
const colorPaletteLavenderBorderActive = "var(--colorPaletteLavenderBorderActive)";
const colorPaletteLavenderForeground2 = "var(--colorPaletteLavenderForeground2)";
const colorPaletteLightTealBackground2 = "var(--colorPaletteLightTealBackground2)";
const colorPaletteLightTealBorderActive = "var(--colorPaletteLightTealBorderActive)";
const colorPaletteLightTealForeground2 = "var(--colorPaletteLightTealForeground2)";
const colorPaletteLilacBackground2 = "var(--colorPaletteLilacBackground2)";
const colorPaletteLilacBorderActive = "var(--colorPaletteLilacBorderActive)";
const colorPaletteLilacForeground2 = "var(--colorPaletteLilacForeground2)";
const colorPaletteMagentaBackground2 = "var(--colorPaletteMagentaBackground2)";
const colorPaletteMagentaBorderActive = "var(--colorPaletteMagentaBorderActive)";
const colorPaletteMagentaForeground2 = "var(--colorPaletteMagentaForeground2)";
const colorPaletteMinkBackground2 = "var(--colorPaletteMinkBackground2)";
const colorPaletteMinkBorderActive = "var(--colorPaletteMinkBorderActive)";
const colorPaletteMinkForeground2 = "var(--colorPaletteMinkForeground2)";
const colorPaletteNavyBackground2 = "var(--colorPaletteNavyBackground2)";
const colorPaletteNavyBorderActive = "var(--colorPaletteNavyBorderActive)";
const colorPaletteNavyForeground2 = "var(--colorPaletteNavyForeground2)";
const colorPalettePeachBackground2 = "var(--colorPalettePeachBackground2)";
const colorPalettePeachBorderActive = "var(--colorPalettePeachBorderActive)";
const colorPalettePeachForeground2 = "var(--colorPalettePeachForeground2)";
const colorPalettePinkBackground2 = "var(--colorPalettePinkBackground2)";
const colorPalettePinkBorderActive = "var(--colorPalettePinkBorderActive)";
const colorPalettePinkForeground2 = "var(--colorPalettePinkForeground2)";
const colorPalettePlatinumBackground2 = "var(--colorPalettePlatinumBackground2)";
const colorPalettePlatinumBorderActive = "var(--colorPalettePlatinumBorderActive)";
const colorPalettePlatinumForeground2 = "var(--colorPalettePlatinumForeground2)";
const colorPalettePlumBackground2 = "var(--colorPalettePlumBackground2)";
const colorPalettePlumBorderActive = "var(--colorPalettePlumBorderActive)";
const colorPalettePlumForeground2 = "var(--colorPalettePlumForeground2)";
const colorPalettePumpkinBackground2 = "var(--colorPalettePumpkinBackground2)";
const colorPalettePumpkinBorderActive = "var(--colorPalettePumpkinBorderActive)";
const colorPalettePumpkinForeground2 = "var(--colorPalettePumpkinForeground2)";
const colorPalettePurpleBackground2 = "var(--colorPalettePurpleBackground2)";
const colorPalettePurpleBorderActive = "var(--colorPalettePurpleBorderActive)";
const colorPalettePurpleForeground2 = "var(--colorPalettePurpleForeground2)";
const colorPaletteRoyalBlueBackground2 = "var(--colorPaletteRoyalBlueBackground2)";
const colorPaletteRoyalBlueBorderActive = "var(--colorPaletteRoyalBlueBorderActive)";
const colorPaletteRoyalBlueForeground2 = "var(--colorPaletteRoyalBlueForeground2)";
const colorPaletteSeafoamBackground2 = "var(--colorPaletteSeafoamBackground2)";
const colorPaletteSeafoamBorderActive = "var(--colorPaletteSeafoamBorderActive)";
const colorPaletteSeafoamForeground2 = "var(--colorPaletteSeafoamForeground2)";
const colorPaletteSteelBackground2 = "var(--colorPaletteSteelBackground2)";
const colorPaletteSteelBorderActive = "var(--colorPaletteSteelBorderActive)";
const colorPaletteSteelForeground2 = "var(--colorPaletteSteelForeground2)";
const colorPaletteTealBackground2 = "var(--colorPaletteTealBackground2)";
const colorPaletteTealBorderActive = "var(--colorPaletteTealBorderActive)";
const colorPaletteTealForeground2 = "var(--colorPaletteTealForeground2)";
const colorStatusSuccessBackground1 = "var(--colorStatusSuccessBackground1)";
const colorStatusSuccessBackground2 = "var(--colorStatusSuccessBackground2)";
const colorStatusSuccessBackground3 = "var(--colorStatusSuccessBackground3)";
const colorStatusSuccessForeground1 = "var(--colorStatusSuccessForeground1)";
const colorStatusSuccessForeground2 = "var(--colorStatusSuccessForeground2)";
const colorStatusSuccessForeground3 = "var(--colorStatusSuccessForeground3)";
const colorStatusSuccessForegroundInverted = "var(--colorStatusSuccessForegroundInverted)";
const colorStatusSuccessBorderActive = "var(--colorStatusSuccessBorderActive)";
const colorStatusSuccessBorder1 = "var(--colorStatusSuccessBorder1)";
const colorStatusSuccessBorder2 = "var(--colorStatusSuccessBorder2)";
const colorStatusWarningBackground1 = "var(--colorStatusWarningBackground1)";
const colorStatusWarningBackground2 = "var(--colorStatusWarningBackground2)";
const colorStatusWarningBackground3 = "var(--colorStatusWarningBackground3)";
const colorStatusWarningForeground1 = "var(--colorStatusWarningForeground1)";
const colorStatusWarningForeground2 = "var(--colorStatusWarningForeground2)";
const colorStatusWarningForeground3 = "var(--colorStatusWarningForeground3)";
const colorStatusWarningForegroundInverted = "var(--colorStatusWarningForegroundInverted)";
const colorStatusWarningBorderActive = "var(--colorStatusWarningBorderActive)";
const colorStatusWarningBorder1 = "var(--colorStatusWarningBorder1)";
const colorStatusWarningBorder2 = "var(--colorStatusWarningBorder2)";
const colorStatusDangerBackground1 = "var(--colorStatusDangerBackground1)";
const colorStatusDangerBackground2 = "var(--colorStatusDangerBackground2)";
const colorStatusDangerBackground3 = "var(--colorStatusDangerBackground3)";
const colorStatusDangerBackground3Hover = "var(--colorStatusDangerBackground3Hover)";
const colorStatusDangerBackground3Pressed = "var(--colorStatusDangerBackground3Pressed)";
const colorStatusDangerForeground1 = "var(--colorStatusDangerForeground1)";
const colorStatusDangerForeground2 = "var(--colorStatusDangerForeground2)";
const colorStatusDangerForeground3 = "var(--colorStatusDangerForeground3)";
const colorStatusDangerForegroundInverted = "var(--colorStatusDangerForegroundInverted)";
const colorStatusDangerBorderActive = "var(--colorStatusDangerBorderActive)";
const colorStatusDangerBorder1 = "var(--colorStatusDangerBorder1)";
const colorStatusDangerBorder2 = "var(--colorStatusDangerBorder2)";
const borderRadiusNone = "var(--borderRadiusNone)";
const borderRadiusSmall = "var(--borderRadiusSmall)";
const borderRadiusMedium = "var(--borderRadiusMedium)";
const borderRadiusLarge = "var(--borderRadiusLarge)";
const borderRadiusXLarge = "var(--borderRadiusXLarge)";
const borderRadius2XLarge = "var(--borderRadius2XLarge)";
const borderRadius3XLarge = "var(--borderRadius3XLarge)";
const borderRadius4XLarge = "var(--borderRadius4XLarge)";
const borderRadius5XLarge = "var(--borderRadius5XLarge)";
const borderRadius6XLarge = "var(--borderRadius6XLarge)";
const borderRadiusCircular = "var(--borderRadiusCircular)";
const fontFamilyBase = "var(--fontFamilyBase)";
const fontFamilyMonospace = "var(--fontFamilyMonospace)";
const fontFamilyNumeric = "var(--fontFamilyNumeric)";
const fontSizeBase100 = "var(--fontSizeBase100)";
const fontSizeBase200 = "var(--fontSizeBase200)";
const fontSizeBase300 = "var(--fontSizeBase300)";
const fontSizeBase400 = "var(--fontSizeBase400)";
const fontSizeBase500 = "var(--fontSizeBase500)";
const fontSizeBase600 = "var(--fontSizeBase600)";
const fontSizeHero700 = "var(--fontSizeHero700)";
const fontSizeHero800 = "var(--fontSizeHero800)";
const fontSizeHero900 = "var(--fontSizeHero900)";
const fontSizeHero1000 = "var(--fontSizeHero1000)";
const fontWeightRegular = "var(--fontWeightRegular)";
const fontWeightMedium = "var(--fontWeightMedium)";
const fontWeightSemibold = "var(--fontWeightSemibold)";
const fontWeightBold = "var(--fontWeightBold)";
const lineHeightBase100 = "var(--lineHeightBase100)";
const lineHeightBase200 = "var(--lineHeightBase200)";
const lineHeightBase300 = "var(--lineHeightBase300)";
const lineHeightBase400 = "var(--lineHeightBase400)";
const lineHeightBase500 = "var(--lineHeightBase500)";
const lineHeightBase600 = "var(--lineHeightBase600)";
const lineHeightHero700 = "var(--lineHeightHero700)";
const lineHeightHero800 = "var(--lineHeightHero800)";
const lineHeightHero900 = "var(--lineHeightHero900)";
const lineHeightHero1000 = "var(--lineHeightHero1000)";
const shadow2 = "var(--shadow2)";
const shadow4 = "var(--shadow4)";
const shadow8 = "var(--shadow8)";
const shadow16 = "var(--shadow16)";
const shadow28 = "var(--shadow28)";
const shadow64 = "var(--shadow64)";
const shadow2Brand = "var(--shadow2Brand)";
const shadow4Brand = "var(--shadow4Brand)";
const shadow8Brand = "var(--shadow8Brand)";
const shadow16Brand = "var(--shadow16Brand)";
const shadow28Brand = "var(--shadow28Brand)";
const shadow64Brand = "var(--shadow64Brand)";
const strokeWidthThin = "var(--strokeWidthThin)";
const strokeWidthThick = "var(--strokeWidthThick)";
const strokeWidthThicker = "var(--strokeWidthThicker)";
const strokeWidthThickest = "var(--strokeWidthThickest)";
const spacingHorizontalNone = "var(--spacingHorizontalNone)";
const spacingHorizontalXXS = "var(--spacingHorizontalXXS)";
const spacingHorizontalXS = "var(--spacingHorizontalXS)";
const spacingHorizontalSNudge = "var(--spacingHorizontalSNudge)";
const spacingHorizontalS = "var(--spacingHorizontalS)";
const spacingHorizontalMNudge = "var(--spacingHorizontalMNudge)";
const spacingHorizontalM = "var(--spacingHorizontalM)";
const spacingHorizontalL = "var(--spacingHorizontalL)";
const spacingHorizontalXL = "var(--spacingHorizontalXL)";
const spacingHorizontalXXL = "var(--spacingHorizontalXXL)";
const spacingHorizontalXXXL = "var(--spacingHorizontalXXXL)";
const spacingVerticalNone = "var(--spacingVerticalNone)";
const spacingVerticalXXS = "var(--spacingVerticalXXS)";
const spacingVerticalXS = "var(--spacingVerticalXS)";
const spacingVerticalSNudge = "var(--spacingVerticalSNudge)";
const spacingVerticalS = "var(--spacingVerticalS)";
const spacingVerticalMNudge = "var(--spacingVerticalMNudge)";
const spacingVerticalM = "var(--spacingVerticalM)";
const spacingVerticalL = "var(--spacingVerticalL)";
const spacingVerticalXL = "var(--spacingVerticalXL)";
const spacingVerticalXXL = "var(--spacingVerticalXXL)";
const spacingVerticalXXXL = "var(--spacingVerticalXXXL)";
const durationUltraFast = "var(--durationUltraFast)";
const durationFaster = "var(--durationFaster)";
const durationFast = "var(--durationFast)";
const durationNormal = "var(--durationNormal)";
const durationGentle = "var(--durationGentle)";
const durationSlow = "var(--durationSlow)";
const durationSlower = "var(--durationSlower)";
const durationUltraSlow = "var(--durationUltraSlow)";
const curveAccelerateMax = "var(--curveAccelerateMax)";
const curveAccelerateMid = "var(--curveAccelerateMid)";
const curveAccelerateMin = "var(--curveAccelerateMin)";
const curveDecelerateMax = "var(--curveDecelerateMax)";
const curveDecelerateMid = "var(--curveDecelerateMid)";
const curveDecelerateMin = "var(--curveDecelerateMin)";
const curveEasyEaseMax = "var(--curveEasyEaseMax)";
const curveEasyEase = "var(--curveEasyEase)";
const curveLinear = "var(--curveLinear)";
const zIndexBackground = "var(--zIndexBackground)";
const zIndexContent = "var(--zIndexContent)";
const zIndexOverlay = "var(--zIndexOverlay)";
const zIndexPopup = "var(--zIndexPopup)";
const zIndexMessages = "var(--zIndexMessages)";
const zIndexFloating = "var(--zIndexFloating)";
const zIndexPriority = "var(--zIndexPriority)";
const zIndexDebug = "var(--zIndexDebug)";

const styles$E = css`${display("block")} :host{max-width:fit-content;contain:content}.heading{height:44px;display:grid;position:relative;padding-inline:${spacingHorizontalM} ${spacingHorizontalMNudge};border-radius:${borderRadiusMedium};font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};line-height:${lineHeightBase300};grid-template-columns:auto auto 1fr auto}.button{appearance:none;background:${colorTransparentBackground};border:none;box-sizing:border-box;color:${colorNeutralForeground1};cursor:pointer;font:inherit;grid-column:auto/span 2;grid-row:1;height:44px;outline:none;padding:0;text-align:start}.button::before{content:'';position:absolute;inset:0px;cursor:pointer;border-radius:${borderRadiusSmall}}:where(.default-marker-collapsed,.default-marker-expanded),::slotted(:is([slot='marker-collapsed'],[slot='marker-expanded'])){display:flex;align-items:center;justify-content:center;pointer-events:none;position:relative;height:100%;padding-inline-end:${spacingHorizontalS};grid-column:1/span 1;grid-row:1}.content{margin:0 ${spacingHorizontalM}}::slotted([slot='start']){display:flex;justify-content:center;align-items:center;padding-right:${spacingHorizontalS};grid-column:2/span 1;grid-row:1}button:focus-visible::after{content:'';position:absolute;inset:0px;cursor:pointer;border-radius:${borderRadiusSmall};outline:none;border:2px solid ${colorStrokeFocus1};box-shadow:inset 0 0 0 1px ${colorStrokeFocus2}}:host([disabled]) .button{color:${colorNeutralForegroundDisabled}}:host([disabled]) svg{filter:invert(89%) sepia(0%) saturate(569%) hue-rotate(155deg) brightness(88%) contrast(87%)}:host([expanded]) .content{display:block}:host([expanded]) .default-marker-collapsed,:host([expanded]) ::slotted([slot='marker-collapsed']),:host(:not([expanded])) :is(.default-marker-expanded,.content),:host(:not([expanded])) ::slotted([slot='marker-expanded']){display:none}:host([expanded]) ::slotted([slot='marker-expanded']),:host(:not([expanded])) ::slotted([slot='marker-collapsed']){display:flex}.heading{font-size:${fontSizeBase300};line-height:${lineHeightBase300}}:host([size='small']) .heading{font-size:${fontSizeBase200};line-height:${lineHeightBase200}}:host([size='large']) .heading{font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host([size='extra-large']) .heading{font-size:${fontSizeBase500};line-height:${lineHeightBase500}}:host([marker-position='end']) ::slotted([slot='start']){grid-column:1/span 1}:host([marker-position='end']) :is(.default-marker-collapsed,.default-marker-expanded){grid-column:4/span 1;padding-inline-start:${spacingHorizontalS};padding-inline-end:0}:host([marker-position='end']) .button{grid-column:2/span 3}:host([block]){max-width:100%}:host([marker-position='end']) .heading{grid-template-columns:auto auto 28px;padding-inline:${spacingHorizontalM}}:host([marker-position='end']:has([slot='start'])) .heading{padding-inline:${spacingHorizontalMNudge} ${spacingHorizontalM}}:host([block][marker-position='end']) .heading{grid-template-columns:auto 1fr}:host([marker-position='end']) :is(.default-marker-collapsed,.default-marker-expanded){grid-column:5/span 1}`;

const chevronRight20Filled = html.partial(`<svg width=20 height=20 viewBox="0 0 20 20" fill=none xmlns=http://www.w3.org/2000/svg class=default-marker-collapsed aria-hidden=true><path d="M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z" fill=currentColor /></svg>`);
const chevronDown20Filled = html.partial(`<svg width=20 height=20 viewBox="0 0 20 20" fill=none xmlns=http://www.w3.org/2000/svg class=default-marker-expanded aria-hidden=true><path d="M15.794 7.73271C16.0797 8.03263 16.0681 8.50737 15.7682 8.79306L10.5178 13.7944C10.2281 14.0703 9.77285 14.0703 9.48318 13.7944L4.23271 8.79306C3.93279 8.50737 3.92125 8.03263 4.20694 7.73271C4.49264 7.43279 4.96737 7.42125 5.26729 7.70694L10.0005 12.2155L14.7336 7.70694C15.0336 7.42125 15.5083 7.43279 15.794 7.73271Z" fill=currentColor /></svg>`);
function accordionItemTemplate(options = {}) {
  return html`<div class=heading part=heading role=heading aria-level=${(x) => x.headinglevel}><button class=button part=button id=control aria-controls=panel aria-expanded=${(x) => x.expanded} ?disabled=${(x) => x.disabled} ${ref("expandbutton")}><slot name=heading></slot></button> ${startSlotTemplate(options)}<slot name=marker-expanded>${staticallyCompose(options.expandedIcon)}</slot><slot name=marker-collapsed>${staticallyCompose(options.collapsedIcon)}</slot></div><div class=content part=content id=panel role=region aria-labelledby=control><slot></slot></div>`;
}
const template$F = accordionItemTemplate({
  collapsedIcon: chevronRight20Filled,
  expandedIcon: chevronDown20Filled
});

const definition$F = AccordionItem.compose({
  name: tagName$F,
  template: template$F,
  styles: styles$E
});

definition$F.define(FluentDesignSystem.registry);

const AccordionExpandMode = {
  single: "single",
  multi: "multi"
};
const tagName$E = `${FluentDesignSystem.prefix}-accordion`;

function requestIdleCallback(callback, options) {
  if ("requestIdleCallback" in globalThis) {
    return globalThis.requestIdleCallback(callback, options);
  }
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: options?.timeout ? Date.now() - start >= options.timeout : false,
      timeRemaining: () => 0
    });
  }, options?.timeout ?? 1);
}
function waitForConnectedDescendants(target, callback, options) {
  const shallow = options?.shallow ?? false;
  const timeout = options?.timeout ?? 50;
  const useIdleCallback = options?.idleCallback ?? false;
  const selector = `${shallow ? ":scope > " : ""}:not(:defined)`;
  const scheduleCheck = (deadline) => {
    if (target.querySelector(selector) === null || deadline && deadline.timeRemaining() <= 0) {
      if (useIdleCallback) {
        requestIdleCallback(callback, { timeout });
      } else {
        callback();
      }
      return;
    }
    requestIdleCallback(scheduleCheck, { timeout });
  };
  scheduleCheck();
}

var __defProp$M = Object.defineProperty;
var __getOwnPropDesc$M = Object.getOwnPropertyDescriptor;
var __decorateClass$M = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$M(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$M(target, key, result);
  return result;
};
class Accordion extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * Guard flag to prevent re-entrant calls to setSingleExpandMode.
     * @internal
     */
    this._isAdjusting = false;
    this.activeItemIndex = 0;
    /**
     * Resets event listeners and sets the `accordionItems` property
     * then rebinds event listeners to each non-disabled item
     */
    this.setItems = () => {
      waitForConnectedDescendants(this, () => {
        if (this.slottedAccordionItems.length === 0) {
          return;
        }
        const children = Array.from(this.children);
        this.removeItemListeners(children);
        children.forEach((child) => Observable.getNotifier(child).subscribe(this, "disabled"));
        this.accordionItems = children.filter((child) => !child.hasAttribute("disabled"));
        this.accordionItems.forEach((item, index) => {
          item.addEventListener("click", this.expandedChangedHandler);
          Observable.getNotifier(item).subscribe(this, "expanded");
        });
        if (this.isSingleExpandMode()) {
          const expandedItem = this.findExpandedItem();
          this.setSingleExpandMode(expandedItem);
        }
      });
    };
    /**
     * Removes event listeners from the previous accordion items
     * @param oldValue - An array of the previous accordion items
     */
    this.removeItemListeners = (oldValue) => {
      oldValue.forEach((item, index) => {
        Observable.getNotifier(item).unsubscribe(this, "disabled");
        Observable.getNotifier(item).unsubscribe(this, "expanded");
        item.removeEventListener("click", this.expandedChangedHandler);
      });
    };
    /**
     * Changes the expanded state of the accordion item
     * @param evt - Click event
     * @returns
     */
    this.expandedChangedHandler = (evt) => {
      const item = evt.target;
      if (isAccordionItem(item)) {
        if (!this.isSingleExpandMode()) {
          item.expanded = !item.expanded;
          this.activeItemIndex = this.accordionItems.indexOf(item);
        } else {
          this.setSingleExpandMode(item);
        }
        this.$emit("change");
      }
    };
  }
  expandmodeChanged(prev, next) {
    if (!this.$fastController.isConnected) {
      return;
    }
    const expandedItem = this.findExpandedItem();
    if (!expandedItem) {
      return;
    }
    if (next === AccordionExpandMode.single) {
      this.setSingleExpandMode(expandedItem);
      return;
    }
    expandedItem?.expandbutton?.removeAttribute("aria-disabled");
  }
  /**
   * @internal
   */
  slottedAccordionItemsChanged(oldValue, newValue) {
    this.setItems();
  }
  /**
   * Watch for changes to the slotted accordion items `disabled` and `expanded` attributes
   * @internal
   */
  handleChange(source, propertyName) {
    if (propertyName === "disabled") {
      this.setItems();
    } else if (propertyName === "expanded") {
      if (source.expanded && this.isSingleExpandMode() && !this._isAdjusting) {
        this._isAdjusting = true;
        this.setSingleExpandMode(source);
        this._isAdjusting = false;
      }
    }
  }
  /**
   * Find the first expanded item in the accordion
   */
  findExpandedItem() {
    if (!this.accordionItems || this.accordionItems?.length === 0) {
      return null;
    }
    return this.accordionItems.find((item) => isAccordionItem(item) && item.expanded) ?? this.accordionItems[0];
  }
  /**
   * Checks if the accordion is in single expand mode
   * @returns true if the accordion is in single expand mode.
   */
  isSingleExpandMode() {
    return this.expandmode === AccordionExpandMode.single;
  }
  /**
   * Controls the behavior of the accordion in single expand mode
   * @param expandedItem - The item to expand in single expand mode
   */
  setSingleExpandMode(expandedItem) {
    if (this.accordionItems.length === 0) {
      return;
    }
    const currentItems = Array.from(this.accordionItems);
    this.activeItemIndex = currentItems.indexOf(expandedItem);
    currentItems.forEach((item, index) => {
      if (isAccordionItem(item)) {
        if (this.activeItemIndex === index) {
          item.expanded = true;
          item.expandbutton?.setAttribute("aria-disabled", "true");
        } else {
          item.expanded = false;
          if (!item.hasAttribute("disabled")) {
            item.expandbutton?.removeAttribute("aria-disabled");
          }
        }
      }
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.expandmode = this.expandmode || AccordionExpandMode.multi;
    this.setItems();
  }
}
__decorateClass$M([
  attr({ attribute: "expand-mode" })
], Accordion.prototype, "expandmode", 2);
__decorateClass$M([
  observable
], Accordion.prototype, "slottedAccordionItems", 2);

const styles$D = css`${display("flex")} :host{flex-direction:column;width:100%;contain:content}`;

function accordionTemplate() {
  return html`<template><slot ${slotted({ property: "slottedAccordionItems", filter: elements() })}></slot></template>`;
}
const template$E = accordionTemplate();

const definition$E = Accordion.compose({
  name: tagName$E,
  template: template$E,
  styles: styles$D
});

definition$E.define(FluentDesignSystem.registry);

const ButtonAppearance = {
  primary: "primary",
  outline: "outline",
  subtle: "subtle",
  transparent: "transparent"
};
const ButtonShape = {
  circular: "circular",
  rounded: "rounded",
  square: "square"
};
const ButtonSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const ButtonType = {
  submit: "submit",
  reset: "reset",
  button: "button"
};
const ButtonFormTarget = {
  blank: "_blank",
  self: "_self",
  parent: "_parent",
  top: "_top"
};
const tagName$D = `${FluentDesignSystem.prefix}-button`;

const AnchorButtonAppearance = ButtonAppearance;
const AnchorButtonShape = ButtonShape;
const AnchorButtonSize = ButtonSize;
const AnchorTarget = {
  _self: "_self",
  _blank: "_blank",
  _parent: "_parent",
  _top: "_top"
};
const AnchorAttributes = {
  download: "download",
  href: "href",
  hreflang: "hreflang",
  ping: "ping",
  referrerpolicy: "referrerpolicy",
  rel: "rel",
  target: "target",
  type: "type"
};
const tagName$C = `${FluentDesignSystem.prefix}-anchor-button`;

const AnchorPositioningCSSSupported = CSS.supports("anchor-name: --a");
const AnchorPositioningHTMLSupported = "anchor" in HTMLElement.prototype;
const CustomStatesSetSupported = CSS.supports("selector(:state(g))");

const statesMap = /* @__PURE__ */ new Map();
function stateSelector(state) {
  return statesMap.get(state) ?? statesMap.set(state, CustomStatesSetSupported ? `:state(${state})` : `[state--${state}]`).get(state);
}
function toggleState(elementInternals, state, force) {
  if (!state || !elementInternals) {
    return;
  }
  if (!CustomStatesSetSupported) {
    elementInternals.shadowRoot.host.toggleAttribute(`state--${state}`, force);
    return;
  }
  if (force ?? !elementInternals.states.has(state)) {
    elementInternals.states.add(state);
    return;
  }
  elementInternals.states.delete(state);
}
const matchingStateMap = /* @__PURE__ */ new WeakMap();
function hasMatchingState(States, state) {
  if (!States || !state) {
    return false;
  }
  if (matchingStateMap.has(States)) {
    return matchingStateMap.get(States).has(state);
  }
  const stateSet = new Set(Object.values(States));
  matchingStateMap.set(States, stateSet);
  return stateSet.has(state);
}
function swapStates(elementInternals, prev = "", next = "", States, prefix = "") {
  toggleState(elementInternals, `${prefix}${prev}`, false);
  if (!States || hasMatchingState(States, next)) {
    toggleState(elementInternals, `${prefix}${next}`, true);
  }
}

var __defProp$L = Object.defineProperty;
var __getOwnPropDesc$L = Object.getOwnPropertyDescriptor;
var __decorateClass$L = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$L(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$L(target, key, result);
  return result;
};
class BaseAnchor extends FASTElement {
  constructor() {
    super();
    /**
     * Holds a reference to the platform to manage ctrl+click on Windows and cmd+click on Mac
     * @internal
     */
    this.isMac = navigator.userAgent.includes("Mac");
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * The proxy anchor element
     * @internal
     */
    this.internalProxyAnchor = this.createProxyElement();
    this.elementInternals.role = "link";
  }
  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0;
    Observable.getNotifier(this).subscribe(this);
    Object.keys(this.$fastController.definition.attributeLookup).forEach((key) => {
      this.handleChange(this, key);
    });
    this.append(this.internalProxyAnchor);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    Observable.getNotifier(this).unsubscribe(this);
  }
  /**
   * Handles changes to observable properties
   * @internal
   * @param source - the source of the change
   * @param propertyName - the property name being changed
   */
  handleChange(source, propertyName) {
    if (propertyName in AnchorAttributes) {
      const attribute = this.$fastController.definition.attributeLookup[propertyName]?.attribute;
      if (attribute) {
        this.handleProxyAttributeChange(attribute, this[propertyName]);
      }
    }
  }
  /**
   * Handles the anchor click event.
   *
   * @param e - The event object
   * @internal
   */
  clickHandler(e) {
    if (e.composedPath()[0] === this.internalProxyAnchor) {
      e.stopImmediatePropagation();
      return true;
    }
    if (this.href) {
      const newTab = e.ctrlKey || e.metaKey;
      this.handleNavigation(newTab);
    }
    return true;
  }
  /**
   * Handles keydown events for the anchor.
   *
   * @param e - the keyboard event
   * @returns - the return value of the click handler
   * @public
   */
  keydownHandler(e) {
    if (this.href) {
      if (e.key === "Enter") {
        const newTab = !this.isMac ? e.ctrlKey : e.metaKey || e.ctrlKey;
        this.handleNavigation(newTab);
        return;
      }
    }
    return true;
  }
  /**
   * Handles navigation based on input
   * If a modified activation requests a new tab, opens the href in a new window.
   * @internal
   */
  handleNavigation(newTab) {
    newTab ? window.open(this.href, "_blank") : this.internalProxyAnchor.click();
  }
  /**
   * A method for updating proxy attributes when attributes have changed
   * @internal
   * @param attribute - an attribute to set/remove
   * @param value - the value of the attribute
   */
  handleProxyAttributeChange(attribute, value) {
    if (value) {
      this.internalProxyAnchor.setAttribute(attribute, value);
    } else {
      this.internalProxyAnchor.removeAttribute(attribute);
    }
  }
  createProxyElement() {
    const proxy = this.internalProxyAnchor ?? document.createElement("a");
    proxy.inert = true;
    return proxy;
  }
}
__decorateClass$L([
  attr
], BaseAnchor.prototype, "download", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "href", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "hreflang", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "ping", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "referrerpolicy", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "rel", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "target", 2);
__decorateClass$L([
  attr
], BaseAnchor.prototype, "type", 2);

var __defProp$K = Object.defineProperty;
var __getOwnPropDesc$K = Object.getOwnPropertyDescriptor;
var __decorateClass$K = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$K(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$K(target, key, result);
  return result;
};
class AnchorButton extends BaseAnchor {
  constructor() {
    super(...arguments);
    this.iconOnly = false;
  }
  /**
   * Handles changes to appearance attribute custom states
   * @param prev - the previous state
   * @param next - the next state
   */
  appearanceChanged(prev, next) {
    swapStates(this.elementInternals, prev, next, AnchorButtonAppearance);
  }
  /**
   * Handles changes to shape attribute custom states
   * @param prev - the previous state
   * @param next - the next state
   */
  shapeChanged(prev, next) {
    swapStates(this.elementInternals, prev, next, AnchorButtonShape);
  }
  /**
   * Handles changes to size attribute custom states
   * @param prev - the previous state
   * @param next - the next state
   */
  sizeChanged(prev, next) {
    swapStates(this.elementInternals, prev, next, AnchorButtonSize);
  }
  /**
   * Handles changes to icon only custom states
   * @param prev - the previous state
   * @param next - the next state
   */
  iconOnlyChanged(prev, next) {
    toggleState(this.elementInternals, "icon", !!next);
  }
}
__decorateClass$K([
  attr
], AnchorButton.prototype, "appearance", 2);
__decorateClass$K([
  attr
], AnchorButton.prototype, "shape", 2);
__decorateClass$K([
  attr
], AnchorButton.prototype, "size", 2);
__decorateClass$K([
  attr({ attribute: "icon-only", mode: "boolean" })
], AnchorButton.prototype, "iconOnly", 2);
applyMixins(AnchorButton, StartEnd);

const baseButtonStyles = css`${display("inline-flex")} :host{--icon-spacing:${spacingHorizontalSNudge};position:relative;contain:layout style;vertical-align:middle;align-items:center;box-sizing:border-box;justify-content:center;text-align:center;text-decoration-line:none;margin:0;min-height:32px;outline-style:none;background-color:${colorNeutralBackground1};color:${colorNeutralForeground1};border:${strokeWidthThin} solid ${colorNeutralStroke1};padding:0 ${spacingHorizontalM};min-width:96px;border-radius:${borderRadiusMedium};font-size:${fontSizeBase300};font-family:${fontFamilyBase};font-weight:${fontWeightSemibold};line-height:${lineHeightBase300};transition-duration:${durationFaster};transition-property:background,border,color;transition-timing-function:${curveEasyEase};cursor:pointer;user-select:none}.content{display:inherit}:host(:hover){background-color:${colorNeutralBackground1Hover};color:${colorNeutralForeground1Hover};border-color:${colorNeutralStroke1Hover}}:host(:hover:active){background-color:${colorNeutralBackground1Pressed};border-color:${colorNeutralStroke1Pressed};color:${colorNeutralForeground1Pressed};outline-style:none}:host(:focus-visible){border-color:${colorTransparentStroke};outline:${strokeWidthThick} solid ${colorTransparentStroke};box-shadow:${shadow4},0 0 0 2px ${colorStrokeFocus2}}@media screen and (prefers-reduced-motion:reduce){:host{transition-duration:0.01ms}}::slotted(svg){font-size:20px;height:20px;width:20px;fill:currentColor}::slotted([slot='start']){margin-inline-end:var(--icon-spacing)}::slotted([slot='end']),[slot='end']{flex-shrink:0;margin-inline-start:var(--icon-spacing)}:host([icon-only]){min-width:32px;max-width:32px}:host([size='small']){--icon-spacing:${spacingHorizontalXS};min-height:24px;min-width:64px;padding:0 ${spacingHorizontalS};border-radius:${borderRadiusSmall};font-size:${fontSizeBase200};line-height:${lineHeightBase200};font-weight:${fontWeightRegular}}:host([size='small'][icon-only]){min-width:24px;max-width:24px}:host([size='large']){min-height:40px;border-radius:${borderRadiusLarge};padding:0 ${spacingHorizontalL};font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host([size='large'][icon-only]){min-width:40px;max-width:40px}:host([size='large']) ::slotted(svg){font-size:24px;height:24px;width:24px}:host(:is([shape='circular'],[shape='circular']:focus-visible)){border-radius:${borderRadiusCircular}}:host(:is([shape='square'],[shape='square']:focus-visible)){border-radius:${borderRadiusNone}}:host([appearance='primary']){background-color:${colorBrandBackground};color:${colorNeutralForegroundOnBrand};border-color:transparent}:host([appearance='primary']:hover){background-color:${colorBrandBackgroundHover}}:host([appearance='primary']:is(:hover,:hover:active):not(:focus-visible)){border-color:transparent}:host([appearance='primary']:is(:hover,:hover:active)){color:${colorNeutralForegroundOnBrand}}:host([appearance='primary']:hover:active){background-color:${colorBrandBackgroundPressed}}:host([appearance='primary']:focus-visible){border-color:${colorNeutralForegroundOnBrand};box-shadow:${shadow2},0 0 0 2px ${colorStrokeFocus2}}:host([appearance='outline']){background-color:${colorTransparentBackground}}:host([appearance='outline']:hover){background-color:${colorTransparentBackgroundHover}}:host([appearance='outline']:hover:active){background-color:${colorTransparentBackgroundPressed}}:host([appearance='subtle']){background-color:${colorSubtleBackground};color:${colorNeutralForeground2};border-color:transparent}:host([appearance='subtle']:hover){background-color:${colorSubtleBackgroundHover};color:${colorNeutralForeground2Hover};border-color:transparent}:host([appearance='subtle']:hover:active){background-color:${colorSubtleBackgroundPressed};color:${colorNeutralForeground2Pressed};border-color:transparent}:host([appearance='subtle']:hover) ::slotted(svg){fill:${colorNeutralForeground2BrandHover}}:host([appearance='subtle']:hover:active) ::slotted(svg){fill:${colorNeutralForeground2BrandPressed}}:host([appearance='transparent']){background-color:${colorTransparentBackground};color:${colorNeutralForeground2}}:host([appearance='transparent']:hover){background-color:${colorTransparentBackgroundHover};color:${colorNeutralForeground2BrandHover}}:host([appearance='transparent']:hover:active){background-color:${colorTransparentBackgroundPressed};color:${colorNeutralForeground2BrandPressed}}:host(:is([appearance='transparent'],[appearance='transparent']:is(:hover,:active))){border-color:transparent}`;
const styles$C = css`${baseButtonStyles} :host(:is(:disabled,[disabled-focusable],[appearance]:disabled,[appearance][disabled-focusable])),:host(:is(:disabled,[disabled-focusable],[appearance]:disabled,[appearance][disabled-focusable]):hover),:host(:is(:disabled,[disabled-focusable],[appearance]:disabled,[appearance][disabled-focusable]):hover:active){background-color:${colorNeutralBackgroundDisabled};border-color:${colorNeutralStrokeDisabled};color:${colorNeutralForegroundDisabled};cursor:not-allowed}:host([appearance='primary']:is(:disabled,[disabled-focusable])),:host([appearance='primary']:is(:disabled,[disabled-focusable]):is(:hover,:hover:active)){border-color:transparent}:host([appearance='outline']:is(:disabled,[disabled-focusable])),:host([appearance='outline']:is(:disabled,[disabled-focusable]):is(:hover,:hover:active)){background-color:${colorTransparentBackground}}:host([appearance='subtle']:is(:disabled,[disabled-focusable])),:host([appearance='subtle']:is(:disabled,[disabled-focusable]):is(:hover,:hover:active)){background-color:${colorTransparentBackground};border-color:transparent}:host([appearance='transparent']:is(:disabled,[disabled-focusable])),:host([appearance='transparent']:is(:disabled,[disabled-focusable]):is(:hover,:hover:active)){border-color:transparent;background-color:${colorTransparentBackground}}@media (forced-colors:active){:host{background-color:ButtonFace;color:ButtonText}:host(:is(:hover,:focus-visible)){border-color:Highlight !important}:host([appearance='primary']:not(:is(:hover,:focus-visible))){background-color:Highlight;color:HighlightText;forced-color-adjust:none}:host(:is(:disabled,[disabled-focusable],[appearance]:disabled,[appearance][disabled-focusable])){background-color:ButtonFace;color:GrayText;border-color:ButtonText}}`;

const styles$B = css`${baseButtonStyles} ::slotted(a){position:absolute;inset:0}@media (forced-colors:active){:host{border-color:LinkText;color:LinkText}}`;

function anchorTemplate$1(options = {}) {
  return html`<template tabindex=0 @click=${(x, c) => x.clickHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)}>${startSlotTemplate(options)} <span class=content part=content><slot></slot></span>${endSlotTemplate(options)}</template>`;
}
const template$D = anchorTemplate$1();

const definition$D = AnchorButton.compose({
  name: tagName$C,
  template: template$D,
  styles: styles$B
});

definition$D.define(FluentDesignSystem.registry);

const AvatarActive = {
  active: "active",
  inactive: "inactive"
};
const AvatarShape = {
  circular: "circular",
  square: "square"
};
const AvatarAppearance = {
  ring: "ring",
  shadow: "shadow",
  ringShadow: "ring-shadow"
};
const AvatarNamedColor = {
  darkRed: "dark-red",
  cranberry: "cranberry",
  red: "red",
  pumpkin: "pumpkin",
  peach: "peach",
  marigold: "marigold",
  gold: "gold",
  brass: "brass",
  brown: "brown",
  forest: "forest",
  seafoam: "seafoam",
  darkGreen: "dark-green",
  lightTeal: "light-teal",
  teal: "teal",
  steel: "steel",
  blue: "blue",
  royalBlue: "royal-blue",
  cornflower: "cornflower",
  navy: "navy",
  lavender: "lavender",
  purple: "purple",
  grape: "grape",
  lilac: "lilac",
  pink: "pink",
  magenta: "magenta",
  plum: "plum",
  beige: "beige",
  mink: "mink",
  platinum: "platinum",
  anchor: "anchor"
};
const AvatarColor = {
  neutral: "neutral",
  brand: "brand",
  colorful: "colorful",
  ...AvatarNamedColor
};
const AvatarSize = {
  _16: 16,
  _20: 20,
  _24: 24,
  _28: 28,
  _32: 32,
  _36: 36,
  _40: 40,
  _48: 48,
  _56: 56,
  _64: 64,
  _72: 72,
  _96: 96,
  _120: 120,
  _128: 128
};
const tagName$B = `${FluentDesignSystem.prefix}-avatar`;

const UNWANTED_ENCLOSURES_REGEX = /[\(\[\{][^\)\]\}]*[\)\]\}]/g;
const UNWANTED_CHARS_REGEX = /[\0-\u001F\!-/:-@\[-`\{-\u00BF\u0250-\u036F\uD800-\uFFFF]/g;
const PHONENUMBER_REGEX = /^\d+[\d\s]*(:?ext|x|)\s*\d+$/i;
const MULTIPLE_WHITESPACES_REGEX = /\s+/g;
const UNSUPPORTED_TEXT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD869][\uDC00-\uDED6]/;
function getInitialsLatin(displayName, isRtl, firstInitialOnly) {
  let initials = "";
  const splits = displayName.split(" ");
  if (splits.length !== 0) {
    initials += splits[0].charAt(0).toUpperCase();
  }
  if (!firstInitialOnly) {
    if (splits.length === 2) {
      initials += splits[1].charAt(0).toUpperCase();
    } else if (splits.length === 3) {
      initials += splits[2].charAt(0).toUpperCase();
    }
  }
  if (isRtl && initials.length > 1) {
    return initials.charAt(1) + initials.charAt(0);
  }
  return initials;
}
function cleanupDisplayName(displayName) {
  displayName = displayName.replace(UNWANTED_ENCLOSURES_REGEX, "");
  displayName = displayName.replace(UNWANTED_CHARS_REGEX, "");
  displayName = displayName.replace(MULTIPLE_WHITESPACES_REGEX, " ");
  displayName = displayName.trim();
  return displayName;
}
function getInitials(displayName, isRtl, options) {
  if (!displayName) {
    return "";
  }
  displayName = cleanupDisplayName(displayName);
  if (UNSUPPORTED_TEXT_REGEX.test(displayName) || !options?.allowPhoneInitials && PHONENUMBER_REGEX.test(displayName)) {
    return "";
  }
  return getInitialsLatin(displayName, isRtl, options?.firstInitialOnly);
}

var __defProp$J = Object.defineProperty;
var __getOwnPropDesc$J = Object.getOwnPropertyDescriptor;
var __decorateClass$J = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$J(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$J(target, key, result);
  return result;
};
class BaseAvatar extends FASTElement {
  constructor() {
    super();
    this.slottedDefaults = [];
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "img";
  }
  /**
   * Handles changes to the default slot element reference.
   *
   * Toggles the `has-slotted` class on the slot element for browsers that do not
   * support the `:has-slotted` CSS selector. Defers cleanup using
   * `Updates.enqueue` to avoid DOM mutations during hydration that could
   * corrupt binding markers.
   *
   * @internal
   */
  defaultSlotChanged() {
    if (!CSS.supports("selector(:has-slotted)")) {
      const elements = this.defaultSlot.assignedElements();
      this.defaultSlot.classList.toggle("has-slotted", elements.length > 0);
    }
    Updates.enqueue(() => {
      this.cleanupSlottedContent();
    });
  }
  /**
   * Updates the monogram text content when the ref is captured.
   *
   * @internal
   */
  monogramChanged() {
    this.updateMonogram();
  }
  /**
   * Handles changes to the slotted default content.
   *
   * Normalizes the DOM, toggles the `has-slotted` class on the default slot element
   * for browsers that do not support the `:has-slotted` CSS selector, and removes
   * empty text nodes from the default slot to keep the DOM clean.
   *
   * @internal
   */
  slottedDefaultsChanged() {
    if (!this.defaultSlot) {
      return;
    }
    this.cleanupSlottedContent();
  }
  /**
   * Handles changes to the name attribute.
   * @internal
   */
  nameChanged() {
    this.updateMonogram();
  }
  /**
   * Handles changes to the initials attribute.
   * @internal
   */
  initialsChanged() {
    this.updateMonogram();
  }
  /**
   * Generates and sets the initials for the template.
   * Subclasses should override this to provide custom initials logic.
   *
   * @internal
   */
  generateInitials() {
    return this.initials || getInitials(this.name, window.getComputedStyle(this).direction === "rtl");
  }
  /**
   * Updates the monogram element's text content with the generated initials.
   *
   * @internal
   */
  updateMonogram() {
    if (this.monogram) {
      this.monogram.textContent = this.generateInitials() ?? "";
    }
  }
  /**
   * Normalizes the DOM and removes empty text nodes from the default slot.
   *
   * @internal
   */
  cleanupSlottedContent() {
    this.normalize();
    if (!CSS.supports("selector(:has-slotted)")) {
      this.defaultSlot.classList.toggle("has-slotted", !!this.slottedDefaults.length);
    }
    if (!this.innerText.trim()) {
      this.slottedDefaults.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        }
      });
    }
  }
}
__decorateClass$J([
  observable
], BaseAvatar.prototype, "defaultSlot", 2);
__decorateClass$J([
  observable
], BaseAvatar.prototype, "monogram", 2);
__decorateClass$J([
  observable
], BaseAvatar.prototype, "slottedDefaults", 2);
__decorateClass$J([
  attr
], BaseAvatar.prototype, "name", 2);
__decorateClass$J([
  attr
], BaseAvatar.prototype, "initials", 2);

var __defProp$I = Object.defineProperty;
var __getOwnPropDesc$I = Object.getOwnPropertyDescriptor;
var __decorateClass$I = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$I(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$I(target, key, result);
  return result;
};
const _Avatar = class _Avatar extends BaseAvatar {
  /**
   * Handles changes to observable properties
   * @internal
   * @param source - the source of the change
   * @param propertyName - the property name being changed
   */
  handleChange(source, propertyName) {
    switch (propertyName) {
      case "color":
      case "colorId":
        this.generateColor();
        break;
    }
  }
  /**
   * Generates and sets the initials for the template
   * @internal
   */
  generateInitials() {
    if (!this.name && !this.initials) {
      return;
    }
    const size = this.size ?? 32;
    return this.initials || getInitials(this.name, window.getComputedStyle(this).direction === "rtl", {
      firstInitialOnly: size <= 16
    });
  }
  /**
   * Sets the data-color attribute used for the visual presentation
   * @internal
   */
  generateColor() {
    const colorful = this.color === AvatarColor.colorful;
    this.currentColor;
    this.currentColor = colorful && this.colorId ? this.colorId : colorful ? _Avatar.colors[getHashCode(this.name ?? "") % _Avatar.colors.length] : this.color ?? AvatarColor.neutral;
    this.setAttribute("data-color", this.currentColor);
  }
  connectedCallback() {
    super.connectedCallback();
    Observable.getNotifier(this).subscribe(this);
    this.generateColor();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    Observable.getNotifier(this).unsubscribe(this);
  }
};
/**
 * An array of the available Avatar named colors
 */
_Avatar.colors = Object.values(AvatarNamedColor);
__decorateClass$I([
  attr
], _Avatar.prototype, "active", 2);
__decorateClass$I([
  attr
], _Avatar.prototype, "shape", 2);
__decorateClass$I([
  attr
], _Avatar.prototype, "appearance", 2);
__decorateClass$I([
  attr({ converter: nullableNumberConverter })
], _Avatar.prototype, "size", 2);
__decorateClass$I([
  attr
], _Avatar.prototype, "color", 2);
__decorateClass$I([
  attr({ attribute: "color-id" })
], _Avatar.prototype, "colorId", 2);
let Avatar = _Avatar;
const getHashCode = (str) => {
  let hashCode = 0;
  for (let len = str.length - 1; len >= 0; len--) {
    const ch = str.charCodeAt(len);
    const shift = len % 8;
    hashCode ^= (ch << shift) + (ch >> 8 - shift);
  }
  return hashCode;
};

const animations = {
  fastOutSlowInMax: curveDecelerateMax,
  fastOutSlowInMid: curveDecelerateMid,
  fastOutSlowInMin: curveDecelerateMin,
  slowOutFastInMax: curveAccelerateMax,
  slowOutFastInMid: curveAccelerateMid,
  slowOutFastInMin: curveAccelerateMin,
  fastEase: curveEasyEaseMax,
  normalEase: curveEasyEase,
  nullEasing: curveLinear
};
const styles$A = css`${display("inline-grid")} :host{position:relative;place-items:center;place-content:center;grid-template:1fr/1fr;flex-shrink:0;width:32px;height:32px;font-family:${fontFamilyBase};font-weight:${fontWeightSemibold};font-size:${fontSizeBase300};border-radius:${borderRadiusCircular};color:${colorNeutralForeground3};background-color:${colorNeutralBackground6};contain:layout style}.monogram,.default-icon{grid-area:1/1/-1/-1}.monogram:empty{display:none}.default-slot:is(.has-slotted,:has-slotted)~.default-icon,.default-slot:is(.has-slotted,:has-slotted)~.monogram,:host(:is([name]):not([name=''])) .default-icon,:host(:is([initials]):not([initials=''])) .default-icon{display:none}.default-icon,::slotted(svg){width:20px;height:20px;font-size:20px}::slotted(img){box-sizing:border-box;width:100%;height:100%;border-radius:${borderRadiusCircular}}::slotted([slot='badge']){position:absolute;bottom:0;right:0;box-shadow:0 0 0 ${strokeWidthThin} ${colorNeutralBackground1}}:host([size='64']) ::slotted([slot='badge']),:host([size='72']) ::slotted([slot='badge']),:host([size='96']) ::slotted([slot='badge']),:host([size='120']) ::slotted([slot='badge']),:host([size='128']) ::slotted([slot='badge']){box-shadow:0 0 0 ${strokeWidthThick} ${colorNeutralBackground1}}:host([size='16']),:host([size='20']),:host([size='24']){font-size:${fontSizeBase100};font-weight:${fontWeightRegular}}:host([size='16']){width:16px;height:16px}:host([size='20']){width:20px;height:20px}:host([size='24']){width:24px;height:24px}:host([size='16']) .default-icon,:host([size='16']) ::slotted(svg){width:12px;height:12px;font-size:12px}:host([size='20']) .default-icon,:host([size='24']) .default-icon,:host([size='20']) ::slotted(svg),:host([size='24']) ::slotted(svg){width:16px;height:16px;font-size:16px}:host([size='28']){width:28px;height:28px;font-size:${fontSizeBase200}}:host([size='36']){width:36px;height:36px}:host([size='40']){width:40px;height:40px}:host([size='48']),:host([size='56']){font-size:${fontSizeBase400}}:host([size='48']){width:48px;height:48px}:host([size='48']) .default-icon,:host([size='48']) ::slotted(svg){width:24px;height:24px;font-size:24px}:host([size='56']){width:56px;height:56px}:host([size='56']) .default-icon,:host([size='56']) ::slotted(svg){width:28px;height:28px;font-size:28px}:host([size='64']),:host([size='72']),:host([size='96']){font-size:${fontSizeBase500}}:host([size='64']) .default-icon,:host([size='72']) .default-icon,:host([size='64']) ::slotted(svg),:host([size='72']) ::slotted(svg){width:32px;height:32px;font-size:32px}:host([size='64']){width:64px;height:64px}:host([size='72']){width:72px;height:72px}:host([size='96']){width:96px;height:96px}:host([size='96']) .default-icon,:host([size='120']) .default-icon,:host([size='128']) .default-icon,:host([size='96']) ::slotted(svg),:host([size='120']) ::slotted(svg),:host([size='128']) ::slotted(svg){width:48px;height:48px;font-size:48px}:host([size='120']),:host([size='128']){font-size:${fontSizeBase600}}:host([size='120']){width:120px;height:120px}:host([size='128']){width:128px;height:128px}:host([shape='square']){border-radius:${borderRadiusMedium}}:host([shape='square'][size='20']),:host([shape='square'][size='24']){border-radius:${borderRadiusSmall}}:host([shape='square'][size='56']),:host([shape='square'][size='64']),:host([shape='square'][size='72']){border-radius:${borderRadiusLarge}}:host([shape='square'][size='96']),:host([shape='square'][size='120']),:host([shape='square'][size='128']){border-radius:${borderRadiusXLarge}}:host([data-color='brand']){color:${colorNeutralForegroundStaticInverted};background-color:${colorBrandBackgroundStatic}}:host([data-color='dark-red']){color:${colorPaletteDarkRedForeground2};background-color:${colorPaletteDarkRedBackground2}}:host([data-color='cranberry']){color:${colorPaletteCranberryForeground2};background-color:${colorPaletteCranberryBackground2}}:host([data-color='red']){color:${colorPaletteRedForeground2};background-color:${colorPaletteRedBackground2}}:host([data-color='pumpkin']){color:${colorPalettePumpkinForeground2};background-color:${colorPalettePumpkinBackground2}}:host([data-color='peach']){color:${colorPalettePeachForeground2};background-color:${colorPalettePeachBackground2}}:host([data-color='marigold']){color:${colorPaletteMarigoldForeground2};background-color:${colorPaletteMarigoldBackground2}}:host([data-color='gold']){color:${colorPaletteGoldForeground2};background-color:${colorPaletteGoldBackground2}}:host([data-color='brass']){color:${colorPaletteBrassForeground2};background-color:${colorPaletteBrassBackground2}}:host([data-color='brown']){color:${colorPaletteBrownForeground2};background-color:${colorPaletteBrownBackground2}}:host([data-color='forest']){color:${colorPaletteForestForeground2};background-color:${colorPaletteForestBackground2}}:host([data-color='seafoam']){color:${colorPaletteSeafoamForeground2};background-color:${colorPaletteSeafoamBackground2}}:host([data-color='dark-green']){color:${colorPaletteDarkGreenForeground2};background-color:${colorPaletteDarkGreenBackground2}}:host([data-color='light-teal']){color:${colorPaletteLightTealForeground2};background-color:${colorPaletteLightTealBackground2}}:host([data-color='teal']){color:${colorPaletteTealForeground2};background-color:${colorPaletteTealBackground2}}:host([data-color='steel']){color:${colorPaletteSteelForeground2};background-color:${colorPaletteSteelBackground2}}:host([data-color='blue']){color:${colorPaletteBlueForeground2};background-color:${colorPaletteBlueBackground2}}:host([data-color='royal-blue']){color:${colorPaletteRoyalBlueForeground2};background-color:${colorPaletteRoyalBlueBackground2}}:host([data-color='cornflower']){color:${colorPaletteCornflowerForeground2};background-color:${colorPaletteCornflowerBackground2}}:host([data-color='navy']){color:${colorPaletteNavyForeground2};background-color:${colorPaletteNavyBackground2}}:host([data-color='lavender']){color:${colorPaletteLavenderForeground2};background-color:${colorPaletteLavenderBackground2}}:host([data-color='purple']){color:${colorPalettePurpleForeground2};background-color:${colorPalettePurpleBackground2}}:host([data-color='grape']){color:${colorPaletteGrapeForeground2};background-color:${colorPaletteGrapeBackground2}}:host([data-color='lilac']){color:${colorPaletteLilacForeground2};background-color:${colorPaletteLilacBackground2}}:host([data-color='pink']){color:${colorPalettePinkForeground2};background-color:${colorPalettePinkBackground2}}:host([data-color='magenta']){color:${colorPaletteMagentaForeground2};background-color:${colorPaletteMagentaBackground2}}:host([data-color='plum']){color:${colorPalettePlumForeground2};background-color:${colorPalettePlumBackground2}}:host([data-color='beige']){color:${colorPaletteBeigeForeground2};background-color:${colorPaletteBeigeBackground2}}:host([data-color='mink']){color:${colorPaletteMinkForeground2};background-color:${colorPaletteMinkBackground2}}:host([data-color='platinum']){color:${colorPalettePlatinumForeground2};background-color:${colorPalettePlatinumBackground2}}:host([data-color='anchor']){color:${colorPaletteAnchorForeground2};background-color:${colorPaletteAnchorBackground2}}:host([active]){transform:perspective(1px);transition-property:transform,opacity;transition-duration:${durationUltraSlow},${durationFaster};transition-delay:${animations.fastEase},${animations.nullEasing}}:host([active])::before{content:'';position:absolute;top:0;left:0;bottom:0;right:0;border-radius:inherit;transition-property:margin,opacity;transition-duration:${durationUltraSlow},${durationSlower};transition-delay:${animations.fastEase},${animations.nullEasing}}:host([active])::before{box-shadow:${shadow8};border-style:solid;border-color:${colorBrandBackgroundStatic}}:host([active][appearance='shadow'])::before{border-style:none;border-color:none}:host([active]:not([appearance='shadow']))::before{margin:calc(-2 * ${strokeWidthThick});border-width:${strokeWidthThick}}:host([size='56'][active]:not([appearance='shadow']))::before,:host([size='64'][active]:not([appearance='shadow']))::before{margin:calc(-2 * ${strokeWidthThicker});border-width:${strokeWidthThicker}}:host([size='72'][active]:not([appearance='shadow']))::before,:host([size='96'][active]:not([appearance='shadow']))::before,:host([size='120'][active]:not([appearance='shadow']))::before,:host([size='128'][active]:not([appearance='shadow']))::before{margin:calc(-2 * ${strokeWidthThickest});border-width:${strokeWidthThickest}}:host([size='20'][active][appearance])::before,:host([size='24'][active][appearance])::before,:host([size='28'][active][appearance])::before{box-shadow:${shadow4}}:host([size='56'][active][appearance])::before,:host([size='64'][active][appearance])::before{box-shadow:${shadow16}}:host([size='72'][active][appearance])::before,:host([size='96'][active][appearance])::before,:host([size='120'][active][appearance])::before,:host([size='128'][active][appearance])::before{box-shadow:${shadow28}}:host([active][appearance='ring'])::before{box-shadow:none}:host([active='inactive']){opacity:0.8;transform:scale(0.875);transition-property:transform,opacity;transition-duration:${durationUltraSlow},${durationFaster};transition-delay:${animations.fastOutSlowInMin},${animations.nullEasing}}:host([active='inactive'])::before{margin:0;opacity:0;transition-property:margin,opacity;transition-duration:${durationUltraSlow},${durationSlower};transition-delay:${animations.fastOutSlowInMin},${animations.nullEasing}}@media screen and (prefers-reduced-motion:reduce){:host([active]){transition-duration:0.01ms}:host([active])::before{transition-duration:0.01ms;transition-delay:0.01ms}}`;

const defaultIconTemplate = html`<svg width=1em height=1em viewBox="0 0 20 20" class=default-icon fill=currentcolor aria-hidden=true><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM7 6a3 3 0 116 0 3 3 0 01-6 0zm-2 5a2 2 0 00-2 2c0 1.7.83 2.97 2.13 3.8A9.14 9.14 0 0010 18c1.85 0 3.58-.39 4.87-1.2A4.35 4.35 0 0017 13a2 2 0 00-2-2H5zm-1 2a1 1 0 011-1h10a1 1 0 011 1c0 1.3-.62 2.28-1.67 2.95A8.16 8.16 0 0110 17a8.16 8.16 0 01-4.33-1.05A3.36 3.36 0 014 13z"></path></svg>`;
function avatarTemplate() {
  return html`<slot class=default-slot ${slotted("slottedDefaults")} ${ref("defaultSlot")}></slot><span class=monogram ${ref("monogram")}>${(x) => x.initials}</span> ${defaultIconTemplate}<slot name=badge></slot>`;
}
const template$C = avatarTemplate();

const definition$C = Avatar.compose({
  name: tagName$B,
  template: template$C,
  styles: styles$A
});

definition$C.define(FluentDesignSystem.registry);

const BadgeAppearance = {
  filled: "filled",
  ghost: "ghost",
  outline: "outline",
  tint: "tint"
};
const BadgeColor = {
  brand: "brand",
  danger: "danger",
  important: "important",
  informative: "informative",
  severe: "severe",
  subtle: "subtle",
  success: "success",
  warning: "warning"
};
const BadgeShape = {
  circular: "circular",
  rounded: "rounded",
  square: "square"
};
const BadgeSize = {
  tiny: "tiny",
  extraSmall: "extra-small",
  small: "small",
  medium: "medium",
  large: "large",
  extraLarge: "extra-large"
};
const tagName$A = `${FluentDesignSystem.prefix}-badge`;

var __defProp$H = Object.defineProperty;
var __getOwnPropDesc$H = Object.getOwnPropertyDescriptor;
var __decorateClass$H = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$H(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$H(target, key, result);
  return result;
};
class Badge extends FASTElement {
  constructor() {
    super(...arguments);
    this.appearance = BadgeAppearance.filled;
    this.color = BadgeColor.brand;
  }
}
__decorateClass$H([
  attr
], Badge.prototype, "appearance", 2);
__decorateClass$H([
  attr
], Badge.prototype, "color", 2);
__decorateClass$H([
  attr
], Badge.prototype, "shape", 2);
__decorateClass$H([
  attr
], Badge.prototype, "size", 2);
applyMixins(Badge, StartEnd);

const badgeBaseStyles = css.partial`${display("inline-flex")} :host{position:relative;box-sizing:border-box;align-items:center;justify-content:center;font-family:${fontFamilyBase};font-weight:${fontWeightSemibold};font-size:${fontSizeBase200};line-height:${lineHeightBase200};min-width:20px;height:20px;padding-inline:calc(${spacingHorizontalXS} + ${spacingHorizontalXXS});border-radius:${borderRadiusCircular};border-color:${colorTransparentStroke};background-color:${colorBrandBackground};color:${colorNeutralForegroundOnBrand};contain:content}::slotted(svg){font-size:12px}:host(:not([appearance='ghost']))::after{position:absolute;content:'';top:0;left:0;bottom:0;right:0;border-style:solid;border-width:${strokeWidthThin};border-color:inherit;border-radius:inherit}`;
const badgeSizeStyles = css.partial`:host([size='tiny']){width:6px;height:6px;font-size:4px;line-height:4px;padding-inline:0;min-width:unset}:host([size='tiny']) ::slotted(svg){font-size:6px}:host([size='extra-small']){width:10px;height:10px;font-size:6px;line-height:6px;padding-inline:0;min-width:unset}:host([size='extra-small']) ::slotted(svg){font-size:10px}:host([size='small']){min-width:16px;height:16px;font-size:${fontSizeBase100};line-height:${lineHeightBase100};padding-inline:calc(${spacingHorizontalXXS} + ${spacingHorizontalXXS})}:host([size='small']) ::slotted(svg){font-size:12px}:host([size='large']){min-width:24px;height:24px;font-size:${fontSizeBase200};line-height:${lineHeightBase200};padding-inline:calc(${spacingHorizontalXS} + ${spacingHorizontalXXS})}:host([size='large']) ::slotted(svg){font-size:16px}:host([size='extra-large']){min-width:32px;height:32px;font-size:${fontSizeBase200};line-height:${lineHeightBase200};padding-inline:calc(${spacingHorizontalSNudge} + ${spacingHorizontalXXS})}:host([size='extra-large']) ::slotted(svg){font-size:20px}`;
const badgeFilledStyles = css.partial`:host([color='danger']){background-color:${colorPaletteRedBackground3};color:${colorNeutralForegroundOnBrand}}:host([color='important']){background-color:${colorNeutralForeground1};color:${colorNeutralBackground1}}:host([color='informative']){background-color:${colorNeutralBackground5};color:${colorNeutralForeground3}}:host([color='severe']){background-color:${colorPaletteDarkOrangeBackground3};color:${colorNeutralForegroundOnBrand}}:host([color='subtle']){background-color:${colorNeutralBackground1};color:${colorNeutralForeground1}}:host([color='success']){background-color:${colorPaletteGreenBackground3};color:${colorNeutralForegroundOnBrand}}:host([color='warning']){background-color:${colorPaletteYellowBackground3};color:${colorNeutralForeground1Static}}`;
const badgeGhostStyles = css.partial`:host([appearance='ghost']){color:${colorBrandForeground1};background-color:initial}:host([appearance='ghost'][color='danger']){color:${colorPaletteRedForeground3}}:host([appearance='ghost'][color='important']){color:${colorNeutralForeground1}}:host([appearance='ghost'][color='informative']){color:${colorNeutralForeground3}}:host([appearance='ghost'][color='severe']){color:${colorPaletteDarkOrangeForeground3}}:host([appearance='ghost'][color='subtle']){color:${colorNeutralForegroundInverted}}:host([appearance='ghost'][color='success']){color:${colorPaletteGreenForeground3}}:host([appearance='ghost'][color='warning']){color:${colorPaletteYellowForeground2}}`;
const badgeOutlineStyles = css.partial`:host([appearance='outline']){border-color:currentColor;color:${colorBrandForeground1};background-color:initial}:host([appearance='outline'][color='danger']){color:${colorPaletteRedForeground3}}:host([appearance='outline'][color='important']){color:${colorNeutralForeground3};border-color:${colorNeutralStrokeAccessible}}:host([appearance='outline'][color='informative']){color:${colorNeutralForeground3};border-color:${colorNeutralStroke2}}:host([appearance='outline'][color='severe']){color:${colorPaletteDarkOrangeForeground3}}:host([appearance='outline'][color='subtle']){color:${colorNeutralForegroundStaticInverted}}:host([appearance='outline'][color='success']){color:${colorPaletteGreenForeground2}}:host([appearance='outline'][color='warning']){color:${colorPaletteYellowForeground2}}`;
const badgeTintStyles = css.partial`:host([appearance='tint']){background-color:${colorBrandBackground2};color:${colorBrandForeground2};border-color:${colorBrandStroke2}}:host([appearance='tint'][color='danger']){background-color:${colorPaletteRedBackground1};color:${colorPaletteRedForeground1};border-color:${colorPaletteRedBorder1}}:host([appearance='tint'][color='important']){background-color:${colorNeutralForeground3};color:${colorNeutralBackground1};border-color:${colorTransparentStroke}}:host([appearance='tint'][color='informative']){background-color:${colorNeutralBackground4};color:${colorNeutralForeground3};border-color:${colorNeutralStroke2}}:host([appearance='tint'][color='severe']){background-color:${colorPaletteDarkOrangeBackground1};color:${colorPaletteDarkOrangeForeground1};border-color:${colorPaletteDarkOrangeBorder1}}:host([appearance='tint'][color='subtle']){background-color:${colorNeutralBackground1};color:${colorNeutralForeground3};border-color:${colorNeutralStroke2}}:host([appearance='tint'][color='success']){background-color:${colorPaletteGreenBackground1};color:${colorPaletteGreenForeground1};border-color:${colorPaletteGreenBorder2}}:host([appearance='tint'][color='warning']){background-color:${colorPaletteYellowBackground1};color:${colorPaletteYellowForeground2};border-color:${colorPaletteYellowBorder1}}`;

const styles$z = css`:host([shape='square']){border-radius:${borderRadiusNone}}:host([shape='rounded']){border-radius:${borderRadiusMedium}}:host([shape='rounded']:is([size='tiny'],[size='extra-small'],[size='small'])){border-radius:${borderRadiusSmall}}${badgeTintStyles} ${badgeOutlineStyles} ${badgeGhostStyles} ${badgeFilledStyles} ${badgeSizeStyles} ${badgeBaseStyles} @media (forced-colors:active){:host,:host([appearance='outline']),:host([appearance='tint']){border-color:CanvasText}}`;

function badgeTemplate(options = {}) {
  return html`${startSlotTemplate(options)}<slot>${staticallyCompose(options.defaultContent)}</slot>${endSlotTemplate(options)}`;
}
const template$B = badgeTemplate();

const definition$B = Badge.compose({
  name: tagName$A,
  template: template$B,
  styles: styles$z
});

definition$B.define(FluentDesignSystem.registry);

var __defProp$G = Object.defineProperty;
var __getOwnPropDesc$G = Object.getOwnPropertyDescriptor;
var __decorateClass$G = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$G(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$G(target, key, result);
  return result;
};
class BaseButton extends FASTElement {
  constructor() {
    super();
    this.disabledFocusable = false;
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "button";
  }
  /**
   * Handles changes to the disabled attribute. If the button is disabled, it
   * should not be focusable.
   *
   * @param previous - the previous disabled value
   * @param next - the new disabled value
   * @internal
   */
  disabledChanged() {
    this.setTabIndex();
  }
  /**
   * Sets the element's internal disabled state when the element is focusable while disabled.
   *
   * @param previous - the previous disabledFocusable value
   * @param next - the current disabledFocusable value
   * @internal
   */
  disabledFocusableChanged(previous, next) {
    if (this.elementInternals) {
      this.elementInternals.ariaDisabled = `${!!next}`;
    }
  }
  /**
   * The associated form element.
   *
   * @public
   */
  get form() {
    return this.elementInternals.form;
  }
  /**
   * A reference to all associated label elements.
   *
   * @public
   */
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  /**
   * Removes the form submission fallback control when the type changes.
   *
   * @param previous - the previous type value
   * @param next - the new type value
   * @internal
   */
  typeChanged(previous, next) {
    if (next !== ButtonType.submit) {
      this.formSubmissionFallbackControl?.remove();
      this.shadowRoot?.querySelector('slot[name="internal"]')?.remove();
    }
  }
  /**
   * Handles the button click event.
   *
   * @param e - The event object
   * @internal
   */
  clickHandler(e) {
    if (e && this.disabledFocusable) {
      e.stopImmediatePropagation();
      return;
    }
    this.press();
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.elementInternals.ariaDisabled = `${!!this.disabledFocusable}`;
    this.setTabIndex();
  }
  /**
   * This fallback creates a new slot, then creates a submit button to mirror the custom element's
   * properties. The submit button is then appended to the slot and the form is submitted.
   *
   * @internal
   * @privateRemarks
   * This is a workaround until {@link https://github.com/WICG/webcomponents/issues/814 | WICG/webcomponents/issues/814} is resolved.
   */
  createAndInsertFormSubmissionFallbackControl() {
    const internalSlot = this.formSubmissionFallbackControlSlot ?? document.createElement("slot");
    internalSlot.setAttribute("name", "internal");
    this.shadowRoot?.appendChild(internalSlot);
    this.formSubmissionFallbackControlSlot = internalSlot;
    const fallbackControl = this.formSubmissionFallbackControl ?? document.createElement("button");
    fallbackControl.style.display = "none";
    fallbackControl.setAttribute("type", "submit");
    fallbackControl.setAttribute("slot", "internal");
    if (this.formNoValidate) {
      fallbackControl.toggleAttribute("formnovalidate", true);
    }
    if (this.elementInternals.form?.id) {
      fallbackControl.setAttribute("form", this.elementInternals.form.id);
    }
    if (this.name) {
      fallbackControl.setAttribute("name", this.name);
    }
    if (this.value) {
      fallbackControl.setAttribute("value", this.value);
    }
    if (this.formAction) {
      fallbackControl.setAttribute("formaction", this.formAction ?? "");
    }
    if (this.formEnctype) {
      fallbackControl.setAttribute("formenctype", this.formEnctype ?? "");
    }
    if (this.formMethod) {
      fallbackControl.setAttribute("formmethod", this.formMethod ?? "");
    }
    if (this.formTarget) {
      fallbackControl.setAttribute("formtarget", this.formTarget ?? "");
    }
    this.append(fallbackControl);
    this.formSubmissionFallbackControl = fallbackControl;
  }
  /**
   * Invoked when a connected component's form or fieldset has its disabled state changed.
   *
   * @param disabled - the disabled value of the form / fieldset
   *
   * @internal
   */
  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }
  /**
   * Handles keypress events for the button.
   *
   * @param e - the keyboard event
   * @returns - the return value of the click handler
   * @public
   */
  keypressHandler(e) {
    if (e && this.disabledFocusable) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      this.click();
      return;
    }
    return true;
  }
  /**
   * Presses the button.
   *
   * @public
   */
  press() {
    switch (this.type) {
      case ButtonType.reset: {
        this.resetForm();
        break;
      }
      case ButtonType.submit: {
        this.submitForm();
        break;
      }
    }
  }
  /**
   * Resets the associated form.
   *
   * @public
   */
  resetForm() {
    this.elementInternals.form?.reset();
  }
  /**
   * Sets the `tabindex` attribute based on the disabled state of the button.
   *
   * @internal
   */
  setTabIndex() {
    if (this.disabled) {
      this.removeAttribute("tabindex");
      return;
    }
    this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0;
  }
  /**
   * Submits the associated form.
   *
   * @internal
   */
  submitForm() {
    if (!this.elementInternals.form || this.disabled || this.type !== ButtonType.submit) {
      return;
    }
    if (!this.name && !this.formAction && !this.formEnctype && !this.formAttribute && !this.formMethod && !this.formNoValidate && !this.formTarget) {
      this.elementInternals.form.requestSubmit();
      return;
    }
    try {
      this.elementInternals.setFormValue(this.value ?? "");
      this.elementInternals.form.requestSubmit(this);
    } catch (e) {
      this.createAndInsertFormSubmissionFallbackControl();
      this.elementInternals.setFormValue(null);
      this.elementInternals.form.requestSubmit(this.formSubmissionFallbackControl);
    }
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
BaseButton.formAssociated = true;
__decorateClass$G([
  attr({ mode: "boolean" })
], BaseButton.prototype, "autofocus", 2);
__decorateClass$G([
  observable
], BaseButton.prototype, "defaultSlottedContent", 2);
__decorateClass$G([
  attr({ mode: "boolean" })
], BaseButton.prototype, "disabled", 2);
__decorateClass$G([
  attr({ attribute: "disabled-focusable", mode: "boolean" })
], BaseButton.prototype, "disabledFocusable", 2);
__decorateClass$G([
  attr({ attribute: "formaction" })
], BaseButton.prototype, "formAction", 2);
__decorateClass$G([
  attr({ attribute: "form" })
], BaseButton.prototype, "formAttribute", 2);
__decorateClass$G([
  attr({ attribute: "formenctype" })
], BaseButton.prototype, "formEnctype", 2);
__decorateClass$G([
  attr({ attribute: "formmethod" })
], BaseButton.prototype, "formMethod", 2);
__decorateClass$G([
  attr({ attribute: "formnovalidate", mode: "boolean" })
], BaseButton.prototype, "formNoValidate", 2);
__decorateClass$G([
  attr({ attribute: "formtarget" })
], BaseButton.prototype, "formTarget", 2);
__decorateClass$G([
  attr
], BaseButton.prototype, "name", 2);
__decorateClass$G([
  attr
], BaseButton.prototype, "type", 2);
__decorateClass$G([
  attr
], BaseButton.prototype, "value", 2);

var __defProp$F = Object.defineProperty;
var __getOwnPropDesc$F = Object.getOwnPropertyDescriptor;
var __decorateClass$F = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$F(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$F(target, key, result);
  return result;
};
class Button extends BaseButton {
  constructor() {
    super(...arguments);
    this.iconOnly = false;
  }
}
__decorateClass$F([
  attr
], Button.prototype, "appearance", 2);
__decorateClass$F([
  attr
], Button.prototype, "shape", 2);
__decorateClass$F([
  attr
], Button.prototype, "size", 2);
__decorateClass$F([
  attr({ attribute: "icon-only", mode: "boolean" })
], Button.prototype, "iconOnly", 2);
applyMixins(Button, StartEnd);

function buttonTemplate$1(options = {}) {
  return html`<template @click=${(x, c) => x.clickHandler(c.event)} @keypress=${(x, c) => x.keypressHandler(c.event)}>${startSlotTemplate(options)} <span class=content part=content><slot ${slotted("defaultSlottedContent")}></slot></span>${endSlotTemplate(options)}</template>`;
}
const template$A = buttonTemplate$1();

const definition$A = Button.compose({
  name: tagName$D,
  template: template$A,
  styles: styles$C
});

definition$A.define(FluentDesignSystem.registry);

const CheckboxShape = {
  circular: "circular",
  square: "square"
};
const CheckboxSize = {
  medium: "medium",
  large: "large"
};
const tagName$z = `${FluentDesignSystem.prefix}-checkbox`;

var __defProp$E = Object.defineProperty;
var __getOwnPropDesc$E = Object.getOwnPropertyDescriptor;
var __decorateClass$E = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$E(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$E(target, key, result);
  return result;
};
class BaseCheckbox extends FASTElement {
  constructor() {
    super(...arguments);
    this.initialValue = "on";
    /**
     * Tracks whether the space key was pressed down while the checkbox was focused.
     * This is used to prevent inadvertently checking a required, unchecked checkbox when the space key is pressed on a
     * submit button and field validation is triggered.
     *
     * @internal
     */
    this._keydownPressed = false;
    /**
     * Indicates that the checked state has been changed by the user.
     *
     * @internal
     */
    this.dirtyChecked = false;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * The fallback validation message, taken from a native checkbox `<input>` element.
     *
     * @internal
     */
    this._validationFallbackMessage = "";
    /**
     * The internal value of the input.
     *
     * @internal
     */
    this._value = this.initialValue;
  }
  /**
   * The element's current checked state.
   *
   * @public
   */
  get checked() {
    Observable.track(this, "checked");
    return !!this._checked;
  }
  set checked(next) {
    this._checked = next;
    this.setFormValue(next ? this.value : null);
    this.setValidity();
    this.setAriaChecked();
    toggleState(this.elementInternals, "checked", next);
    Observable.notify(this, "checked");
  }
  /**
   * Toggles the disabled state when the user changes the `disabled` property.
   *
   * @internal
   */
  disabledChanged(prev, next) {
    if (this.disabled) {
      this.removeAttribute("tabindex");
    } else {
      this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0;
    }
    this.elementInternals.ariaDisabled = this.disabled ? "true" : "false";
    toggleState(this.elementInternals, "disabled", this.disabled);
  }
  /**
   * Sets the disabled state when the `disabled` attribute changes.
   *
   * @param prev - the previous value
   * @param next - the current value
   * @internal
   */
  disabledAttributeChanged(prev, next) {
    this.disabled = !!next;
  }
  /**
   * Updates the checked state when the `checked` attribute is changed, unless the checked state has been changed by the user.
   *
   * @param prev - The previous initial checked state
   * @param next - The current initial checked state
   * @internal
   */
  initialCheckedChanged(prev, next) {
    if (!this.dirtyChecked) {
      this.checked = !!next;
    }
  }
  /**
   * Sets the value of the input when the `value` attribute changes.
   *
   * @param prev - The previous initial value
   * @param next - The current initial value
   * @internal
   */
  initialValueChanged(prev, next) {
    this._value = next;
  }
  /**
   * Sets the validity of the control when the required state changes.
   *
   * @param prev - The previous required state
   * @param next - The current required state
   * @internal
   */
  requiredChanged(prev, next) {
    if (this.$fastController.isConnected) {
      this.setValidity();
      this.elementInternals.ariaRequired = this.required ? "true" : "false";
    }
  }
  /**
   * The associated `<form>` element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
   */
  get form() {
    return this.elementInternals.form;
  }
  /**
   * A reference to all associated `<label>` elements.
   *
   * @public
   */
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  /**
   * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
   * specified (e.g., via `setCustomValidity`).
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
   */
  get validationMessage() {
    if (this.elementInternals.validationMessage) {
      return this.elementInternals.validationMessage;
    }
    if (!this._validationFallbackMessage) {
      const validationMessageFallbackControl = document.createElement("input");
      validationMessageFallbackControl.type = "checkbox";
      validationMessageFallbackControl.required = true;
      validationMessageFallbackControl.checked = false;
      this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
    }
    return this._validationFallbackMessage;
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The current value of the input.
   *
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this._value;
  }
  set value(value) {
    this._value = value;
    if (this.$fastController.isConnected) {
      this.setFormValue(value);
      this.setValidity();
      Observable.notify(this, "value");
    }
  }
  /**
   * Determines if the control can be submitted for constraint validation.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
   */
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  /**
   * Checks the validity of the element and returns the result.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Toggles the checked state when the user clicks the element.
   *
   * @param e - the event object
   * @internal
   */
  clickHandler(e) {
    if (this.disabled) {
      return;
    }
    this.dirtyChecked = true;
    const previousChecked = this.checked;
    this.toggleChecked();
    if (previousChecked !== this.checked) {
      this.$emit("change");
      this.$emit("input");
    }
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.disabled = !!this.disabledAttribute;
    this.setAriaChecked();
    this.setValidity();
  }
  /**
   * Updates the form value when a user changes the `checked` state.
   *
   * @param e - the event object
   * @internal
   */
  inputHandler(e) {
    this.setFormValue(this.value);
    this.setValidity();
    return true;
  }
  /**
   * Prevents scrolling when the user presses the space key, and sets a flag to indicate that the space key was pressed
   * down while the checkbox was focused.
   *
   * @param e - the event object
   * @internal
   */
  keydownHandler(e) {
    if (e.key !== " ") {
      return true;
    }
    this._keydownPressed = true;
  }
  /**
   * Toggles the checked state when the user releases the space key.
   *
   * @param e - the event object
   * @internal
   */
  keyupHandler(e) {
    if (!this._keydownPressed || e.key !== " ") {
      return true;
    }
    this._keydownPressed = false;
    this.click();
  }
  /**
   * Resets the form value to its initial value when the form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.checked = this.initialChecked ?? false;
    this.dirtyChecked = false;
    this.setValidity();
  }
  /**
   * Reports the validity of the element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Sets the ARIA checked state.
   *
   * @param value - The checked state
   * @internal
   */
  setAriaChecked(value = this.checked) {
    this.elementInternals.ariaChecked = value ? "true" : "false";
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    this.elementInternals.setFormValue(value, value ?? state);
  }
  /**
   * Sets a custom validity message.
   *
   * @param message - The message to set
   * @public
   */
  setCustomValidity(message) {
    this.elementInternals.setValidity({ customError: true }, message);
    this.setValidity();
  }
  /**
   * Sets the validity of the control.
   *
   * @param flags - Validity flags to set.
   * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
   * @param anchor - Optional anchor to use for the validation message.
   *
   * @internal
   */
  setValidity(flags, message, anchor) {
    if (this.$fastController.isConnected) {
      if (this.disabled || !this.required) {
        this.elementInternals.setValidity({});
        return;
      }
      this.elementInternals.setValidity(
        { valueMissing: !!this.required && !this.checked, ...flags },
        message ?? this.validationMessage,
        anchor
      );
    }
  }
  /**
   * Toggles the checked state of the control.
   *
   * @param force - Forces the element to be checked or unchecked
   * @public
   */
  toggleChecked(force = !this.checked) {
    this.checked = force;
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
BaseCheckbox.formAssociated = true;
__decorateClass$E([
  attr({ mode: "boolean" })
], BaseCheckbox.prototype, "autofocus", 2);
__decorateClass$E([
  observable
], BaseCheckbox.prototype, "disabled", 2);
__decorateClass$E([
  attr({ attribute: "disabled", mode: "boolean" })
], BaseCheckbox.prototype, "disabledAttribute", 2);
__decorateClass$E([
  attr({ attribute: "form" })
], BaseCheckbox.prototype, "formAttribute", 2);
__decorateClass$E([
  attr({ attribute: "checked", mode: "boolean" })
], BaseCheckbox.prototype, "initialChecked", 2);
__decorateClass$E([
  attr({ attribute: "value", mode: "fromView" })
], BaseCheckbox.prototype, "initialValue", 2);
__decorateClass$E([
  attr
], BaseCheckbox.prototype, "name", 2);
__decorateClass$E([
  attr({ mode: "boolean" })
], BaseCheckbox.prototype, "required", 2);

var __defProp$D = Object.defineProperty;
var __getOwnPropDesc$D = Object.getOwnPropertyDescriptor;
var __decorateClass$D = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$D(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$D(target, key, result);
  return result;
};
class Checkbox extends BaseCheckbox {
  /**
   * Updates the indeterminate state when the `indeterminate` property changes.
   *
   * @param prev - the indeterminate state
   * @param next - the current indeterminate state
   * @internal
   */
  indeterminateChanged(prev, next) {
    this.setAriaChecked();
    toggleState(this.elementInternals, "indeterminate", next);
  }
  constructor() {
    super();
    this.elementInternals.role = "checkbox";
  }
  /**
   * Sets the ARIA checked state. If the `indeterminate` flag is true, the value will be 'mixed'.
   *
   * @internal
   * @override
   */
  setAriaChecked(value = this.checked) {
    if (this.indeterminate) {
      this.elementInternals.ariaChecked = "mixed";
      return;
    }
    super.setAriaChecked(value);
  }
  /**
   * Toggles the checked state of the control.
   *
   * @param force - Forces the element to be checked or unchecked
   * @public
   */
  toggleChecked(force = !this.checked) {
    this.indeterminate = false;
    super.toggleChecked(force);
  }
}
__decorateClass$D([
  observable
], Checkbox.prototype, "indeterminate", 2);
__decorateClass$D([
  attr
], Checkbox.prototype, "shape", 2);
__decorateClass$D([
  attr
], Checkbox.prototype, "size", 2);

const activeState = stateSelector("active");
const badInputState = stateSelector("bad-input");
const checkedState = stateSelector("checked");
const customErrorState = stateSelector("custom-error");
const descriptionState = stateSelector("description");
const disabledState = stateSelector("disabled");
stateSelector("error");
const flipBlockState = stateSelector("flip-block");
const focusVisibleState = stateSelector("focus-visible");
stateSelector("has-message");
const indeterminateState = stateSelector("indeterminate");
const multipleState = stateSelector("multiple");
const openState = stateSelector("open");
const patternMismatchState = stateSelector("pattern-mismatch");
const placeholderShownState = stateSelector("placeholder-shown");
const pressedState = stateSelector("pressed");
const rangeOverflowState = stateSelector("range-overflow");
const rangeUnderflowState = stateSelector("range-underflow");
const requiredState = stateSelector("required");
const selectedState = stateSelector("selected");
const stepMismatchState = stateSelector("step-mismatch");
const submenuState = stateSelector("submenu");
const tooLongState = stateSelector("too-long");
const tooShortState = stateSelector("too-short");
const typeMismatchState = stateSelector("type-mismatch");
const userInvalidState = stateSelector("user-invalid");
const validState = stateSelector("valid");
const valueMissingState = stateSelector("value-missing");

const styles$y = css`${display("inline-flex")} :host{--size:16px;background-color:${colorNeutralBackground1};border-radius:${borderRadiusSmall};border:${strokeWidthThin} solid ${colorNeutralStrokeAccessible};box-sizing:border-box;cursor:pointer;position:relative;width:var(--size)}:host,.indeterminate-indicator,.checked-indicator{aspect-ratio:1}:host(:hover){border-color:${colorNeutralStrokeAccessibleHover}}:host(:active){border-color:${colorNeutralStrokeAccessiblePressed}}:host(${checkedState}:hover){background-color:${colorCompoundBrandBackgroundHover};border-color:${colorCompoundBrandStrokeHover}}:host(${checkedState}:active){background-color:${colorCompoundBrandBackgroundPressed};border-color:${colorCompoundBrandStrokePressed}}:host(:focus-visible){outline:none}:host(:not([slot='input']))::after{content:'';position:absolute;inset:-8px;box-sizing:border-box;outline:none;border:${strokeWidthThick} solid ${colorTransparentStroke};border-radius:${borderRadiusMedium}}:host(:not([slot='input']):focus-visible)::after{border-color:${colorStrokeFocus2}}.indeterminate-indicator,.checked-indicator{color:${colorNeutralForegroundInverted};inset:0;margin:auto;position:absolute}::slotted([slot='checked-indicator']),.checked-indicator{fill:currentColor;display:inline-flex;flex:1 0 auto;width:12px}:host(:not(${checkedState})) *:is(::slotted([slot='checked-indicator']),.checked-indicator){display:none}:host(${checkedState}),:host(${indeterminateState}){border-color:${colorCompoundBrandStroke}}:host(${checkedState}),:host(${indeterminateState}) .indeterminate-indicator{background-color:${colorCompoundBrandBackground}}:host(${indeterminateState}) .indeterminate-indicator{border-radius:${borderRadiusSmall};position:absolute;width:calc(var(--size)/2);inset:0}:host([size='large']){--size:20px}:host([size='large']) ::slotted([slot='checked-indicator']),:host([size='large']) .checked-indicator{width:16px}:host([shape='circular']),:host([shape='circular']) .indeterminate-indicator{border-radius:${borderRadiusCircular}}:host([disabled]),:host([disabled]${checkedState}){background-color:${colorNeutralBackgroundDisabled};border-color:${colorNeutralStrokeDisabled}}:host([disabled]){cursor:unset}:host([disabled]${indeterminateState}) .indeterminate-indicator{background-color:${colorNeutralStrokeDisabled}}:host([disabled]${checkedState}) .checked-indicator{color:${colorNeutralStrokeDisabled}}@media (forced-colors:active){:host{border-color:FieldText}:host(:not([slot='input']:focus-visible))::after{border-color:Canvas}:host(:not([disabled]):hover),:host(${checkedState}:not([disabled]):hover),:host(:not([slot='input']):focus-visible)::after{border-color:Highlight}.indeterminate-indicator,.checked-indicator{color:HighlightText}:host(${checkedState}),:host(${indeterminateState}) .indeterminate-indicator{background-color:FieldText}:host(${checkedState}:not([disabled]):hover),:host(${indeterminateState}:not([disabled]):hover) .indeterminate-indicator{background-color:Highlight}:host([disabled]){border-color:GrayText}:host([disabled]${indeterminateState}) .indeterminate-indicator{background-color:GrayText}:host([disabled]),:host([disabled]${checkedState}) .checked-indicator{color:GrayText}}`;

const checkedIndicator$2 = html.partial(
  /* html */
  `<svg fill=currentColor aria-hidden=true class=checked-indicator width=1em height=1em viewBox="0 0 12 12" xmlns=http://www.w3.org/2000/svg><path d="M9.76 3.2c.3.29.32.76.04 1.06l-4.25 4.5a.75.75 0 0 1-1.08.02L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.7 1.7L8.7 3.24a.75.75 0 0 1 1.06-.04Z" fill=currentColor></path></svg>`
);
const indeterminateIndicator = html.partial(
  /* html */
  `<span class=indeterminate-indicator></span>`
);
function checkboxTemplate(options = {}) {
  return html`<template @click=${(x, c) => x.clickHandler(c.event)} @input=${(x, c) => x.inputHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)} @keyup=${(x, c) => x.keyupHandler(c.event)}><slot name=checked-indicator>${staticallyCompose(options.checkedIndicator)}</slot><slot name=indeterminate-indicator>${staticallyCompose(options.indeterminateIndicator)}</slot></template>`;
}
const template$z = checkboxTemplate({
  checkedIndicator: checkedIndicator$2,
  indeterminateIndicator
});

const definition$z = Checkbox.compose({
  name: tagName$z,
  template: template$z,
  styles: styles$y
});

definition$z.define(FluentDesignSystem.registry);

const CompoundButtonAppearance = ButtonAppearance;
const CompoundButtonShape = ButtonShape;
const CompoundButtonSize = ButtonSize;
const tagName$y = `${FluentDesignSystem.prefix}-compound-button`;

class CompoundButton extends Button {
}

const styles$x = css`${styles$C} :host,:host(:is([size])){gap:12px;height:auto;padding-top:14px;padding-inline:12px;padding-bottom:16px;font-size:${fontSizeBase300};line-height:${lineHeightBase300}}.content{display:flex;flex-direction:column;text-align:start}::slotted([slot='description']){color:${colorNeutralForeground2};line-height:100%;font-size:${fontSizeBase200};font-weight:${fontWeightRegular}}::slotted(svg),:host([size='large']) ::slotted(svg){font-size:40px;height:40px;width:40px}:host(:hover) ::slotted([slot='description']){color:${colorNeutralForeground2Hover}}:host(:active) ::slotted([slot='description']){color:${colorNeutralForeground2Pressed}}:host(:is([appearance='primary'],[appearance='primary']:is(:hover,:active))) ::slotted([slot='description']){color:${colorNeutralForegroundOnBrand}}:host(:is([appearance='transparent'],[appearance='subtle'],[appearance='subtle']:is(:hover,:active))) ::slotted([slot='description']){color:${colorNeutralForeground2}}:host([appearance='transparent']:hover) ::slotted([slot='description']){color:${colorNeutralForeground2BrandHover}}:host([appearance='transparent']:active) ::slotted([slot='description']){color:${colorNeutralForeground2BrandPressed}}:host(:is(:disabled,:disabled[appearance],[disabled-focusable],[disabled-focusable][appearance])) ::slotted([slot='description']){color:${colorNeutralForegroundDisabled}}:host([size='small']){padding:8px;padding-bottom:10px}:host([icon-only]){min-width:52px;max-width:52px;padding:${spacingHorizontalSNudge}}:host([icon-only][size='small']){min-width:48px;max-width:48px;padding:${spacingHorizontalXS}}:host([icon-only][size='large']){min-width:56px;max-width:56px;padding:${spacingHorizontalS}}:host([size='large']){padding-top:18px;padding-inline:16px;padding-bottom:20px;font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host([size='large']) ::slotted([slot='description']){font-size:${fontSizeBase300}}@media (forced-colors:active){:host([appearance='primary']:not(:hover,:focus-visible,:disabled,[disabled-focusable])) ::slotted([slot='description']){color:HighlightText}}`;

function buttonTemplate(options = {}) {
  return html`<template ?disabled=${(x) => x.disabled} tabindex=${(x) => x.disabled ? null : x.tabIndex ?? 0}>${startSlotTemplate(options)} <span class=content part=content><slot ${slotted("defaultSlottedContent")}></slot><slot name=description></slot></span>${endSlotTemplate(options)}</template>`;
}
const template$y = buttonTemplate();

const definition$y = CompoundButton.compose({
  name: tagName$y,
  template: template$y,
  styles: styles$x
});

definition$y.define(FluentDesignSystem.registry);

const CounterBadgeAppearance = {
  filled: "filled",
  ghost: "ghost"
};
const CounterBadgeColor = {
  brand: "brand",
  danger: "danger",
  important: "important",
  informative: "informative",
  severe: "severe",
  subtle: "subtle",
  success: "success",
  warning: "warning"
};
const CounterBadgeShape = {
  circular: "circular",
  rounded: "rounded"
};
const CounterBadgeSize = {
  tiny: "tiny",
  extraSmall: "extra-small",
  small: "small",
  medium: "medium",
  large: "large",
  extraLarge: "extra-large"
};
const tagName$x = `${FluentDesignSystem.prefix}-counter-badge`;

var __defProp$C = Object.defineProperty;
var __getOwnPropDesc$C = Object.getOwnPropertyDescriptor;
var __decorateClass$C = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$C(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$C(target, key, result);
  return result;
};
class CounterBadge extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.count = 0;
    this.overflowCount = 99;
    this.showZero = false;
    this.dot = false;
  }
  countChanged() {
    this.setCount();
  }
  overflowCountChanged() {
    this.setCount();
  }
  /**
   * Function to set the count
   * This is the default slotted content for the counter badge
   * If children are slotted, that will override the value returned
   *
   * @internal
   */
  setCount() {
    const count = this.count ?? 0;
    if ((count !== 0 || this.showZero) && !this.dot) {
      return count > this.overflowCount ? `${this.overflowCount}+` : `${count}`;
    }
    return;
  }
}
__decorateClass$C([
  attr
], CounterBadge.prototype, "appearance", 2);
__decorateClass$C([
  attr
], CounterBadge.prototype, "color", 2);
__decorateClass$C([
  attr
], CounterBadge.prototype, "shape", 2);
__decorateClass$C([
  attr
], CounterBadge.prototype, "size", 2);
__decorateClass$C([
  attr({ converter: nullableNumberConverter })
], CounterBadge.prototype, "count", 2);
__decorateClass$C([
  attr({ attribute: "overflow-count", converter: nullableNumberConverter })
], CounterBadge.prototype, "overflowCount", 2);
__decorateClass$C([
  attr({ attribute: "show-zero", mode: "boolean" })
], CounterBadge.prototype, "showZero", 2);
__decorateClass$C([
  attr({ mode: "boolean" })
], CounterBadge.prototype, "dot", 2);
applyMixins(CounterBadge, StartEnd);

const styles$w = css`:host([shape='rounded']){border-radius:${borderRadiusMedium}}:host([shape='rounded']:is([size='tiny'],[size='extra-small'],[size='small'])){border-radius:${borderRadiusSmall}}${badgeSizeStyles} ${badgeFilledStyles} ${badgeGhostStyles} ${badgeBaseStyles} :host(:is([dot],[dot][appearance][size])){min-width:auto;width:6px;height:6px;padding:0}`;

function composeTemplate(options = {}) {
  return badgeTemplate({
    defaultContent: html`${(x) => x.setCount()}`
  });
}
const template$x = composeTemplate();

const definition$x = CounterBadge.compose({
  name: tagName$x,
  template: template$x,
  styles: styles$w
});

definition$x.define(FluentDesignSystem.registry);

const DialogType = {
  modal: "modal",
  nonModal: "non-modal",
  alert: "alert"
};
function isDialog(element, tagName2 = "-dialog") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const tagName$w = `${FluentDesignSystem.prefix}-dialog`;

var __defProp$B = Object.defineProperty;
var __getOwnPropDesc$B = Object.getOwnPropertyDescriptor;
var __decorateClass$B = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$B(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$B(target, key, result);
  return result;
};
class Dialog extends FASTElement {
  constructor() {
    super(...arguments);
    this.type = DialogType.modal;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    this.emitBeforeToggle = () => {
      this.$emit("beforetoggle", {
        oldState: this.dialog.open ? "open" : "closed",
        newState: this.dialog.open ? "closed" : "open"
      });
    };
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    this.emitToggle = () => {
      this.$emit("toggle", {
        oldState: this.dialog.open ? "closed" : "open",
        newState: this.dialog.open ? "open" : "closed"
      });
    };
  }
  dialogChanged() {
    this.updateDialogAttributes();
  }
  typeChanged(prev, next) {
    this.updateDialogAttributes();
  }
  /**
   * Method to show the dialog
   *
   * @public
   */
  show() {
    Updates.enqueue(() => {
      this.emitBeforeToggle();
      if (this.type === DialogType.alert || this.type === DialogType.modal) {
        this.dialog.showModal();
      } else if (this.type === DialogType.nonModal) {
        this.dialog.show();
      }
      this.emitToggle();
    });
  }
  /**
   * Method to hide the dialog
   *
   * @public
   */
  hide() {
    this.emitBeforeToggle();
    this.dialog.close();
    this.emitToggle();
  }
  /**
   * Handles click events on the dialog overlay for light-dismiss
   *
   * @public
   * @param event - The click event
   * @returns boolean
   */
  clickHandler(event) {
    if (this.dialog.open && this.type !== DialogType.alert && event.target === this.dialog) {
      this.hide();
    }
    return true;
  }
  /**
   * Updates the internal dialog element's attributes based on its type.
   *
   * @internal
   */
  updateDialogAttributes() {
    if (!this.dialog) {
      return;
    }
    if (this.type === DialogType.alert) {
      this.dialog.setAttribute("role", "alertdialog");
    } else {
      this.dialog.removeAttribute("role");
    }
    if (this.type !== DialogType.nonModal) {
      this.dialog.setAttribute("aria-modal", "true");
    } else {
      this.dialog.removeAttribute("aria-modal");
    }
  }
}
__decorateClass$B([
  observable
], Dialog.prototype, "dialog", 2);
__decorateClass$B([
  attr({ attribute: "aria-describedby" })
], Dialog.prototype, "ariaDescribedby", 2);
__decorateClass$B([
  attr({ attribute: "aria-labelledby" })
], Dialog.prototype, "ariaLabelledby", 2);
__decorateClass$B([
  attr({ attribute: "aria-label" })
], Dialog.prototype, "ariaLabel", 2);
__decorateClass$B([
  attr
], Dialog.prototype, "type", 2);

const template$w = html`<dialog class=dialog part=dialog aria-describedby=${(x) => x.ariaDescribedby} aria-labelledby=${(x) => x.ariaLabelledby} aria-label=${(x) => x.ariaLabel} @click=${(x, c) => x.clickHandler(c.event)} @cancel=${(x) => x.hide()} ${ref("dialog")}><slot></slot></dialog>`;

const styles$v = css`@layer base{:host{--dialog-backdrop:${colorBackgroundOverlay};--dialog-starting-scale:0.85}::backdrop{background:var(--dialog-backdrop,rgba(0,0,0,0.4))}dialog{background:${colorNeutralBackground1};border-radius:${borderRadiusXLarge};border:none;box-shadow:${shadow64};color:${colorNeutralForeground1};max-height:100vh;padding:0;width:100%;max-width:600px}:host([type='non-modal']) dialog{inset:0;position:fixed;z-index:2;overflow:auto}@supports (max-height:1dvh){dialog{max-height:100dvh}}}@layer animations{@media (prefers-reduced-motion:no-preference){dialog,::backdrop{transition:display allow-discrete,opacity,overlay allow-discrete,scale;transition-duration:${durationGentle};transition-timing-function:${curveDecelerateMid};opacity:0}::backdrop{transition-timing-function:${curveLinear}}[open],[open]::backdrop{opacity:1}dialog:not([open]){scale:var(--dialog-starting-scale);transition-timing-function:${curveAccelerateMid}}}@starting-style{[open],[open]::backdrop{opacity:0}dialog{scale:var(--dialog-starting-scale)}}}@media (forced-colors:active){@layer base{dialog{border:${strokeWidthThin} solid ${colorTransparentStroke}}}}`;

const definition$w = Dialog.compose({
  name: tagName$w,
  template: template$w,
  styles: styles$v
});

definition$w.define(FluentDesignSystem.registry);

const tagName$v = `${FluentDesignSystem.prefix}-dialog-body`;

class DialogBody extends FASTElement {
  /**
   * Handles click event for the close slot
   *
   * @param e - the click event
   * @internal
   */
  clickHandler(event) {
    if (!event.defaultPrevented) {
      const dialog = this.parentElement;
      if (isDialog(dialog)) {
        dialog.hide();
      }
    }
    return true;
  }
}

const template$v = html`<template><div class=title part=title><slot name=title></slot><slot name=title-action></slot><slot name=close @click=${(x, c) => x.clickHandler(c.event)}></slot></div><div class=content part=content><slot></slot></div><div class=actions part=actions><slot name=action></slot></div></template>`;

const styles$u = css`${display("grid")} :host{background:${colorNeutralBackground1};box-sizing:border-box;gap:${spacingVerticalS};padding:${spacingVerticalXXL} ${spacingHorizontalXXL};container:dialog-body/inline-size}.title{box-sizing:border-box;align-items:flex-start;background:${colorNeutralBackground1};color:${colorNeutralForeground1};column-gap:8px;display:flex;font-family:${fontFamilyBase};font-size:${fontSizeBase500};font-weight:${fontWeightSemibold};inset-block-start:0;justify-content:space-between;line-height:${lineHeightBase500};margin-block-end:calc(${spacingVerticalS} * -1);margin-block-start:calc(${spacingVerticalXXL} * -1);padding-block-end:${spacingVerticalS};padding-block-start:${spacingVerticalXXL}}.content{box-sizing:border-box;color:${colorNeutralForeground1};font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};line-height:${lineHeightBase300};min-height:32px}.actions{box-sizing:border-box;background:${colorNeutralBackground1};display:flex;flex-direction:column;gap:${spacingVerticalS};inset-block-end:0;margin-block-end:calc(${spacingVerticalXXL} * -1);padding-block-end:${spacingVerticalXXL};padding-block-start:${spacingVerticalL}}::slotted([slot='title-action']){margin-inline-start:auto}::slotted([slot='title']){font:inherit;padding:0;margin:0}:not(:has(:is([slot='title'],[slot='title-action']))) .title{justify-content:end}@container (min-width:480px){.actions{align-items:center;flex-direction:row;justify-content:flex-end;margin-block-start:calc(${spacingVerticalS} * -1);padding-block-start:${spacingVerticalS}}}@media (min-height:480px){.title{position:sticky;z-index:1}.actions{position:sticky;z-index:2}`;

const definition$v = DialogBody.compose({
  name: tagName$v,
  template: template$v,
  styles: styles$u
});

definition$v.define(FluentDesignSystem.registry);

const Orientation = {
  horizontal: "horizontal",
  vertical: "vertical"
};

const DividerRole = {
  /**
   * The divider semantically separates content
   */
  separator: "separator",
  /**
   * The divider has no semantic value and is for visual presentation only.
   */
  presentation: "presentation"
};
const DividerOrientation = Orientation;
const DividerAlignContent = {
  center: "center",
  start: "start",
  end: "end"
};
const DividerAppearance = {
  strong: "strong",
  brand: "brand",
  subtle: "subtle"
};
const tagName$u = `${FluentDesignSystem.prefix}-divider`;

var __defProp$A = Object.defineProperty;
var __getOwnPropDesc$A = Object.getOwnPropertyDescriptor;
var __decorateClass$A = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$A(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$A(target, key, result);
  return result;
};
class BaseDivider extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback();
    this.elementInternals.role = this.role ?? DividerRole.separator;
    if (this.role !== DividerRole.presentation) {
      this.elementInternals.ariaOrientation = this.orientation ?? DividerOrientation.horizontal;
    }
  }
  /**
   * Sets the element's internal role when the role attribute changes.
   *
   * @param previous - the previous role value
   * @param next - the current role value
   * @internal
   */
  roleChanged(previous, next) {
    if (this.$fastController.isConnected) {
      this.elementInternals.role = `${next ?? DividerRole.separator}`;
    }
    if (next === DividerRole.presentation) {
      this.elementInternals.ariaOrientation = null;
    }
  }
  /**
   * Sets the element's internal orientation when the orientation attribute changes.
   *
   * @param previous - the previous orientation value
   * @param next - the current orientation value
   * @internal
   */
  orientationChanged(previous, next) {
    this.elementInternals.ariaOrientation = this.role !== DividerRole.presentation ? next ?? null : null;
    swapStates(this.elementInternals, previous, next, DividerOrientation);
  }
}
__decorateClass$A([
  attr
], BaseDivider.prototype, "role", 2);
__decorateClass$A([
  attr
], BaseDivider.prototype, "orientation", 2);

var __defProp$z = Object.defineProperty;
var __getOwnPropDesc$z = Object.getOwnPropertyDescriptor;
var __decorateClass$z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$z(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$z(target, key, result);
  return result;
};
class Divider extends BaseDivider {
}
__decorateClass$z([
  attr({ attribute: "align-content" })
], Divider.prototype, "alignContent", 2);
__decorateClass$z([
  attr
], Divider.prototype, "appearance", 2);
__decorateClass$z([
  attr({ mode: "boolean" })
], Divider.prototype, "inset", 2);

function dividerTemplate() {
  return html`<slot></slot>`;
}
const template$u = dividerTemplate();

const styles$t = css`${display("flex")} :host{contain:content}:host::after,:host::before{align-self:center;background:${colorNeutralStroke2};box-sizing:border-box;content:'';display:flex;flex-grow:1;height:${strokeWidthThin}}:host([inset]){padding:0 12px}:host ::slotted(*){color:${colorNeutralForeground2};font-family:${fontFamilyBase};font-size:${fontSizeBase200};font-weight:${fontWeightRegular};margin:0;padding:0 12px}:host([align-content='start'])::before,:host([align-content='end'])::after{flex-basis:12px;flex-grow:0;flex-shrink:0}:host([orientation='vertical']){align-items:center;flex-direction:column;height:100%;min-height:84px}:host([orientation='vertical']):empty{min-height:20px}:host([orientation='vertical'][inset])::before{margin-top:12px}:host([orientation='vertical'][inset])::after{margin-bottom:12px}:host([orientation='vertical']):empty::before,:host([orientation='vertical']):empty::after{height:10px;min-height:10px;flex-grow:0}:host([orientation='vertical'])::before,:host([orientation='vertical'])::after{width:${strokeWidthThin};min-height:20px;height:100%}:host([orientation='vertical']) ::slotted(*){display:flex;flex-direction:column;padding:12px 0;line-height:20px}:host([orientation='vertical'][align-content='start'])::before{min-height:8px}:host([orientation='vertical'][align-content='end'])::after{min-height:8px}:host([appearance='strong'])::before,:host([appearance='strong'])::after{background:${colorNeutralStroke1}}:host([appearance='strong']) ::slotted(*){color:${colorNeutralForeground1}}:host([appearance='brand'])::before,:host([appearance='brand'])::after{background:${colorBrandStroke1}}:host([appearance='brand']) ::slotted(*){color:${colorBrandForeground1}}:host([appearance='subtle'])::before,:host([appearance='subtle'])::after{background:${colorNeutralStroke3}}:host([appearance='subtle']) ::slotted(*){color:${colorNeutralForeground3}}@media (forced-colors:active){:host([appearance='strong'])::before,:host([appearance='strong'])::after,:host([appearance='brand'])::before,:host([appearance='brand'])::after,:host([appearance='subtle'])::before,:host([appearance='subtle'])::after,:host::after,:host::before{background:WindowText;color:WindowText}}`;

const definition$u = Divider.compose({
  name: tagName$u,
  template: template$u,
  styles: styles$t
});

definition$u.define(FluentDesignSystem.registry);

const DrawerPosition = {
  start: "start",
  end: "end"
};
const DrawerSize = {
  small: "small",
  medium: "medium",
  large: "large",
  full: "full"
};
const DrawerType = {
  nonModal: "non-modal",
  modal: "modal",
  inline: "inline"
};
const tagName$t = `${FluentDesignSystem.prefix}-drawer`;

var __defProp$y = Object.defineProperty;
var __getOwnPropDesc$y = Object.getOwnPropertyDescriptor;
var __decorateClass$y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$y(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$y(target, key, result);
  return result;
};
class Drawer extends FASTElement {
  constructor() {
    super(...arguments);
    this.type = DrawerType.modal;
    this.position = DrawerPosition.start;
    this.size = DrawerSize.medium;
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    this.emitToggle = () => {
      this.$emit("toggle", {
        oldState: this.dialog.open ? "closed" : "open",
        newState: this.dialog.open ? "open" : "closed"
      });
    };
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    this.emitBeforeToggle = () => {
      this.$emit("beforetoggle", {
        oldState: this.dialog.open ? "open" : "closed",
        newState: this.dialog.open ? "closed" : "open"
      });
    };
  }
  typeChanged() {
    if (!this.dialog) {
      return;
    }
    this.updateDialogRole();
    if (this.type === DrawerType.modal) {
      this.dialog.setAttribute("aria-modal", "true");
    } else {
      this.dialog.removeAttribute("aria-modal");
    }
  }
  /** @internal */
  connectedCallback() {
    super.connectedCallback();
    this.typeChanged();
    this.observeRoleAttr();
  }
  /** @internal */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.roleAttrObserver.disconnect();
  }
  /**
   * Method to show the drawer
   *
   * @public
   */
  show() {
    Updates.enqueue(() => {
      this.emitBeforeToggle();
      if (this.type === DrawerType.inline || this.type === DrawerType.nonModal) {
        this.dialog.show();
      } else {
        this.dialog.showModal();
      }
      this.emitToggle();
    });
  }
  /**
   * Method to hide the drawer
   *
   * @public
   */
  hide() {
    this.emitBeforeToggle();
    this.dialog.close();
    this.emitToggle();
  }
  /**
   * @public
   * @param event - The click event
   * @returns boolean - Always returns true
   * Handles click events on the drawer.
   */
  clickHandler(event) {
    if (this.dialog.open && event.target === this.dialog) {
      this.hide();
    }
    return true;
  }
  /**
   * Handles cancel events on the drawer.
   *
   * @public
   */
  cancelHandler() {
    this.hide();
  }
  observeRoleAttr() {
    if (this.roleAttrObserver) {
      return;
    }
    this.roleAttrObserver = new MutationObserver(() => {
      this.updateDialogRole();
    });
    this.roleAttrObserver.observe(this, {
      attributes: true,
      attributeFilter: ["role"]
    });
  }
  updateDialogRole() {
    if (!this.dialog) {
      return;
    }
    this.dialog.role = this.type === DrawerType.modal ? "dialog" : this.role;
  }
}
__decorateClass$y([
  attr
], Drawer.prototype, "type", 2);
__decorateClass$y([
  attr({ attribute: "aria-labelledby" })
], Drawer.prototype, "ariaLabelledby", 2);
__decorateClass$y([
  attr({ attribute: "aria-describedby" })
], Drawer.prototype, "ariaDescribedby", 2);
__decorateClass$y([
  attr
], Drawer.prototype, "position", 2);
__decorateClass$y([
  attr({ attribute: "size" })
], Drawer.prototype, "size", 2);
__decorateClass$y([
  observable
], Drawer.prototype, "dialog", 2);

const styles$s = css`${display("block")} :host{--dialog-backdrop:${colorBackgroundOverlay}}:host([type='non-modal']) dialog[open]::backdrop{display:none}:host([type='non-modal']) dialog{position:fixed;top:0;bottom:0}:host([type='inline']){height:100%;width:fit-content}:host([type='inline']) dialog[open]{box-shadow:none;position:relative}:host([size='small']) dialog{width:320px;max-width:320px}:host([size='large']) dialog{width:940px;max-width:940px}:host([size='full']) dialog{width:100%;max-width:100%}:host([position='end']) dialog{margin-inline-start:auto;margin-inline-end:0}dialog{box-sizing:border-box;z-index:var(--drawer-elevation,1000);font-size:${fontSizeBase300};line-height:${lineHeightBase300};font-family:${fontFamilyBase};font-weight:${fontWeightRegular};color:${colorNeutralForeground1};max-width:var(--drawer-width,592px);max-height:100vh;height:100%;margin-inline-start:0;margin-inline-end:auto;border-inline-end-color:${colorTransparentStroke};border-inline-start-color:var(--drawer-separator,${colorTransparentStroke});outline:none;top:0;bottom:0;width:var(--drawer-width,592px);border-radius:0;padding:0;max-width:var(--drawer-width,592px);box-shadow:${shadow64};border:${strokeWidthThin} solid ${colorTransparentStroke};background:${colorNeutralBackground1}}dialog::backdrop{background:var(--dialog-backdrop)}@layer animations{@media (prefers-reduced-motion:no-preference){dialog{transition:display allow-discrete,opacity,overlay allow-discrete,transform;transition-duration:${durationGentle};transition-timing-function:${curveDecelerateMid}}:host dialog:not([open]){transform:translateX(-100%);transition-timing-function:${curveAccelerateMid}}:host([position='end']) dialog:not([open]){transform:translateX(100%);transition-timing-function:${curveAccelerateMid}}dialog[open]{transform:translateX(0)}dialog::backdrop{transition:display allow-discrete,opacity,overlay allow-discrete,scale;transition-duration:${durationGentle};transition-timing-function:${curveDecelerateMid};background:var(--dialog-backdrop,${colorBackgroundOverlay});opacity:0}dialog[open]::backdrop{opacity:1}dialog::backdrop{transition-timing-function:${curveLinear}}}@starting-style{dialog[open]{transform:translateX(-100%)}:host([position='end']) dialog[open]{transform:translateX(100%)}dialog[open]::backdrop{opacity:0}}}`;

function drawerTemplate() {
  return html`<dialog class=dialog part=dialog aria-describedby=${(x) => x.ariaDescribedby} aria-labelledby=${(x) => x.ariaLabelledby} aria-label=${(x) => x.ariaLabel} size=${(x) => x.size} position=${(x) => x.position} @click=${(x, c) => x.clickHandler(c.event)} @cancel=${(x) => x.cancelHandler()} ${ref("dialog")}><slot></slot></dialog>`;
}
const template$t = drawerTemplate();

const definition$t = Drawer.compose({
  name: tagName$t,
  template: template$t,
  styles: styles$s
});

definition$t.define(FluentDesignSystem.registry);

const tagName$s = `${FluentDesignSystem.prefix}-drawer-body`;

class DrawerBody extends FASTElement {
  /**
   * Handles click event for the close slot
   *
   * @param e - the click event
   * @internal
   */
  clickHandler(event) {
    if (!event.defaultPrevented) {
      const dialog = this.parentElement;
      if (isDialog(dialog, "-drawer")) {
        dialog.hide();
      }
    }
    return true;
  }
}

const typographyBody1Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase300};line-height:${lineHeightBase300};font-weight:${fontWeightRegular};`;
const typographyBody1StrongStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase300};line-height:${lineHeightBase300};font-weight:${fontWeightSemibold};`;
const typographyBody1StrongerStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase300};line-height:${lineHeightBase300};font-weight:${fontWeightBold};`;
const typographyBody2Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase400};line-height:${lineHeightBase400};font-weight:${fontWeightRegular};`;
const typographyCaption1Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase200};line-height:${lineHeightBase200};font-weight:${fontWeightRegular};`;
const typographyCaption1StrongStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase200};line-height:${lineHeightBase200};font-weight:${fontWeightSemibold};`;
const typographyCaption1StrongerStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase200};line-height:${lineHeightBase200};font-weight:${fontWeightBold};`;
const typographyCaption2Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase100};line-height:${lineHeightBase100};font-weight:${fontWeightRegular};`;
const typographyCaption2StrongStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase100};line-height:${lineHeightBase100};font-weight:${fontWeightSemibold};`;
const typographySubtitle1Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase500};line-height:${lineHeightBase500};font-weight:${fontWeightSemibold};`;
const typographySubtitle2Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase400};line-height:${lineHeightBase400};font-weight:${fontWeightSemibold};`;
const typographySubtitle2StrongerStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase400};line-height:${lineHeightBase400};font-weight:${fontWeightBold};`;
const typographyTitle1Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeHero800};line-height:${lineHeightHero800};font-weight:${fontWeightSemibold};`;
const typographyTitle2Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeHero700};line-height:${lineHeightHero700};font-weight:${fontWeightSemibold};`;
const typographyTitle3Styles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeBase600};line-height:${lineHeightBase600};font-weight:${fontWeightSemibold};`;
const typographyLargeTitleStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeHero900};line-height:${lineHeightHero900};font-weight:${fontWeightSemibold};`;
const typographyDisplayStyles = css.partial`font-family:${fontFamilyBase};font-size:${fontSizeHero1000};line-height:${lineHeightHero1000};font-weight:${fontWeightSemibold};`;

const styles$r = css`${display("grid")} :host{box-sizing:border-box;grid-template-rows:min-content auto min-content;position:relative;height:100%;padding:${spacingHorizontalXL};max-height:100svh}.header{display:flex;justify-content:space-between;align-items:center;${typographySubtitle1Styles}}.footer{display:flex;justify-content:flex-start;gap:${spacingHorizontalM}}::slotted([slot='title']){font:inherit;padding:0;margin:0}`;

function drawerBodyTemplate() {
  return html`<div class=header part=header><slot name=title></slot><slot name=close @click=${(x, c) => x.clickHandler(c.event)}></slot></div><div class=content part=content><slot></slot></div><div class=footer part=footer><slot name=footer></slot></div>`;
}
const template$s = drawerBodyTemplate();

const definition$s = DrawerBody.compose({
  name: tagName$s,
  template: template$s,
  styles: styles$r
});

definition$s.define(FluentDesignSystem.registry);

function isDropdown(element, tagName2 = "-dropdown") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const DropdownAppearance = {
  filledDarker: "filled-darker",
  filledLighter: "filled-lighter",
  outline: "outline",
  transparent: "transparent"
};
const DropdownSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const DropdownType = {
  combobox: "combobox",
  dropdown: "dropdown",
  select: "select"
};
const tagName$r = `${FluentDesignSystem.prefix}-dropdown`;

function isListbox(element, tagName2 = "-listbox") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const tagName$q = `${FluentDesignSystem.prefix}-listbox`;

function isDropdownOption(value, tagName2 = "-option") {
  if (value?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return value.tagName.toLowerCase().endsWith(tagName2);
}
const tagName$p = `${FluentDesignSystem.prefix}-option`;

const Direction = {
  ltr: "ltr",
  rtl: "rtl"
};
const getDirection = (rootNode) => {
  return rootNode.closest("[dir]")?.dir === "rtl" ? Direction.rtl : Direction.ltr;
};

function getLanguage(rootNode) {
  return rootNode.closest("[lang]")?.lang ?? "en";
}

let uniqueIdCounter = 0;
function uniqueId(prefix = "id-") {
  const str = `${prefix}${uniqueIdCounter++}`;
  return document.getElementById(str) ? uniqueId(prefix) : str;
}

const dropdownIndicatorTemplate = html`<svg class=chevron-down-20-regular aria-hidden=true slot=indicator viewBox="0 0 20 20" ${ref("indicator")}><path d="M15.85 7.65a.5.5 0 0 1 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16a.5.5 0 0 1 .7 0" fill=currentColor /></svg>`;
const dropdownInputTemplate = html`<input @input=${(x, c) => x.inputHandler(c.event)} @change=${(x, c) => x.changeHandler(c.event)} aria-activedescendant=${(x) => x.activeDescendant} aria-controls=${(x) => x.listbox?.id ?? null} aria-labelledby=${(x) => x.ariaLabelledBy} aria-expanded=${(x) => x.open} aria-haspopup=listbox placeholder=${(x) => x.placeholder} role=combobox ?disabled=${(x) => x.disabled} type=${(x) => x.type} value=${(x) => x.valueAttribute} slot=control ${ref("control")}>`;
const dropdownButtonTemplate = html`<button aria-activedescendant=${(x) => x.activeDescendant} aria-controls=${(x) => x.listbox?.id ?? null} aria-expanded=${(x) => x.open} aria-haspopup=listbox role=combobox ?disabled=${(x) => x.disabled} type=button slot=control ${ref("control")}>${(x) => x.displayValue}</button>`;
function dropdownTemplate(options = {}) {
  return html`<template @click=${(x, c) => x.clickHandler(c.event)} @focusout=${(x, c) => x.focusoutHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)} @mousedown=${(x, c) => x.mousedownHandler(c.event)}><div class=control><slot name=control ${ref("controlSlot")}></slot><slot name=indicator ${ref("indicatorSlot")}>${staticallyCompose(options.indicator)}</slot></div><slot @slotchange=${(x, c) => x.slotchangeHandler(c.event)}></slot></template>`;
}
const template$r = dropdownTemplate({
  indicator: dropdownIndicatorTemplate
});

var __defProp$x = Object.defineProperty;
var __getOwnPropDesc$x = Object.getOwnPropertyDescriptor;
var __decorateClass$x = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$x(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$x(target, key, result);
  return result;
};
const _BaseDropdown = class _BaseDropdown extends FASTElement {
  constructor() {
    super();
    this.activeIndex = 0;
    this.id = uniqueId("dropdown-");
    this.required = false;
    this.type = DropdownType.dropdown;
    this.valueAttribute = "";
    /**
     * Repositions the listbox to align with the control element. Used when the browser does not support CSS anchor
     * positioning.
     *
     * @internal
     */
    this.repositionListbox = () => {
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
      this.frameId = requestAnimationFrame(() => {
        const controlRect = this.getBoundingClientRect();
        const right = window.innerWidth - controlRect.right;
        const left = controlRect.left;
        this.listbox.style.minWidth = `${controlRect.width}px`;
        this.listbox.style.top = `${controlRect.top}px`;
        if (left + controlRect.width > window.innerWidth || getDirection(this) === "rtl" && right - controlRect.width > 0) {
          this.listbox.style.right = `${right}px`;
          this.listbox.style.left = "unset";
        } else {
          this.listbox.style.left = `${left}px`;
          this.listbox.style.right = "unset";
        }
      });
    };
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * Guard flag to prevent reentrant calls to `insertControl`.
     * @internal
     */
    this._insertingControl = false;
    this.elementInternals.role = "presentation";
  }
  get activeDescendant() {
    if (this.open) {
      return this.enabledOptions[this.activeIndex]?.id;
    }
    return void 0;
  }
  /**
   * Sets the active index when the active index property changes.
   *
   * @param prev - the previous active index
   * @param next - the current active index
   * @internal
   */
  activeIndexChanged(prev, next) {
    if (typeof next === "number") {
      const optionIndex = this.matches(":has(:focus-visible)") ? next : -1;
      this.enabledOptions.forEach((option, index) => {
        option.active = index === optionIndex;
      });
      if (this.open) {
        this.enabledOptions[optionIndex]?.scrollIntoView({ block: "nearest" });
      }
    }
  }
  /**
   * Updates properties on the control element when the control slot changes.
   *
   * @param prev - the previous control element
   * @param next - the current control element
   * @internal
   * @remarks
   * The control element is assigned to the dropdown via the control slot with manual slot assignment.
   */
  controlChanged(prev, next) {
    if (next) {
      next.id = next.id || uniqueId("input-");
    }
  }
  /**
   * Updates the disabled state of the options when the disabled property changes.
   *
   * @param prev - the previous disabled state
   * @param next - the current disabled state
   */
  disabledChanged(prev, next) {
    if (this.listbox) {
      Updates.enqueue(() => {
        this.options.forEach((option) => {
          option.disabled = option.disabledAttribute || this.disabled;
        });
      });
    }
  }
  get displayValue() {
    if (!this.$fastController.isConnected || !this.control || this.isCombobox && this.multiple) {
      toggleState(this.elementInternals, "placeholder-shown", false);
      return "";
    }
    this.listFormatter = this.listFormatter ?? new Intl.ListFormat(getLanguage(this), {
      type: "conjunction",
      style: "narrow"
    });
    const displayValue = this.listFormatter.format(this.selectedOptions.map((x) => x.text));
    toggleState(this.elementInternals, "placeholder-shown", !displayValue);
    if (this.isCombobox) {
      return displayValue;
    }
    return displayValue || this.placeholder;
  }
  /**
   * Updates properties on the listbox element when the listbox reference changes.
   *
   * @param prev - the previous listbox element
   * @param next - the current listbox element
   * @internal
   *
   * @remarks
   * The listbox element is assigned to the dropdown via the default slot with manual slot assignment.
   */
  listboxChanged(prev, next) {
    if (prev) {
      Observable.getNotifier(this).unsubscribe(prev);
    }
    if (next) {
      next.dropdown = this;
      next.popover = "manual";
      next.tabIndex = -1;
      const notifier = Observable.getNotifier(this);
      notifier.subscribe(next);
      notifier.notify("multiple");
      waitForConnectedDescendants(
        next,
        () => {
          this.options.forEach((option) => {
            option.disabled = option.disabledAttribute || this.disabled;
            option.name = this.name;
          });
          this.enabledOptions.filter((x) => x.defaultSelected).forEach((x, i) => {
            x.selected = this.multiple || i === 0;
          });
          this.setValidity();
        },
        { idleCallback: true }
      );
      if (AnchorPositioningCSSSupported) {
        const anchorName = uniqueId("--dropdown-anchor-");
        this.style.setProperty("anchor-name", anchorName);
        this.listbox.style.setProperty("position-anchor", anchorName);
      }
    }
  }
  /**
   * Toggles between single and multiple selection modes when the `multiple` property changes.
   *
   * @param prev - the previous multiple state
   * @param next - the next multiple state
   * @internal
   */
  multipleChanged(prev, next) {
    this.elementInternals.ariaMultiSelectable = next ? "true" : "false";
    toggleState(this.elementInternals, "multiple", next);
    this.value = null;
  }
  /**
   * Updates the name of the options when the name property changes.
   *
   * @param prev - the previous name
   * @param next - the current name
   */
  nameChanged(prev, next) {
    if (this.listbox) {
      Updates.enqueue(() => {
        this.options.forEach((option) => {
          option.name = next;
        });
      });
    }
  }
  /**
   * Handles the open state of the dropdown.
   *
   * @param prev - the previous open state
   * @param next - the current open state
   *
   * @internal
   */
  openChanged(prev, next) {
    toggleState(this.elementInternals, "open", next);
    this.elementInternals.ariaExpanded = next ? "true" : "false";
    this.activeIndex = this.selectedIndex ?? -1;
    if (!AnchorPositioningCSSSupported) {
      this.anchorPositionFallback(next);
    }
  }
  /**
   * Changes the slotted control element based on the dropdown type.
   *
   * @param prev - the previous dropdown type
   * @param next - the current dropdown type
   * @internal
   */
  typeChanged(prev, next) {
    if (this.$fastController.isConnected) {
      this.insertControl();
    }
  }
  /**
   * The collection of enabled options.
   * @public
   */
  get enabledOptions() {
    return this.listbox?.enabledOptions ?? [];
  }
  /**
   * A reference to the first freeform option, if present.
   *
   * @internal
   */
  get freeformOption() {
    return this.enabledOptions.find((x) => x.freeform);
  }
  /**
   * Indicates whether the dropdown is a combobox.
   *
   * @internal
   */
  get isCombobox() {
    return this.type === DropdownType.combobox;
  }
  /**
   * A reference to all associated label elements.
   *
   * @public
   */
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  /**
   * The collection of all child options.
   *
   * @public
   */
  get options() {
    return this.listbox?.options ?? [];
  }
  /**
   * The index of the first selected option, scoped to the enabled options.
   *
   * @internal
   * @remarks
   * This property is a reflection of {@link Listbox.selectedIndex}.
   */
  get selectedIndex() {
    return this.enabledOptions.findIndex((x) => x.selected) ?? -1;
  }
  /**
   * The collection of selected options.
   *
   * @public
   * @remarks
   * This property is a reflection of {@link Listbox.selectedOptions}.
   */
  get selectedOptions() {
    return this.listbox?.selectedOptions ?? [];
  }
  /**
   * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
   * specified (e.g., via `setCustomValidity`).
   *
   * @internal
   */
  get validationMessage() {
    if (this.elementInternals.validationMessage) {
      return this.elementInternals.validationMessage;
    }
    if (!this._validationFallbackMessage) {
      const validationMessageFallbackControl = document.createElement("input");
      validationMessageFallbackControl.type = "radio";
      validationMessageFallbackControl.name = "validation-message-fallback";
      validationMessageFallbackControl.required = true;
      validationMessageFallbackControl.checked = false;
      this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
    }
    if (!this.disabled && this.required && this.listbox.selectedOptions.length === 0) {
      return this._validationFallbackMessage;
    }
    return "";
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The current value of the selected option.
   *
   * @public
   */
  get value() {
    Observable.notify(this, "value");
    return this.enabledOptions.find((x) => x.selected)?.value ?? null;
  }
  set value(next) {
    if (this.multiple) {
      return;
    }
    this.selectOption(this.enabledOptions.findIndex((x) => x.value === next));
    Observable.track(this, "value");
  }
  /**
   * Determines if the control can be submitted for constraint validation.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
   */
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  /**
   * Handles the change events for the dropdown.
   *
   * @param e - the event object
   *
   * @public
   */
  changeHandler(e) {
    if (this === e.target) {
      return true;
    }
    const optionIndex = this.isCombobox ? this.enabledOptions.findIndex((x) => x.text === this.control.value) : this.enabledOptions.indexOf(e.target);
    this.selectOption(optionIndex, true);
    return true;
  }
  /**
   * Checks the validity of the element and returns the result.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Handles the click events for the dropdown.
   *
   * @param e - the event object
   *
   * @public
   */
  clickHandler(e) {
    if (this.disabled) {
      return;
    }
    const target = e.target;
    this.focus();
    if ((target === this.control || e.composedPath().includes(this.indicator)) && !this.isCombobox) {
      this.listbox.togglePopover();
      return true;
    }
    if (!this.open) {
      this.listbox.showPopover();
      return true;
    }
    if (isDropdownOption(target)) {
      if (target.disabled) {
        return;
      }
      this.selectOption(this.enabledOptions.indexOf(target), true);
      if (!this.multiple) {
        if (this.isCombobox) {
          this.control.value = target.text;
          this.updateFreeformOption();
        }
        this.listbox.hidePopover();
      }
    }
    return true;
  }
  /**
   * Filters the options based on the input value.
   *
   * @param value - the input value to filter the options by
   * @param collection - the collection of options to filter
   * @returns the filtered options
   * @internal
   */
  filterOptions(value, collection = this.enabledOptions) {
    if (!this.listCollator) {
      this.listCollator = new Intl.Collator(getLanguage(this), { usage: "search", sensitivity: "base" });
    }
    return collection.filter((x) => {
      return this.listCollator.compare(x.text.substring(0, Math.min(x.text.length, value.length)), value) === 0;
    });
  }
  /**
   * Focuses the control when the dropdown receives focus.
   *
   * @internal
   */
  focus(options) {
    if (this.disabled) {
      return;
    }
    this.control.focus(options);
  }
  /**
   * Toggles the listbox when the control element loses focus.
   *
   * @param e - the focus event
   * @internal
   */
  focusoutHandler(e) {
    const relatedTarget = e.relatedTarget;
    if (this.open && !this.contains(relatedTarget)) {
      this.listbox.togglePopover();
    }
    return true;
  }
  /**
   * Resets the form value to its initial value when the form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.enabledOptions.forEach((x, i) => {
      if (this.multiple) {
        x.selected = !!x.defaultSelected;
        return;
      }
      if (!x.defaultSelected) {
        x.selected = false;
        return;
      }
      this.selectOption(i);
    });
    this.setValidity();
  }
  /**
   * Ensures the active index is within bounds of the enabled options. Out-of-bounds indices are wrapped to the opposite
   * end of the range.
   *
   * @param index - the desired index
   * @param upperBound - the upper bound of the range
   * @returns the index in bounds
   * @internal
   */
  getEnabledIndexInBounds(index, upperBound = this.enabledOptions.length || 0) {
    if (upperBound === 0) {
      return -1;
    }
    return (index + upperBound) % upperBound;
  }
  /**
   * Handles the input events for the dropdown from the control element.
   *
   * @param e - the input event
   * @public
   */
  inputHandler(e) {
    if (!this.open) {
      this.listbox.showPopover();
    }
    this.updateFreeformOption();
    const controlValue = this.control.value;
    const index = this.enabledOptions.indexOf(this.filterOptions(controlValue)[0] ?? null);
    this.activeIndex = index;
    return true;
  }
  /**
   * Inserts the control element based on the dropdown type.
   *
   * @public
   * @remarks
   * This method can be overridden in derived classes to provide custom control elements, though this is not recommended.
   */
  insertControl() {
    if (this._insertingControl) {
      return;
    }
    this._insertingControl = true;
    this.controlSlot?.assignedNodes().forEach((x) => this.removeChild(x));
    if (this.type === DropdownType.combobox) {
      dropdownInputTemplate.render(this, this);
      return;
    }
    dropdownButtonTemplate.render(this, this);
    this._insertingControl = false;
  }
  /**
   * Handles the keydown events for the dropdown.
   *
   * @param e - the keyboard event
   * @public
   */
  keydownHandler(e) {
    let increment = 0;
    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        increment = -1;
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        increment = 1;
        break;
      }
      case " ": {
        if (this.isCombobox) {
          break;
        }
        e.preventDefault();
      }
      case "Enter":
      case "Tab": {
        if (this.open) {
          this.selectOption(this.activeIndex, true);
          if (this.multiple) {
            break;
          }
          this.listbox.hidePopover();
          return e.key === "Tab";
        }
        this.listbox.showPopover();
        break;
      }
      case "Escape": {
        this.activeIndex = this.multiple ? 0 : this.selectedIndex;
        this.listbox.hidePopover();
        break;
      }
    }
    if (!increment) {
      return true;
    }
    if (!this.open) {
      this.listbox.showPopover();
      return;
    }
    let nextIndex = this.activeIndex;
    nextIndex += increment;
    let indexInBounds = this.getEnabledIndexInBounds(nextIndex);
    if (indexInBounds === 0 && this.freeformOption?.hidden) {
      indexInBounds = this.getEnabledIndexInBounds(nextIndex + increment);
    }
    this.activeIndex = indexInBounds;
    return true;
  }
  /**
   * Prevents the default behavior of the mousedown event. This is necessary to prevent the input from losing focus
   * when the dropdown is open.
   *
   * @param e - the mouse event
   *
   * @internal
   */
  mousedownHandler(e) {
    if (this.disabled || e.target === this.control && !this.isCombobox) {
      return;
    }
    return !isDropdownOption(e.target);
  }
  /**
   * Reports the validity of the element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Selects an option by index.
   *
   * @param index - The index of the option to select.
   * @public
   */
  selectOption(index = this.selectedIndex, shouldEmit = false) {
    this.listbox.selectOption(index);
    if (this.control) {
      this.control.value = this.displayValue;
    }
    this.setValidity();
    this.updateFreeformOption();
    if (shouldEmit) {
      this.$emit("change");
    }
  }
  /**
   * Sets the validity of the element.
   *
   * @param flags - Validity flags to set.
   * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
   * @param anchor - Optional anchor to use for the validation message.
   *
   * @internal
   */
  setValidity(flags, message, anchor) {
    if (!this.elementInternals) {
      return;
    }
    if (this.disabled || !this.required) {
      this.elementInternals.setValidity({});
      return;
    }
    const valueMissing = this.required && this.listbox.selectedOptions.length === 0;
    this.elementInternals.setValidity(
      { valueMissing, ...flags },
      message ?? this.validationMessage,
      anchor ?? this.control
    );
  }
  /**
   * Handles the `slotchange` event for the dropdown.
   * Sets the `listbox` property when a valid listbox is assigned to the default slot.
   *
   * @param e - the slot change event
   * @internal
   */
  slotchangeHandler(e) {
    const target = e.target;
    waitForConnectedDescendants(this, () => {
      const listbox = target.assignedElements().find((el) => isListbox(el));
      if (listbox) {
        this.listbox = listbox;
      }
    });
  }
  /**
   * Updates the freeform option with the provided value.
   *
   * @param value - the value to update the freeform option with
   * @internal
   */
  updateFreeformOption(value = this.control.value) {
    if (!this.freeformOption) {
      return;
    }
    if (value === "" || this.filterOptions(
      value,
      this.enabledOptions.filter((x) => !x.freeform)
    ).length) {
      this.freeformOption.value = "";
      this.freeformOption.selected = false;
      this.freeformOption.hidden = true;
      return;
    }
    this.freeformOption.value = value;
    this.freeformOption.hidden = false;
  }
  connectedCallback() {
    super.connectedCallback();
    Updates.enqueue(() => {
      this.insertControl();
    });
  }
  disconnectedCallback() {
    _BaseDropdown.AnchorPositionFallbackObserver?.disconnect();
    this.debounceController?.abort();
    super.disconnectedCallback();
  }
  /**
   * When anchor positioning isn't supported, an intersection observer is used to flip the listbox when it hits the
   * viewport bounds. One static observer is used for all dropdowns.
   *
   * @internal
   */
  anchorPositionFallback(shouldObserve) {
    if (!_BaseDropdown.AnchorPositionFallbackObserver) {
      _BaseDropdown.AnchorPositionFallbackObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ boundingClientRect, isIntersecting, target }) => {
            if (isListbox(target)) {
              if (boundingClientRect.bottom > window.innerHeight) {
                toggleState(target.elementInternals, "flip-block", true);
                return;
              }
              if (boundingClientRect.top < 0) {
                toggleState(target.elementInternals, "flip-block", false);
              }
            }
          });
        },
        { threshold: 1 }
      );
    }
    if (shouldObserve) {
      this.debounceController = new AbortController();
      _BaseDropdown.AnchorPositionFallbackObserver.observe(this.listbox);
      window.addEventListener("scroll", this.repositionListbox, {
        passive: true,
        capture: true,
        signal: this.debounceController.signal
      });
      window.addEventListener("resize", this.repositionListbox, {
        passive: true,
        signal: this.debounceController.signal
      });
      this.repositionListbox();
      return;
    }
    _BaseDropdown.AnchorPositionFallbackObserver.unobserve(this.listbox);
    this.debounceController?.abort();
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = void 0;
    }
  }
};
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
_BaseDropdown.formAssociated = true;
__decorateClass$x([
  volatile
], _BaseDropdown.prototype, "activeDescendant", 1);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "activeIndex", 2);
__decorateClass$x([
  attr({ attribute: "aria-labelledby", mode: "fromView" })
], _BaseDropdown.prototype, "ariaLabelledBy", 2);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "control", 2);
__decorateClass$x([
  attr({ mode: "boolean" })
], _BaseDropdown.prototype, "disabled", 2);
__decorateClass$x([
  volatile
], _BaseDropdown.prototype, "displayValue", 1);
__decorateClass$x([
  attr({ attribute: "id" })
], _BaseDropdown.prototype, "id", 2);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "indicator", 2);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "indicatorSlot", 2);
__decorateClass$x([
  attr({ attribute: "value", mode: "fromView" })
], _BaseDropdown.prototype, "initialValue", 2);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "listbox", 2);
__decorateClass$x([
  attr({ mode: "boolean" })
], _BaseDropdown.prototype, "multiple", 2);
__decorateClass$x([
  attr
], _BaseDropdown.prototype, "name", 2);
__decorateClass$x([
  observable
], _BaseDropdown.prototype, "open", 2);
__decorateClass$x([
  attr
], _BaseDropdown.prototype, "placeholder", 2);
__decorateClass$x([
  attr({ mode: "boolean" })
], _BaseDropdown.prototype, "required", 2);
__decorateClass$x([
  attr
], _BaseDropdown.prototype, "type", 2);
__decorateClass$x([
  attr({ attribute: "value" })
], _BaseDropdown.prototype, "valueAttribute", 2);
let BaseDropdown = _BaseDropdown;

var __defProp$w = Object.defineProperty;
var __getOwnPropDesc$w = Object.getOwnPropertyDescriptor;
var __decorateClass$w = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$w(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$w(target, key, result);
  return result;
};
class Dropdown extends BaseDropdown {
  constructor() {
    super(...arguments);
    this.appearance = DropdownAppearance.outline;
  }
}
__decorateClass$w([
  attr
], Dropdown.prototype, "appearance", 2);
__decorateClass$w([
  attr
], Dropdown.prototype, "size", 2);

const styles$q = css`${display("inline-flex")} :host{anchor-name:--dropdown-trigger;box-sizing:border-box;color:${colorNeutralForeground1};cursor:pointer}:host(${placeholderShownState}){color:${colorNeutralForeground4}}.control{appearance:none;background-color:${colorNeutralBackground1};border-radius:${borderRadiusMedium};border:${strokeWidthThin} solid ${colorTransparentStroke};box-shadow:inset 0 0 0 ${strokeWidthThin} var(--control-border-color);box-sizing:border-box;color:inherit;column-gap:${spacingHorizontalXXS};display:inline-flex;justify-content:space-between;min-width:160px;overflow:hidden;padding:${spacingVerticalSNudge} ${spacingHorizontalMNudge};position:relative;text-align:start;width:100%;z-index:1;${typographyBody1Styles}}:host([size='small']) .control{column-gap:${spacingHorizontalXXS};padding:${spacingVerticalXS} ${spacingHorizontalSNudge};${typographyCaption1Styles}}:host([size='large']) .control{column-gap:${spacingHorizontalS};padding:${spacingVerticalS} ${spacingHorizontalM};${typographyBody2Styles}}::slotted(:is(input,button)){all:unset;flex:1 1 auto}::slotted(button){cursor:pointer}::slotted(input){cursor:text}:where(slot[name='indicator']>*,::slotted([slot='indicator'])){all:unset;align-items:center;appearance:none;aspect-ratio:1;color:${colorNeutralForeground3};display:inline-flex;justify-content:center;width:20px}:host([size='small']) :where(slot[name='indicator']>*,::slotted([slot='indicator'])){width:16px}:host([size='large']) :where(slot[name='indicator']>*,::slotted([slot='indicator'])){width:24px}.control::after,.control::before{content:''/'';inset:auto 0 0;pointer-events:none;position:absolute}.control::before{height:${strokeWidthThin}}.control::after{background-color:${colorCompoundBrandStroke};height:${strokeWidthThick};scale:0 1;transition:scale ${durationUltraFast} ${curveDecelerateMid}}:host(:where(:focus-within)) .control{border-radius:${borderRadiusMedium};box-shadow:inset 0 0 0 1px ${colorStrokeFocus1};outline:${strokeWidthThick} solid ${colorStrokeFocus2}}:host(:where(${openState},:focus-within)) .control::after{scale:1 1;transition-duration:${durationNormal};transition-timing-function:${curveAccelerateMid}}:host(:where([appearance='outline'],[appearance='transparent'])) .control::before{background-color:${colorNeutralStrokeAccessible}}:host([appearance='transparent']) .control{--control-border-color:${colorTransparentStrokeInteractive};background-color:${colorTransparentBackground};border-radius:${borderRadiusNone}}:host([appearance='outline']) .control{--control-border-color:${colorNeutralStroke1}}:host([appearance='outline']) .control:hover{--control-border-color:${colorNeutralStroke1Hover}}:host(:where([appearance='outline'],[appearance='transparent'])) .control:hover::before{background-color:${colorNeutralStrokeAccessibleHover}}:host([appearance='outline']) .control:hover::after{background-color:${colorCompoundBrandBackgroundHover}}:host([appearance='outline']) .control:active{--control-border-color:${colorNeutralStroke1Pressed}}:host(:where([appearance='outline'],[appearance='transparent'])) .control:active::before{background-color:${colorNeutralStrokeAccessiblePressed}}:host(:where([appearance='outline'],[appearance='transparent'])) .control:active::after{background-color:${colorCompoundBrandBackgroundPressed}}:host([appearance='filled-darker']) .control{background-color:${colorNeutralBackground3}}:host(:where([appearance='filled-lighter'],[appearance='filled-darker'])) .control{--control-border-color:${colorTransparentStroke}}:host(:disabled),:host(:disabled) ::slotted(:where(button,input)){cursor:not-allowed}:host(:disabled) .control::before,:host(:disabled) .control::after{content:none}:host(:disabled) .control:is(*,:active,:hover),:host(:disabled) :where(slot[name='indicator']>*,::slotted([slot='indicator'])){--control-border-color:${colorNeutralStrokeDisabled};background-color:${colorNeutralBackgroundDisabled};color:${colorNeutralForegroundDisabled}}::slotted(:not([slot]):not([popover])),::slotted([popover]:not(:popover-open)){display:none}@supports not (anchor-name:--anchor){:host{--listbox-max-height:50vh;--margin-offset:calc(${lineHeightBase300} + (${spacingVerticalSNudge} * 2) + ${strokeWidthThin})}:host([size='small']){--margin-offset:calc(${lineHeightBase200} + (${spacingVerticalXS} * 2) + ${strokeWidthThin})}:host([size='large']){--margin-offset:calc(${lineHeightBase400} + (${spacingVerticalS} * 2) + ${strokeWidthThin})}}@media (forced-colors:active){:host(:disabled) .control{border-color:GrayText}:host(:disabled) :where(slot[name='indicator']>*,::slotted([slot='indicator'])){color:GrayText}`;

const definition$r = Dropdown.compose({
  name: tagName$r,
  template: template$r,
  styles: styles$q
});

definition$r.define(FluentDesignSystem.registry);

const LabelPosition = {
  above: "above",
  after: "after",
  before: "before"
};
const ValidationFlags = {
  badInput: "bad-input",
  customError: "custom-error",
  patternMismatch: "pattern-mismatch",
  rangeOverflow: "range-overflow",
  rangeUnderflow: "range-underflow",
  stepMismatch: "step-mismatch",
  tooLong: "too-long",
  tooShort: "too-short",
  typeMismatch: "type-mismatch",
  valueMissing: "value-missing",
  valid: "valid"
};
const tagName$o = `${FluentDesignSystem.prefix}-field`;

var __defProp$v = Object.defineProperty;
var __getOwnPropDesc$v = Object.getOwnPropertyDescriptor;
var __decorateClass$v = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$v(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$v(target, key, result);
  return result;
};
class BaseField extends FASTElement {
  constructor() {
    super();
    this.labelSlot = [];
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "presentation";
  }
  /**
   * Updates attributes on the slotted label elements.
   *
   * @param prev - the previous list of slotted label elements
   * @param next - the current list of slotted label elements
   */
  labelSlotChanged(prev, next) {
    if (next && this.input) {
      this.setLabelProperties();
      this.setStates();
    }
  }
  /**
   * Adds or removes the `invalid` event listener based on the presence of slotted message elements.
   *
   * @param prev - the previous list of slotted message elements
   * @param next - the current list of slotted message elements
   * @internal
   */
  messageSlotChanged(prev, next) {
    toggleState(this.elementInternals, "has-message", !!next.length);
  }
  /**
   * Sets the `input` property to the first slotted input.
   *
   * @param prev - The previous collection of inputs.
   * @param next - The current collection of inputs.
   * @internal
   */
  slottedInputsChanged(prev, next) {
    const filtered = next?.filter((node) => node.nodeType === Node.ELEMENT_NODE) ?? [];
    if (filtered?.length) {
      this.input = filtered?.[0];
    }
  }
  /**
   * Updates the field's states and label properties when the assigned input changes.
   *
   * @param prev - the previous input
   * @param next - the current input
   */
  inputChanged(prev, next) {
    if (next) {
      this.setStates();
      this.setLabelProperties();
      this.slottedInputObserver.observe(this.input, {
        attributes: true,
        attributeFilter: ["disabled", "required", "readonly"],
        subtree: true
      });
    }
  }
  /**
   * Calls the `setStates` method when a `change` event is emitted from the slotted input.
   *
   * @param e - the event object
   * @internal
   */
  changeHandler(e) {
    this.setStates();
    this.setValidationStates();
    return true;
  }
  /**
   * Redirects `click` events to the slotted input.
   *
   * @param e - the event object
   * @internal
   */
  clickHandler(e) {
    if (this === e.target) {
      this.input.click();
    }
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("invalid", this.invalidHandler, { capture: true });
    this.slottedInputObserver = new MutationObserver(() => {
      this.setStates();
    });
  }
  disconnectedCallback() {
    this.slottedInputObserver.disconnect();
    this.removeEventListener("invalid", this.invalidHandler, { capture: true });
    super.disconnectedCallback();
  }
  /**
   * Applies the `focus-visible` state to the element when the slotted input receives visible focus.
   *
   * @param e - the focus event
   * @internal
   */
  focusinHandler(e) {
    if (this.matches(":focus-within:has(> :focus-visible)")) {
      toggleState(this.elementInternals, "focus-visible", true);
    }
    return true;
  }
  /**
   * Removes the `focus-visible` state from the field when a slotted input loses focus.
   *
   * @param e - the focus event
   * @internal
   */
  focusoutHandler(e) {
    toggleState(this.elementInternals, "focus-visible", false);
    return true;
  }
  /**
   * Toggles validity state flags on the element when the slotted input emits an `invalid` event (if slotted validation messages are present).
   *
   * @param e - the event object
   * @internal
   */
  invalidHandler(e) {
    if (this.messageSlot.length) {
      e.preventDefault();
    }
    this.setValidationStates();
  }
  /**
   * Sets ARIA and form-related attributes on slotted label elements.
   *
   * @internal
   */
  setLabelProperties() {
    if (this.$fastController.isConnected) {
      this.input.id = this.input.id || uniqueId("input");
      this.labelSlot?.forEach((label) => {
        if (label instanceof HTMLLabelElement) {
          label.htmlFor = label.htmlFor || this.input.id;
          label.id = label.id || `${this.input.id}--label`;
          this.input.setAttribute("aria-labelledby", label.id);
        }
      });
    }
  }
  /**
   * Toggles the field's states based on the slotted input.
   *
   * @internal
   */
  setStates() {
    if (this.elementInternals && this.input) {
      toggleState(this.elementInternals, "disabled", !!this.input.disabled);
      toggleState(this.elementInternals, "readonly", !!this.input.readOnly);
      toggleState(this.elementInternals, "required", !!this.input.required);
      toggleState(this.elementInternals, "checked", !!this.input.checked);
    }
  }
  setValidationStates() {
    if (!this.input?.validity) {
      return;
    }
    for (const [flag, value] of Object.entries(ValidationFlags)) {
      toggleState(this.elementInternals, value, this.input.validity[flag]);
    }
  }
}
__decorateClass$v([
  observable
], BaseField.prototype, "labelSlot", 2);
__decorateClass$v([
  observable
], BaseField.prototype, "messageSlot", 2);
__decorateClass$v([
  observable
], BaseField.prototype, "slottedInputs", 2);
__decorateClass$v([
  observable
], BaseField.prototype, "input", 2);

var __defProp$u = Object.defineProperty;
var __getOwnPropDesc$u = Object.getOwnPropertyDescriptor;
var __decorateClass$u = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$u(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$u(target, key, result);
  return result;
};
class Field extends BaseField {
  constructor() {
    super(...arguments);
    this.labelPosition = LabelPosition.above;
  }
}
__decorateClass$u([
  attr({ attribute: "label-position" })
], Field.prototype, "labelPosition", 2);

const styles$p = css`${display("inline-grid")} :host{color:${colorNeutralForeground1};align-items:center;gap:0 ${spacingHorizontalM};justify-items:start}:has([slot='message']){color:${colorNeutralForeground1};row-gap:${spacingVerticalS}}:not(::slotted([slot='label'])){gap:0}:host([label-position='before']){grid-template-areas:'label input' 'label message'}:host([label-position='after']){gap:0;grid-template-areas:'input label' 'message message';grid-template-columns:auto 1fr}:host([label-position='after']) ::slotted([slot='input']){margin-inline-end:${spacingHorizontalM}}:host([label-position='above']){grid-template-areas:'label' 'input' 'message';row-gap:${spacingVerticalXXS}}:host([label-position='below']){grid-template-areas:'input' 'label' 'message';justify-items:center}:host([label-position='below']) ::slotted([slot='label']){margin-block-start:${spacingVerticalM}}:host(${requiredState}) ::slotted([slot='label'])::after{content:'*'/'';color:${colorPaletteRedForeground1};margin-inline-start:${spacingHorizontalXS}}::slotted([slot='input']){grid-area:input}::slotted([slot='message']){color:${colorNeutralForeground3};font-family:${fontFamilyBase};font-size:${fontSizeBase200};font-weight:${fontWeightRegular};grid-area:message;line-height:${lineHeightBase200};margin-block-start:${spacingVerticalXXS}}:host(${focusVisibleState}:focus-within){border-radius:${borderRadiusMedium};outline:${strokeWidthThick} solid ${colorStrokeFocus2}}::slotted(label),::slotted([slot='label']){cursor:inherit;display:inline-flex;font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};grid-area:label;line-height:${lineHeightBase300};justify-self:stretch;user-select:none}:host([size='small']) ::slotted(label){font-size:${fontSizeBase200};line-height:${lineHeightBase200}}:host([size='large']) ::slotted(label){font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host([size='large']) ::slotted(label),:host([weight='semibold']) ::slotted(label){font-weight:${fontWeightSemibold}}:host(${disabledState}){cursor:default}::slotted([flag]){display:none}:host(${badInputState}) ::slotted([flag='${ValidationFlags.badInput}']),:host(${customErrorState}) ::slotted([flag='${ValidationFlags.customError}']),:host(${patternMismatchState}) ::slotted([flag='${ValidationFlags.patternMismatch}']),:host(${rangeOverflowState}) ::slotted([flag='${ValidationFlags.rangeOverflow}']),:host(${rangeUnderflowState}) ::slotted([flag='${ValidationFlags.rangeUnderflow}']),:host(${stepMismatchState}) ::slotted([flag='${ValidationFlags.stepMismatch}']),:host(${tooLongState}) ::slotted([flag='${ValidationFlags.tooLong}']),:host(${tooShortState}) ::slotted([flag='${ValidationFlags.tooShort}']),:host(${typeMismatchState}) ::slotted([flag='${ValidationFlags.typeMismatch}']),:host(${valueMissingState}) ::slotted([flag='${ValidationFlags.valueMissing}']),:host(${validState}) ::slotted([flag='${ValidationFlags.valid}']){display:block}`;

const template$q = html`<template @click=${(x, c) => x.clickHandler(c.event)} @change=${(x, c) => x.changeHandler(c.event)} @focusin=${(x, c) => x.focusinHandler(c.event)} @focusout=${(x, c) => x.focusoutHandler(c.event)}><slot name=label part=label ${slotted("labelSlot")}></slot><slot name=input part=input ${slotted("slottedInputs")}></slot><slot name=message part=message ${slotted({ property: "messageSlot", filter: elements("[flag]") })}></slot></template>`;

const definition$q = Field.compose({
  name: tagName$o,
  template: template$q,
  styles: styles$p,
  shadowOptions: {
    delegatesFocus: true
  }
});

definition$q.define(FluentDesignSystem.registry);

const ImageFit = {
  none: "none",
  center: "center",
  contain: "contain",
  cover: "cover"
};
const ImageShape = {
  circular: "circular",
  rounded: "rounded",
  square: "square"
};
const tagName$n = `${FluentDesignSystem.prefix}-image`;

var __defProp$t = Object.defineProperty;
var __getOwnPropDesc$t = Object.getOwnPropertyDescriptor;
var __decorateClass$t = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$t(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$t(target, key, result);
  return result;
};
class Image extends FASTElement {
}
__decorateClass$t([
  attr({ mode: "boolean" })
], Image.prototype, "block", 2);
__decorateClass$t([
  attr({ mode: "boolean" })
], Image.prototype, "bordered", 2);
__decorateClass$t([
  attr({ mode: "boolean" })
], Image.prototype, "shadow", 2);
__decorateClass$t([
  attr
], Image.prototype, "fit", 2);
__decorateClass$t([
  attr
], Image.prototype, "shape", 2);

const template$p = html`<slot></slot>`;

const styles$o = css`:host{contain:content}:host ::slotted(img){box-sizing:border-box;min-height:8px;min-width:8px;display:inline-block}:host([block]) ::slotted(img){width:100%;height:auto}:host([bordered]) ::slotted(img){border:${strokeWidthThin} solid ${colorNeutralStroke2}}:host([fit='none']) ::slotted(img){object-fit:none;object-position:top left;height:100%;width:100%}:host([fit='center']) ::slotted(img){object-fit:none;object-position:center;height:100%;width:100%}:host([fit='contain']) ::slotted(img){object-fit:contain;object-position:center;height:100%;width:100%}:host([fit='cover']) ::slotted(img){object-fit:cover;object-position:center;height:100%;width:100%}:host([shadow]) ::slotted(img){box-shadow:${shadow4}}:host([shape='circular']) ::slotted(img){border-radius:${borderRadiusCircular}}:host([shape='rounded']) ::slotted(img){border-radius:${borderRadiusMedium}}`;

const definition$p = Image.compose({
  name: tagName$n,
  template: template$p,
  styles: styles$o
});

definition$p.define(FluentDesignSystem.registry);

const LabelSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const LabelWeight = {
  regular: "regular",
  semibold: "semibold"
};
const tagName$m = `${FluentDesignSystem.prefix}-label`;

var __defProp$s = Object.defineProperty;
var __getOwnPropDesc$s = Object.getOwnPropertyDescriptor;
var __decorateClass$s = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$s(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$s(target, key, result);
  return result;
};
class Label extends FASTElement {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.required = false;
  }
}
__decorateClass$s([
  attr
], Label.prototype, "size", 2);
__decorateClass$s([
  attr
], Label.prototype, "weight", 2);
__decorateClass$s([
  attr({ mode: "boolean" })
], Label.prototype, "disabled", 2);
__decorateClass$s([
  attr({ mode: "boolean" })
], Label.prototype, "required", 2);

const styles$n = css`${display("inline-flex")} :host{color:${colorNeutralForeground1};cursor:pointer;font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};line-height:${lineHeightBase300};user-select:none}.asterisk{color:${colorPaletteRedForeground1};margin-inline-start:${spacingHorizontalXS}}:host([size='small']){font-size:${fontSizeBase200};line-height:${lineHeightBase200}}:host([size='large']){font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host(:is([size='large'],[weight='semibold'])){font-weight:${fontWeightSemibold}}:host([disabled]),:host([disabled]) .asterisk{color:${colorNeutralForegroundDisabled}}`;

function labelTemplate() {
  return html`<slot></slot><span part=asterisk class=asterisk aria-hidden=true ?hidden=${(x) => !x.required}>*</span>`;
}
const template$o = labelTemplate();

const definition$o = Label.compose({
  name: tagName$m,
  template: template$o,
  styles: styles$n
});

definition$o.define(FluentDesignSystem.registry);

const LinkAppearance = {
  subtle: "subtle"
};
const LinkTarget = AnchorTarget;
const tagName$l = `${FluentDesignSystem.prefix}-link`;

var __defProp$r = Object.defineProperty;
var __getOwnPropDesc$r = Object.getOwnPropertyDescriptor;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$r(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$r(target, key, result);
  return result;
};
class Link extends BaseAnchor {
  constructor() {
    super(...arguments);
    this.inline = false;
  }
}
__decorateClass$r([
  attr
], Link.prototype, "appearance", 2);
__decorateClass$r([
  attr({ mode: "boolean" })
], Link.prototype, "inline", 2);

const styles$m = css`${display("inline")} :host{position:relative;box-sizing:border-box;background-color:transparent;color:${colorBrandForegroundLink};cursor:pointer;font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};overflow:inherit;text-align:start;text-decoration:none;text-decoration-thickness:${strokeWidthThin};text-overflow:inherit;user-select:text}:host(:is(:hover,:focus-visible)){outline:none;text-decoration-line:underline}@media (hover:hover){:host(:hover){color:${colorBrandForegroundLinkHover}}:host(:active){color:${colorBrandForegroundLinkPressed}}:host([appearance='subtle']:hover){color:${colorNeutralForeground2LinkHover}}:host([appearance='subtle']:active){color:${colorNeutralForeground2LinkPressed}}}:host([appearance='subtle']){color:${colorNeutralForeground2Link}}:host-context(:is(h1,h2,h3,h4,h5,h6,p,fluent-text)),:host([inline]){font:inherit;text-decoration:underline}:host(:not([href])){color:inherit;text-decoration:none}::slotted(a){position:absolute;inset:0}@media (forced-colors:active){:host{color:LinkText}}`;

function anchorTemplate() {
  return html`<template tabindex=0 @click=${(x, c) => x.clickHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)}><slot></slot></template>`;
}
const template$n = anchorTemplate();

const definition$n = Link.compose({
  name: tagName$l,
  template: template$n,
  styles: styles$m
});

definition$n.define(FluentDesignSystem.registry);

var __defProp$q = Object.defineProperty;
var __getOwnPropDesc$q = Object.getOwnPropertyDescriptor;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$q(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$q(target, key, result);
  return result;
};
class Listbox extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "listbox";
  }
  /**
   * Calls the `slotchangeHandler` when the `defaultSlot` element is assigned
   * via the `ref` directive in the template.
   *
   * @internal
   */
  defaultSlotChanged() {
    this.slotchangeHandler();
  }
  /**
   * Updates the multiple selection state of the listbox and its options.
   *
   * @param prev - the previous multiple value
   * @param next - the current multiple value
   */
  multipleChanged(prev, next) {
    this.elementInternals.ariaMultiSelectable = next ? "true" : "false";
    toggleState(this.elementInternals, "multiple", next);
    Updates.enqueue(() => {
      this.options.forEach((x) => {
        x.multiple = !!next;
      });
    });
  }
  /**
   * Updates the enabled options collection when properties on the child options change.
   *
   * @param prev - the previous options
   * @param next - the current options
   *
   * @internal
   */
  optionsChanged(prev, next) {
    next?.forEach((option, index) => {
      option.elementInternals.ariaPosInSet = `${index + 1}`;
      option.elementInternals.ariaSetSize = `${next.length}`;
    });
  }
  /**
   * Handles the `beforetoggle` event on the listbox.
   *
   * @param e - the toggle event
   * @returns true to allow the default popover behavior, undefined to prevent it
   * @internal
   */
  beforetoggleHandler(e) {
    if (!this.dropdown) {
      return true;
    }
    if (this.dropdown.disabled) {
      this.dropdown.open = false;
      return;
    }
    this.dropdown.open = e.newState === "open";
    return true;
  }
  /**
   * The collection of child options that are not disabled.
   *
   * @internal
   */
  get enabledOptions() {
    return this.options?.filter((x) => !x.disabled) ?? [];
  }
  /**
   * The collection of child options that are selected.
   *
   * @public
   */
  get selectedOptions() {
    return this.options?.filter((x) => x.selected) ?? [];
  }
  /**
   * Sets the `selected` state on a target option when clicked.
   *
   * @param e - The pointer event
   * @public
   */
  clickHandler(e) {
    if (this.dropdown) {
      return true;
    }
    const target = e.target;
    if (isDropdownOption(target)) {
      this.selectOption(this.enabledOptions.indexOf(target));
    }
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    waitForConnectedDescendants(
      this,
      () => {
        this.id = this.id || uniqueId("listbox-");
      },
      { shallow: true }
    );
  }
  /**
   * Handles observable subscriptions for the listbox.
   *
   * @param source - The source of the observed change
   * @param propertyName - The name of the property that changed
   *
   * @internal
   */
  handleChange(source, propertyName) {
    if (propertyName === "multiple") {
      this.multiple = source.multiple;
      return;
    }
  }
  /**
   * Selects an option by index.
   *
   * @param index - The index of the option to select.
   * @public
   */
  selectOption(index = this.selectedIndex) {
    let selectedIndex = this.selectedIndex;
    if (!this.multiple) {
      this.enabledOptions.forEach((item, i) => {
        const shouldCheck = i === index;
        item.selected = shouldCheck;
        if (shouldCheck) {
          selectedIndex = i;
        }
      });
    } else {
      const option = this.enabledOptions[index];
      if (option) {
        option.selected = !option.selected;
      }
      selectedIndex = index;
    }
    this.selectedIndex = selectedIndex;
  }
  /**
   * Handles the `slotchange` event for the default slot.
   * Sets the `options` property to the list of slotted options.
   *
   * @param e - The slotchange event
   * @public
   */
  slotchangeHandler(e) {
    waitForConnectedDescendants(this, () => {
      if (this.defaultSlot) {
        const options = this.defaultSlot.assignedElements().filter((option) => isDropdownOption(option));
        this.options = options;
      }
    });
  }
}
__decorateClass$q([
  observable
], Listbox.prototype, "defaultSlot", 2);
__decorateClass$q([
  observable
], Listbox.prototype, "multiple", 2);
__decorateClass$q([
  observable
], Listbox.prototype, "options", 2);
__decorateClass$q([
  observable
], Listbox.prototype, "selectedIndex", 2);
__decorateClass$q([
  observable
], Listbox.prototype, "dropdown", 2);

const styles$l = css`${display("inline-flex")} :host{background-color:${colorNeutralBackground1};border-radius:${borderRadiusMedium};border:${strokeWidthThin} solid ${colorTransparentStroke};box-shadow:${shadow16};box-sizing:border-box;flex-direction:column;margin:0;min-width:160px;padding:${spacingHorizontalXS};row-gap:${spacingHorizontalXXS};width:auto}:host([popover]){inset:unset;overflow:auto}@supports (anchor-name:--anchor){:host([popover]){position:absolute;margin-block-start:0;max-height:var(--listbox-max-height,calc(50vh - anchor-size(self-block)));min-width:anchor-size(width);position-anchor:--dropdown;position-area:block-end span-inline-end;position-try-fallbacks:flip-inline,flip-block,--flip-block,block-start}@position-try --flip-block{bottom:anchor(top);top:unset}}@supports not (anchor-name:--anchor){:host([popover]){margin-block-start:var(--margin-offset,0);max-height:var(--listbox-max-height,50vh);position:fixed}:host([popover]${flipBlockState}){margin-block-start:revert;translate:0 -100%}}`;

function listboxTemplate() {
  return html`<template @beforetoggle=${(x, c) => x.beforetoggleHandler(c.event)} @click=${(x, c) => x.clickHandler(c.event)}><slot ${ref("defaultSlot")} @slotchange=${(x, c) => x.slotchangeHandler(c.event)}></slot></template>`;
}
const template$m = listboxTemplate();

const definition$m = Listbox.compose({
  name: tagName$q,
  template: template$m,
  styles: styles$l
});

definition$m.define(FluentDesignSystem.registry);

const MenuButtonAppearance = ButtonAppearance;
const MenuButtonShape = ButtonShape;
const MenuButtonSize = ButtonSize;
const tagName$k = `${FluentDesignSystem.prefix}-menu-button`;

class MenuButton extends Button {
}

const template$l = buttonTemplate$1({
  end: html.partial(
    /* html */
    `<svg slot=end fill=currentColor aria-hidden=true width=1em height=1em viewBox="0 0 20 20" xmlns=http://www.w3.org/2000/svg><path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z" fill=currentColor></path></svg>`
  )
});

const definition$l = MenuButton.compose({
  name: tagName$k,
  template: template$l,
  styles: styles$C
});

definition$l.define(FluentDesignSystem.registry);

const MenuItemRole = {
  /**
   * The menu item has a "menuitem" role
   */
  menuitem: "menuitem",
  /**
   * The menu item has a "menuitemcheckbox" role
   */
  menuitemcheckbox: "menuitemcheckbox",
  /**
   * The menu item has a "menuitemradio" role
   */
  menuitemradio: "menuitemradio"
};
const roleForMenuItem = {
  [MenuItemRole.menuitem]: "menuitem",
  [MenuItemRole.menuitemcheckbox]: "menuitemcheckbox",
  [MenuItemRole.menuitemradio]: "menuitemradio"
};
function isMenuItem(element, tagName2 = "-menu-item") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const tagName$j = `${FluentDesignSystem.prefix}-menu-item`;

var __defProp$p = Object.defineProperty;
var __getOwnPropDesc$p = Object.getOwnPropertyDescriptor;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$p(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$p(target, key, result);
  return result;
};
class MenuItem extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.role = MenuItemRole.menuitem;
    this.checked = false;
    /**
     * @internal
     */
    this.handleMenuItemKeyDown = (e) => {
      if (e.defaultPrevented) {
        return false;
      }
      switch (e.key) {
        case "Enter":
        case " ":
          this.invoke();
          return false;
        case "ArrowRight":
          if (!this.disabled) {
            this.submenu?.togglePopover(true);
            this.submenu?.focus();
          }
          return false;
        case "ArrowLeft":
          if (this.parentElement?.hasAttribute("popover")) {
            this.parentElement.togglePopover(false);
            this.parentElement.parentElement?.focus();
          }
          return false;
      }
      return true;
    };
    /**
     * @internal
     */
    this.handleMenuItemClick = (e) => {
      if (e.defaultPrevented || this.disabled) {
        return false;
      }
      this.invoke();
      return false;
    };
    /**
     * @internal
     */
    this.handleMouseOver = (e) => {
      if (this.disabled) {
        return false;
      }
      this.submenu?.togglePopover(true);
      return false;
    };
    /**
     * @internal
     */
    this.handleMouseOut = (e) => {
      if (this.contains(document.activeElement)) {
        return false;
      }
      this.submenu?.togglePopover(false);
      return false;
    };
    /**
     * Setup required ARIA on open/close
     * @internal
     */
    this.handleToggle = (e) => {
      if (!(e instanceof ToggleEvent)) {
        return;
      }
      if (e.newState === "open") {
        this.elementInternals.ariaExpanded = "true";
        this.setSubmenuPosition();
      }
      if (e.newState === "closed") {
        this.elementInternals.ariaExpanded = "false";
      }
      this.submenu?.setAttribute("focusgroup", e.newState === "open" ? "menu" : "none");
    };
    /** @internal */
    this.handleSubmenuFocusOut = (e) => {
      if (e.relatedTarget && this.submenu?.contains(e.relatedTarget)) {
        return;
      }
      this.submenu?.togglePopover(false);
    };
    /**
     * @internal
     */
    this.invoke = () => {
      if (this.disabled) {
        return;
      }
      switch (this.role) {
        case MenuItemRole.menuitemcheckbox:
          this.checked = !this.checked;
          break;
        case MenuItemRole.menuitem:
          if (!!this.submenu) {
            this.submenu.togglePopover(true);
            this.submenu.focus();
            break;
          }
          this.$emit("change");
          break;
        case MenuItemRole.menuitemradio:
          if (!this.checked) {
            this.checked = true;
          }
          break;
      }
    };
    /**
     * Set fallback position of menu on open when CSS anchor not supported
     * @internal
     */
    this.setSubmenuPosition = () => {
      if (!CSS.supports("anchor-name", "--anchor") && !!this.submenu) {
        const thisRect = this.getBoundingClientRect();
        const thisSubmenuRect = this.submenu.getBoundingClientRect();
        const inlineEnd = getComputedStyle(this).direction === "ltr" ? "right" : "left";
        if (thisRect.width + thisSubmenuRect.width > window.innerWidth * 0.75) {
          this.submenu.style.translate = "0 -100%";
          return;
        }
        if (thisRect[inlineEnd] + thisSubmenuRect.width > window.innerWidth) {
          this.submenu.style.translate = "-100% 0";
          return;
        }
        this.submenu.style.translate = `${thisRect.width - 8}px 0`;
      }
    };
  }
  /**
   * Handles changes to disabled attribute custom states and element internals
   * @param prev - the previous state
   * @param next - the next state
   */
  disabledChanged(prev, next) {
    this.elementInternals.ariaDisabled = !!next ? `${next}` : null;
    toggleState(this.elementInternals, "disabled", next);
  }
  /**
   * Handles changes to role attribute element internals properties
   * @param prev - the previous state
   * @param next - the next state
   */
  roleChanged(prev, next) {
    this.elementInternals.role = next ?? MenuItemRole.menuitem;
  }
  /**
   * Handles changes to checked attribute custom states and element internals
   * @param prev - the previous state
   * @param next - the next state
   */
  checkedChanged(prev, next) {
    const checkableMenuItem = this.role !== MenuItemRole.menuitem;
    this.elementInternals.ariaChecked = checkableMenuItem ? `${!!next}` : null;
    toggleState(this.elementInternals, "checked", checkableMenuItem ? next : false);
    if (this.$fastController.isConnected) {
      this.$emit("change", next, { bubbles: true });
    }
  }
  /**
   * Sets the submenu and updates its position.
   *
   * @internal
   */
  slottedSubmenuChanged(prev, next) {
    this.submenu?.removeEventListener("toggle", this.handleToggle);
    this.submenu?.removeEventListener("focusout", this.handleSubmenuFocusOut);
    if (next.length) {
      this.submenu = next[0];
      this.submenu.toggleAttribute("popover", true);
      this.submenu.setAttribute("focusgroup", "none");
      this.submenu.addEventListener("toggle", this.handleToggle);
      this.submenu.addEventListener("focusout", this.handleSubmenuFocusOut);
      this.elementInternals.ariaHasPopup = "menu";
      toggleState(this.elementInternals, "submenu", true);
    } else {
      this.elementInternals.ariaHasPopup = null;
      toggleState(this.elementInternals, "submenu", false);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.elementInternals.role = this.role ?? MenuItemRole.menuitem;
    this.elementInternals.ariaChecked = this.role !== MenuItemRole.menuitem ? `${!!this.checked}` : null;
  }
}
__decorateClass$p([
  attr({ mode: "boolean" })
], MenuItem.prototype, "disabled", 2);
__decorateClass$p([
  attr
], MenuItem.prototype, "role", 2);
__decorateClass$p([
  attr({ mode: "boolean" })
], MenuItem.prototype, "checked", 2);
__decorateClass$p([
  attr({ mode: "boolean" })
], MenuItem.prototype, "hidden", 2);
__decorateClass$p([
  observable
], MenuItem.prototype, "slottedSubmenu", 2);
__decorateClass$p([
  observable
], MenuItem.prototype, "submenu", 2);
applyMixins(MenuItem, StartEnd);

const styles$k = css`${display("grid")} :host{--indent:0;align-items:center;background:${colorNeutralBackground1};border-radius:${borderRadiusMedium};color:${colorNeutralForeground2};contain:layout;cursor:pointer;flex-shrink:0;font:${fontWeightRegular} ${fontSizeBase300}/${lineHeightBase300} ${fontFamilyBase};grid-gap:4px;grid-template-columns:20px 20px auto 20px;height:32px;overflow:visible;padding:0 10px}:host(:hover){background:${colorNeutralBackground1Hover};color:${colorNeutralForeground2Hover}}:host(:active){background-color:${colorNeutralBackground1Selected};color:${colorNeutralForeground2Pressed}}:host(:active) ::slotted([slot='start']){color:${colorCompoundBrandForeground1Pressed}}:host(${disabledState}){background-color:${colorNeutralBackgroundDisabled};color:${colorNeutralForegroundDisabled}}:host(${disabledState}) ::slotted([slot='start']),:host(${disabledState}) ::slotted([slot='end']){color:${colorNeutralForegroundDisabled}}:host(:focus-visible){border-radius:${borderRadiusMedium};outline:2px solid ${colorStrokeFocus2}}.content{white-space:nowrap;flex-grow:1;grid-column:auto/span 2;padding:0 2px}:host(:not(${checkedState})) .indicator,:host(:not(${checkedState})) ::slotted([slot='indicator']),:host(:not(${submenuState})) .submenu-glyph,:host(:not(${submenuState})) ::slotted([slot='submenu-glyph']){display:none}::slotted([slot='end']){color:${colorNeutralForeground3};font:${fontWeightRegular} ${fontSizeBase200}/${lineHeightBase200} ${fontFamilyBase};white-space:nowrap}:host([data-indent='1']){--indent:1}:host([data-indent='2']){--indent:2;grid-template-columns:20px 20px auto auto}:host(${submenuState}){grid-template-columns:20px auto auto 20px}:host([data-indent='2']${submenuState}){grid-template-columns:20px 20px auto auto 20px}.indicator,::slotted([slot='indicator']){grid-column:1/span 1;width:20px}::slotted([slot='start']){display:inline-flex;grid-column:calc(var(--indent))/span 1}.content{grid-column:calc(var(--indent) + 1)/span 1}::slotted([slot='end']){grid-column:calc(var(--indent) + 2)/span 1;justify-self:end}.submenu-glyph,::slotted([slot='submenu-glyph']){grid-column:-2/span 1;justify-self:end}@layer popover{:host{anchor-name:--menu-trigger;position:relative}::slotted([popover]){margin:0;max-height:var(--menu-max-height,auto);position:absolute;position-anchor:--menu-trigger;position-area:inline-end span-block-end;position-try-fallbacks:flip-inline,block-start,block-end;z-index:1}::slotted([popover]:not(:popover-open)){display:none}::slotted([popover]:popover-open){inset:unset}@supports not (anchor-name:--menu-trigger){::slotted([popover]){align-self:start}}}@media (forced-colors:active){:host(${disabledState}),:host(${disabledState}) ::slotted([slot='start']),:host(${disabledState}) ::slotted([slot='end']){color:GrayText}}`;

const Checkmark16Filled = html.partial(
  `<svg class=indicator fill=currentColor aria-hidden=true width=16 height=16 viewBox="0 0 16 16" xmlns=http://www.w3.org/2000/svg><path d="M14.05 3.49c.28.3.27.77-.04 1.06l-7.93 7.47A.85.85 0 014.9 12L2.22 9.28a.75.75 0 111.06-1.06l2.24 2.27 7.47-7.04a.75.75 0 011.06.04z" fill=currentColor></path></svg>`
);
const chevronRight16Filled = html.partial(
  `<svg class=submenu-glyph fill=currentColor aria-hidden=true width=16 height=16 viewBox="0 0 16 16" xmlns=http://www.w3.org/2000/svg><path d="M5.74 3.2a.75.75 0 00-.04 1.06L9.23 8 5.7 11.74a.75.75 0 101.1 1.02l4-4.25a.75.75 0 000-1.02l-4-4.25a.75.75 0 00-1.06-.04z" fill=currentColor></path></svg>`
);
function menuItemTemplate(options = {}) {
  return html`<template tabindex=0 @keydown=${(x, c) => x.handleMenuItemKeyDown(c.event)} @click=${(x, c) => x.handleMenuItemClick(c.event)} @mouseover=${(x, c) => x.handleMouseOver(c.event)} @mouseout=${(x, c) => x.handleMouseOut(c.event)} @toggle=${(x, c) => x.handleToggle(c.event)}><slot name=indicator>${staticallyCompose(options.indicator)}</slot>${startSlotTemplate(options)}<div part=content class=content><slot></slot></div>${endSlotTemplate(options)}<slot name=submenu-glyph>${staticallyCompose(options.submenuGlyph)}</slot><slot name=submenu ${slotted({ property: "slottedSubmenu" })}></slot></template>`;
}
const template$k = menuItemTemplate({
  indicator: Checkmark16Filled,
  submenuGlyph: chevronRight16Filled
});

const definition$k = MenuItem.compose({
  name: tagName$j,
  template: template$k,
  styles: styles$k
});

definition$k.define(FluentDesignSystem.registry);

const tagName$i = `${FluentDesignSystem.prefix}-menu-list`;

//#region src/constants.js
/** @enum {string} */
var DatasetName = {
	INFERRED_ROLE: "data-fg-ir",
	ITEM: "data-fg-item",
	AUTHOR_TABINDEX: "data-fg-ati",
	SEGMENT: "data-fg-seg",
	SEGMENT_START: "data-fg-segs"
};
/** @enum {string} */
var BehaviorToken = {
	TOOLBAR: "toolbar",
	TABLIST: "tablist",
	RADIOGROUP: "radiogroup",
	LISTBOX: "listbox",
	MENU: "menu",
	MENUBAR: "menubar",
	NONE: "none"
};

//#region src/shadow-utils/index-shadowless.js
function nodeContains(node, otherNode) {
	return node.contains(otherNode);
}

/**
* Whether the current user agent supports focusgroup.
*
* @returns {boolean}
*/
function supportsFocusGroup() {
	return "focusgroup" in (globalThis?.HTMLElement?.prototype ?? {});
}
/**
* Gets the navigation direction (“forward” or “backward”) based on:
*
* - The key that the user just pressed
* - The owner element’s writing mode and direction
* - The current focus group’s directional limit (“inline”, “block”, none)
*
* @param {KeyboardEvent} event - The keyboard event object.
* @param {HTMLElement} owner - The owner element.
* @param {("inline" | "block" | undefined)} axis - The directional limitation.
* @returns {("forward" | "backward" | "start" | "end" | null)} Returns `null`
*     if there shouldn’t be navigation, e.g. when directional limit applies.
*/
function getNavigationDirection(event, owner, axis) {
	const FORWARD = "forward";
	const BACKWARD = "backward";
	const BLOCK = "block";
	const INLINE = "inline";
	if (isKeyConflictElement(event.composedPath()[0])) return event.key === "Tab" ? event.shiftKey ? BACKWARD : FORWARD : null;
	if (event.shiftKey || event.ctrlKey || event.metaKey) return null;
	const { writingMode, direction } = window.getComputedStyle(owner);
	const isVertical = !writingMode.startsWith("horizontal-");
	const isRtl = direction === "rtl";
	const horizontal = isVertical ? BLOCK : INLINE;
	const vertical = isVertical ? INLINE : BLOCK;
	const isHorizontalReversed = isVertical ? writingMode.endsWith("-rl") !== isRtl : isRtl;
	const isVerticalReversed = isVertical && isRtl;
	const action = {
		ArrowUp: {
			axis: vertical,
			dir: isVerticalReversed ? FORWARD : BACKWARD
		},
		ArrowDown: {
			axis: vertical,
			dir: isVerticalReversed ? BACKWARD : FORWARD
		},
		ArrowLeft: {
			axis: horizontal,
			dir: isHorizontalReversed ? FORWARD : BACKWARD
		},
		ArrowRight: {
			axis: horizontal,
			dir: isHorizontalReversed ? BACKWARD : FORWARD
		},
		Home: { dir: "start" },
		End: { dir: "end" }
	}[event.key];
	if (!action || axis && action.axis && action.axis !== axis) return null;
	return action.dir;
}
/**
* Whether a given element has keyboard conflicts with navigation keys, in which
* case they should be considered as segmentors.
*
* @param {HTMLElement} element
* @returns {boolean}
*/
function isKeyConflictElement(el) {
	return el?.nodeType === Node.ELEMENT_NODE && ([
		"INPUT",
		"TEXTAREA",
		"SELECT"
	].includes(el.nodeName) && !["checkbox", "radio"].includes(el.getAttribute("type")) || el.isContentEditable || ["AUDIO", "VIDEO"].includes(el.nodeName) && el.hasAttribute("controls") || ["IFRAME", "OBJECT"].includes(el.nodeName));
}

//#region src/global-state.js
/**
* @type {{ o: Set<MutationObserver>, m?: Map<HTMLElement, *>, g?: MutationObserver, b: boolean }}
* @global
*/
globalThis.__FOCUSGROUP_POLYFILL__ ??= {
	o: /* @__PURE__ */ new Set(),
	b: false
};
var state = globalThis.__FOCUSGROUP_POLYFILL__;

//#region src/observer-registry.js
/** @type {Set<MutationObserver>} */
var observers = state.o;
/**
* Flushes all globally registered focusgroup MutationObservers by calling
* `takeRecords()` on each, discarding any pending mutation records that were
* caused by polyfill-managed attribute writes. This prevents infinite
* cross-group loops between nested focusgroups whose subtrees overlap.
*/
function flushAllObservers() {
	for (const observer of observers) observer.takeRecords();
}

//#region src/focusgroup.js
/**
* @import {
*   FocusGroupItemCollection,
*   FocusGroupOptions,
*   FocusGroupUpdateInfo,
* } from "./focusgroup-items.js"
* @import {FocusGroupDefinition} from "./utils.js"
*/
var FocusGroup = class {
	/**
	* The focus group owner element.
	* @type {HTMLElement!}
	*/
	#owner;
	/**
	* The items collection — exposes the focus group's items and answers
	* queries about them. Reconciliation is triggered externally via
	* `FocusGroup#update()`.
	* @type {FocusGroupItemCollection}
	*/
	#items;
	/**
	* The focus group behavior.
	* @type {BehaviorToken!}
	*/
	#behavior = BehaviorToken.NONE;
	/**
	* The focus group navigation axis limitation.
	* @type {("inline" | "block" | undefined)}
	*/
	#axis = void 0;
	/**
	* Whether the focus group wraps. Defaults to `false`.
	* @type {boolean}
	*/
	#wrap = false;
	/**
	* Whether the focus group remembers the previously focused element.
	* Defaults to `true`.
	* @type {boolean}
	*/
	#memory = true;
	/**
	* The focus group start element (initial tab stop after decoration).
	* @type {HTMLElement}
	*/
	#start;
	/**
	* The current item — the most recently focused item within the group.
	* Serves as the keyboard-navigation cursor while focus is inside, and (in
	* memory mode) as the tab stop to restore on re-entry. Updated by
	* `#handleFocusin`, plus directly by `#handleKeydown` for shadow-internal
	* navigation (where focus events don't cross the shadow boundary).
	* Cleared in nomemory mode on focusout and when validation fails after
	* re-decoration.
	* @type {HTMLElement|null}
	*/
	#current = null;
	/**
	* Whether the owner currently has `tabindex=0` set as a Tab-entry proxy so
	* sequential focus navigation can reach a tab stop inside a shadow root.
	* @type {boolean}
	*/
	#ownerIsProxy = false;
	/**
	* The owner's original `tabindex` attribute value (or `null` if it had no
	* `tabindex`), saved before the polyfill sets `tabindex=0` for proxy duty.
	* @type {string|null}
	*/
	#ownerTabindexBeforeProxy = null;
	/**
	* The abort controller for when `disconnect()` is called.
	* @type {AbortController}
	*/
	#abort = new AbortController();
	/**
	* Optional owner-decoration hook injected via `options.decorateOwner`.
	* Called with `(owner, behavior)` on decoration and `(owner, null)` on
	* undecoration. When absent, no owner decoration happens.
	* @type {((element: HTMLElement, behavior: BehaviorToken|null) => void) | undefined}
	*/
	#decorateOwner;
	/**
	* Optional item-decoration hook injected via `options.decorateItem`.
	* Called with `(item, behavior)` on decoration and `(item, null)` on
	* undecoration. When absent, no item decoration happens.
	* @type {((element: HTMLElement, behavior: BehaviorToken|null) => void) | undefined}
	*/
	#decorateItem;
	/**
	* @param {HTMLElement!} owner - The focus group owner element.
	* @param {FocusGroupItemCollection} items - The items collection providing
	*     item discovery and queries.
	* @param {FocusGroupOptions} [options]
	*/
	constructor(owner, items, options = {}) {
		if (supportsFocusGroup() || !owner) return;
		this.#owner = owner;
		this.#items = items;
		this.#decorateOwner = options.decorateOwner;
		this.#decorateItem = options.decorateItem;
		this.#updateDefinition(options.definition);
		this.#decorateOwner?.(this.#owner, this.#behavior);
		this.#decorateItems();
		const opts = { signal: this.#abort.signal };
		this.#owner.addEventListener("keydown", this.#handleKeydown.bind(this), opts);
		this.#owner.addEventListener("focusin", this.#handleFocusin.bind(this), opts);
		this.#owner.addEventListener("focusout", this.#handleFocusout.bind(this), opts);
	}
	/**
	* Tears down the focus group: disables the owner proxy, removes all event
	* listeners (via the abort signal), then disconnects the items collection
	* if it supports it.
	*
	* Ordering matters: owner-proxy teardown can trigger `flushAllObservers()`,
	* which expects the items' observer to still be in the global registry.
	* The items' own `disconnect()` is therefore called last.
	*
	* NOTE: This method does not undecorate the elements. Call it only after
	* the focusgroup owner has been removed from the DOM.
	*/
	disconnect() {
		this.#disableFocusabilityProxy();
		this.#abort.abort();
		this.#items?.disconnect?.();
		this.#owner = null;
	}
	/**
	* Reconciles decoration state in response to relevant changes. Call this
	* whenever the focus group should refresh — e.g. items were added or
	* removed, the owner's `focusgroup` attribute changed, or an author set
	* `tabindex` on a decorated item.
	*
	* The polyfill's default `TreeWalkerItemCollection` calls this from a
	* `MutationObserver`. App-supplied collections (or app code that knows
	* when its model changed) can call it directly.
	*
	* @param {FocusGroupUpdateInfo} [info]
	*/
	update(info = {}) {
		if (!this.#owner) return;
		if (info.definition !== void 0) {
			this.#updateDefinition(info.definition);
			this.#decorateOwner?.(this.#owner, this.#behavior);
		}
		if (info.authorTabindexChanges) for (const el of info.authorTabindexChanges) el.setAttribute(DatasetName.AUTHOR_TABINDEX, el.getAttribute("tabindex") ?? "none");
		this.#undecorateItems();
		this.#decorateItems();
	}
	/** @param {FocusGroupDefinition} [def] */
	#updateDefinition(def) {
		this.#behavior = def?.behavior ?? BehaviorToken.NONE;
		this.#wrap = def?.wrap ?? false;
		this.#axis = def?.axis;
		this.#memory = def?.memory ?? true;
		if (!this.#memory) this.#current = null;
	}
	#decorateItems() {
		if (this.#behavior === BehaviorToken.NONE) {
			this.#undecorateItems();
			return;
		}
		this.#items.decorate?.();
		for (const { element, segmentBoundary } of this.#items.items()) {
			this.#decorateItem?.(element, this.#behavior);
			element.setAttribute(DatasetName.AUTHOR_TABINDEX, element.getAttribute("tabindex") ?? "none");
			element.tabIndex = segmentBoundary ? 0 : -1;
		}
		if (!this.#current?.isConnected || !(this.#items.isItem?.(this.#current) ?? this.#items.contains(this.#current))) this.#current = null;
		const startItem = this.#current ?? this.#items.start ?? this.#items.first?.() ?? null;
		if (startItem) {
			startItem.tabIndex = 0;
			this.#start = startItem;
			this.#disableFocusabilityProxy();
			this.#enableFocusabilityProxy(startItem);
		}
		this.#items.flush?.();
	}
	#undecorateItems() {
		this.#disableFocusabilityProxy();
		let undecorated = false;
		for (const { element } of this.#items.items()) {
			undecorated = true;
			this.#decorateItem?.(element, null);
			const authorTabIndex = element.getAttribute(DatasetName.AUTHOR_TABINDEX);
			if (authorTabIndex) {
				if (authorTabIndex === "none") element.removeAttribute("tabindex");
				else element.setAttribute("tabindex", authorTabIndex);
				element.removeAttribute(DatasetName.AUTHOR_TABINDEX);
			}
		}
		this.#items.undecorate?.();
		if (undecorated) this.#items.flush?.();
	}
	/** @param {KeyboardEvent} evt */
	#handleKeydown(evt) {
		const current = evt.composedPath()[0];
		if (evt.defaultPrevented || current === this.#owner) return;
		if (!this.#items.contains(current)) return;
		let target;
		switch (getNavigationDirection(evt, current, this.#axis)) {
			case "start":
				target = this.#items.first();
				break;
			case "end":
				target = this.#items.last();
				break;
			case "forward":
				target = this.#items.next(current);
				if (!target && this.#wrap) target = this.#items.first();
				break;
			case "backward":
				target = this.#items.previous(current);
				if (!target && this.#wrap) target = this.#items.last();
				break;
		}
		if (target && target !== current) {
			this.#advanceFocus(current, target, true);
			this.#current = target;
			evt.preventDefault();
		}
	}
	/** @param {FocusEvent} evt */
	#handleFocusin(evt) {
		const target = evt.composedPath()[0];
		if (target === this.#owner && this.#ownerIsProxy && (!evt.relatedTarget || !nodeContains(this.#owner, evt.relatedTarget))) {
			const tabStop = this.#current || this.#start;
			this.#disableFocusabilityProxy();
			if (tabStop) tabStop.focus();
			evt.stopPropagation();
			return;
		}
		if (!this.#items.contains(target)) return;
		if (this.#ownerIsProxy) this.#disableFocusabilityProxy();
		const prev = this.#current;
		this.#current = target;
		if (prev === target) return;
		if (target.tabIndex < 0) {
			const transferFrom = prev ?? this.#start;
			if (transferFrom) this.#advanceFocus(transferFrom, target);
		}
	}
	/** @param {FocusEvent} evt */
	#handleFocusout(evt) {
		if (!evt.relatedTarget || !nodeContains(this.#owner, evt.relatedTarget)) {
			const tabStop = this.#memory ? this.#current || this.#start : this.#start;
			if (tabStop) this.#enableFocusabilityProxy(tabStop);
		}
		if (evt.relatedTarget && nodeContains(this.#owner, evt.relatedTarget) || this.#memory || !this.#start) return;
		const prev = this.#current;
		this.#current = null;
		const nextStart = this.#items.start ?? this.#items.first?.() ?? null;
		if (prev !== this.#start || nextStart !== this.#start) {
			for (const { element, segmentBoundary } of this.#items.items()) element.tabIndex = segmentBoundary ? 0 : -1;
			if (nextStart) {
				nextStart.tabIndex = 0;
				this.#start = nextStart;
			}
			this.#items.flush?.();
		}
	}
	/**
	* If the tab stop is inside a shadow DOM, sets `tabindex=0` on the
	* focusgroup owner so the browser's Tab navigation can land on it, at
	* which point `#handleFocusin` will redirect focus to the real tab stop.
	* @param {HTMLElement} tabStop - The actual focusable tab stop element.
	*/
	#enableFocusabilityProxy(tabStop) {
		const rootNode = (tabStop.assignedSlot ?? tabStop).getRootNode();
		const hasFocusableHost = rootNode instanceof ShadowRoot && rootNode.host.hasAttribute(DatasetName.AUTHOR_TABINDEX);
		if (this.#ownerIsProxy || !hasFocusableHost) return;
		this.#ownerTabindexBeforeProxy = this.#owner.getAttribute("tabindex");
		this.#owner.tabIndex = 0;
		this.#ownerIsProxy = true;
		flushAllObservers();
	}
	/** Undoes `#enableFocusabilityProxy`. */
	#disableFocusabilityProxy() {
		if (!this.#ownerIsProxy) return;
		if (this.#ownerTabindexBeforeProxy !== null) this.#owner.setAttribute("tabindex", this.#ownerTabindexBeforeProxy);
		else this.#owner.removeAttribute("tabindex");
		this.#ownerIsProxy = false;
		this.#ownerTabindexBeforeProxy = null;
		this.#items.flush?.();
		flushAllObservers();
	}
	/**
	* Advances the focusgroup's active tab stop from one item to another. Sets
	* the target's `tabindex` to `0` and optionally calls `focus()` on it. The
	* previous item's `tabindex` is set to `-1` unless it belongs to a different
	* segment (in which case it remains `0` as a segment tab stop). Also disables
	* the owner proxy.
	*
	* @param {HTMLElement} prev - The currently focused item.
	* @param {HTMLElement} next - The item to receive focus.
	* @param {boolean} [shouldCallFocus=false] - Whether to programmatically
	*     call `focus()` on the target element.
	*/
	#advanceFocus(prev, next, shouldCallFocus = false) {
		next.tabIndex = 0;
		if (shouldCallFocus) next.focus();
		prev.tabIndex = this.#items.sameSegment?.(prev, next) ?? true ? -1 : 0;
		this.#disableFocusabilityProxy();
		flushAllObservers();
	}
};

class ArrayItemCollection {
  constructor(getItems, getStart) {
    this.getItems = getItems;
    this.getStart = getStart;
  }
  get start() {
    return this.getStart?.() ?? null;
  }
  first() {
    return this.getItems()[0] ?? null;
  }
  last() {
    const items = this.getItems();
    return items[items.length - 1] ?? null;
  }
  next(current) {
    const items = this.getItems();
    const i = items.indexOf(current);
    return i === -1 ? null : items[i + 1] ?? null;
  }
  previous(current) {
    const items = this.getItems();
    const i = items.indexOf(current);
    return i <= 0 ? null : items[i - 1] ?? null;
  }
  *items() {
    for (const element of this.getItems()) {
      yield { element };
    }
  }
  contains(element) {
    return this.getItems().includes(element);
  }
}

var __defProp$o = Object.defineProperty;
var __getOwnPropDesc$o = Object.getOwnPropertyDescriptor;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$o(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$o(target, key, result);
  return result;
};
const _BaseMenuList = class _BaseMenuList extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * @internal
     */
    this.isNestedMenu = () => {
      return this.parentElement !== null && isHTMLElement(this.parentElement) && this.parentElement.getAttribute("role") === "menuitem";
    };
    /**
     * Handle change from child MenuItem element and set radio group behavior
     */
    this.changedMenuItemHandler = (e) => {
      if (this.menuChildren === void 0) {
        return;
      }
      const changedMenuItem = e.target;
      const changeItemIndex = this.menuChildren.indexOf(changedMenuItem);
      if (changeItemIndex === -1) {
        return;
      }
      if (changedMenuItem.role === "menuitemradio" && changedMenuItem.checked === true) {
        for (let i = changeItemIndex - 1; i >= 0; --i) {
          const item = this.menuChildren[i];
          const role = item.role;
          if (role === MenuItemRole.menuitemradio) {
            item.checked = false;
          }
          if (role === "separator") {
            break;
          }
        }
        const maxIndex = this.menuChildren.length - 1;
        for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
          const item = this.menuChildren[i];
          const role = item.role;
          if (role === MenuItemRole.menuitemradio) {
            item.checked = false;
          }
          if (role === "separator") {
            break;
          }
        }
      }
    };
    this.elementInternals.role = "menu";
  }
  itemsChanged(oldValue, newValue) {
    if (this.$fastController.isConnected && this.menuChildren !== void 0) {
      this.setItems();
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    Updates.enqueue(() => {
      this.setItems();
    });
    this.addEventListener("change", this.changedMenuItemHandler);
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.menuChildren = void 0;
    this.removeEventListener("change", this.changedMenuItemHandler);
  }
  /**
   * Focuses the first item in the menu.
   *
   * @public
   */
  focus() {
    this.menuItems?.find((item) => !item.disabled)?.focus();
  }
  static elementIndent(el) {
    const role = el.role;
    const startSlot = el.querySelector("[slot=start]");
    if (role && role !== MenuItemRole.menuitem) {
      return startSlot ? 2 : 1;
    }
    return startSlot ? 1 : 0;
  }
  setItems() {
    const children = Array.from(this.children);
    this.menuChildren = children.filter((child) => !child.hasAttribute("hidden"));
    this.menuItems = this.menuChildren?.filter(this.isMenuItemElement);
    const indent = this.menuItems?.reduce((accum, current) => {
      const elementValue = _BaseMenuList.elementIndent(current);
      return Math.max(accum, elementValue);
    }, 0);
    this.menuItems?.forEach((item) => {
      item.dataset.indent = `${indent}`;
    });
  }
  /**
   * Method for Observable changes to the hidden attribute of child elements
   */
  handleChange(source, propertyName) {
    if (propertyName === "hidden") {
      this.setItems();
    }
  }
  /**
   * check if the item is a menu item
   */
  isMenuItemElement(el) {
    return isMenuItem(el) || isHTMLElement(el) && !!el.role && el.role in _BaseMenuList.focusableElementRoles;
  }
};
_BaseMenuList.focusableElementRoles = MenuItemRole;
__decorateClass$o([
  observable
], _BaseMenuList.prototype, "items", 2);
let BaseMenuList = _BaseMenuList;

class MenuList extends BaseMenuList {
  disconnectedCallback() {
    this.fg?.disconnect();
    super.disconnectedCallback();
  }
  setItems() {
    super.setItems();
    this.fgItems ?? (this.fgItems = new ArrayItemCollection(() => this.menuItems?.filter((i) => !i.hidden) ?? []));
    if (!this.fg) {
      this.fg = new FocusGroup(this, this.fgItems, {
        definition: {
          behavior: "menu",
          axis: "block",
          wrap: true
        }
      });
    } else {
      this.fg.update();
    }
  }
}

const styles$j = css`${display("flex")} :host{flex-direction:column;height:fit-content;max-width:300px;min-width:160px;width:auto;background-color:${colorNeutralBackground1};border:1px solid ${colorTransparentStroke};border-radius:${borderRadiusMedium};box-shadow:${shadow16};padding:4px;row-gap:2px}`;

function menuTemplate$1() {
  return html`<template focusgroup=menu slot=${(x) => x.slot ? x.slot : x.isNestedMenu() ? "submenu" : void 0}><slot ${slotted("items")}></slot></template>`;
}
const template$j = menuTemplate$1();

const definition$j = MenuList.compose({
  name: tagName$i,
  template: template$j,
  styles: styles$j
});

definition$j.define(FluentDesignSystem.registry);

const tagName$h = `${FluentDesignSystem.prefix}-menu`;

var __defProp$n = Object.defineProperty;
var __getOwnPropDesc$n = Object.getOwnPropertyDescriptor;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$n(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$n(target, key, result);
  return result;
};
class Menu extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * Defines whether the menu is open or not.
     * @internal
     */
    this._open = false;
    /**
     * Toggles the open state of the menu.
     * @public
     */
    this.toggleMenu = () => {
      this._menuList?.togglePopover(!this._open);
    };
    /**
     * Closes the menu.
     * @public
     */
    this.closeMenu = (event) => {
      if (event?.target instanceof MenuItem && (event.target.getAttribute("role") === MenuItemRole.menuitemcheckbox || event.target.getAttribute("role") === MenuItemRole.menuitemradio)) {
        return;
      }
      this._menuList?.togglePopover(false);
      if (this.closeOnScroll) {
        document.removeEventListener("scroll", this.closeMenu);
      }
    };
    /**
     * Opens the menu.
     * @public
     */
    this.openMenu = (e) => {
      this._menuList?.togglePopover(true);
      if (e && this.openOnContext) {
        e.preventDefault();
      }
      if (this.closeOnScroll) {
        document.addEventListener("scroll", this.closeMenu);
      }
    };
    /**
     * Handles the 'toggle' event on the popover.
     * @public
     * @param e - the event
     * @returns void
     */
    this.toggleHandler = (e) => {
      if (e.type === "toggle" && e.newState) {
        const open = e.newState === "open";
        this._trigger?.setAttribute("aria-expanded", `${open}`);
        this._menuList?.setAttribute("focusgroup", open ? "menu" : "none");
        this._open = open;
        if (this._open) {
          this.focusMenuList();
        }
      }
    };
    /**
     * Handles keyboard interaction for the trigger. Toggles the menu when the Space or Enter key is pressed. If the menu
     * is open, focuses on the menu list.
     *
     * @param e - the keyboard event
     * @public
     */
    this.triggerKeydownHandler = (e) => {
      if (e.defaultPrevented) {
        return;
      }
      const key = e.key;
      switch (key) {
        case " ":
        case "Enter":
          e.preventDefault();
          this.toggleMenu();
          break;
        default:
          return true;
      }
    };
    /**
     * Handles document click events to close a menu opened with contextmenu in popover="manual" mode.
     * @internal
     * @param e - The event triggered on document click.
     */
    this.documentClickHandler = (e) => {
      if (!e.composedPath().some((el) => el === this._trigger || el === this._menuList)) {
        this.closeMenu();
      }
    };
  }
  /**
   * Sets up the component when the slotted menu list changes.
   * @param prev - The previous items in the slotted menu list.
   * @param next - The new items in the slotted menu list.
   * @internal
   */
  slottedMenuListChanged(prev, next) {
    this._menuListAbortController?.abort();
    if (!next?.length) {
      return;
    }
    this._menuList = next[0];
    this._menuList.popover = this.openOnContext ? "manual" : "";
    this.addMenuListListeners();
  }
  /**
   * Ensures the trigger is properly set up when the slotted triggers change.
   * This includes setting ARIA attributes and adding event listeners based on the current property values.
   *
   * @param prev - The previous items in the slotted triggers list.
   * @param next - The current items in the slotted triggers list.
   * @internal
   */
  slottedTriggersChanged(prev, next) {
    this._triggerAbortController?.abort();
    if (next?.length) {
      const trigger = next[0];
      this._trigger = trigger;
      if (this._trigger?.isConnected) {
        this._trigger.setAttribute("aria-haspopup", "true");
        this._trigger.setAttribute("aria-expanded", `${this._open}`);
        this.addTriggerListeners();
      }
    }
  }
  /**
   * Called when the element is connected to the DOM.
   * Sets up the component.
   * @public
   */
  connectedCallback() {
    super.connectedCallback();
    this.setComponent();
  }
  /**
   * Called when the element is disconnected from the DOM.
   * Removes event listeners.
   * @public
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._triggerAbortController?.abort();
    this._menuListAbortController?.abort();
  }
  /**
   * Sets the component.
   * @deprecated This method is no longer used. Trigger and menu-list listeners are now
   * managed by their respective slot-changed callbacks.
   * @public
   */
  setComponent() {
  }
  /**
   * Focuses on the menu list.
   * @public
   */
  focusMenuList() {
    Updates.enqueue(() => {
      this._menuList.focus();
    });
  }
  /**
   * Focuses on the menu trigger.
   * @public
   */
  focusTrigger() {
    Updates.enqueue(() => {
      this._trigger.focus();
    });
  }
  /**
   * Called whenever the 'openOnHover' property changes.
   * Adds or removes a 'mouseover' event listener to the trigger based on the new value.
   *
   * @param oldValue - The previous value of 'openOnHover'.
   * @param newValue - The new value of 'openOnHover'.
   * @public
   */
  openOnHoverChanged(oldValue, newValue) {
    if (this._trigger) {
      this._triggerAbortController?.abort();
      this.addTriggerListeners();
    }
  }
  /**
   * Called whenever the 'persistOnItemClick' property changes.
   * Adds or removes a 'click' event listener to the menu list based on the new value.
   * @public
   * @param oldValue - The previous value of 'persistOnItemClick'.
   * @param newValue - The new value of 'persistOnItemClick'.
   */
  persistOnItemClickChanged(oldValue, newValue) {
    if (this._menuList) {
      this._menuListAbortController?.abort();
      this.addMenuListListeners();
    }
  }
  /**
   * Called whenever the 'openOnContext' property changes.
   * Adds or removes a 'contextmenu' event listener to the trigger based on the new value.
   * @public
   * @param oldValue - The previous value of 'openOnContext'.
   * @param newValue - The new value of 'openOnContext'.
   */
  openOnContextChanged(oldValue, newValue) {
    if (newValue) {
      this._menuList?.setAttribute("popover", "manual");
    } else {
      this._menuList?.setAttribute("popover", "");
    }
    if (this._trigger) {
      this._triggerAbortController?.abort();
      this.addTriggerListeners();
    }
  }
  /**
   * Called whenever the 'closeOnScroll' property changes.
   * Adds or removes a 'closeOnScroll' event listener to the trigger based on the new value.
   * @public
   * @param oldValue - The previous value of 'closeOnScroll'.
   * @param newValue - The new value of 'closeOnScroll'.
   */
  closeOnScrollChanged(oldValue, newValue) {
    if (newValue) {
      document.addEventListener("scroll", this.closeMenu);
    } else {
      document.removeEventListener("scroll", this.closeMenu);
    }
  }
  /**
   * Adds trigger-related event listeners.
   * @internal
   */
  addTriggerListeners() {
    this._triggerAbortController = new AbortController();
    const { signal } = this._triggerAbortController;
    this._trigger?.addEventListener("keydown", this.triggerKeydownHandler, { signal });
    if (this.openOnHover) {
      this._trigger?.addEventListener("mouseover", this.openMenu, { signal });
    } else if (this.openOnContext) {
      this._trigger?.addEventListener("contextmenu", this.openMenu, { signal });
      document.addEventListener("click", this.documentClickHandler, { signal });
    } else {
      this._trigger?.addEventListener("click", this.toggleMenu, { signal });
    }
  }
  /**
   * Adds menu-list event listeners.
   * @internal
   */
  addMenuListListeners() {
    this._menuListAbortController = new AbortController();
    const { signal } = this._menuListAbortController;
    this._menuList?.addEventListener("toggle", this.toggleHandler, { signal });
    if (!this.persistOnItemClick) {
      this._menuList?.addEventListener("change", this.closeMenu, { signal });
    }
  }
  /**
   * Handles keyboard interaction for the menu. Closes the menu and focuses on the trigger when the Escape key is
   * pressed. Closes the menu when the Tab key is pressed.
   *
   * @param e - the keyboard event
   * @public
   */
  menuKeydownHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    const key = e.key;
    switch (key) {
      case "Escape":
        e.preventDefault();
        if (this._open) {
          this.closeMenu();
          this.focusTrigger();
        }
        break;
      case "Tab":
        if (this._open) this.closeMenu();
        if (e.shiftKey && e.composedPath()[0] !== this._trigger && e.composedPath()[0].assignedSlot !== this.primaryAction) {
          this.focusTrigger();
        } else if (e.shiftKey) {
          return true;
        }
      default:
        return true;
    }
  }
}
__decorateClass$n([
  attr({ attribute: "open-on-hover", mode: "boolean" })
], Menu.prototype, "openOnHover", 2);
__decorateClass$n([
  attr({ attribute: "open-on-context", mode: "boolean" })
], Menu.prototype, "openOnContext", 2);
__decorateClass$n([
  attr({ attribute: "close-on-scroll", mode: "boolean" })
], Menu.prototype, "closeOnScroll", 2);
__decorateClass$n([
  attr({ attribute: "persist-on-item-click", mode: "boolean" })
], Menu.prototype, "persistOnItemClick", 2);
__decorateClass$n([
  attr({ mode: "boolean" })
], Menu.prototype, "split", 2);
__decorateClass$n([
  observable
], Menu.prototype, "slottedMenuList", 2);
__decorateClass$n([
  observable
], Menu.prototype, "slottedTriggers", 2);
__decorateClass$n([
  observable
], Menu.prototype, "primaryAction", 2);

const styles$i = css`${display("inline-block")} ::slotted([slot='trigger']){anchor-name:--menu-trigger}::slotted([popover]){margin:0;max-height:var(--menu-max-height,auto);position-anchor:--menu-trigger;position-area:block-end span-inline-end;position-try-fallbacks:flip-block;position:absolute;z-index:1}:host([split]) ::slotted([popover]){position-area:block-end span-inline-start}::slotted([popover]:popover-open){inset:unset}::slotted([popover]:not(:popover-open)){display:none}:host([split]){display:inline-flex}:host([split]) ::slotted([slot='primary-action']){border-inline-end:${strokeWidthThin} solid ${colorNeutralStroke1};border-start-end-radius:0;border-end-end-radius:0}:host([split]) ::slotted([slot='primary-action']:focus-visible){z-index:1}:host([split]) ::slotted([slot='primary-action'][appearance='primary']){border-inline-end:${strokeWidthThin} solid white}:host([split]) ::slotted([slot='trigger']){border-inline-start:0;border-start-start-radius:0;border-end-start-radius:0}`;

function menuTemplate() {
  return html`<template ?open-on-hover=${(x) => x.openOnHover} ?open-on-context=${(x) => x.openOnContext} ?close-on-scroll=${(x) => x.closeOnScroll} ?persist-on-item-click=${(x) => x.persistOnItemClick} @keydown=${(x, c) => x.menuKeydownHandler(c.event)}><slot name=primary-action ${ref("primaryAction")}></slot><slot name=trigger ${slotted({ property: "slottedTriggers", filter: elements() })}></slot><slot ${slotted({ property: "slottedMenuList", filter: elements() })}></slot></template>`;
}
const template$i = menuTemplate();

const definition$i = Menu.compose({
  name: tagName$h,
  template: template$i,
  styles: styles$i
});

definition$i.define(FluentDesignSystem.registry);

const MessageBarLayout = {
  multiline: "multiline",
  singleline: "singleline"
};
const MessageBarShape = {
  rounded: "rounded",
  square: "square"
};
const MessageBarIntent = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "info"
};
const tagName$g = `${FluentDesignSystem.prefix}-message-bar`;

var __defProp$m = Object.defineProperty;
var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$m(target, key, result);
  return result;
};
class MessageBar extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * Method to emit a `dismiss` event when the message bar is dismissed
     *
     * @public
     */
    this.dismissMessageBar = () => {
      this.$emit("dismiss", {});
    };
    this.elementInternals.role = "status";
  }
}
__decorateClass$m([
  attr
], MessageBar.prototype, "shape", 2);
__decorateClass$m([
  attr
], MessageBar.prototype, "layout", 2);
__decorateClass$m([
  attr
], MessageBar.prototype, "intent", 2);

const styles$h = css`:host{display:grid;box-sizing:border-box;font-family:${fontFamilyBase};font-size:${fontSizeBase200};line-height:${lineHeightBase200};width:100%;background:${colorNeutralBackground3};border:1px solid ${colorNeutralStroke1};padding-inline:${spacingHorizontalM};border-radius:${borderRadiusMedium};min-height:36px;align-items:center;grid-template:'icon body actions dismiss'/auto 1fr auto auto;contain:layout style paint}:host([shape='square']){border-radius:0}:host([intent='success']){background-color:${colorPaletteGreenBackground1};border-color:${colorPaletteGreenBorder1}}:host([intent='warning']){background-color:${colorPaletteDarkOrangeBackground1};border-color:${colorPaletteDarkOrangeBorder1}}:host([intent='error']){background-color:${colorPaletteRedBackground1};border-color:${colorPaletteRedBorder1}}:host([layout='multiline']){grid-template-areas:'icon body dismiss' 'actions actions actions';grid-template-columns:auto 1fr auto;grid-template-rows:auto auto 1fr;padding-block:${spacingVerticalMNudge};padding-inline:${spacingHorizontalM}}.content{grid-area:body;max-width:520px;padding-block:${spacingVerticalMNudge};padding-inline:0}:host([layout='multiline']) .content{padding:0}::slotted([slot='icon']){display:flex;grid-area:icon;flex-direction:column;align-items:center;color:${colorNeutralForeground3};margin-inline-end:${spacingHorizontalS}}:host([layout='multiline']) ::slotted([slot='icon']){align-items:start;height:100%}::slotted([slot='dismiss']){grid-area:dismiss}.actions{grid-area:actions;display:flex;justify-self:end;margin-inline-end:${spacingHorizontalS};gap:${spacingHorizontalS}}:host([layout='multiline']) .actions{margin-block-start:${spacingVerticalMNudge};margin-inline-end:0}:host([layout='multiline']) ::slotted([slot='dismiss']){align-items:start;height:100%;padding-block-start:${spacingVerticalS}}::slotted(*){font-size:inherit}`;

function messageBarTemplate() {
  return html`<slot name=icon></slot><div class=content><slot></slot></div><div class=actions><slot name=actions></slot></div><slot name=dismiss></slot>`;
}
const template$h = messageBarTemplate();

const definition$h = MessageBar.compose({
  name: tagName$g,
  template: template$h,
  styles: styles$h,
  shadowOptions: {
    mode: FluentDesignSystem.shadowRootMode
  }
});

definition$h.define(FluentDesignSystem.registry);

var __defProp$l = Object.defineProperty;
var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$l(target, key, result);
  return result;
};
class DropdownOption extends FASTElement {
  constructor() {
    super();
    this.active = false;
    this.id = uniqueId("option-");
    this.initialValue = "";
    this.multiple = false;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    /**
     * The internal value of the option.
     *
     * @internal
     */
    this._value = this.initialValue;
    this.elementInternals.role = "option";
  }
  /**
   * Changes the active state of the option when the active property changes.
   *
   * @param prev - the previous active state
   * @param next - the current active state
   * @internal
   */
  activeChanged(prev, next) {
    toggleState(this.elementInternals, "active", next);
  }
  /**
   * Sets the selected property to match the currentSelected state.
   *
   * @param prev - the previous selected state
   * @param next - the current selected state
   * @internal
   */
  currentSelectedChanged(prev, next) {
    this.selected = !!next;
  }
  /**
   * Updates the selected state when the `selected` attribute is changed, unless the selected state has been changed by the user.
   *
   * @param prev - The previous initial selected state
   * @param next - The current initial selected state
   * @internal
   */
  defaultSelectedChanged(prev, next) {
    this.selected = !!next;
  }
  /**
   * Changes the description state of the option when the description slot changes.
   *
   * @param prev - the previous collection of description elements
   * @param next - the current collection of description elements
   * @internal
   */
  descriptionSlotChanged(prev, next) {
    toggleState(this.elementInternals, "description", !!next?.length);
  }
  /**
   * Toggles the disabled state when the user changes the `disabled` property.
   *
   * @internal
   */
  disabledChanged(prev, next) {
    this.elementInternals.ariaDisabled = this.disabled ? "true" : "false";
    toggleState(this.elementInternals, "disabled", this.disabled);
    this.setFormValue(!this.disabled && this.selected ? this.value : null);
  }
  /**
   * Sets the disabled state when the `disabled` attribute changes.
   *
   * @param prev - the previous value
   * @param next - the current value
   * @internal
   */
  disabledAttributeChanged(prev, next) {
    this.disabled = !!next;
  }
  /**
   * Sets the value of the option when the `value` attribute changes.
   *
   * @param prev - The previous initial value
   * @param next - The current initial value
   * @internal
   */
  initialValueChanged(prev, next) {
    this._value = next;
  }
  /**
   * Updates the multiple state of the option when the multiple property changes.
   *
   * @param prev - the previous multiple state
   * @param next - the current multiple state
   */
  multipleChanged(prev, next) {
    toggleState(this.elementInternals, "multiple", next);
    this.selected = false;
  }
  /**
   * The associated `<form>` element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
   */
  get form() {
    return this.elementInternals.form;
  }
  /**
   * A reference to all associated `<label>` elements.
   *
   * @public
   */
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  /**
   * The option's current selected state.
   *
   * @public
   */
  get selected() {
    Observable.track(this, "selected");
    return !!this.currentSelected;
  }
  set selected(next) {
    this.currentSelected = next;
    Updates.enqueue(() => {
      if (this.elementInternals) {
        this.setFormValue(next ? this.value : null);
        this.elementInternals.ariaSelected = next ? "true" : "false";
        toggleState(this.elementInternals, "selected", next);
      }
    });
    Observable.notify(this, "selected");
  }
  /**
   * The display text of the option.
   *
   * @public
   * @remarks
   * When the option is freeform, the text is the value of the option.
   */
  get text() {
    if (this.freeform) {
      return this.value.replace(/\s+/g, " ").trim();
    }
    return (this.textAttribute ?? this.textContent)?.replace(/\s+/g, " ").trim() ?? "";
  }
  /**
   * The current value of the option.
   *
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this._value ?? this.text;
  }
  set value(value) {
    this._value = value;
    if (this.$fastController.isConnected) {
      this.setFormValue(this.selected ? value : null);
      this.freeformOutputs?.forEach((output) => {
        output.value = value;
      });
      Observable.notify(this, "value");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.freeform) {
      this.value = "";
      this.hidden = true;
      this.selected = false;
    }
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    if (this.disabled) {
      this.elementInternals.setFormValue(null);
      return;
    }
    this.elementInternals.setFormValue(value, value ?? state);
  }
  /**
   * Toggles the selected state of the control.
   *
   * @param force - Forces the element to be checked or unchecked
   * @public
   */
  toggleSelected(force = !this.selected) {
    this.selected = force;
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
DropdownOption.formAssociated = true;
__decorateClass$l([
  observable
], DropdownOption.prototype, "active", 2);
__decorateClass$l([
  attr({ attribute: "current-selected", mode: "boolean" })
], DropdownOption.prototype, "currentSelected", 2);
__decorateClass$l([
  attr({ attribute: "selected", mode: "boolean" })
], DropdownOption.prototype, "defaultSelected", 2);
__decorateClass$l([
  observable
], DropdownOption.prototype, "descriptionSlot", 2);
__decorateClass$l([
  observable
], DropdownOption.prototype, "disabled", 2);
__decorateClass$l([
  attr({ attribute: "disabled", mode: "boolean" })
], DropdownOption.prototype, "disabledAttribute", 2);
__decorateClass$l([
  attr({ attribute: "form" })
], DropdownOption.prototype, "formAttribute", 2);
__decorateClass$l([
  attr({ mode: "boolean" })
], DropdownOption.prototype, "freeform", 2);
__decorateClass$l([
  attr({ attribute: "id" })
], DropdownOption.prototype, "id", 2);
__decorateClass$l([
  attr({ attribute: "value", mode: "fromView" })
], DropdownOption.prototype, "initialValue", 2);
__decorateClass$l([
  observable
], DropdownOption.prototype, "multiple", 2);
__decorateClass$l([
  attr
], DropdownOption.prototype, "name", 2);
__decorateClass$l([
  observable
], DropdownOption.prototype, "start", 2);
__decorateClass$l([
  attr({ attribute: "text", mode: "fromView" })
], DropdownOption.prototype, "textAttribute", 2);

const styles$g = css`${display("inline-grid")} :host{-webkit-tap-highlight-color:transparent;${typographyBody1Styles} align-items:center;background-color:${colorNeutralBackground1};border-radius:${borderRadiusMedium};box-sizing:border-box;color:${colorNeutralForeground2};column-gap:${spacingHorizontalXS};cursor:pointer;grid-template-areas:'indicator start content';grid-template-columns:auto auto 1fr;min-height:32px;padding:${spacingHorizontalSNudge};text-align:start}.content{grid-area:content;line-height:1}::slotted([slot='start']){grid-area:start}:host(:hover){background-color:${colorNeutralBackground1Hover};color:${colorNeutralForeground2Hover}}:host(:active){background-color:${colorNeutralBackground1Pressed};color:${colorNeutralForeground2Pressed}}:host(:disabled){background-color:${colorNeutralBackground1};color:${colorNeutralForegroundDisabled};cursor:default}.checkmark-16-filled{fill:currentColor;width:16px}slot[name='checked-indicator']>*,::slotted([slot='checked-indicator']){aspect-ratio:1;flex:0 0 auto;grid-area:indicator;visibility:hidden}:host(${selectedState}) :is(slot[name='checked-indicator']>*,::slotted([slot='checked-indicator'])){visibility:visible}:host(${multipleState}) .checkmark-16-filled,:host(:not(${multipleState})) .checkmark-12-regular{display:none}:host(${multipleState}) .checkmark-12-regular{background-color:${colorNeutralBackground1};border-radius:${borderRadiusSmall};border:${strokeWidthThin} solid ${colorNeutralStrokeAccessible};box-sizing:border-box;cursor:pointer;fill:transparent;position:relative;visibility:visible;width:16px}:host(${multipleState}${selectedState}) .checkmark-12-regular{background-color:${colorCompoundBrandBackground};border-color:${colorCompoundBrandStroke};fill:${colorNeutralForegroundInverted}}:host(:disabled${multipleState}) .checkmark-12-regular{border-color:${colorNeutralStrokeDisabled}}:host(:disabled${multipleState}${selectedState}) .checkmark-12-regular{background-color:${colorNeutralBackgroundDisabled}}:host(${activeState}){border:${strokeWidthThick} solid ${colorStrokeFocus2}}@supports (selector(:host(:has(*)))){:host(:has([slot='start']:not([size='16']))){column-gap:${spacingHorizontalSNudge}}}:host(${descriptionState}){column-gap:${spacingHorizontalSNudge};grid-template-areas:'indicator start content' 'indicator start description'}::slotted([slot='description']){color:${colorNeutralForeground3};grid-area:description;${typographyCaption1Styles}}@media (forced-colors:active){:host(:disabled){color:GrayText}}`;

const checkedIndicator$1 = html.partial(
  /* html */
  `<svg aria-hidden=true class=checkmark-16-filled viewBox="0 0 16 16"><path d="M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032"/></svg> <svg aria-hidden=true class=checkmark-12-regular viewBox="0 0 12 12"><path d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0"/></svg>`
);
function dropdownOptionTemplate(options = {}) {
  return html`<slot name=checked-indicator>${staticallyCompose(options.checkedIndicator)}</slot>${startSlotTemplate(options)}<div class=content part=content><slot ${slotted({ property: "freeformOutputs", filter: elements("output") })}></slot></div><div class=description part=description><slot name=description ${slotted("descriptionSlot")}></slot></div>`;
}
const template$g = dropdownOptionTemplate({
  checkedIndicator: checkedIndicator$1
});

const definition$g = DropdownOption.compose({
  name: tagName$p,
  template: template$g,
  styles: styles$g
});

definition$g.define(FluentDesignSystem.registry);

const ProgressBarThickness = {
  medium: "medium",
  large: "large"
};
const ProgressBarShape = {
  rounded: "rounded",
  square: "square"
};
const ProgressBarValidationState = {
  success: "success",
  warning: "warning",
  error: "error"
};
const tagName$f = `${FluentDesignSystem.prefix}-progress-bar`;

var __defProp$k = Object.defineProperty;
var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$k(target, key, result);
  return result;
};
class BaseProgressBar extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.validationState = null;
    this.elementInternals.role = "progressbar";
  }
  /**
   * Updates the indicator width after the element is connected to the DOM via the template.
   * @internal
   */
  indicatorChanged() {
    this.setIndicatorWidth();
  }
  /**
   * Handles changes to validation-state attribute custom states
   * @param prev - the previous state
   * @param next - the next state
   */
  validationStateChanged(prev, next) {
    swapStates(this.elementInternals, prev, next, ProgressBarValidationState);
  }
  /**
   * Updates the percent complete when the `value` property changes.
   *
   * @internal
   */
  valueChanged(prev, next) {
    if (this.elementInternals) {
      this.elementInternals.ariaValueNow = typeof next === "number" ? `${next}` : null;
    }
    this.setIndicatorWidth();
  }
  /**
   * Updates the percent complete when the `min` property changes.
   *
   * @param prev - The previous min value
   * @param next - The current min value
   */
  minChanged(prev, next) {
    if (this.elementInternals) {
      this.elementInternals.ariaValueMin = typeof next === "number" ? `${next}` : null;
    }
    this.setIndicatorWidth();
  }
  /**
   * Updates the percent complete when the `max` property changes.
   *
   * @param prev - The previous max value
   * @param next - The current max value
   * @internal
   */
  maxChanged(prev, next) {
    if (this.elementInternals) {
      this.elementInternals.ariaValueMax = typeof next === "number" ? `${next}` : null;
    }
    this.setIndicatorWidth();
  }
  /**
   * Sets the width of the indicator element based on the value, min, and max
   * properties. If the browser supports `width: attr(value)`, this method does
   * nothing and allows CSS to handle the width.
   *
   * @internal
   */
  setIndicatorWidth() {
    if (CSS.supports("width: attr(value type(<number>))")) {
      return;
    }
    Updates.enqueue(() => {
      if (typeof this.value !== "number") {
        this.indicator?.style.removeProperty("width");
        return;
      }
      const min = this.min ?? 0;
      const max = this.max ?? 100;
      const value = this.value ?? 0;
      const range = max - min;
      const width = range === 0 ? 0 : Math.fround((value - min) / range * 100);
      this.indicator?.style.setProperty("width", `${width}%`);
    });
  }
}
__decorateClass$k([
  observable
], BaseProgressBar.prototype, "indicator", 2);
__decorateClass$k([
  attr({ attribute: "validation-state" })
], BaseProgressBar.prototype, "validationState", 2);
__decorateClass$k([
  attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "value", 2);
__decorateClass$k([
  attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "min", 2);
__decorateClass$k([
  attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "max", 2);

var __defProp$j = Object.defineProperty;
var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$j(target, key, result);
  return result;
};
class ProgressBar extends BaseProgressBar {
}
__decorateClass$j([
  attr
], ProgressBar.prototype, "thickness", 2);
__decorateClass$j([
  attr
], ProgressBar.prototype, "shape", 2);

const styles$f = css`${display("block")} :host{width:100%;height:2px;overflow-x:hidden;background-color:${colorNeutralBackground6};border-radius:${borderRadiusMedium};contain:content;@supports (width:attr(value type(<number>))){--max:attr(max type(<number>),100);--min:attr(min type(<number>),0);--value:attr(value type(<number>),0);--indicator-width:clamp(0%,calc((var(--value) - var(--min))/(var(--max) - var(--min)) * 100%),100%)}}:host([thickness='large']){height:4px}:host([shape='square']){border-radius:${borderRadiusNone}}.indicator{background-color:${colorCompoundBrandBackground};border-radius:inherit;height:100%}:host([value]) .indicator{transition:all 0.2s ease-in-out;@supports (width:attr(value type(<number>))){width:var(--indicator-width)}}:host(:not([value])) .indicator{position:relative;width:33%;background-image:linear-gradient( to right,${colorNeutralBackground6} 0%,${colorTransparentBackground} 50%,${colorNeutralBackground6} 100% );animation-name:indeterminate;animation-duration:3s;animation-timing-function:linear;animation-iteration-count:infinite}:host([validation-state='error']) .indicator{background-color:${colorPaletteRedBackground3}}:host([validation-state='warning']) .indicator{background-color:${colorPaletteDarkOrangeBackground3}}:host([validation-state='success']) .indicator{background-color:${colorPaletteGreenBackground3}}@layer animations{@media (prefers-reduced-motion:no-preference){:host([value]){transition:none}:host(:not([value])) .indicator{animation-duration:0.01ms;animation-iteration-count:1}}}@keyframes indeterminate{0%{inset-inline-start:-33%}100%{inset-inline-start:100%}}@media (forced-colors:active){:host{background-color:CanvasText}.indicator,:host(:is([validation-state='success'],[validation-state='warning'],[validation-state='error'])) .indicator{background-color:Highlight}}`;

function progressTemplate() {
  return html`<div class=indicator part=indicator ${ref("indicator")}></div>`;
}
const template$f = progressTemplate();

const definition$f = ProgressBar.compose({
  name: tagName$f,
  template: template$f,
  styles: styles$f
});

definition$f.define(FluentDesignSystem.registry);

const RadioGroupOrientation = Orientation;
const tagName$e = `${FluentDesignSystem.prefix}-radio-group`;

function isRadio(element, tagName2 = "-radio") {
  return isCustomElement(tagName2)(element);
}
const tagName$d = `${FluentDesignSystem.prefix}-radio`;

var __defProp$i = Object.defineProperty;
var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$i(target, key, result);
  return result;
};
class BaseRadioGroup extends FASTElement {
  constructor() {
    super();
    this.isNavigating = false;
    /**
     * Indicates that the value has been changed by the user.
     */
    this.dirtyState = false;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "radiogroup";
    this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
  }
  /**
   * Sets the checked state of the nearest enabled radio when the `checkedIndex` changes.
   *
   * @param prev - the previous index
   * @param next - the current index
   * @internal
   */
  checkedIndexChanged(prev, next) {
    if (!this.enabledRadios) {
      return;
    }
    this.checkRadio(next);
  }
  /**
   * Sets the `disabled` attribute on all child radios when the `disabled` property changes.
   *
   * @param prev - the previous disabled value
   * @param next - the current disabled value
   * @internal
   */
  disabledChanged(prev, next) {
    if (this.radios) {
      this.checkedIndex = -1;
      this.radios?.forEach((radio) => {
        radio.disabled = !!radio.disabledAttribute || !!this.disabled;
      });
    }
  }
  /**
   * Sets the matching radio to checked when the value changes. If no radio matches the value, no radio will be checked.
   *
   * @param prev - the previous value
   * @param next - the current value
   */
  initialValueChanged(prev, next) {
    this.value = next ?? "";
  }
  /**
   * Sets the `name` attribute on all child radios when the `name` property changes.
   *
   * @internal
   */
  nameChanged(prev, next) {
    if (this.isConnected && next) {
      this.radios?.forEach((radio) => {
        radio.name = this.name;
      });
    }
  }
  /**
   * Sets the ariaOrientation attribute when the orientation changes.
   *
   * @param prev - the previous orientation
   * @param next - the current orientation
   * @internal
   */
  orientationChanged(prev, next) {
    this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
  }
  /**
   * Updates the enabled radios collection when properties on the child radios change.
   *
   * @param prev - the previous radios
   * @param next - the current radios
   */
  radiosChanged(prev, next) {
    const setSize = next?.length;
    if (!setSize) {
      return;
    }
    if (!this.name && next.every((x) => x.name === next[0].name)) {
      this.name = next[0].name;
    }
    const checkedIndex = this.enabledRadios.findLastIndex((x) => x.initialChecked);
    next.forEach((radio, index) => {
      radio.ariaPosInSet = `${index + 1}`;
      radio.ariaSetSize = `${setSize}`;
      if (this.initialValue && !this.dirtyState) {
        radio.checked = radio.value === this.initialValue;
      } else {
        radio.checked = index === checkedIndex;
      }
      radio.name = this.name ?? radio.name;
      radio.disabled = !!this.disabled || !!radio.disabledAttribute;
      radio.toggleAttribute("focusgroupstart", radio.checked && !radio.disabled);
    });
    if (!this.dirtyState && this.initialValue) {
      this.value = this.initialValue;
    }
    if (!this.value || // This logic covers the case when the RadioGroup doesn't have a `value`
    this.value && typeof this.checkedIndex !== "number" && checkedIndex >= 0) {
      this.checkedIndex = checkedIndex;
    }
    const radioIds = next.map((radio) => radio.id).join(" ").trim();
    if (radioIds) {
      this.setAttribute("aria-owns", radioIds);
    }
  }
  /**
   *
   * @param prev - the previous required value
   * @param next - the current required value
   */
  requiredChanged(prev, next) {
    this.elementInternals.ariaRequired = next ? "true" : null;
    this.setValidity();
  }
  /**
   * Updates the radios collection when the slotted radios change.
   *
   * @param prev - the previous slotted radios
   * @param next - the current slotted radios
   */
  slottedRadiosChanged(prev, next) {
    this.radios = [...this.querySelectorAll("*")].filter((x) => isRadio(x));
  }
  /**
   * A collection of child radios that are not disabled.
   *
   * @internal
   */
  get enabledRadios() {
    if (this.disabled) {
      return [];
    }
    return this.radios?.filter((x) => !x.disabled) ?? [];
  }
  /**
   * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
   * specified (e.g., via `setCustomValidity`).
   *
   * @internal
   */
  get validationMessage() {
    if (this.elementInternals.validationMessage) {
      return this.elementInternals.validationMessage;
    }
    if (this.enabledRadios?.[0]?.validationMessage) {
      return this.enabledRadios[0].validationMessage;
    }
    if (!this._validationFallbackMessage) {
      const validationMessageFallbackControl = document.createElement("input");
      validationMessageFallbackControl.type = "radio";
      validationMessageFallbackControl.required = true;
      validationMessageFallbackControl.checked = false;
      this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
    }
    return this._validationFallbackMessage;
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The current value of the checked radio.
   *
   * @public
   */
  get value() {
    Observable.notify(this, "value");
    return this.enabledRadios.find((x) => x.checked)?.value ?? null;
  }
  set value(next) {
    const index = this.enabledRadios.findIndex((x) => x.value === next);
    this.checkedIndex = index;
    if (this.$fastController.isConnected) {
      this.setFormValue(next);
      this.setValidity();
    }
    Observable.track(this, "value");
  }
  /**
   * Sets the checked state of all radios when any radio emits a `change` event.
   *
   * @param e - the change event
   */
  changeHandler(e) {
    if (this === e.target) {
      return true;
    }
    this.dirtyState = true;
    const radioIndex = this.enabledRadios.indexOf(e.target);
    this.checkRadio(radioIndex);
    this.radios?.filter((x) => x.disabled)?.forEach((item) => {
      item.checked = false;
    });
    return true;
  }
  /**
   * Checks the radio at the specified index.
   *
   * @param index - the index of the radio to check
   * @internal
   */
  checkRadio(index = this.checkedIndex, shouldEmit = false) {
    let checkedIndex = this.checkedIndex;
    this.enabledRadios.forEach((item, i) => {
      const shouldCheck = i === index;
      item.checked = shouldCheck;
      if (shouldCheck) {
        checkedIndex = i;
        if (shouldEmit) {
          item.$emit("change");
        }
      }
    });
    this.checkedIndex = checkedIndex;
    this.setFormValue(this.value);
    this.setValidity();
  }
  /**
   * Checks the validity of the element and returns the result.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Handles click events for the radio group.
   *
   * @param e - the click event
   * @internal
   */
  clickHandler(e) {
    if (this === e.target) {
      this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
    }
    return true;
  }
  /**
   * Focuses the checked radio or the first enabled radio.
   *
   * @internal
   */
  focus() {
    this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
  }
  formResetCallback() {
    this.dirtyState = false;
    this.checkedIndex = -1;
    this.setFormValue(this.value);
    this.setValidity();
  }
  /**
   * Enables tabbing through the radio group when the group receives focus.
   *
   * @param e - the focus event
   * @internal
   */
  focusinHandler(e) {
    if (!this.disabled && (this.isNavigating || this.value)) {
      this.radios?.forEach((radio) => {
        if (radio.disabled && radio.checked) {
          radio.checked = false;
        }
      });
      const index = this.enabledRadios.indexOf(e.target);
      if (index > -1) {
        this.checkRadio(index, true);
      }
      this.isNavigating = false;
    }
    return true;
  }
  /**
   * Handles keydown events for the radio group.
   *
   * @param e - the keyboard event
   * @internal
   */
  keydownHandler(e) {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "Home":
      case "End":
        this.isNavigating = true;
        break;
      case " ":
        this.checkRadio();
        break;
    }
    return true;
  }
  /**
   *
   * @param e - the disabled event
   */
  disabledRadioHandler(e) {
    if (e.detail === true && e.target.checked) {
      this.checkedIndex = -1;
    }
  }
  /**
   * Reports the validity of the element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    this.elementInternals.setFormValue(value, value ?? state);
  }
  /**
   * Sets the validity of the element.
   *
   * @param flags - Validity flags to set.
   * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
   * @param anchor - Optional anchor to use for the validation message.
   *
   * @internal
   * @remarks
   * RadioGroup validation is reported through the individual Radio elements rather than the RadioGroup itself.
   * This is necessary because:
   * 1. Each Radio is form-associated (extends BaseCheckbox which has `formAssociated = true`)
   * 2. Browser validation UIs and screen readers announce validation against individual form controls
   * 3. For groups like RadioGroup, the browser needs to report the error on a specific member of the group
   * 4. We anchor the error to the first Radio so it receives focus and announcement
   *
   * When the group is invalid (required but no selection):
   * - Only the first Radio gets the invalid state with the validation message
   * - Other Radios are kept valid since selecting any of them would satisfy the requirement
   *
   * When the group becomes valid (user selects any Radio):
   * - All Radios are cleared back to valid state
   * - This allows form submission to proceed
   */
  setValidity(flags, message, anchor) {
    if (this.$fastController.isConnected) {
      const isInvalid = this.required && !this.value && !this.disabled;
      if (!isInvalid) {
        this.enabledRadios?.forEach((radio) => {
          radio.elementInternals.setValidity({});
        });
        return;
      }
      const validationFlags = { valueMissing: true, ...flags };
      const validationMessage = message ?? this.validationMessage;
      this.enabledRadios?.forEach((radio, index) => {
        if (index === 0) {
          radio.elementInternals.setValidity(validationFlags, validationMessage, radio);
        } else {
          radio.elementInternals.setValidity({});
        }
      });
    }
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
BaseRadioGroup.formAssociated = true;
__decorateClass$i([
  observable
], BaseRadioGroup.prototype, "checkedIndex", 2);
__decorateClass$i([
  attr({ attribute: "disabled", mode: "boolean" })
], BaseRadioGroup.prototype, "disabled", 2);
__decorateClass$i([
  attr({ attribute: "value", mode: "fromView" })
], BaseRadioGroup.prototype, "initialValue", 2);
__decorateClass$i([
  attr
], BaseRadioGroup.prototype, "name", 2);
__decorateClass$i([
  attr
], BaseRadioGroup.prototype, "orientation", 2);
__decorateClass$i([
  observable
], BaseRadioGroup.prototype, "radios", 2);
__decorateClass$i([
  attr({ mode: "boolean" })
], BaseRadioGroup.prototype, "required", 2);
__decorateClass$i([
  observable
], BaseRadioGroup.prototype, "slottedRadios", 2);

class RadioGroup extends BaseRadioGroup {
  disconnectedCallback() {
    this.fg?.disconnect();
    super.disconnectedCallback();
  }
  radiosChanged(prev, next) {
    super.radiosChanged(prev, next);
    this.fgItems ?? (this.fgItems = new ArrayItemCollection(
      () => this.enabledRadios?.filter((r) => !r.hidden) ?? [],
      () => this.enabledRadios?.find((r) => r.checked) ?? null
    ));
    if (!this.fg) {
      this.fg = new FocusGroup(this, this.fgItems, {
        definition: {
          behavior: "radiogroup",
          axis: void 0,
          wrap: true
        }
      });
    } else {
      this.fg.update();
    }
  }
}

const styles$e = css`${display("flex")} :host{-webkit-tap-highlight-color:transparent;cursor:pointer;gap:${spacingVerticalL}}:host([orientation='vertical']){flex-direction:column;justify-content:flex-start}:host([orientation='horizontal']){flex-direction:row}::slotted(*){color:${colorNeutralForeground3}}::slotted(:hover){color:${colorNeutralForeground2}}::slotted(:active){color:${colorNeutralForeground1}}::slotted(${disabledState}){color:${colorNeutralForegroundDisabled}}::slotted(${checkedState}){color:${colorNeutralForeground1}}:host([slot='input']){margin:${spacingVerticalS} ${spacingHorizontalS}}`;

function radioGroupTemplate() {
  return html`<template focusgroup="radiogroup wrap" @disabled=${(x, c) => x.disabledRadioHandler(c.event)} @change=${(x, c) => x.changeHandler(c.event)} @click=${(x, c) => x.clickHandler(c.event)} @focusin=${(x, c) => x.focusinHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)}><slot ${slotted("slottedRadios")}></slot></template>`;
}
const template$e = radioGroupTemplate();

const definition$e = RadioGroup.compose({
  name: tagName$e,
  template: template$e,
  styles: styles$e
});

definition$e.define(FluentDesignSystem.registry);

class Radio extends BaseCheckbox {
  constructor() {
    super();
    this.elementInternals.role = "radio";
  }
  /**
   * Toggles the disabled state when the user changes the `disabled` property.
   *
   * @param prev - the previous value of the `disabled` property
   * @param next - the current value of the `disabled` property
   * @internal
   * @override
   */
  disabledChanged(prev, next) {
    super.disabledChanged(prev, next);
    this.$emit("disabled", next, { bubbles: true });
  }
  /**
   * This method is a no-op for the radio component.
   *
   * @internal
   * @override
   * @remarks
   * To make a group of radio controls required, see `RadioGroup.required`.
   */
  requiredChanged() {
    return;
  }
  /**
   * This method is a no-op for the radio component.
   *
   * @internal
   * @override
   * @remarks
   * The radio form value is controlled by the `RadioGroup` component.
   */
  setFormValue() {
    return;
  }
  /**
   * Sets the validity of the control.
   *
   * @internal
   * @override
   * @remarks
   * The radio component does not have a `required` attribute, so this method always sets the validity to `true`.
   */
  setValidity() {
    this.elementInternals.setValidity({});
  }
  /**
   * Toggles the checked state of the control.
   *
   * @param force - Forces the element to be checked or unchecked
   * @public
   * @override
   * @remarks
   * The radio checked state is controlled by the `RadioGroup` component, so the `force` parameter defaults to `true`.
   */
  toggleChecked(force = true) {
    super.toggleChecked(force);
  }
}

const styles$d = css`${display("inline-flex")} :host{--size:16px;aspect-ratio:1;background-color:${colorNeutralBackground1};border:${strokeWidthThin} solid ${colorNeutralStrokeAccessible};border-radius:${borderRadiusCircular};box-sizing:border-box;position:relative;width:var(--size)}:host([size='large']){--size:20px}.checked-indicator{aspect-ratio:1;border-radius:${borderRadiusCircular};color:${colorNeutralForegroundInverted};inset:0;margin:auto;position:absolute;width:calc(var(--size) * 0.625)}:host(:not([slot='input']))::after{content:''/'';position:absolute;display:block;inset:-8px;box-sizing:border-box;outline:none;border:${strokeWidthThick} solid ${colorTransparentStroke};border-radius:${borderRadiusMedium}}:host(:not([slot='input']):focus-visible)::after{border-color:${colorStrokeFocus2}}:host(:hover){border-color:${colorNeutralStrokeAccessibleHover}}:host(${checkedState}){border-color:${colorCompoundBrandStroke}}:host(${checkedState}) .checked-indicator{background-color:${colorCompoundBrandBackground}}:host(${checkedState}:hover) .checked-indicator{background-color:${colorCompoundBrandBackgroundHover}}:host(:active){border-color:${colorNeutralStrokeAccessiblePressed}}:host(${checkedState}:active) .checked-indicator{background-color:${colorCompoundBrandBackgroundPressed}}:host(:focus-visible){outline:none}:host(${disabledState}){background-color:${colorNeutralBackgroundDisabled};border-color:${colorNeutralStrokeDisabled}}:host(${checkedState}${disabledState}) .checked-indicator{background-color:${colorNeutralStrokeDisabled}}@media (forced-colors:active){:host{border-color:FieldText}:host(:not([slot='input']:focus-visible))::after{border-color:Canvas}:host(:not(${disabledState}):hover),:host(:not([slot='input']):focus-visible)::after{border-color:Highlight}.checked-indicator{color:HighlightText}:host(${checkedState}) .checked-indicator{background-color:FieldText}:host(${checkedState}:not(${disabledState}):hover) .checked-indicator{background-color:Highlight}:host(${disabledState}){border-color:GrayText;color:GrayText}:host(${disabledState}${checkedState}) .checked-indicator{background-color:GrayText}}`;

const checkedIndicator = html.partial(
  /* html */
  `<span part=checked-indicator class=checked-indicator role=presentation></span>`
);
function radioTemplate(options = {}) {
  return html`<template @click=${(x, c) => x.clickHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)} @keyup=${(x, c) => x.keyupHandler(c.event)}><slot name=checked-indicator>${staticallyCompose(options.checkedIndicator)}</slot></template>`;
}
const template$d = radioTemplate({ checkedIndicator });

const definition$d = Radio.compose({
  name: tagName$d,
  template: template$d,
  styles: styles$d
});

definition$d.define(FluentDesignSystem.registry);

const RatingDisplayColor = {
  neutral: "neutral",
  brand: "brand",
  marigold: "marigold"
};
const RatingDisplaySize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const tagName$c = `${FluentDesignSystem.prefix}-rating-display`;

var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$h(target, key, result);
  return result;
};
const SUPPORTS_ATTR_TYPE = CSS.supports("width: attr(value type(<number>))");
const CUSTOM_PROPERTY_NAME = {
  max: "--_attr-max",
  value: "--_attr-value",
  maskImageFilled: "--_mask-image-filled",
  maskImageOutlined: "--_mask-image-outlined"
};
function svgToDataURI(svg) {
  if (!svg) {
    return "";
  }
  return ["data:image/svg+xml", encodeURIComponent(svg.replace(/\n/g, "").replace(/\s+/g, " "))].join(",");
}
class BaseRatingDisplay extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.defaultCustomIconViewBox = "0 0 20 20";
    this.elementInternals.role = "img";
    this.numberFormatter = new Intl.NumberFormat();
  }
  /**
   * Updates the icon when the referenced slot is bound in the template.
   *
   * @internal
   */
  iconSlotChanged() {
    this.handleSlotChange();
  }
  maxChanged() {
    this.setCustomPropertyValue("max");
  }
  valueChanged() {
    this.setCustomPropertyValue("value");
  }
  connectedCallback() {
    super.connectedCallback();
    this.setCustomPropertyValue("value");
    this.setCustomPropertyValue("max");
  }
  /**
   * Returns "count" as string, formatted according to the locale.
   *
   * @internal
   */
  get formattedCount() {
    return this.count ? this.numberFormatter.format(this.count) : "";
  }
  /** @internal */
  handleSlotChange() {
    const icon = this.iconSlot.assignedElements()?.find((el) => el.nodeName.toLowerCase() === "svg");
    this.renderSlottedIcon(icon ?? null);
  }
  renderSlottedIcon(svg) {
    if (!svg) {
      this.display.style.removeProperty(CUSTOM_PROPERTY_NAME.maskImageFilled);
      this.display.style.removeProperty(CUSTOM_PROPERTY_NAME.maskImageOutlined);
      return;
    }
    const innerSvg = svg.innerHTML;
    const viewBox = svg.getAttribute("viewBox") ?? this.iconViewBox ?? this.defaultCustomIconViewBox;
    const customSvgFilled = `
            <svg
                viewBox="${viewBox}"
                xmlns="http://www.w3.org/2000/svg"
            >${innerSvg}</svg>`;
    const customSvgOutlined = `
            <svg
                viewBox="${viewBox}"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="black"
                stroke-width="2"
            >${innerSvg}</svg>`;
    this.display.style.setProperty(CUSTOM_PROPERTY_NAME.maskImageFilled, `url(${svgToDataURI(customSvgFilled)})`);
    this.display.style.setProperty(CUSTOM_PROPERTY_NAME.maskImageOutlined, `url(${svgToDataURI(customSvgOutlined)})`);
  }
  setCustomPropertyValue(propertyName) {
    requestAnimationFrame(() => {
      if (!this.display || SUPPORTS_ATTR_TYPE) {
        return;
      }
      const propertyValue = this[propertyName];
      if (typeof propertyValue !== "number" || Number.isNaN(propertyValue)) {
        this.display.style.removeProperty(CUSTOM_PROPERTY_NAME[propertyName]);
      } else {
        this.display.style.setProperty(CUSTOM_PROPERTY_NAME[propertyName], `${propertyValue}`);
      }
    });
  }
}
__decorateClass$h([
  observable
], BaseRatingDisplay.prototype, "iconSlot", 2);
__decorateClass$h([
  attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "count", 2);
__decorateClass$h([
  attr({ attribute: "icon-view-box" })
], BaseRatingDisplay.prototype, "iconViewBox", 2);
__decorateClass$h([
  attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "max", 2);
__decorateClass$h([
  attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "value", 2);

var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$g(target, key, result);
  return result;
};
class RatingDisplay extends BaseRatingDisplay {
  constructor() {
    super(...arguments);
    this.compact = false;
  }
}
__decorateClass$g([
  attr
], RatingDisplay.prototype, "color", 2);
__decorateClass$g([
  attr
], RatingDisplay.prototype, "size", 2);
__decorateClass$g([
  attr({ mode: "boolean" })
], RatingDisplay.prototype, "compact", 2);

const defaultIconPath = `<path d="M5.28347 1.54605C5.57692 0.951448 6.42479 0.951449 6.71825 1.54605L7.82997 3.79866L10.3159 4.15988C10.9721 4.25523 11.2341 5.0616 10.7592 5.52443L8.96043 7.27785L9.38507 9.7537C9.49716 10.4072 8.81122 10.9056 8.22431 10.597L6.00086 9.4281L3.7774 10.597C3.19049 10.9056 2.50455 10.4072 2.61664 9.7537L3.04128 7.27784L1.24246 5.52443C0.767651 5.0616 1.02966 4.25523 1.68584 4.15988L4.17174 3.79865L5.28347 1.54605Z" />`;
const defaultIconFilled = `
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">${defaultIconPath}</svg>
`;
const defaultIconOutlined = `
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"
    fill="none" stroke="black" stroke-width="2"
>${defaultIconPath}</svg>
`;
function ratingDisplayTemplate() {
  return html`<div ${ref("display")} class=display aria-hidden=true></div><slot name=icon ${ref("iconSlot")} @slotchange=${(x) => x.handleSlotChange()}></slot><slot name=value><span class=value-label aria-hidden=true>${(x) => x.value}</span></slot><slot name=count><span class=count-label aria-hidden=true>${(x) => x.formattedCount}</span></slot>`;
}
const template$c = ratingDisplayTemplate();

const styles$c = css`${display("inline-flex")} :host{--_icon-size:16px;--_icon-gradient-degree:90deg;--_icon-color-value:${colorPaletteMarigoldBorderActive};--_icon-color-empty:${colorPaletteMarigoldBackground2};--_default-value:0;--_default-max:5;--_mask-image-filled:url(${svgToDataURI(defaultIconFilled)});--_mask-image-outlined:url(${svgToDataURI(defaultIconOutlined)});--_mask-position-x:left;align-items:center;color:${colorNeutralForeground1};font-family:${fontFamilyBase};font-size:${fontSizeBase200};line-height:${lineHeightBase200};contain:layout style;user-select:none}:host(:dir(rtl)){--_icon-gradient-degree:-90deg;--_mask-position-x:right}:host([size='small']){--_icon-size:12px}:host([size='large']){--_icon-size:20px;font-size:${fontSizeBase300};line-height:${lineHeightBase300}}::slotted([slot='icon']){display:none}:host([color='neutral']){--_icon-color-value:${colorNeutralForeground1};--_icon-color-empty:${colorNeutralBackground6}}:host([color='brand']){--_icon-color-value:${colorBrandForeground1};--_icon-color-empty:${colorBrandBackground2}}@supports (width:attr(value type(<number>))){:host{--_attr-value:attr(value type(<number>));--_attr-max:attr(max type(<number>))}}:host([compact]) .display{--_max:1}.display{--_value:max(0,round(var(--_attr-value,var(--_default-value)) * 2)/2);--_max:max(1,var(--_attr-max,var(--_default-max)));--_mask-inline-size:calc(var(--_icon-size) + ${spacingHorizontalXXS});--_icon-gradient-stop-visual-adjustment:0px;--_icon-gradient-stop:calc( var(--_mask-inline-size) * var(--_value) - var(--_icon-gradient-stop-visual-adjustment) );background-image:linear-gradient( var(--_icon-gradient-degree),var(--_icon-color-value) var(--_icon-gradient-stop),var(--_icon-color-empty) calc(var(--_icon-gradient-stop) + 0.5px) );block-size:var(--_icon-size);display:grid;inline-size:calc(var(--_max) * var(--_mask-inline-size) - ${spacingHorizontalXXS}/2);mask-image:var(--_mask-image-filled);mask-repeat:repeat no-repeat;mask-size:var(--_mask-inline-size) var(--_icon-size);mask-position:var(--_mask-position-x) center}.value-label,::slotted([slot='value']){display:block;margin-inline-start:${spacingHorizontalXS};font-weight:${fontWeightSemibold}}:host([size='small']) .value-label,:host([size='small']) ::slotted([slot='value']){margin-inline-start:${spacingHorizontalXXS}}:host([size='large']) .value-label,:host([size='large']) ::slotted([slot='value']){margin-inline-start:${spacingHorizontalSNudge}}:host(:not([count])) .count-label{display:none}.count-label::before,::slotted([slot='count'])::before{content:'·';margin-inline:${spacingHorizontalXS}}:host([size='small']) .count-label::before,:host([size='small']) ::slotted([slot='count'])::before{margin-inline:${spacingHorizontalXXS}}:host([size='large']) .count-label::before,:host([size='large']) ::slotted([slot='count'])::before{margin-inline:${spacingHorizontalSNudge}}@media (forced-colors:active){.display{--_icon-color-value:CanvasText;--_icon-color-empty:Canvas;--_icon-gradient-stop-visual-adjustment:0.5px;forced-color-adjust:none}.display::before{background-color:var(--_icon-color-value);content:'';grid-area:1/1/-1/-1;mask:inherit;mask-image:var(--_mask-image-outlined)}}`;

const definition$c = RatingDisplay.compose({
  name: tagName$c,
  template: template$c,
  styles: styles$c
});

definition$c.define(FluentDesignSystem.registry);

const SliderSize = {
  small: "small",
  medium: "medium"
};
const SliderOrientation = Orientation;
const SliderMode = {
  singleValue: "single-value"
};
const tagName$b = `${FluentDesignSystem.prefix}-slider`;

function limit(min, max, value) {
  return Math.min(Math.max(value, min), max);
}

const numberLikeStringConverter = {
  fromView(value) {
    const valueAsNumber = parseFloat(value);
    return Number.isNaN(valueAsNumber) ? "" : valueAsNumber.toString();
  },
  toView(value) {
    const valueAsNumber = parseFloat(value);
    return Number.isNaN(valueAsNumber) ? void 0 : valueAsNumber.toString();
  }
};

function convertPixelToPercent(pixelPos, minPosition, maxPosition, direction) {
  let pct = limit(0, 1, (pixelPos - minPosition) / (maxPosition - minPosition));
  if (direction === Direction.rtl) {
    pct = 1 - pct;
  }
  return pct;
}

var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$f(target, key, result);
  return result;
};
class Slider extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.direction = Direction.ltr;
    this.isDragging = false;
    this.trackWidth = 0;
    this.trackMinWidth = 0;
    this.trackHeight = 0;
    this.trackLeft = 0;
    this.trackMinHeight = 0;
    this.valueTextFormatter = () => "";
    this.disabled = false;
    this.min = "";
    this.max = "";
    this.step = "";
    this.mode = SliderMode.singleValue;
    this.setupTrackConstraints = () => {
      const clientRect = this.track.getBoundingClientRect();
      this.trackWidth = this.track.clientWidth;
      this.trackMinWidth = this.track.clientLeft;
      this.trackHeight = clientRect.top;
      this.trackMinHeight = clientRect.bottom;
      this.trackLeft = this.getBoundingClientRect().left;
      if (this.trackWidth === 0) {
        this.trackWidth = 1;
      }
    };
    /**
     *  Handle mouse moves during a thumb drag operation
     *  If the event handler is null it removes the events
     */
    this.handleThumbPointerDown = (event) => {
      if (this.isDisabled) {
        return true;
      }
      const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
      windowFn("pointerup", this.handleWindowPointerUp);
      windowFn("pointermove", this.handlePointerMove, { passive: true });
      windowFn("touchmove", this.handlePointerMove, { passive: true });
      windowFn("touchend", this.handleWindowPointerUp);
      this.isDragging = event !== null;
      return true;
    };
    /**
     *  Handle mouse moves during a thumb drag operation
     */
    this.handlePointerMove = (event) => {
      if (this.isDisabled || event.defaultPrevented) {
        return;
      }
      const sourceEvent = window.TouchEvent && event instanceof TouchEvent ? event.touches[0] : event;
      const thumbWidth = this.thumb.getBoundingClientRect().width;
      const eventValue = this.orientation === Orientation.vertical ? sourceEvent.pageY - document.documentElement.scrollTop : sourceEvent.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
      this.value = `${this.calculateNewValue(eventValue)}`;
    };
    /**
     * Handle a window mouse up during a drag operation
     */
    this.handleWindowPointerUp = () => {
      this.stopDragging();
    };
    this.stopDragging = () => {
      this.isDragging = false;
      this.handlePointerDown(null);
      this.handleThumbPointerDown(null);
    };
    /**
     *
     * @param event - PointerEvent or null. If there is no event handler it will remove the events
     */
    this.handlePointerDown = (event) => {
      if (event === null || !this.isDisabled) {
        const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
        const documentFn = event !== null ? document.addEventListener : document.removeEventListener;
        windowFn("pointerup", this.handleWindowPointerUp);
        documentFn("mouseleave", this.handleWindowPointerUp);
        windowFn("pointermove", this.handlePointerMove);
        const thumbWidth = this.thumb.getBoundingClientRect().width;
        if (event) {
          this.setupTrackConstraints();
          const controlValue = this.orientation === Orientation.vertical ? event.pageY - document.documentElement.scrollTop : event.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
          this.value = `${this.calculateNewValue(controlValue)}`;
        }
      }
      return true;
    };
    this.elementInternals.role = "slider";
    this.elementInternals.ariaOrientation = this.orientation ?? SliderOrientation.horizontal;
  }
  /**
   * A reference to all associated `<label>` elements.
   *
   * @public
   */
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  handleChange(_, propertyName) {
    switch (propertyName) {
      case "min":
      case "max":
        this.setSliderPosition();
      case "step":
        this.handleStepStyles();
        break;
    }
  }
  /**
   * Handles changes to step styling based on the step value
   * NOTE: This function is not a changed callback, stepStyles is not observable
   */
  handleStepStyles() {
    if (this.step) {
      const totalSteps = 100 / Math.floor((this.maxAsNumber - this.minAsNumber) / this.stepAsNumber);
      if (this.stepStyles !== void 0) {
        this.$fastController.removeStyles(this.stepStyles);
      }
      this.stepStyles = css`:host{--step-rate:${totalSteps}%}`;
      this.$fastController.addStyles(this.stepStyles);
    } else if (this.stepStyles !== void 0) {
      this.$fastController.removeStyles(this.stepStyles);
    }
  }
  /**
   * Sets the value of the input when the value attribute changes.
   *
   * @param prev - The previous value
   * @param next - The current value
   * @internal
   */
  initialValueChanged(_, next) {
    if (this.$fastController.isConnected) {
      this.value = next;
    } else {
      this._value = next;
    }
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The element's validation message.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validationMessage | `ElemenentInternals.validationMessage`} property.
   */
  get validationMessage() {
    return this.elementInternals.validationMessage;
  }
  /**
   * Whether the element is a candidate for its owning form's constraint validation.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/willValidate | `ElemenentInternals.willValidate`} property.
   */
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  /**
   * Checks the element's validity.
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/checkValidity | `ElemenentInternals.checkValidity`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Reports the element's validity.
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/reportValidity | `ElemenentInternals.reportValidity`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Sets a custom validity message.
   * @public
   */
  setCustomValidity(message) {
    this.setValidity({ customError: !!message }, message);
  }
  /**
   * Sets the validity of the control.
   *
   * @param flags - Validity flags to set.
   * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
   * @param anchor - Optional anchor to use for the validation message.
   *
   * @internal
   */
  setValidity(flags, message, anchor) {
    if (this.$fastController.isConnected) {
      if (this.isDisabled) {
        this.elementInternals.setValidity({});
        return;
      }
      this.elementInternals.setValidity(
        { customError: !!message, ...flags },
        message ?? this.validationMessage,
        anchor
      );
    }
  }
  /**
   * The current value of the input.
   *
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this._value?.toString() ?? "";
  }
  set value(value) {
    if (!this.$fastController.isConnected) {
      this._value = value.toString();
      return;
    }
    const nextAsNumber = parseFloat(value);
    const newValue = limit(this.minAsNumber, this.maxAsNumber, this.convertToConstrainedValue(nextAsNumber)).toString();
    if (newValue !== value) {
      this.value = newValue;
      return;
    }
    this._value = value.toString();
    this.elementInternals.ariaValueNow = this._value;
    this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
    this.setSliderPosition();
    this.$emit("change");
    this.setFormValue(value);
    Observable.notify(this, "value");
  }
  /**
   * Resets the form value to its initial value when the form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.value = this.initialValue ?? this.midpoint;
  }
  /**
   * Disabled the component when its associated form is disabled.
   *
   * @internal
   *
   * @privateRemarks
   * DO NOT change the `disabled` property or attribute here, because if the
   * `disabled` attribute is present, reenabling an ancestor `<fieldset>`
   * element will not reenabling this component.
   */
  formDisabledCallback(disabled) {
    this.setDisabledSideEffect(disabled);
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    this.elementInternals.setFormValue(value, value ?? state);
  }
  directionChanged() {
    this.setSliderPosition();
  }
  /**
   * The value property, typed as a number.
   *
   * @public
   */
  get valueAsNumber() {
    return parseFloat(this.value);
  }
  set valueAsNumber(next) {
    this.value = next.toString();
  }
  valueTextFormatterChanged() {
    if (typeof this.valueTextFormatter === "function") {
      this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
    } else {
      this.elementInternals.ariaValueText = "";
    }
  }
  disabledChanged() {
    this.setDisabledSideEffect(this.disabled);
  }
  /**
   * Returns true if the component is disabled, taking into account the `disabled`
   * attribute, `aria-disabled` attribute, and the `:disabled` pseudo-class.
   *
   * @internal
   */
  get isDisabled() {
    return this.disabled || this.elementInternals?.ariaDisabled === "true" || this.isConnected && this.matches(":disabled");
  }
  minChanged() {
    this.elementInternals.ariaValueMin = `${this.minAsNumber}`;
    if (this.$fastController.isConnected && this.minAsNumber > this.valueAsNumber) {
      this.value = this.min;
    }
  }
  /**
   * Returns the min property or the default value
   *
   * @internal
   */
  get minAsNumber() {
    if (this.min !== void 0) {
      const parsed = parseFloat(this.min);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return 0;
  }
  maxChanged() {
    this.elementInternals.ariaValueMax = `${this.maxAsNumber}`;
    if (this.$fastController.isConnected && this.maxAsNumber < this.valueAsNumber) {
      this.value = this.max;
    }
  }
  /**
   * Returns the max property or the default value
   *
   * @internal
   */
  get maxAsNumber() {
    if (this.max !== void 0) {
      const parsed = parseFloat(this.max);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return 100;
  }
  stepChanged() {
    this.updateStepMultiplier();
    if (this.$fastController.isConnected) {
      this.value = this._value;
    }
  }
  /**
   * Returns the step property as a number.
   *
   * @internal
   */
  get stepAsNumber() {
    if (this.step !== void 0) {
      const parsed = parseFloat(this.step);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return 1;
  }
  orientationChanged(prev, next) {
    this.elementInternals.ariaOrientation = next ?? Orientation.horizontal;
    if (this.$fastController.isConnected) {
      this.setSliderPosition();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      if (!this.$fastController.isConnected) {
        return;
      }
      this.direction = getDirection(this);
      this.setDisabledSideEffect(this.disabled);
      this.updateStepMultiplier();
      this.setupTrackConstraints();
      this.setupDefaultValue();
      this.setSliderPosition();
      this.handleStepStyles();
      const notifier = Observable.getNotifier(this);
      notifier.subscribe(this, "max");
      notifier.subscribe(this, "min");
      notifier.subscribe(this, "step");
    });
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    const notifier = Observable.getNotifier(this);
    notifier.unsubscribe(this, "max");
    notifier.unsubscribe(this, "min");
    notifier.unsubscribe(this, "step");
  }
  /**
   * Increment the value by the step
   *
   * @public
   */
  increment() {
    const newVal = this.direction !== Direction.rtl ? Number(this.value) + this.stepAsNumber : Number(this.value) - this.stepAsNumber;
    const incrementedVal = this.convertToConstrainedValue(newVal);
    const incrementedValString = incrementedVal < this.maxAsNumber ? `${incrementedVal}` : `${this.maxAsNumber}`;
    this.value = incrementedValString;
  }
  /**
   * Decrement the value by the step
   *
   * @public
   */
  decrement() {
    const newVal = this.direction !== Direction.rtl ? Number(this.value) - Number(this.stepAsNumber) : Number(this.value) + Number(this.stepAsNumber);
    const decrementedVal = this.convertToConstrainedValue(newVal);
    const decrementedValString = decrementedVal > this.minAsNumber ? `${decrementedVal}` : `${this.minAsNumber}`;
    this.value = decrementedValString;
  }
  handleKeydown(event) {
    if (this.isDisabled) {
      return true;
    }
    switch (event.key) {
      case "Home":
        event.preventDefault();
        this.value = this.direction !== Direction.rtl && this.orientation !== Orientation.vertical ? `${this.minAsNumber}` : `${this.maxAsNumber}`;
        break;
      case "End":
        event.preventDefault();
        this.value = this.direction !== Direction.rtl && this.orientation !== Orientation.vertical ? `${this.maxAsNumber}` : `${this.minAsNumber}`;
        break;
      case "ArrowRight":
      case "ArrowUp":
        if (!event.shiftKey) {
          event.preventDefault();
          this.increment();
        }
        break;
      case "ArrowLeft":
      case "ArrowDown":
        if (!event.shiftKey) {
          event.preventDefault();
          this.decrement();
        }
        break;
    }
    return true;
  }
  /**
   * Places the thumb based on the current value
   */
  setSliderPosition() {
    const newPct = convertPixelToPercent(
      parseFloat(this.value),
      this.minAsNumber,
      this.maxAsNumber,
      this.orientation === Orientation.vertical ? void 0 : this.direction
    );
    const percentage = newPct * 100;
    this.position = `--slider-thumb: ${percentage}%; --slider-progress: ${percentage}%`;
  }
  /**
   * Update the step multiplier used to ensure rounding errors from steps that
   * are not whole numbers
   */
  updateStepMultiplier() {
    const stepString = this.stepAsNumber + "";
    const decimalPlacesOfStep = !!(this.stepAsNumber % 1) ? stepString.length - stepString.indexOf(".") - 1 : 0;
    this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
  }
  get midpoint() {
    return `${this.convertToConstrainedValue((this.maxAsNumber + this.minAsNumber) / 2)}`;
  }
  setupDefaultValue() {
    if (!this._value) {
      this.value = this.initialValue ?? this.midpoint;
    }
    if (!Number.isNaN(this.valueAsNumber) && (this.valueAsNumber < this.minAsNumber || this.valueAsNumber > this.maxAsNumber)) {
      this.value = this.midpoint;
    }
    this.elementInternals.ariaValueNow = this.value;
  }
  /**
   * Calculate the new value based on the given raw pixel value.
   *
   * @param rawValue - the value to be converted to a constrained value
   * @returns the constrained value
   *
   * @internal
   */
  calculateNewValue(rawValue) {
    this.setupTrackConstraints();
    const newPosition = convertPixelToPercent(
      rawValue,
      this.orientation === Orientation.vertical ? this.trackMinHeight : this.trackMinWidth,
      this.orientation === Orientation.vertical ? this.trackHeight : this.trackWidth,
      this.orientation === Orientation.vertical ? void 0 : this.direction
    );
    const newValue = (this.maxAsNumber - this.minAsNumber) * newPosition + this.minAsNumber;
    return this.convertToConstrainedValue(newValue);
  }
  convertToConstrainedValue(value) {
    if (isNaN(value)) {
      value = this.minAsNumber;
    }
    let constrainedValue = value - this.minAsNumber;
    const roundedConstrainedValue = Math.round(constrainedValue / this.stepAsNumber);
    const remainderValue = constrainedValue - roundedConstrainedValue * (this.stepMultiplier * this.stepAsNumber) / this.stepMultiplier;
    constrainedValue = remainderValue >= Number(this.stepAsNumber) / 2 ? constrainedValue - remainderValue + Number(this.stepAsNumber) : constrainedValue - remainderValue;
    return constrainedValue + this.minAsNumber;
  }
  /**
   * Makes sure the side effects of set up when the disabled state changes.
   */
  setDisabledSideEffect(disabled = this.isDisabled) {
    Updates.enqueue(() => {
      this.elementInternals.ariaDisabled = disabled.toString();
      this.tabIndex = disabled ? -1 : 0;
    });
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
Slider.formAssociated = true;
__decorateClass$f([
  attr
], Slider.prototype, "size", 2);
__decorateClass$f([
  attr({ attribute: "value", mode: "fromView" })
], Slider.prototype, "initialValue", 2);
__decorateClass$f([
  observable
], Slider.prototype, "direction", 2);
__decorateClass$f([
  observable
], Slider.prototype, "isDragging", 2);
__decorateClass$f([
  observable
], Slider.prototype, "position", 2);
__decorateClass$f([
  observable
], Slider.prototype, "trackWidth", 2);
__decorateClass$f([
  observable
], Slider.prototype, "trackMinWidth", 2);
__decorateClass$f([
  observable
], Slider.prototype, "trackHeight", 2);
__decorateClass$f([
  observable
], Slider.prototype, "trackLeft", 2);
__decorateClass$f([
  observable
], Slider.prototype, "trackMinHeight", 2);
__decorateClass$f([
  observable
], Slider.prototype, "valueTextFormatter", 2);
__decorateClass$f([
  attr({ mode: "boolean" })
], Slider.prototype, "disabled", 2);
__decorateClass$f([
  attr({ converter: numberLikeStringConverter })
], Slider.prototype, "min", 2);
__decorateClass$f([
  attr({ converter: numberLikeStringConverter })
], Slider.prototype, "max", 2);
__decorateClass$f([
  attr({ converter: numberLikeStringConverter })
], Slider.prototype, "step", 2);
__decorateClass$f([
  attr
], Slider.prototype, "orientation", 2);
__decorateClass$f([
  attr
], Slider.prototype, "mode", 2);

const styles$b = css`${display("inline-grid")} :host{--thumb-size:20px;--track-margin-inline:calc(var(--thumb-size)/2);--track-size:4px;--track-overhang:calc(var(--track-size)/-2);--rail-color:${colorCompoundBrandBackground};--track-color:${colorNeutralStrokeAccessible};--slider-direction:90deg;--border-radius:${borderRadiusMedium};--step-marker-inset:var(--track-overhang) -1px;position:relative;align-items:center;justify-content:center;box-sizing:border-box;outline:none;user-select:none;touch-action:none;min-width:120px;min-height:32px;grid-template-rows:1fr var(--thumb-size) 1fr;grid-template-columns:var(--track-margin-inline) 1fr var(--track-margin-inline)}:host(:hover){--rail-color:${colorCompoundBrandBackgroundHover}}:host(:active){--rail-color:${colorCompoundBrandBackgroundPressed}}:host(:disabled){--rail-color:${colorNeutralForegroundDisabled};--track-color:${colorNeutralBackgroundDisabled}}:host(:not(:disabled)){cursor:pointer}:host(:dir(rtl)){--slider-direction:-90deg}:host([size='small']){--thumb-size:16px;--track-overhang:-1px;--track-size:2px;--border-radius:${borderRadiusSmall}}:host([orientation='vertical']){--slider-direction:0deg;--step-marker-inset:-1px var(--track-overhang);min-height:120px;grid-template-rows:var(--track-margin-inline) 1fr var(--track-margin-inline);grid-template-columns:1fr var(--thumb-size) 1fr;width:unset;min-width:32px;justify-items:center}:host(:not([slot='input']):focus-visible){box-shadow:0 0 0 2pt ${colorStrokeFocus2};outline:1px solid ${colorStrokeFocus1}}:host:after,.track{height:var(--track-size);width:100%}:host:after{background-image:linear-gradient( var(--slider-direction),var(--rail-color) 0%,var(--rail-color) 50%,var(--track-color) 50.1%,var(--track-color) 100% );border-radius:var(--border-radius);content:'';grid-row:1/-1;grid-column:1/-1}.track{position:relative;background-color:var(--track-color);grid-row:2/2;grid-column:2/2;forced-color-adjust:none;overflow:hidden}:host([orientation='vertical'])::after,:host([orientation='vertical']) .track{height:100%;width:var(--track-size)}.track::before{content:'';position:absolute;height:100%;border-radius:inherit;inset-inline-start:0;width:var(--slider-progress)}:host(:dir(rtl)) .track::before{width:calc(100% - var(--slider-progress))}:host([orientation='vertical']) .track::before{width:100%;bottom:0;height:var(--slider-progress)}:host([step]) .track::after{content:'';position:absolute;border-radius:inherit;inset:var(--step-marker-inset);background-image:repeating-linear-gradient( var(--slider-direction),#0000 0%,#0000 calc(var(--step-rate) - 1px),${colorNeutralBackground1} calc(var(--step-rate) - 1px),${colorNeutralBackground1} var(--step-rate) )}.thumb-container{position:absolute;grid-row:2/2;grid-column:2/2;transform:translateX(-50%);left:var(--slider-thumb)}:host([orientation='vertical']) .thumb-container{transform:translateY(50%);left:unset;bottom:var(--slider-thumb)}:host(:not(:active)) :is(.thumb-container,.track::before){transition:all 0.2s ease}.thumb{width:var(--thumb-size);height:var(--thumb-size);border-radius:${borderRadiusCircular};box-shadow:0 0 0 calc(var(--thumb-size) * 0.2) ${colorNeutralBackground1} inset;border:calc(var(--thumb-size) * 0.05) solid ${colorNeutralStroke1};box-sizing:border-box}.thumb,.track::before{background-color:var(--rail-color)}@media (forced-colors:active){.track:hover,.track:active,.track{background:WindowText}.thumb:hover,.thumb:active,.thumb{background:ButtonText}:host(:hover) .track::before,:host(:active) .track::before,.track::before{background:Highlight}}`;

function sliderTemplate(options = {}) {
  return html`<template @pointerdown=${(x, c) => x.handlePointerDown(c.event)} @keydown=${(x, c) => x.handleKeydown(c.event)}><div ${ref("track")} part=track-container class=track style=${(x) => x.position}></div><div ${ref("thumb")} part=thumb-container class=thumb-container style=${(x) => x.position} @pointerdown=${(x, c) => x.handleThumbPointerDown(c.event)}><slot name=thumb>${staticallyCompose(options.thumb)}</slot></div></template>`;
}
const template$b = sliderTemplate({
  thumb: `<div class="thumb"></div>`
});

const definition$b = Slider.compose({
  name: tagName$b,
  template: template$b,
  styles: styles$b
});

definition$b.define(FluentDesignSystem.registry);

const SpinnerAppearance = {
  primary: "primary",
  inverted: "inverted"
};
const SpinnerSize = {
  tiny: "tiny",
  extraSmall: "extra-small",
  small: "small",
  medium: "medium",
  large: "large",
  extraLarge: "extra-large",
  huge: "huge"
};
const tagName$a = `${FluentDesignSystem.prefix}-spinner`;

class BaseSpinner extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "progressbar";
  }
}

var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$e(target, key, result);
  return result;
};
class Spinner extends BaseSpinner {
}
__decorateClass$e([
  attr
], Spinner.prototype, "size", 2);
__decorateClass$e([
  attr
], Spinner.prototype, "appearance", 2);

const styles$a = css`${display("inline-flex")} :host{--duration:1.5s;--indicatorSize:${strokeWidthThicker};--size:32px;height:var(--size);width:var(--size);contain:strict;content-visibility:auto}:host([size='tiny']){--indicatorSize:${strokeWidthThick};--size:20px}:host([size='extra-small']){--indicatorSize:${strokeWidthThick};--size:24px}:host([size='small']){--indicatorSize:${strokeWidthThick};--size:28px}:host([size='large']){--indicatorSize:${strokeWidthThicker};--size:36px}:host([size='extra-large']){--indicatorSize:${strokeWidthThicker};--size:40px}:host([size='huge']){--indicatorSize:${strokeWidthThickest};--size:44px}.progress,.background,.spinner,.start,.end,.indicator{position:absolute;inset:0}.progress,.spinner,.indicator{animation:none var(--duration) infinite ${curveEasyEase}}.progress{animation-timing-function:linear;animation-name:spin-linear}.background{border:var(--indicatorSize) solid ${colorBrandStroke2};border-radius:50%}:host([appearance='inverted']) .background{border-color:rgba(255,255,255,0.2)}.spinner{animation-name:spin-swing}.start{overflow:hidden;right:50%}.end{overflow:hidden;left:50%}.indicator{color:${colorBrandStroke1};box-sizing:border-box;border-radius:50%;border:var(--indicatorSize) solid transparent;border-block-start-color:currentcolor;border-right-color:currentcolor}:host([appearance='inverted']) .indicator{color:${colorNeutralStrokeOnBrand2}}.start .indicator{rotate:135deg;inset:0 -100% 0 0;animation-name:spin-start}.end .indicator{rotate:135deg;inset:0 0 0 -100%;animation-name:spin-end}@keyframes spin-linear{100%{transform:rotate(360deg)}}@keyframes spin-swing{0%{transform:rotate(-135deg)}50%{transform:rotate(0deg)}100%{transform:rotate(225deg)}}@keyframes spin-start{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-80deg)}}@keyframes spin-end{0%,100%{transform:rotate(0deg)}50%{transform:rotate(70deg)}}@media (forced-colors:active){.background{display:none}.indicator{border-color:Canvas;border-block-start-color:Highlight;border-right-color:Highlight}}`;

const template$a = html`<slot name=indicator><div class=background></div><div class=progress><div class=spinner><div class=start><div class=indicator></div></div><div class=end><div class=indicator></div></div></div></div></slot>`;

const definition$a = Spinner.compose({
  name: tagName$a,
  template: template$a,
  styles: styles$a
});

definition$a.define(FluentDesignSystem.registry);

const SwitchLabelPosition = {
  above: "above",
  after: "after",
  before: "before"
};
const tagName$9 = `${FluentDesignSystem.prefix}-switch`;

class Switch extends BaseCheckbox {
  constructor() {
    super();
    this.elementInternals.role = "switch";
  }
}

function switchTemplate(options = {}) {
  return html`<template @click=${(x, c) => x.clickHandler(c.event)} @input=${(x, c) => x.inputHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)} @keyup=${(x, c) => x.keyupHandler(c.event)}><slot name=switch>${staticallyCompose(options.switch)}</slot></template>`;
}
const template$9 = switchTemplate({
  switch: `<span class="checked-indicator" part="checked-indicator"></span>`
});

const styles$9 = css`${display("inline-flex")} :host{box-sizing:border-box;align-items:center;flex-direction:row;outline:none;user-select:none;contain:content;padding:0 ${spacingHorizontalXXS};width:40px;height:20px;background-color:${colorTransparentBackground};border:1px solid ${colorNeutralStrokeAccessible};border-radius:${borderRadiusCircular}}:host(:enabled){cursor:pointer}:host(:hover){background:none;border-color:${colorNeutralStrokeAccessibleHover}}:host(:active){border-color:${colorNeutralStrokeAccessiblePressed}}:host(:disabled),:host([readonly]){border:1px solid ${colorNeutralStrokeDisabled};background-color:none;pointer:default}:host(${checkedState}){background:${colorCompoundBrandBackground};border-color:${colorCompoundBrandBackground}}:host(${checkedState}:hover){background:${colorCompoundBrandBackgroundHover};border-color:${colorCompoundBrandBackgroundHover}}:host(${checkedState}:active){background:${colorCompoundBrandBackgroundPressed};border-color:${colorCompoundBrandBackgroundPressed}}:host(${checkedState}:disabled){background:${colorNeutralBackgroundDisabled};border-color:${colorNeutralStrokeDisabled}}.checked-indicator{height:14px;width:14px;border-radius:50%;margin-inline-start:0;background-color:${colorNeutralForeground3};transition-duration:${durationNormal};transition-timing-function:${curveEasyEase};transition-property:margin-inline-start}:host(${checkedState}) .checked-indicator{background-color:${colorNeutralForegroundInverted};margin-inline-start:calc(100% - 14px)}:host(${checkedState}:hover) .checked-indicator{background:${colorNeutralForegroundInvertedHover}}:host(${checkedState}:active) .checked-indicator{background:${colorNeutralForegroundInvertedPressed}}:host(:hover) .checked-indicator{background-color:${colorNeutralForeground3Hover}}:host(:active) .checked-indicator{background-color:${colorNeutralForeground3Pressed}}:host(:disabled) .checked-indicator,:host([readonly]) .checked-indicator{background:${colorNeutralForegroundDisabled}}:host(${checkedState}:disabled) .checked-indicator{background:${colorNeutralForegroundDisabled}}:host(:focus-visible){outline:none}:host(:not([slot='input']):focus-visible){border-color:${colorTransparentStroke};outline:${strokeWidthThick} solid ${colorTransparentStroke};outline-offset:1px;box-shadow:${shadow4},0 0 0 2px ${colorStrokeFocus2}}@media (forced-colors:active){:host{border-color:InactiveBorder}:host(${checkedState}),:host(${checkedState}:active),:host(${checkedState}:hover){background:Highlight;border-color:Highlight}.checked-indicator,:host(:hover) .checked-indicator,:host(:active) .checked-indicator{background-color:ActiveCaption}:host(${checkedState}) .checked-indicator,:host(${checkedState}:hover) .checked-indicator,:host(${checkedState}:active) .checked-indicator{background-color:ButtonFace}:host(:disabled) .checked-indicator,:host(${checkedState}:disabled) .checked-indicator{background-color:GrayText}}`;

const definition$9 = Switch.compose({
  name: tagName$9,
  template: template$9,
  styles: styles$9
});

definition$9.define(FluentDesignSystem.registry);

function isTab(element, tagName2 = "-tab") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const tagName$8 = `${FluentDesignSystem.prefix}-tab`;

var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$d(target, key, result);
  return result;
};
class Tab extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "tab";
  }
  disabledChanged(prev, next) {
    this.setDisabledSideEffect(next);
  }
  connectedCallback() {
    super.connectedCallback();
    this.slot || (this.slot = "tab");
    this.setDisabledSideEffect(this.disabled);
    if (this.styles) {
      this.$fastController.removeStyles(this.styles);
    }
    this.styles = css`:host{--textContent:'${this.textContent}'}`;
    this.$fastController.addStyles(this.styles);
  }
  setDisabledSideEffect(disabled) {
    if (disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
    this.tabIndex = disabled && this.getAttribute("aria-selected") !== "true" ? -1 : 0;
  }
}
__decorateClass$d([
  attr({ mode: "boolean" })
], Tab.prototype, "disabled", 2);
applyMixins(Tab, StartEnd);

function tabTemplate(options = {}) {
  return html`<template slot=tab role=tab>${startSlotTemplate(options)} <span class=tab-content><slot></slot></span>${endSlotTemplate(options)}</template>`;
}
const template$8 = tabTemplate({});

const styles$8 = css`${display("inline-flex")} :host{position:relative;flex-direction:row;align-items:center;cursor:pointer;box-sizing:border-box;justify-content:center;line-height:${lineHeightBase300};font-family:${fontFamilyBase};font-size:${fontSizeBase300};color:${colorNeutralForeground2};fill:currentcolor;grid-row:1;padding:${spacingHorizontalM} ${spacingHorizontalMNudge};border-radius:${borderRadiusMedium};gap:4px}:host .tab-content{display:inline-flex;flex-direction:column;padding:0 2px}:host([aria-selected='true']){color:${colorNeutralForeground1};font-weight:${fontWeightSemibold}}:host .tab-content::after{content:var(--textContent);visibility:hidden;height:0;line-height:${lineHeightBase300};font-weight:${fontWeightSemibold}}:host([aria-selected='true'])::after{background-color:${colorCompoundBrandStroke};border-radius:${borderRadiusCircular};content:'';inset:0;position:absolute;z-index:2}:host([aria-selected='false']:hover)::after{background-color:${colorNeutralStroke1Hover};border-radius:${borderRadiusCircular};content:'';inset:0;position:absolute;z-index:1}@supports (anchor-name:--a) and (text-size-adjust:auto){:host([aria-selected='true'])::after{background-color:transparent}:host([aria-selected='true']:hover)::after{background-color:${colorNeutralStroke1Hover}}}:host([aria-selected='true'][disabled])::after{background-color:${colorNeutralForegroundDisabled}}::slotted([slot='start']),::slotted([slot='end']){display:flex}:host([disabled]){cursor:not-allowed;fill:${colorNeutralForegroundDisabled};color:${colorNeutralForegroundDisabled};pointer-events:none}:host([disabled]:hover)::after{background-color:unset}:host(:focus){outline:none}:host(:focus-visible){border-radius:${borderRadiusSmall};box-shadow:0 0 0 3px ${colorStrokeFocus2};outline:1px solid ${colorStrokeFocus1}}:host([data-hasIndent]){display:grid;grid-template-columns:20px 1fr auto}:host([data-hasIndent]) .tab-content{grid-column:2}@media (forced-colors:active){:host([aria-selected='true'])::after{background-color:Highlight}}`;

const definition$8 = Tab.compose({
  name: tagName$8,
  template: template$8,
  styles: styles$8
});

definition$8.define(FluentDesignSystem.registry);

const TablistAppearance = {
  subtle: "subtle",
  transparent: "transparent"
};
const TablistSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const TablistOrientation = Orientation;
const tagName$7 = `${FluentDesignSystem.prefix}-tablist`;

var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$c(target, key, result);
  return result;
};
class BaseTablist extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.disabled = false;
    this.orientation = TablistOrientation.horizontal;
    this.tabs = [];
    this.tabPanelMap = /* @__PURE__ */ new WeakMap();
    this.change = () => {
      this.$emit("change", this.activetab);
    };
    this.elementInternals.role = "tablist";
    this.elementInternals.ariaOrientation = this.orientation ?? TablistOrientation.horizontal;
  }
  /** @internal */
  disabledChanged(prev, next) {
    if (this.elementInternals) {
      toggleState(this.elementInternals, "disabled", next);
    }
    this.setTabs({ forceDisabled: true });
  }
  orientationChanged(prev, next) {
    if (this.elementInternals) {
      this.elementInternals.ariaOrientation = next ?? TablistOrientation.horizontal;
      swapStates(this.elementInternals, prev, next, TablistOrientation);
    }
    this.setTabs();
  }
  /** @internal */
  activeidChanged(oldValue, newValue) {
    if (this.tabs?.length > 0) {
      this.changeTab(oldValue, newValue);
    }
  }
  /** @internal */
  slottedTabsChanged(prev, next) {
    this.tabs = next?.filter((tab) => isTab(tab)) ?? [];
  }
  /** @internal */
  tabsChanged(prev, next) {
    if (this.tabs?.length > 0) {
      this.setTabs({ connectToPanel: true });
    }
  }
  /**
   * Function that is invoked whenever the selected tab or the tab collection changes.
   */
  setTabs({ connectToPanel = false, forceDisabled = false } = {}) {
    if (!this.tabs) {
      return;
    }
    const hasStartSlot = this.tabs.some((tab) => !!tab.querySelector("[slot='start']"));
    const rootNode = this.getRootNode();
    let firstEnabledTabId = "";
    for (const tab of this.tabs) {
      if (tab.slot !== "tab") {
        continue;
      }
      tab.id || (tab.id = uniqueId("tab-"));
      if (forceDisabled) {
        tab.disabled = this.disabled;
      } else {
        tab.disabled = tab.disabled || this.disabled;
      }
      if (!firstEnabledTabId && !tab.disabled) {
        firstEnabledTabId = tab.id;
      }
      const isSelected = this.activeid === tab.id;
      tab.toggleAttribute("focusgroupstart", isSelected);
      tab.setAttribute("aria-selected", isSelected.toString());
      tab.toggleAttribute("data-hasIndent", hasStartSlot && this.orientation === TablistOrientation.vertical);
      if (connectToPanel) {
        const ariaControls = tab.getAttribute("aria-controls") ?? "";
        const panel = rootNode.getElementById(ariaControls);
        if (ariaControls && panel) {
          panel.role ?? (panel.role = "tabpanel");
          panel.hidden = this.activeid !== tab.id;
          this.tabPanelMap.set(tab, panel);
        }
      }
    }
    if (!this.disabled) {
      if (this.activeid) {
        this.changeTab(void 0, this.activeid);
      } else if (firstEnabledTabId) {
        this.activeid = firstEnabledTabId;
      }
    }
  }
  /** @internal */
  handleFocusIn(event) {
    const target = event.target;
    if (!isTab(target) || target.disabled) {
      return;
    }
    this.activeid = target.id;
  }
  changeTab(oldId, newId) {
    const rootNode = this.getRootNode();
    const prevTab = oldId ? rootNode.getElementById(oldId) : null;
    const nextTab = rootNode.getElementById(newId);
    if (!isTab(nextTab) || !this.contains(nextTab)) {
      return;
    }
    if (prevTab) {
      prevTab.setAttribute("aria-selected", "false");
      const prevPanel = this.tabPanelMap.get(prevTab);
      if (prevPanel) {
        prevPanel.hidden = true;
      }
    }
    nextTab.setAttribute("aria-selected", "true");
    const nextPanel = this.tabPanelMap.get(nextTab);
    if (nextPanel) {
      nextPanel.hidden = false;
    }
    this.activetab = nextTab;
    this.change();
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    waitForConnectedDescendants(
      this,
      () => {
        this.setTabs();
      },
      { shallow: true }
    );
  }
}
__decorateClass$c([
  attr({ mode: "boolean" })
], BaseTablist.prototype, "disabled", 2);
__decorateClass$c([
  attr
], BaseTablist.prototype, "orientation", 2);
__decorateClass$c([
  attr
], BaseTablist.prototype, "activeid", 2);
__decorateClass$c([
  observable
], BaseTablist.prototype, "slottedTabs", 2);
__decorateClass$c([
  observable
], BaseTablist.prototype, "tabs", 2);

var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$b(target, key, result);
  return result;
};
class Tablist extends BaseTablist {
  constructor() {
    super(...arguments);
    this.appearance = TablistAppearance.transparent;
  }
  disconnectedCallback() {
    this.fg?.disconnect();
    super.disconnectedCallback();
  }
  tabsChanged(prev, next) {
    super.tabsChanged(prev, next);
    this.fgItems ?? (this.fgItems = new ArrayItemCollection(
      () => this.tabs?.filter((t) => (t.getAttribute("aria-selected") === "true" || !t.disabled) && !t.hidden) ?? [],
      () => this.activetab ?? null
    ));
    if (!this.fg) {
      this.fg = new FocusGroup(this, this.fgItems, {
        definition: {
          behavior: "tablist",
          axis: void 0,
          memory: false,
          wrap: true
        }
      });
    } else {
      this.fg.update();
    }
  }
}
__decorateClass$b([
  attr
], Tablist.prototype, "appearance", 2);
__decorateClass$b([
  attr
], Tablist.prototype, "size", 2);

const template$7 = html`<template role=tablist focusgroup="tablist inline block" @focusin=${(x, c) => x.handleFocusIn(c.event)}><slot name=tab ${slotted("slottedTabs")}></slot></template>`;

const styles$7 = css`${display("flex")} :host{--tabPaddingInline:${spacingHorizontalMNudge};--tabPaddingBlock:${spacingHorizontalM};--tabIndicatorInsetInline:var(--tabPaddingInline);--tabIndicatorInsetBlock:0;box-sizing:border-box;color:${colorNeutralForeground2};flex-direction:row;position:relative}:host([size='small']){--tabPaddingBlock:${spacingVerticalSNudge};--tabPaddingInline:${spacingHorizontalSNudge}}:host([size='large']){--tabPaddingBlock:${spacingVerticalL};--tabPaddingInline:${spacingHorizontalMNudge}}:host([orientation='vertical']){--tabPaddingBlock:${spacingVerticalS};--tabIndicatorInsetBlock:${spacingVerticalS};flex-direction:column}:host([orientation='vertical'][size='small']){--tabPaddingBlock:${spacingVerticalXXS};--tabIndicatorInsetBlock:${spacingVerticalSNudge}}:host([orientation='vertical'][size='large']){--tabPaddingBlock:${spacingVerticalS};--tabIndicatorInsetBlock:${spacingVerticalMNudge}}::slotted([slot='tab']){padding-inline:var(--tabPaddingInline);padding-block:var(--tabPaddingBlock)}:host([orientation='vertical']) ::slotted([role='tab']){justify-content:flex-start}:host ::slotted([slot='tab'])::after{height:${strokeWidthThicker};margin-block-start:auto}:host([orientation='vertical']) ::slotted([slot='tab'])::after{width:${strokeWidthThicker};height:unset;margin-block-start:unset}:host ::slotted([slot='tab'])::before{height:${strokeWidthThicker};border-radius:${borderRadiusCircular};content:'';inset-inline:var(--tabIndicatorInsetInline);inset-block:var(--tabIndicatorInsetBlock);position:absolute;margin-top:auto}:host ::slotted([slot='tab'])::before{inset-inline:var(--tabIndicatorInsetInline);inset-block:var(--tabIndicatorInsetBlock)}:host ::slotted([slot='tab'][aria-selected='true'])::before{background-color:${colorNeutralForegroundDisabled}}:host ::slotted([slot='tab'][aria-selected='false']:hover)::after{height:${strokeWidthThicker};margin-block-start:auto;transform-origin:left}:host([orientation='vertical']) ::slotted([slot='tab'])::before,:host([orientation='vertical']) ::slotted([slot='tab'][aria-selected='false']:hover)::after{height:unset;width:${strokeWidthThicker};margin-inline-end:auto;transform-origin:top}:host([size='small']) ::slotted([slot='tab']){font-size:${fontSizeBase300};line-height:${lineHeightBase300}}:host([size='large']) ::slotted([slot='tab']){font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host ::slotted([slot='tab'])::after,:host ::slotted([slot='tab'])::before,:host ::slotted([slot='tab']:hover)::after{inset-inline:var(--tabIndicatorInsetInline)}:host([orientation='vertical']) ::slotted([slot='tab'])::after,:host([orientation='vertical']) ::slotted([slot='tab'])::before,:host([orientation='vertical']) ::slotted([slot='tab']:hover)::after{inset-inline:0;inset-block:var(--tabIndicatorInsetBlock)}:host([disabled]){cursor:not-allowed;color:${colorNeutralForegroundDisabled}}:host([disabled]) ::slotted([slot='tab']){pointer-events:none;cursor:not-allowed;color:${colorNeutralForegroundDisabled}}:host([disabled]) ::slotted([slot='tab']:after){background-color:${colorNeutralForegroundDisabled}}:host([disabled]) ::slotted([slot='tab'][aria-selected='true'])::after{background-color:${colorNeutralForegroundDisabled}}:host([disabled]) ::slotted([slot='tab']:hover):before{content:unset}:host([appearance='subtle']) ::slotted([slot='tab']:hover){background-color:${colorSubtleBackgroundHover};color:${colorNeutralForeground1Hover};fill:${colorCompoundBrandForeground1Hover}}:host([appearance='subtle']) ::slotted([slot='tab']:active){background-color:${colorSubtleBackgroundPressed};fill:${colorSubtleBackgroundPressed};color:${colorNeutralForeground1}}@supports (anchor-name:--a) and (text-size-adjust:auto){::slotted([slot='tab'][aria-selected='true']){anchor-name:--tab}:host::after{background-color:${colorCompoundBrandStroke};content:'';inline-size:100%;inset:auto auto anchor(end) anchor(center);position:absolute;position-anchor:--tab;transform:translateX(-50%);transition-property:inset-inline,width;transition-duration:${durationSlow};transition-timing-function:${curveDecelerateMax};z-index:3;border-radius:${borderRadiusCircular};width:calc(anchor-size() - var(--tabIndicatorInsetInline) * 2);height:${strokeWidthThicker}}:host([orientation='vertical'])::after{inset:anchor(center) anchor(end) auto 0;transform:translateY(-50%);transition-property:inset-block,height;width:${strokeWidthThicker};height:calc(anchor-size() - var(--tabIndicatorInsetBlock) * 2)}:host(:dir(rtl)[orientation='vertical'])::after{inset:anchor(center) anchor(start) auto 0}:host([disabled])::after{background-color:${colorNeutralForegroundDisabled}}}`;

const definition$7 = Tablist.compose({
  name: tagName$7,
  template: template$7,
  styles: styles$7
});

definition$7.define(FluentDesignSystem.registry);

const TextAreaSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const TextAreaAppearance = {
  outline: "outline",
  filledLighter: "filled-lighter",
  filledDarker: "filled-darker"
};
const TextAreaAppearancesForDisplayShadow = [
  TextAreaAppearance.filledLighter,
  TextAreaAppearance.filledDarker
];
const TextAreaAutocomplete = {
  on: "on",
  off: "off"
};
const TextAreaResize = {
  none: "none",
  both: "both",
  horizontal: "horizontal",
  vertical: "vertical"
};
const tagName$6 = `${FluentDesignSystem.prefix}-textarea`;

const whitespaceFilter = (value) => value.nodeType !== Node.TEXT_NODE || !!value.nodeValue?.trim().length;

var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$a(target, key, result);
  return result;
};
class BaseTextArea extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.filteredLabelSlottedNodes = [];
    this.labelSlottedNodes = [];
    this.userInteracted = false;
    this.preConnectControlEl = document.createElement("textarea");
    this.autoResize = false;
    this.disabled = false;
    this.displayShadow = false;
    this.readOnly = false;
    this.required = false;
    this.resize = TextAreaResize.none;
    this.spellcheck = false;
  }
  /**
   * Sets up a mutation observer to watch for changes to the control element's
   * attributes that could affect validity, and binds an input event listener to detect user interaction.
   *
   * @internal
   */
  controlElChanged() {
    this.controlElAttrObserver = new MutationObserver(() => {
      this.setValidity();
    });
    this.controlElAttrObserver.observe(this.controlEl, {
      attributes: true,
      attributeFilter: ["disabled", "required", "readonly", "maxlength", "minlength"]
    });
    this.controlEl.addEventListener("input", () => this.userInteracted = true, { once: true });
  }
  defaultSlottedNodesChanged() {
    const next = this.getContent();
    this.defaultValue = next;
    this.value = next;
  }
  labelSlottedNodesChanged() {
    this.filteredLabelSlottedNodes = this.labelSlottedNodes.filter(whitespaceFilter);
    if (this.labelEl) {
      this.labelEl.hidden = !this.filteredLabelSlottedNodes.length;
    }
    this.filteredLabelSlottedNodes.forEach((node) => {
      node.disabled = this.disabled;
      node.required = this.required;
    });
  }
  autoResizeChanged() {
    this.maybeCreateAutoSizerEl();
    toggleState(this.elementInternals, "auto-resize", this.autoResize);
  }
  disabledChanged() {
    this.setDisabledSideEffect(this.disabled);
  }
  /**
   * The form element that’s associated to the element, or `null` if no form is associated.
   *
   * @public
   */
  get form() {
    return this.elementInternals.form;
  }
  /**
   * A `NodeList` of `<label>` element associated with the element.
   * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels | `labels`} property
   *
   * @public
   */
  get labels() {
    return this.elementInternals.labels;
  }
  readOnlyChanged() {
    this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
    if (this.$fastController.isConnected) {
      this.setValidity();
    }
  }
  requiredChanged() {
    this.elementInternals.ariaRequired = `${!!this.required}`;
    if (this.filteredLabelSlottedNodes?.length) {
      this.filteredLabelSlottedNodes.forEach((node) => node.required = this.required);
    }
  }
  resizeChanged(prev, next) {
    swapStates(this.elementInternals, prev, next, TextAreaResize, "resize-");
    toggleState(
      this.elementInternals,
      "resize",
      hasMatchingState(TextAreaResize, next) && next !== TextAreaResize.none
    );
  }
  /**
   * The length of the current value.
   * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#textLength | 'textLength'} property
   *
   * @public
   */
  get textLength() {
    return this.controlEl.textLength;
  }
  /**
   * The type of the element, which is always "textarea".
   * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/type | `type`} property
   *
   * @public
   */
  get type() {
    return "textarea";
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The validation message.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
   */
  get validationMessage() {
    return this.elementInternals.validationMessage || this.controlEl.validationMessage;
  }
  /**
   * Determines if the control can be submitted for constraint validation.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
   */
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  /**
   * The text content of the element before user interaction.
   * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#defaultvalue | `defaultValue`} property
   *
   * @public
   * @remarks
   * In order to set the initial/default value, an author should either add the default value in the HTML as the children
   * of the component, or setting this property in JavaScript. Setting `innerHTML`, `innerText`, or `textContent` on this
   * component will not change the default value or the content displayed inside the component.
   */
  get defaultValue() {
    return this.controlEl?.defaultValue ?? this.preConnectControlEl.defaultValue;
  }
  set defaultValue(next) {
    const controlEl = this.controlEl ?? this.preConnectControlEl;
    controlEl.defaultValue = next;
    if (this.controlEl && !this.userInteracted) {
      this.controlEl.value = next;
    }
  }
  /**
   * The value of the element.
   *
   * @public
   * @remarks
   * Reflects the `value` property.
   */
  get value() {
    return this.controlEl?.value ?? this.preConnectControlEl.value;
  }
  set value(next) {
    const controlEl = this.controlEl ?? this.preConnectControlEl;
    controlEl.value = next;
    this.setFormValue(next);
    this.setValidity();
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      if (!this.$fastController.isConnected) {
        return;
      }
      const preConnect = this.preConnectControlEl;
      const content = this.getContent();
      this.defaultValue = content || preConnect?.defaultValue || "";
      this.value = preConnect?.value || this.defaultValue;
      this.setFormValue(this.value);
      this.setValidity();
      this.preConnectControlEl = null;
      this.maybeCreateAutoSizerEl();
    });
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.autoSizerObserver?.disconnect();
    this.controlElAttrObserver?.disconnect();
  }
  /**
   * Resets the value to its initial value when the form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.value = this.defaultValue;
  }
  /**
   * @internal
   */
  formDisabledCallback(disabled) {
    this.setDisabledSideEffect(disabled);
    this.setValidity();
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    this.elementInternals.setFormValue(value, value ?? state);
  }
  /**
   * Checks the validity of the element and returns the result.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Reports the validity of the element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Sets the custom validity message.
   * @param message - The message to set
   *
   * @public
   */
  setCustomValidity(message) {
    this.elementInternals.setValidity({ customError: !!message }, !!message ? message.toString() : void 0);
    this.reportValidity();
  }
  /**
   * Sets the validity of the control.
   *
   * @param flags - Validity flags. If not provided, the control's `validity` will be used.
   * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
   * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
   *
   * @internal
   */
  setValidity(flags, message, anchor) {
    if (!this.$fastController.isConnected) {
      return;
    }
    if (this.disabled || this.readOnly) {
      this.elementInternals.setValidity({});
    } else {
      this.elementInternals.setValidity(
        flags ?? this.controlEl.validity,
        message ?? this.controlEl.validationMessage,
        anchor ?? this.controlEl
      );
    }
    if (this.userInteracted) {
      this.toggleUserValidityState();
    }
  }
  /**
   * Selects the content in the element.
   *
   * @public
   */
  select() {
    this.controlEl.select();
  }
  /**
   * Gets the content inside the light DOM, if any HTML element is present, use its `outerHTML` value.
   */
  getContent() {
    return this.defaultSlottedNodes.map((node) => {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          return node.outerHTML;
        case Node.TEXT_NODE:
          return node.textContent.trim();
        default:
          return "";
      }
    }).join("") || "";
  }
  setDisabledSideEffect(disabled) {
    this.elementInternals.ariaDisabled = `${disabled}`;
    if (this.controlEl) {
      this.controlEl.disabled = disabled;
    }
    if (this.filteredLabelSlottedNodes?.length) {
      this.filteredLabelSlottedNodes.forEach((node) => node.disabled = this.disabled);
    }
  }
  toggleUserValidityState() {
    toggleState(this.elementInternals, "user-invalid", !this.validity.valid);
    toggleState(this.elementInternals, "user-valid", this.validity.valid);
  }
  // Technique inspired by https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
  // TODO: This should be removed after `field-sizing: content` is widely supported
  // https://caniuse.com/mdn-css_properties_field-sizing_content
  maybeCreateAutoSizerEl() {
    if (CSS.supports("field-sizing: content")) {
      return;
    }
    if (!this.autoResize) {
      this.autoSizerEl?.remove();
      this.autoSizerObserver?.disconnect();
      return;
    }
    if (!this.autoSizerEl) {
      this.autoSizerEl = document.createElement("div");
      this.autoSizerEl.classList.add("auto-sizer");
      this.autoSizerEl.ariaHidden = "true";
    }
    this.rootEl?.prepend(this.autoSizerEl);
    if (!this.autoSizerObserver) {
      this.autoSizerObserver = new ResizeObserver((_, observer) => {
        const blockSizePropName = window.getComputedStyle(this).writingMode.startsWith("horizontal") ? "height" : "width";
        if (this.style.getPropertyValue(blockSizePropName) !== "") {
          this.autoSizerEl?.remove();
          observer.disconnect();
        }
      });
    }
    this.autoSizerObserver.observe(this);
  }
  /**
   * @internal
   */
  handleControlInput() {
    if (this.autoResize && this.autoSizerEl) {
      this.autoSizerEl.textContent = this.value + " ";
    }
    this.setFormValue(this.value);
    this.setValidity();
  }
  /**
   * @internal
   */
  handleControlChange() {
    this.toggleUserValidityState();
    this.$emit("change");
  }
  /**
   * @internal
   */
  handleControlSelect() {
    this.$emit("select");
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
BaseTextArea.formAssociated = true;
__decorateClass$a([
  observable
], BaseTextArea.prototype, "controlEl", 2);
__decorateClass$a([
  observable
], BaseTextArea.prototype, "defaultSlottedNodes", 2);
__decorateClass$a([
  observable
], BaseTextArea.prototype, "labelSlottedNodes", 2);
__decorateClass$a([
  attr
], BaseTextArea.prototype, "autocomplete", 2);
__decorateClass$a([
  attr({ attribute: "auto-resize", mode: "boolean" })
], BaseTextArea.prototype, "autoResize", 2);
__decorateClass$a([
  attr({ attribute: "dirname" })
], BaseTextArea.prototype, "dirName", 2);
__decorateClass$a([
  attr({ mode: "boolean" })
], BaseTextArea.prototype, "disabled", 2);
__decorateClass$a([
  attr({ attribute: "display-shadow", mode: "boolean" })
], BaseTextArea.prototype, "displayShadow", 2);
__decorateClass$a([
  attr({ attribute: "form" })
], BaseTextArea.prototype, "initialForm", 2);
__decorateClass$a([
  attr({ attribute: "maxlength", converter: nullableNumberConverter })
], BaseTextArea.prototype, "maxLength", 2);
__decorateClass$a([
  attr({ attribute: "minlength", converter: nullableNumberConverter })
], BaseTextArea.prototype, "minLength", 2);
__decorateClass$a([
  attr
], BaseTextArea.prototype, "name", 2);
__decorateClass$a([
  attr
], BaseTextArea.prototype, "placeholder", 2);
__decorateClass$a([
  attr({ attribute: "readonly", mode: "boolean" })
], BaseTextArea.prototype, "readOnly", 2);
__decorateClass$a([
  attr({ mode: "boolean" })
], BaseTextArea.prototype, "required", 2);
__decorateClass$a([
  attr({ mode: "fromView" })
], BaseTextArea.prototype, "resize", 2);
__decorateClass$a([
  attr({ mode: "boolean" })
], BaseTextArea.prototype, "spellcheck", 2);

var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$9(target, key, result);
  return result;
};
class TextArea extends BaseTextArea {
  constructor() {
    super(...arguments);
    this.appearance = TextAreaAppearance.outline;
    this.block = false;
  }
  labelSlottedNodesChanged() {
    super.labelSlottedNodesChanged();
    this.labelSlottedNodes.forEach((node) => {
      node.size = this.size;
    });
  }
  /**
   * @internal
   */
  handleChange(_, propertyName) {
    switch (propertyName) {
      case "size":
        this.labelSlottedNodes.forEach((node) => {
          node.size = this.size;
        });
        break;
    }
  }
  /**
   * @internal
   */
  connectedCallback() {
    super.connectedCallback();
    Observable.getNotifier(this).subscribe(this, "size");
  }
  /**
   * @internal
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    Observable.getNotifier(this).unsubscribe(this, "size");
  }
}
__decorateClass$9([
  attr({ mode: "fromView" })
], TextArea.prototype, "appearance", 2);
__decorateClass$9([
  attr({ mode: "boolean" })
], TextArea.prototype, "block", 2);
__decorateClass$9([
  attr
], TextArea.prototype, "size", 2);

const styles$6 = css`${display("inline-block")} :host{--font-size:${fontSizeBase300};--line-height:${lineHeightBase300};--padding-inline:${spacingHorizontalMNudge};--padding-block:${spacingVerticalSNudge};--min-block-size:52px;--block-size:var(--min-block-size);--inline-size:18rem;--border-width:${strokeWidthThin};--control-padding-inline:${spacingHorizontalXXS};--color:${colorNeutralForeground1};--background-color:${colorNeutralBackground1};--border-color:${colorNeutralStroke1};--border-block-end-color:${colorNeutralStrokeAccessible};--placeholder-color:${colorNeutralForeground4};--focus-indicator-color:${colorCompoundBrandStroke};--box-shadow:none;--contain-size:size;--resize:none;color:var(--color);font-family:${fontFamilyBase};font-size:var(--font-size);font-weight:${fontWeightRegular};line-height:var(--line-height);position:relative}:host(:hover){--border-color:${colorNeutralStroke1Hover};--border-block-end-color:${colorNeutralStrokeAccessibleHover}}:host(:active){--border-color:${colorNeutralStroke1Pressed};--border-block-end-color:${colorNeutralStrokeAccessiblePressed}}:host(:focus-within){outline:none}:host([block]:not([hidden])){display:block}:host([size='small']){--font-size:${fontSizeBase200};--line-height:${lineHeightBase200};--min-block-size:40px;--padding-block:${spacingVerticalXS};--padding-inline:${spacingHorizontalSNudge};--control-padding-inline:${spacingHorizontalXXS}}:host([size='large']){--font-size:${fontSizeBase400};--line-height:${lineHeightBase400};--min-block-size:64px;--padding-block:${spacingVerticalS};--padding-inline:${spacingHorizontalM};--control-padding-inline:${spacingHorizontalSNudge}}:host([resize='both']:not(:disabled)){--resize:both}:host([resize='horizontal']:not(:disabled)){--resize:horizontal}:host([resize='vertical']:not(:disabled)){--resize:vertical}:host([auto-resize]){--block-size:auto;--contain-size:inline-size}:host([appearance='filled-darker']){--background-color:${colorNeutralBackground3};--border-color:var(--background-color);--border-block-end-color:var(--border-color)}:host([appearance='filled-lighter']){--border-color:var(--background-color);--border-block-end-color:var(--border-color)}:host([appearance='filled-darker'][display-shadow]),:host([appearance='filled-lighter'][display-shadow]){--box-shadow:${shadow2}}:host(${userInvalidState}){--border-color:${colorPaletteRedBorder2};--border-block-end-color:${colorPaletteRedBorder2}}:host(:disabled){--color:${colorNeutralForegroundDisabled};--background-color:${colorTransparentBackground};--border-color:${colorNeutralStrokeDisabled};--border-block-end-color:var(--border-color);--box-shadow:none;--placeholder-color:${colorNeutralForegroundDisabled};cursor:no-drop;user-select:none}.root{background-color:var(--background-color);border:var(--border-width) solid var(--border-color);border-block-end-color:var(--border-block-end-color);border-radius:${borderRadiusMedium};box-sizing:border-box;box-shadow:var(--box-shadow);contain:paint layout style var(--contain-size);display:grid;grid-template:1fr/1fr;inline-size:var(--inline-size);min-block-size:var(--min-block-size);block-size:var(--block-size);overflow:hidden;padding:var(--padding-block) var(--padding-inline);position:relative;resize:var(--resize)}:host([block]) .root{inline-size:auto}.root::after{border-bottom:2px solid var(--focus-indicator-color);border-radius:0 0 ${borderRadiusMedium} ${borderRadiusMedium};box-sizing:border-box;clip-path:inset(calc(100% - 2px) 1px 0px);content:'';height:max(2px,${borderRadiusMedium});inset:auto -1px 0;position:absolute;transform:scaleX(0);transition-delay:${curveAccelerateMid};transition-duration:${durationUltraFast};transition-property:transform}:host(:focus-within) .root::after{transform:scaleX(1);transition-property:transform;transition-duration:${durationNormal};transition-delay:${curveDecelerateMid}}:host([readonly]) .root::after,:host(:disabled) .root::after{content:none}label{color:var(--color);display:flex;inline-size:fit-content;padding-block-end:${spacingVerticalXS};padding-inline-end:${spacingHorizontalXS}}:host(:empty) label,label[hidden]{display:none}.auto-sizer,.control{box-sizing:border-box;font:inherit;grid-column:1/-1;grid-row:1/-1;letter-space:inherit;padding:0 var(--control-padding-inline)}.auto-sizer{display:none;padding-block-end:2px;pointer-events:none;visibility:hidden;white-space:pre-wrap}:host([auto-resize]) .auto-sizer{display:block}.control{appearance:none;background-color:transparent;border:0;color:inherit;field-sizing:content;max-block-size:100%;outline:0;resize:none;text-align:inherit}.control:disabled{cursor:inherit}.control::placeholder{color:var(--placeholder-color)}::selection{color:${colorNeutralForegroundInverted};background-color:${colorNeutralBackgroundInverted}}@media (forced-colors:active){:host{--border-color:FieldText;--border-block-end-color:FieldText;--focus-indicator-color:Highlight;--placeholder-color:FieldText}:host(:hover),:host(:active),:host(:focus-within){--border-color:Highlight;--border-block-end-color:Highlight}:host(:disabled){--color:GrayText;--border-color:GrayText;--border-block-end-color:GrayText;--placeholder-color:GrayText}}`;

function textAreaTemplate() {
  return html`<template><label ${ref("labelEl")} for=control part=label><slot name=label ${slotted("labelSlottedNodes")}></slot></label><div class=root part=root ${ref("rootEl")}><textarea ${ref("controlEl")} id=control class=control part=control ?required=${(x) => x.required} ?disabled=${(x) => x.disabled} ?readonly=${(x) => x.readOnly} ?spellcheck=${(x) => x.spellcheck} autocomplete=${(x) => x.autocomplete} maxlength=${(x) => x.maxLength} minlength=${(x) => x.minLength} placeholder=${(x) => x.placeholder} @change=${(x) => x.handleControlChange()} @select=${(x) => x.handleControlSelect()} @input=${(x) => x.handleControlInput()}></textarea></div><div hidden><slot ${slotted("defaultSlottedNodes")}></slot></div></template>`;
}
const template$6 = textAreaTemplate();

const definition$6 = TextArea.compose({
  name: tagName$6,
  template: template$6,
  styles: styles$6,
  shadowOptions: {
    delegatesFocus: true
  }
});

definition$6.define(FluentDesignSystem.registry);

const TextInputControlSize = {
  small: "small",
  medium: "medium",
  large: "large"
};
const TextInputAppearance = {
  outline: "outline",
  underline: "underline",
  filledLighter: "filled-lighter",
  filledDarker: "filled-darker"
};
const TextInputType = {
  email: "email",
  password: "password",
  tel: "tel",
  text: "text",
  url: "url"
};
const ImplicitSubmissionBlockingTypes = [
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week"
];
const tagName$5 = `${FluentDesignSystem.prefix}-text-input`;

var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$8(target, key, result);
  return result;
};
class BaseTextInput extends FASTElement {
  constructor() {
    super(...arguments);
    this.type = TextInputType.text;
    /**
     * Indicates that the value has been changed by the user.
     *
     * @internal
     */
    this.dirtyValue = false;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
  }
  /**
   * Tracks the current value of the input.
   *
   * @param prev - the previous value
   * @param next - the next value
   *
   * @internal
   */
  currentValueChanged(prev, next) {
    this.value = next;
  }
  /**
   * Updates the control label visibility based on the presence of default slotted content.
   *
   * @internal
   */
  defaultSlottedNodesChanged(prev, next) {
    Updates.enqueue(() => {
      if (this.controlLabel) {
        this.controlLabel.hidden = !next?.some(
          (node) => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim()
        );
      }
    });
  }
  /**
   * Sets the value of the element to the initial value.
   *
   * @internal
   */
  initialValueChanged() {
    if (!this.dirtyValue) {
      this.value = this.initialValue;
    }
  }
  /**
   * Syncs the `ElementInternals.ariaReadOnly` property when the `readonly` property changes.
   *
   * @internal
   */
  readOnlyChanged() {
    if (this.$fastController.isConnected) {
      this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
    }
  }
  /**
   * Syncs the element's internal `aria-required` state with the `required` attribute.
   *
   * @param previous - the previous required state
   * @param next - the current required state
   *
   * @internal
   */
  requiredChanged(previous, next) {
    if (this.$fastController.isConnected) {
      this.elementInternals.ariaRequired = `${!!next}`;
    }
  }
  /**
   * Calls the `setValidity` method when the control reference changes.
   *
   * @param prev - the previous control reference
   * @param next - the current control reference
   *
   * @internal
   */
  controlChanged(prev, next) {
    Updates.enqueue(() => {
      if (this.$fastController.isConnected) {
        this.setValidity();
      }
    });
  }
  /**
   * The element's validity state.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
   */
  get validity() {
    return this.elementInternals.validity;
  }
  /**
   * The validation message.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
   */
  get validationMessage() {
    return this.elementInternals.validationMessage || this.control.validationMessage;
  }
  /**
   * The current value of the input.
   * @public
   */
  get value() {
    Observable.track(this, "value");
    return this.currentValue;
  }
  set value(value) {
    this.currentValue = value;
    if (this.$fastController.isConnected) {
      this.control.value = value ?? "";
      this.setFormValue(value);
      this.setValidity();
      Observable.notify(this, "value");
    }
  }
  /**
   * Determines if the control can be submitted for constraint validation.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
   */
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  /**
   * The associated form element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
   */
  get form() {
    return this.elementInternals.form;
  }
  /**
   * Handles the internal control's `keypress` event.
   *
   * @internal
   */
  beforeinputHandler(e) {
    if (e.inputType === "insertLineBreak") {
      this.implicitSubmit();
    }
    return true;
  }
  /**
   * Change event handler for inner control.
   *
   * @internal
   * @privateRemarks
   * "Change" events are not `composable` so they will not permeate the shadow DOM boundary. This function effectively
   * proxies the change event, emitting a `change` event whenever the internal control emits a `change` event.
   */
  changeHandler(e) {
    this.setValidity();
    this.$emit("change", e, {
      bubbles: true,
      composed: true
    });
    return true;
  }
  /**
   * Checks the validity of the element and returns the result.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
   */
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  /**
   * Clicks the inner control when the component is clicked.
   *
   * @param e - the event object
   */
  clickHandler(e) {
    if (e.target === this) {
      this.control?.click();
    }
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0;
    this.setFormValue(this.value);
    this.setValidity();
  }
  /**
   * Focuses the inner control when the component is focused.
   *
   * @param e - the event object
   * @public
   */
  focusinHandler(e) {
    if (e.target === this) {
      this.control?.focus();
    }
    return true;
  }
  /**
   * Resets the value to its initial value when the form is reset.
   *
   * @internal
   */
  formResetCallback() {
    this.value = this.initialValue;
    this.dirtyValue = false;
  }
  /**
   * Handles implicit form submission when the user presses the "Enter" key.
   *
   * @internal
   */
  implicitSubmit() {
    if (!this.elementInternals.form) {
      return;
    }
    if (this.elementInternals.form.elements.length === 1) {
      this.elementInternals.form.requestSubmit();
      return;
    }
    const formElements = [...this.elementInternals.form.elements];
    const submitButton = formElements.find((x) => x.getAttribute("type") === "submit");
    if (submitButton) {
      submitButton.click();
      return;
    }
    const filteredElements = formElements.filter(
      (x) => ImplicitSubmissionBlockingTypes.includes(x.getAttribute("type") ?? "")
    );
    if (filteredElements.length > 1) {
      return;
    }
    this.elementInternals.form.requestSubmit();
  }
  /**
   * Handles the internal control's `input` event.
   *
   * @internal
   */
  inputHandler(e) {
    this.dirtyValue = true;
    this.value = this.control.value;
    return true;
  }
  /**
   * Handles the internal control's `keydown` event.
   *
   * @param e - the event object
   * @internal
   */
  keydownHandler(e) {
    if (e.key === "Enter") {
      this.implicitSubmit();
    }
    return true;
  }
  /**
   * Selects all the text in the text field.
   *
   * @public
   * @privateRemarks
   * The `select` event does not permeate the shadow DOM boundary. This function effectively proxies the event,
   * emitting a `select` event whenever the internal control emits a `select` event
   *
   */
  select() {
    this.control.select();
    this.$emit("select");
  }
  /**
   * Sets the custom validity message.
   * @param message - The message to set
   *
   * @public
   */
  setCustomValidity(message) {
    this.elementInternals.setValidity({ customError: true }, message);
    this.reportValidity();
  }
  /**
   * Reports the validity of the element.
   *
   * @public
   * @remarks
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
   */
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  /**
   * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
   *
   * @internal
   */
  setFormValue(value, state) {
    this.elementInternals.setFormValue(value, value ?? state);
  }
  /**
   * Sets the validity of the control.
   *
   * @param flags - Validity flags. If not provided, the control's `validity` will be used.
   * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
   * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
   *
   * @internal
   */
  setValidity(flags, message, anchor) {
    if (this.$fastController.isConnected && this.control) {
      if (this.disabled) {
        this.elementInternals.setValidity({});
        return;
      }
      this.elementInternals.setValidity(
        flags ?? this.control.validity,
        message ?? this.validationMessage,
        anchor ?? this.control
      );
    }
  }
}
/**
 * The form-associated flag.
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
 *
 * @public
 */
BaseTextInput.formAssociated = true;
__decorateClass$8([
  attr
], BaseTextInput.prototype, "autocomplete", 2);
__decorateClass$8([
  attr({ mode: "boolean" })
], BaseTextInput.prototype, "autofocus", 2);
__decorateClass$8([
  attr({ attribute: "current-value" })
], BaseTextInput.prototype, "currentValue", 2);
__decorateClass$8([
  observable
], BaseTextInput.prototype, "defaultSlottedNodes", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "dirname", 2);
__decorateClass$8([
  attr({ mode: "boolean" })
], BaseTextInput.prototype, "disabled", 2);
__decorateClass$8([
  attr({ attribute: "form" })
], BaseTextInput.prototype, "formAttribute", 2);
__decorateClass$8([
  attr({ attribute: "value", mode: "fromView" })
], BaseTextInput.prototype, "initialValue", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "list", 2);
__decorateClass$8([
  attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "maxlength", 2);
__decorateClass$8([
  attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "minlength", 2);
__decorateClass$8([
  attr({ mode: "boolean" })
], BaseTextInput.prototype, "multiple", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "name", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "pattern", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "placeholder", 2);
__decorateClass$8([
  attr({ attribute: "readonly", mode: "boolean" })
], BaseTextInput.prototype, "readOnly", 2);
__decorateClass$8([
  attr({ mode: "boolean" })
], BaseTextInput.prototype, "required", 2);
__decorateClass$8([
  attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "size", 2);
__decorateClass$8([
  attr({
    converter: {
      fromView: (value) => typeof value === "string" ? ["true", ""].includes(value.trim().toLowerCase()) : null,
      toView: (value) => value.toString()
    }
  })
], BaseTextInput.prototype, "spellcheck", 2);
__decorateClass$8([
  attr
], BaseTextInput.prototype, "type", 2);
__decorateClass$8([
  observable
], BaseTextInput.prototype, "control", 2);
__decorateClass$8([
  observable
], BaseTextInput.prototype, "controlLabel", 2);

var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$7(target, key, result);
  return result;
};
class TextInput extends BaseTextInput {
}
__decorateClass$7([
  attr
], TextInput.prototype, "appearance", 2);
__decorateClass$7([
  attr({ attribute: "control-size" })
], TextInput.prototype, "controlSize", 2);
applyMixins(TextInput, StartEnd);

const styles$5 = css`${display("block")} :host{font-family:${fontFamilyBase};font-size:${fontSizeBase300};font-weight:${fontWeightRegular};line-height:${lineHeightBase300};max-width:400px}.label{display:flex;color:${colorNeutralForeground1};padding-bottom:${spacingVerticalXS};flex-shrink:0;padding-inline-end:${spacingHorizontalXS}}.label[hidden],:host(:empty) .label{display:none}.root{align-items:center;background-color:${colorNeutralBackground1};border:${strokeWidthThin} solid ${colorNeutralStroke1};border-bottom-color:${colorNeutralStrokeAccessible};border-radius:${borderRadiusMedium};box-sizing:border-box;height:32px;display:inline-flex;flex-direction:row;gap:${spacingHorizontalXXS};padding:0 ${spacingHorizontalMNudge};position:relative;width:100%}:has(.control:user-invalid){border-color:${colorPaletteRedBorder2}}.root::after{box-sizing:border-box;content:'';position:absolute;left:-1px;bottom:0px;right:-1px;height:max(2px,${borderRadiusMedium});border-radius:0 0 ${borderRadiusMedium} ${borderRadiusMedium};border-bottom:2px solid ${colorCompoundBrandStroke};clip-path:inset(calc(100% - 2px) 1px 0px);transform:scaleX(0);transition-property:transform;transition-duration:${durationUltraFast};transition-delay:${curveAccelerateMid}}.control{width:100%;height:100%;box-sizing:border-box;color:${colorNeutralForeground1};border-radius:${borderRadiusMedium};background:${colorTransparentBackground};font-family:${fontFamilyBase};font-weight:${fontWeightRegular};font-size:${fontSizeBase300};border:none;vertical-align:center}.control:focus-visible{outline:0;border:0}.control::placeholder{color:${colorNeutralForeground4}}:host ::slotted([slot='start']),:host ::slotted([slot='end']){display:flex;align-items:center;justify-content:center;color:${colorNeutralForeground3};font-size:${fontSizeBase500}}:host ::slotted([slot='start']){padding-right:${spacingHorizontalXXS}}:host ::slotted([slot='end']){padding-left:${spacingHorizontalXXS};gap:${spacingHorizontalXS}}:host(:hover) .root{border-color:${colorNeutralStroke1Hover};border-bottom-color:${colorNeutralStrokeAccessibleHover}}:host(:active) .root{border-color:${colorNeutralStroke1Pressed}}:host(:focus-within) .root{outline:transparent solid 2px;border-bottom:0}:host(:focus-within) .root::after{transform:scaleX(1);transition-property:transform;transition-duration:${durationNormal};transition-delay:${curveDecelerateMid}}:host(:focus-within:active) .root:after{border-bottom-color:${colorCompoundBrandStrokePressed}}:host([appearance='outline']:focus-within) .root{border:${strokeWidthThin} solid ${colorNeutralStroke1}}:host(:focus-within) .control{color:${colorNeutralForeground1}}:host([disabled]) .root{background:${colorTransparentBackground};border:${strokeWidthThin} solid ${colorNeutralStrokeDisabled}}:host([disabled]) .control::placeholder,:host([disabled]) ::slotted([slot='start']),:host([disabled]) ::slotted([slot='end']){color:${colorNeutralForegroundDisabled}}::selection{color:${colorNeutralForegroundInverted};background-color:${colorNeutralBackgroundInverted}}:host([control-size='small']) .control{font-size:${fontSizeBase200};font-weight:${fontWeightRegular};line-height:${lineHeightBase200}}:host([control-size='small']) .root{height:24px;gap:${spacingHorizontalXXS};padding:0 ${spacingHorizontalSNudge}}:host([control-size='small']) ::slotted([slot='start']),:host([control-size='small']) ::slotted([slot='end']){font-size:${fontSizeBase400}}:host([control-size='large']) .control{font-size:${fontSizeBase400};font-weight:${fontWeightRegular};line-height:${lineHeightBase400}}:host([control-size='large']) .root{height:40px;gap:${spacingHorizontalS};padding:0 ${spacingHorizontalM}}:host([control-size='large']) ::slotted([slot='start']),:host([control-size='large']) ::slotted([slot='end']){font-size:${fontSizeBase600}}:host([appearance='underline']) .root{background:${colorTransparentBackground};border:0;border-radius:0;border-bottom:${strokeWidthThin} solid ${colorNeutralStrokeAccessible}}:host([appearance='underline']:hover) .root{border-bottom-color:${colorNeutralStrokeAccessibleHover}}:host([appearance='underline']:active) .root{border-bottom-color:${colorNeutralStrokeAccessiblePressed}}:host([appearance='underline']:focus-within) .root{border:0;border-bottom-color:${colorNeutralStrokeAccessiblePressed}}:host([appearance='underline'][disabled]) .root{border-bottom-color:${colorNeutralStrokeDisabled}}:host([appearance='filled-lighter']) .root,:host([appearance='filled-darker']) .root{border:${strokeWidthThin} solid ${colorTransparentStroke};box-shadow:${shadow2}}:host([appearance='filled-lighter']) .root{background:${colorNeutralBackground1}}:host([appearance='filled-darker']) .root{background:${colorNeutralBackground3}}:host([appearance='filled-lighter']:hover) .root,:host([appearance='filled-darker']:hover) .root{border-color:${colorTransparentStrokeInteractive}}:host([appearance='filled-lighter']:active) .root,:host([appearance='filled-darker']:active) .root{border-color:${colorTransparentStrokeInteractive};background:${colorNeutralBackground3}}`;

function textInputTemplate(options = {}) {
  return html`<template @beforeinput=${(x, c) => x.beforeinputHandler(c.event)} @focusin=${(x, c) => x.focusinHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)}><label part=label for=control class=label ${ref("controlLabel")}><slot ${slotted("defaultSlottedNodes")}></slot></label><div class=root part=root>${startSlotTemplate(options)} <input class=control part=control id=control @change=${(x, c) => x.changeHandler(c.event)} @input=${(x, c) => x.inputHandler(c.event)} ?autofocus=${(x) => x.autofocus} autocomplete=${(x) => x.autocomplete} ?disabled=${(x) => x.disabled} list=${(x) => x.list} maxlength=${(x) => x.maxlength} minlength=${(x) => x.minlength} ?multiple=${(x) => x.multiple} name=${(x) => x.name} pattern=${(x) => x.pattern} placeholder=${(x) => x.placeholder} ?readonly=${(x) => x.readOnly} ?required=${(x) => x.required} size=${(x) => x.size} spellcheck=${(x) => x.spellcheck} type=${(x) => x.type} value=${(x) => x.initialValue} ${ref("control")}> ${endSlotTemplate(options)}</div></template>`;
}
const template$5 = textInputTemplate();

const definition$5 = TextInput.compose({
  name: tagName$5,
  template: template$5,
  styles: styles$5,
  shadowOptions: {
    delegatesFocus: true
  }
});

definition$5.define(FluentDesignSystem.registry);

const TextSize = {
  _100: "100",
  _200: "200",
  _300: "300",
  _400: "400",
  _500: "500",
  _600: "600",
  _700: "700",
  _800: "800",
  _900: "900",
  _1000: "1000"
};
const TextFont = {
  base: "base",
  numeric: "numeric",
  monospace: "monospace"
};
const TextWeight = {
  medium: "medium",
  regular: "regular",
  semibold: "semibold",
  bold: "bold"
};
const TextAlign = {
  start: "start",
  end: "end",
  center: "center",
  justify: "justify"
};
const tagName$4 = `${FluentDesignSystem.prefix}-text`;

var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$6(target, key, result);
  return result;
};
class Text extends FASTElement {
  constructor() {
    super(...arguments);
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.nowrap = false;
    this.truncate = false;
    this.italic = false;
    this.underline = false;
    this.strikethrough = false;
    this.block = false;
  }
}
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "nowrap", 2);
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "truncate", 2);
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "italic", 2);
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "underline", 2);
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "strikethrough", 2);
__decorateClass$6([
  attr({ mode: "boolean" })
], Text.prototype, "block", 2);
__decorateClass$6([
  attr
], Text.prototype, "size", 2);
__decorateClass$6([
  attr
], Text.prototype, "font", 2);
__decorateClass$6([
  attr
], Text.prototype, "weight", 2);
__decorateClass$6([
  attr
], Text.prototype, "align", 2);

const styles$4 = css`${display("inline")} :host{font-family:${fontFamilyBase};font-size:${fontSizeBase300};line-height:${lineHeightBase300};font-weight:${fontWeightRegular};text-align:start}:host([nowrap]),:host([nowrap]) ::slotted(*){white-space:nowrap;overflow:hidden}:host([truncate]),:host([truncate]) ::slotted(*){text-overflow:ellipsis}:host([block]){display:block}:host([italic]){font-style:italic}:host([underline]){text-decoration-line:underline}:host([strikethrough]){text-decoration-line:line-through}:host([underline][strikethrough]){text-decoration-line:line-through underline}:host([size='100']){font-size:${fontSizeBase100};line-height:${lineHeightBase100}}:host([size='200']){font-size:${fontSizeBase200};line-height:${lineHeightBase200}}:host([size='400']){font-size:${fontSizeBase400};line-height:${lineHeightBase400}}:host([size='500']){font-size:${fontSizeBase500};line-height:${lineHeightBase500}}:host([size='600']){font-size:${fontSizeBase600};line-height:${lineHeightBase600}}:host([size='700']){font-size:${fontSizeHero700};line-height:${lineHeightHero700}}:host([size='800']){font-size:${fontSizeHero800};line-height:${lineHeightHero800}}:host([size='900']){font-size:${fontSizeHero900};line-height:${lineHeightHero900}}:host([size='1000']){font-size:${fontSizeHero1000};line-height:${lineHeightHero1000}}:host([font='monospace']){font-family:${fontFamilyMonospace}}:host([font='numeric']){font-family:${fontFamilyNumeric}}:host([weight='medium']){font-weight:${fontWeightMedium}}:host([weight='semibold']){font-weight:${fontWeightSemibold}}:host([weight='bold']){font-weight:${fontWeightBold}}:host([align='center']){text-align:center}:host([align='end']){text-align:end}:host([align='justify']){text-align:justify}::slotted(*){font:inherit;line-height:inherit;text-decoration-line:inherit;text-align:inherit;text-decoration-line:inherit;margin:0}`;

const template$4 = html`<slot></slot>`;

const definition$4 = Text.compose({
  name: tagName$4,
  template: template$4,
  styles: styles$4
});

definition$4.define(FluentDesignSystem.registry);

const ToggleButtonAppearance = ButtonAppearance;
const ToggleButtonShape = ButtonShape;
const ToggleButtonSize = ButtonSize;
const tagName$3 = `${FluentDesignSystem.prefix}-toggle-button`;

var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$5(target, key, result);
  return result;
};
class ToggleButton extends Button {
  /**
   * Updates the pressed state when the `pressed` property changes.
   *
   * @internal
   */
  pressedChanged() {
    this.setPressedState();
  }
  /**
   * Updates the pressed state when the `mixed` property changes.
   *
   * @param previous - the previous mixed state
   * @param next - the current mixed state
   * @internal
   */
  mixedChanged() {
    this.setPressedState();
  }
  /**
   * Toggles the pressed state of the button.
   *
   * @override
   */
  press() {
    this.pressed = !this.pressed;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setPressedState();
  }
  /**
   * Sets the `aria-pressed` attribute based on the `pressed` and `mixed` properties.
   *
   * @internal
   */
  setPressedState() {
    if (this.$fastController.isConnected) {
      const ariaPressed = `${this.mixed ? "mixed" : !!this.pressed}`;
      this.elementInternals.ariaPressed = ariaPressed;
      toggleState(this.elementInternals, "pressed", !!this.pressed || !!this.mixed);
    }
  }
}
__decorateClass$5([
  attr({ mode: "boolean" })
], ToggleButton.prototype, "pressed", 2);
__decorateClass$5([
  attr({ mode: "boolean" })
], ToggleButton.prototype, "mixed", 2);

const styles$3 = css`${styles$C} :host(${pressedState}){border-color:${colorNeutralStroke1};background-color:${colorNeutralBackground1Selected};color:${colorNeutralForeground1};border-width:${strokeWidthThin}}:host(${pressedState}:hover){border-color:${colorNeutralStroke1Hover};background-color:${colorNeutralBackground1Hover}}:host(${pressedState}:active){border-color:${colorNeutralStroke1Pressed};background-color:${colorNeutralBackground1Pressed}}:host(${pressedState}[appearance='primary']:not(:focus-visible)){border-color:transparent}:host(${pressedState}[appearance='primary']){background-color:${colorBrandBackgroundSelected};color:${colorNeutralForegroundOnBrand}}:host(${pressedState}[appearance='primary']:hover){background-color:${colorBrandBackgroundHover}}:host(${pressedState}[appearance='primary']:active){background-color:${colorBrandBackgroundPressed}}:host(${pressedState}[appearance='subtle']){border-color:transparent;background-color:${colorSubtleBackgroundSelected};color:${colorNeutralForeground2Selected}}:host(${pressedState}[appearance='subtle']:hover){background-color:${colorSubtleBackgroundHover};color:${colorNeutralForeground2Hover}}:host(${pressedState}[appearance='subtle']:active){background-color:${colorSubtleBackgroundPressed};color:${colorNeutralForeground2Pressed}}:host(${pressedState}[appearance='outline']),:host(${pressedState}[appearance='transparent']){background-color:${colorTransparentBackgroundSelected}}:host(${pressedState}[appearance='outline']:hover),:host(${pressedState}[appearance='transparent']:hover){background-color:${colorTransparentBackgroundHover}}:host(${pressedState}[appearance='outline']:active),:host(${pressedState}[appearance='transparent']:active){background-color:${colorTransparentBackgroundPressed}}:host(${pressedState}[appearance='transparent']){border-color:transparent;color:${colorNeutralForeground2BrandSelected}}:host(${pressedState}[appearance='transparent']:hover){color:${colorNeutralForeground2BrandHover}}:host(${pressedState}[appearance='transparent']:active){color:${colorNeutralForeground2BrandPressed}}@media (forced-colors:active){:host(${pressedState}),:host( ${pressedState}:is([appearance='primary'],[appearance='subtle'],[appearance='outline'],[appearance='transparent']) ){background:SelectedItem;color:SelectedItemText}}`;

const template$3 = buttonTemplate$1();

const definition$3 = ToggleButton.compose({
  name: tagName$3,
  template: template$3,
  styles: styles$3
});

definition$3.define(FluentDesignSystem.registry);

const TooltipPositioningOption = {
  "above-start": "block-start span-inline-end",
  above: "block-start",
  "above-end": "block-start span-inline-start",
  "below-start": "block-end span-inline-end",
  below: "block-end",
  "below-end": "block-end span-inline-start",
  "before-top": "inline-start span-block-end",
  before: "inline-start",
  "before-bottom": "inline-start span-block-start",
  "after-top": "inline-end span-block-end",
  after: "inline-end",
  "after-bottom": "inline-end span-block-start"
};
const tagName$2 = `${FluentDesignSystem.prefix}-tooltip`;

var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
class Tooltip extends FASTElement {
  constructor() {
    super();
    /**
     * The attached element internals
     */
    this.elementInternals = this.attachInternals();
    this.id = uniqueId("tooltip-");
    /**
     * The default delay for the tooltip
     * @internal
     */
    this.defaultDelay = 250;
    this.anchor = "";
    /**
     * Reference to the anchor positioning style element
     * @internal
     */
    this.anchorPositioningStyleElement = null;
    /**
     * Show the tooltip on mouse enter
     */
    this.mouseenterAnchorHandler = () => this.showTooltip(this.delay);
    /**
     * Hide the tooltip on mouse leave
     */
    this.mouseleaveAnchorHandler = () => this.hideTooltip(this.delay);
    /**
     * Show the tooltip on focus
     */
    this.focusAnchorHandler = () => this.showTooltip(0);
    /**
     * Hide the tooltip on blur
     */
    this.blurAnchorHandler = () => this.hideTooltip(0);
    this.elementInternals.role = "tooltip";
  }
  /**
   * Updates the fallback styles when the positioning changes.
   *
   * @internal
   */
  positioningChanged() {
    if (!AnchorPositioningCSSSupported) {
      this.setFallbackStyles();
    }
  }
  /**
   * Reference to the anchor element
   * @internal
   */
  get anchorElement() {
    const rootNode = this.getRootNode();
    return (rootNode instanceof ShadowRoot ? rootNode : document).getElementById(this.anchor ?? "");
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.anchorElement) {
      return;
    }
    const anchorName = this.anchorElement.style.anchorName || `--${this.anchor}`;
    const describedBy = this.anchorElement.getAttribute("aria-describedby");
    this.anchorElement.setAttribute("aria-describedby", describedBy ? `${describedBy} ${this.id}` : this.id);
    this.anchorElement.addEventListener("focus", this.focusAnchorHandler);
    this.anchorElement.addEventListener("blur", this.blurAnchorHandler);
    this.anchorElement.addEventListener("mouseenter", this.mouseenterAnchorHandler);
    this.anchorElement.addEventListener("mouseleave", this.mouseleaveAnchorHandler);
    if (AnchorPositioningCSSSupported) {
      if (!AnchorPositioningHTMLSupported) {
        this.anchorElement.style.anchorName = anchorName;
        this.style.positionAnchor = anchorName;
      }
      return;
    }
    Updates.enqueue(() => this.setFallbackStyles());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.anchorElement?.removeEventListener("focus", this.focusAnchorHandler);
    this.anchorElement?.removeEventListener("blur", this.blurAnchorHandler);
    this.anchorElement?.removeEventListener("mouseenter", this.mouseenterAnchorHandler);
    this.anchorElement?.removeEventListener("mouseleave", this.mouseleaveAnchorHandler);
  }
  /**
   * Shows the tooltip
   * @param delay - Number of milliseconds to delay showing the tooltip
   * @internal
   */
  showTooltip(delay = this.defaultDelay) {
    setTimeout(() => {
      this.setAttribute("aria-hidden", "false");
      this.showPopover();
    }, delay);
  }
  /**
   * Hide the tooltip
   * @param delay - Number of milliseconds to delay hiding the tooltip
   * @internal
   */
  hideTooltip(delay = this.defaultDelay) {
    setTimeout(() => {
      if (this.matches(":hover") || this.anchorElement?.matches(":hover")) {
        this.hideTooltip(delay);
        return;
      }
      this.setAttribute("aria-hidden", "true");
      this.hidePopover();
    }, delay);
  }
  setFallbackStyles() {
    if (!this.anchorElement) {
      return;
    }
    const anchorName = this.anchorElement.style.anchorName || `--${this.anchor}`;
    if (!this.anchorPositioningStyleElement) {
      this.anchorPositioningStyleElement = document.createElement("style");
      document.head.append(this.anchorPositioningStyleElement);
    }
    let [direction, alignment] = this.positioning?.split("-") ?? [];
    if (!alignment) {
      if (direction === "above" || direction === "below") {
        alignment = "centerX";
      }
      if (direction === "before" || direction === "after") {
        alignment = "centerY";
      }
    }
    const directionCSSMap = {
      above: `bottom: anchor(top);`,
      below: `top: anchor(bottom);`,
      before: `right: anchor(left);`,
      after: `left: anchor(right);`
    };
    const directionCSS = directionCSSMap[direction] ?? directionCSSMap.above;
    const alignmentCSSMap = {
      start: `left: anchor(left);`,
      end: `right: anchor(right);`,
      top: `top: anchor(top);`,
      bottom: `bottom: anchor(bottom);`,
      centerX: `left: anchor(center); translate: -50% 0;`,
      centerY: `top: anchor(center); translate: 0 -50%;`
    };
    const alignmentCSS = alignmentCSSMap[alignment] ?? alignmentCSSMap.centerX;
    this.anchorPositioningStyleElement.textContent = /* css */
    `
      #${this.anchor} {
        anchor-name: ${anchorName};
      }
      #${this.id} {
        inset: unset;
        position-anchor: ${anchorName};
        position: absolute;
        ${directionCSS}
        ${alignmentCSS}
      }
    `;
    if (window.CSS_ANCHOR_POLYFILL) {
      window.CSS_ANCHOR_POLYFILL.call({ element: this.anchorPositioningStyleElement });
    }
  }
}
__decorateClass$4([
  attr
], Tooltip.prototype, "id", 2);
__decorateClass$4([
  attr({ converter: nullableNumberConverter })
], Tooltip.prototype, "delay", 2);
__decorateClass$4([
  attr
], Tooltip.prototype, "positioning", 2);
__decorateClass$4([
  attr
], Tooltip.prototype, "anchor", 2);

const styles$2 = css`${display("inline-flex")} :host(:not(:popover-open)){display:none}:host{--position-area:block-start;--position-try-options:flip-block;--block-offset:${spacingVerticalXS};--inline-offset:${spacingHorizontalXS};background:${colorNeutralBackground1};border-radius:${borderRadiusMedium};border:1px solid ${colorTransparentStroke};box-sizing:border-box;color:${colorNeutralForeground1};display:inline-flex;filter:drop-shadow(0 0 2px ${colorNeutralShadowAmbient}) drop-shadow(0 4px 8px ${colorNeutralShadowKey});font-family:${fontFamilyBase};font-size:${fontSizeBase200};inset:unset;line-height:${lineHeightBase200};margin:unset;max-width:240px;overflow:visible;padding:4px ${spacingHorizontalMNudge} 6px;position:absolute;position-area:var(--position-area);position-try-options:var(--position-try-options);width:auto;z-index:1}@supports (inset-area:block-start){:host{inset-area:var(--position-area);position-try-fallbacks:var(--position-try-options)}}:host(:is([positioning^='above'],[positioning^='below'],:not([positioning]))){margin-block:var(--block-offset)}:host(:is([positioning^='before'],[positioning^='after'])){margin-inline:var(--inline-offset);--position-try-options:flip-inline}:host([positioning='above-start']){--position-area:${TooltipPositioningOption["above-start"]}}:host([positioning='above']){--position-area:${TooltipPositioningOption.above}}:host([positioning='above-end']){--position-area:${TooltipPositioningOption["above-end"]}}:host([positioning='below-start']){--position-area:${TooltipPositioningOption["below-start"]}}:host([positioning='below']){--position-area:${TooltipPositioningOption.below}}:host([positioning='below-end']){--position-area:${TooltipPositioningOption["below-end"]}}:host([positioning='before-top']){--position-area:${TooltipPositioningOption["before-top"]}}:host([positioning='before']){--position-area:${TooltipPositioningOption.before}}:host([positioning='before-bottom']){--position-area:${TooltipPositioningOption["before-bottom"]}}:host([positioning='after-top']){--position-area:${TooltipPositioningOption["after-top"]}}:host([positioning='after']){--position-area:${TooltipPositioningOption.after}}:host([positioning='after-bottom']){--position-area:${TooltipPositioningOption["after-bottom"]}}`;

const template$2 = html`<template popover aria-hidden=true><slot></slot></template>`;

const definition$2 = Tooltip.compose({
  name: tagName$2,
  template: template$2,
  styles: styles$2
});

definition$2.define(FluentDesignSystem.registry);

const tagName$1 = `${FluentDesignSystem.prefix}-tree`;

const TreeItemAppearance = {
  subtle: "subtle",
  subtleAlpha: "subtle-alpha",
  transparent: "transparent"
};
const TreeItemSize = {
  small: "small",
  medium: "medium"
};
function isTreeItem(element, tagName2 = "-tree-item") {
  if (element?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return element.tagName.toLowerCase().endsWith(tagName2);
}
const tagName = `${FluentDesignSystem.prefix}-tree-item`;

var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
class BaseTree extends FASTElement {
  constructor() {
    super();
    this.currentSelected = null;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.elementInternals.role = "tree";
  }
  /**
   * Calls the slot change handler when the `defaultSlot` reference is updated
   * by the template binding.
   *
   * @internal
   */
  defaultSlotChanged() {
    this.handleDefaultSlotChange();
  }
  /** @internal */
  childTreeItemsChanged() {
    this.updateCurrentSelected();
  }
  /**
   * Updates current selected when slottedTreeItems changes
   */
  updateCurrentSelected() {
    const selectedItem = this.querySelector(`[selected]`);
    this.currentSelected = selectedItem;
  }
  /**
   * KeyDown handler
   *
   *  @internal
   */
  keydownHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    const item = e.target;
    if (!isTreeItem(item) || this.childTreeItems.length < 1) {
      return true;
    }
    switch (e.key) {
      case "ArrowLeft": {
        if (item?.childTreeItems?.length && item.expanded) {
          item.expanded = false;
        } else if (isTreeItem(item.parentElement)) {
          item.parentElement.focus();
        }
        return;
      }
      case "ArrowRight": {
        if (item?.childTreeItems?.length) {
          if (!item.expanded) {
            item.expanded = true;
          }
        }
        return;
      }
      case "Enter": {
        this.clickHandler(e);
        return;
      }
      case " ": {
        item.selected = true;
        return;
      }
    }
    return true;
  }
  /**
   * Handles click events bubbling up
   *
   *  @internal
   */
  clickHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    if (!isTreeItem(e.target)) {
      return true;
    }
    const item = e.target;
    item.toggleExpansion();
    item.selected = true;
  }
  /**
   * Handles the selected-changed events bubbling up
   * from child tree items
   *
   *  @internal
   */
  changeHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    if (!isTreeItem(e.target)) {
      return true;
    }
    const item = e.target;
    if (item.selected) {
      if (this.currentSelected && this.currentSelected !== item && isTreeItem(this.currentSelected)) {
        this.currentSelected.selected = false;
      }
      this.currentSelected = item;
    } else if (!item.selected && this.currentSelected === item) {
      this.currentSelected = null;
    }
  }
  /** @internal */
  handleDefaultSlotChange() {
    this.childTreeItems = this.defaultSlot.assignedElements().filter((el) => isTreeItem(el));
  }
  /**
   * All descendant tree items in DOM order, recursively flattened from
   * `childTreeItems`.
   */
  get descendantTreeItems() {
    const result = [];
    const visit = (items) => {
      if (!items) {
        return;
      }
      for (const item of items) {
        result.push(item);
        visit(item.childTreeItems);
      }
    };
    visit(this.childTreeItems);
    return result;
  }
}
__decorateClass$3([
  observable
], BaseTree.prototype, "currentSelected", 2);
__decorateClass$3([
  observable
], BaseTree.prototype, "defaultSlot", 2);
__decorateClass$3([
  observable
], BaseTree.prototype, "childTreeItems", 2);

var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
class Tree extends BaseTree {
  constructor() {
    super(...arguments);
    this.size = TreeItemSize.small;
    this.appearance = TreeItemAppearance.subtle;
  }
  sizeChanged() {
    this.updateSizeAndAppearance();
  }
  appearanceChanged() {
    this.updateSizeAndAppearance();
  }
  /**
   * child tree items supered change event
   * @internal
   */
  childTreeItemsChanged() {
    super.childTreeItemsChanged();
    this.updateSizeAndAppearance();
    this.fgItems ?? (this.fgItems = new ArrayItemCollection(
      () => this.descendantTreeItems.filter((i) => !i.isHidden),
      () => this.currentSelected ?? null
    ));
    if (!this.fg) {
      this.fg = new FocusGroup(this, this.fgItems, {
        definition: {
          behavior: "menu",
          axis: "block",
          memory: false
        }
      });
    } else {
      this.fg.update();
    }
  }
  disconnectedCallback() {
    this.fg?.disconnect();
    super.disconnectedCallback();
  }
  /**
   * 1. Update the child items' size based on the tree's size
   * 2. Update the child items' appearance based on the tree's appearance
   */
  updateSizeAndAppearance() {
    if (!this.childTreeItems?.length) {
      return;
    }
    this.childTreeItems.forEach((item) => {
      item.size = this.size;
      item.appearance = this.appearance;
    });
  }
  /** @internal */
  itemToggleHandler() {
    this.fg?.update();
  }
}
__decorateClass$2([
  attr
], Tree.prototype, "size", 2);
__decorateClass$2([
  attr
], Tree.prototype, "appearance", 2);

const styles$1 = css`${display("block")} :host{outline:none}`;

const template$1 = html`<template focusgroup="menu nowrap nomemory" @click=${(x, c) => x.clickHandler(c.event)} @keydown=${(x, c) => x.keydownHandler(c.event)} @change=${(x, c) => x.changeHandler(c.event)} @toggle=${(x, c) => x.itemToggleHandler()}><slot ${ref("defaultSlot")} @slotchange=${(x) => x.handleDefaultSlotChange()}></slot></template>`;

const definition$1 = Tree.compose({
  name: tagName$1,
  template: template$1,
  styles: styles$1
});

definition$1.define(FluentDesignSystem.registry);

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
class BaseTreeItem extends FASTElement {
  constructor() {
    super();
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    this.elementInternals = this.attachInternals();
    this.expanded = false;
    this.empty = false;
    this.childTreeItems = [];
    this.elementInternals.role = "treeitem";
  }
  /**
   * Calls the slot change handler when the `itemSlot` reference is updated
   * by the template binding.
   *
   * @internal
   */
  itemSlotChanged() {
    this.handleItemSlotChange();
  }
  /**
   * Handles changes to the expanded attribute
   * @param prev - the previous state
   * @param next - the next state
   *
   * @public
   */
  expandedChanged(prev, next) {
    this.$emit("toggle", {
      oldState: prev ? "open" : "closed",
      newState: next ? "open" : "closed"
    });
    toggleState(this.elementInternals, "expanded", next);
    if (this.childTreeItems && this.childTreeItems.length > 0) {
      this.elementInternals.ariaExpanded = next ? "true" : "false";
      requestAnimationFrame(() => {
        const walker = document.createTreeWalker(
          this,
          NodeFilter.SHOW_ELEMENT,
          (node) => isTreeItem(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        );
        while (walker.nextNode()) {
          const item = walker.currentNode;
          if (next) {
            item.removeAttribute("focusgroup");
          } else {
            if (item.selected) {
              item.selected = false;
            }
            item.setAttribute("focusgroup", "none");
          }
        }
      });
    }
  }
  /**
   * Handles changes to the selected attribute
   * @param prev - the previous state
   * @param next - the next state
   *
   * @internal
   */
  selectedChanged(prev, next) {
    this.$emit("change");
    toggleState(this.elementInternals, "selected", next);
    this.elementInternals.ariaSelected = next ? "true" : "false";
  }
  dataIndentChanged(prev, next) {
    if (this.styles !== void 0) {
      this.$fastController.removeStyles(this.styles);
    }
    this.styles = css`:host{--indent:${next}}`;
    this.$fastController.addStyles(this.styles);
  }
  /**
   * Handles changes to the child tree items
   *
   * @public
   */
  childTreeItemsChanged() {
    this.empty = this.childTreeItems?.length === 0;
    this.updateChildTreeItems();
  }
  /**
   * Updates the childrens indent
   *
   * @public
   */
  updateChildTreeItems() {
    if (!this.childTreeItems?.length) {
      return;
    }
    if (!this.expanded) {
      this.expanded = Array.from(this.querySelectorAll("[selected]")).some((el) => isTreeItem(el));
    }
    this.childTreeItems.forEach((item) => {
      this.setIndent(item);
    });
  }
  /**
   * Sets the indent for each item
   */
  setIndent(item) {
    const indent = this.dataIndent ?? 0;
    item.dataIndent = indent + 1;
  }
  /**
   * Toggle the expansion state of the tree item
   *
   * @public
   */
  toggleExpansion() {
    if (this.childTreeItems?.length) {
      this.expanded = !this.expanded;
    }
  }
  /**
   * Whether the tree item is nested
   * @internal
   */
  get isNestedItem() {
    return isTreeItem(this.parentElement);
  }
  /**
   * Whether the tree item is nested in a collapsed tree item.
   * @internal
   */
  get isHidden() {
    let parent = this.parentElement;
    while (isTreeItem(parent)) {
      if (!parent.expanded) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }
  /** @internal */
  handleItemSlotChange() {
    this.childTreeItems = this.itemSlot.assignedElements().filter((el) => isTreeItem(el));
  }
}
__decorateClass$1([
  observable
], BaseTreeItem.prototype, "itemSlot", 2);
__decorateClass$1([
  attr({ mode: "boolean" })
], BaseTreeItem.prototype, "expanded", 2);
__decorateClass$1([
  attr({ mode: "boolean" })
], BaseTreeItem.prototype, "selected", 2);
__decorateClass$1([
  attr({ mode: "boolean" })
], BaseTreeItem.prototype, "empty", 2);
__decorateClass$1([
  attr({ attribute: "data-indent" })
], BaseTreeItem.prototype, "dataIndent", 2);
__decorateClass$1([
  observable
], BaseTreeItem.prototype, "childTreeItems", 2);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
class TreeItem extends BaseTreeItem {
  constructor() {
    super(...arguments);
    this.size = TreeItemSize.small;
    this.appearance = TreeItemAppearance.subtle;
  }
  /**
   * Handles changes to the size attribute
   * we update the child tree items' size based on the size
   *  @internal
   */
  sizeChanged() {
    this.updateSizeAndAppearance();
  }
  /**
   * Handles changes to the appearance attribute
   *
   * @internal
   */
  appearanceChanged() {
    this.updateSizeAndAppearance();
  }
  /**
   * child tree items supered change event
   * @internal
   */
  childTreeItemsChanged() {
    super.childTreeItemsChanged();
    this.updateSizeAndAppearance();
  }
  /**
   * 1. Update the child items' size based on the tree's size
   * 2. Update the child items' appearance based on the tree's appearance
   *
   * @public
   */
  updateSizeAndAppearance() {
    if (!this.childTreeItems?.length) {
      return;
    }
    this.childTreeItems.forEach((item) => {
      item.size = this.size;
      item.appearance = this.appearance;
    });
  }
}
__decorateClass([
  attr
], TreeItem.prototype, "size", 2);
__decorateClass([
  attr
], TreeItem.prototype, "appearance", 2);

const styles = css`${display("block")} :host{outline:none;font-size:${fontSizeBase300};line-height:${lineHeightBase300}}:host(:focus-visible) .positioning-region{box-shadow:${spacingVerticalNone} ${spacingVerticalNone} ${spacingVerticalNone} ${spacingVerticalXXS} ${colorStrokeFocus2} inset}.positioning-region{display:flex;align-items:center;justify-content:space-between;cursor:pointer;height:${spacingVerticalXXXL};padding-inline-start:calc(var(--indent) * ${spacingHorizontalXXL});padding-inline-end:${spacingVerticalS};border-radius:${borderRadiusMedium};background-color:${colorSubtleBackground};color:${colorNeutralForeground2};gap:${spacingHorizontalXS}}@media (prefers-contrast:more){:host(:focus-visible) .positioning-region{outline:1px solid ${colorStrokeFocus2}}}.content{display:flex;align-items:center;gap:${spacingHorizontalXS}}.chevron{display:flex;align-items:center;flex-shrink:0;justify-content:center;width:${spacingHorizontalXXL};height:${spacingVerticalXXL};transition:transform ${durationFaster} ${curveEasyEaseMax};transform:rotate(0deg)}.chevron:dir(rtl){transform:rotate(180deg)}.chevron svg{inline-size:12px;block-size:12px}.aside{display:flex;align-items:center}.positioning-region:hover{background-color:${colorSubtleBackgroundHover};color:${colorNeutralForeground2Hover}}.positioning-region:active{background-color:${colorSubtleBackgroundPressed};color:${colorNeutralForeground2Pressed}}::slotted([slot='start']),::slotted([slot='end']),::slotted(:not([slot])){display:flex;align-items:center;min-width:0}::slotted([slot='start']){flex-shrink:0}::slotted(:not([slot])){padding-inline:${spacingHorizontalXXS}}.items{display:none}:host([expanded]) .items{display:block}:host([empty]) .chevron,:host([empty]) .items{visibility:hidden}:host([selected]) .positioning-region{background-color:${colorSubtleBackgroundSelected};color:${colorNeutralForeground2Selected}}:host([selected]) .content,:host([selected]) .chevron{color:${colorNeutralForeground3Selected}}:host([size='small']) .positioning-region{height:${spacingVerticalXXL};padding-inline-start:calc(var(--indent) * ${spacingHorizontalM})}:host([appearance='subtle-alpha']) .positioning-region:hover{background-color:${colorSubtleBackgroundLightAlphaHover}}:host([appearance='subtle-alpha']) .positioning-region:active{background-color:${colorSubtleBackgroundLightAlphaPressed}}:host([appearance='subtle-alpha'][selected]) .positioning-region{background-color:${colorSubtleBackgroundLightAlphaSelected};color:${colorNeutralForeground2Selected}}:host([appearance='transparent']) .positioning-region{background-color:${colorTransparentBackground}}:host([appearance='transparent']) .positioning-region:hover{background-color:${colorTransparentBackgroundHover}}:host([appearance='transparent']) .positioning-region:active{background-color:${colorTransparentBackgroundPressed}}:host([appearance='transparent'][selected]) .positioning-region{background-color:${colorTransparentBackgroundSelected};color:${colorNeutralForeground2Selected}}:host([expanded]) .chevron{transform:rotate(90deg)}`;

const chevronIcon = html`<svg viewBox="0 0 12 12" fill=currentColor><path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"></path></svg>`;
const template = html`<template slot=${(x) => x.isNestedItem ? "item" : void 0} tabindex=0 ?focusgroupstart=${(x) => x.selected}><div class=positioning-region part=positioning-region><div class=content part=content><span class=chevron part=chevron aria-hidden=true><slot name=chevron>${chevronIcon}</slot></span><slot name=start></slot><slot></slot><slot name=end></slot></div><div class=aside part=aside><slot name=aside></slot></div></div><div role=group class=items part=items><slot name=item ${ref("itemSlot")} @slotchange=${(x) => x.handleItemSlotChange()}></slot></div></template>`;

const definition = TreeItem.compose({
  name: tagName,
  template: template,
  styles: styles
});

definition.define(FluentDesignSystem.registry);

const SUPPORTS_ADOPTED_STYLE_SHEETS = "adoptedStyleSheets" in document;
const SUPPORTS_CSS_SCOPE = "CSSScopeRule" in window;
const themeStyleTextMap = /* @__PURE__ */ new Map();
const scopedThemeKeyMap = /* @__PURE__ */ new Map();
const shadowAdoptedStyleSheetMap = /* @__PURE__ */ new Map();
const elementThemeMap = /* @__PURE__ */ new Map();
const globalThemeStyleSheet = new CSSStyleSheet();
function setTheme(theme, node = document) {
  if (!node || !isThemeableNode(node)) {
    return;
  }
  if (!SUPPORTS_ADOPTED_STYLE_SHEETS || node instanceof HTMLElement && !node.shadowRoot && !SUPPORTS_CSS_SCOPE) {
    const target = node === document ? document.documentElement : node;
    setThemePropertiesOnElement(theme, target);
    return;
  }
  if ([document, document.documentElement, document.body].includes(node)) {
    setGlobalTheme(theme);
  } else {
    setLocalTheme(theme, node);
  }
}
function getThemeStyleText(theme) {
  if (!themeStyleTextMap.has(theme)) {
    const tokenDeclarations = [];
    for (const [tokenName, tokenValue] of Object.entries(theme)) {
      tokenDeclarations.push(`--${tokenName}:${tokenValue.toString()};`);
    }
    themeStyleTextMap.set(theme, tokenDeclarations.join(""));
  }
  return themeStyleTextMap.get(theme);
}
function isThemeableNode(node) {
  return [document, document.documentElement].includes(node) || node instanceof HTMLElement && !!node.closest("body");
}
function setGlobalTheme(theme) {
  if (theme === null) {
    if (document.adoptedStyleSheets.includes(globalThemeStyleSheet)) {
      globalThemeStyleSheet.replaceSync("");
    }
    return;
  }
  globalThemeStyleSheet.replaceSync(`
    html {
      ${getThemeStyleText(theme)}
    }
  `);
  if (!document.adoptedStyleSheets.includes(globalThemeStyleSheet)) {
    document.adoptedStyleSheets.push(globalThemeStyleSheet);
  }
}
function setLocalTheme(theme, element) {
  if (theme === null) {
    if (element.shadowRoot && shadowAdoptedStyleSheetMap.has(element)) {
      shadowAdoptedStyleSheetMap.get(element).replaceSync("");
    } else {
      delete element.dataset.fluentTheme;
      forceRepaint(element);
    }
    return;
  }
  if (element.shadowRoot) {
    getShadowAdoptedStyleSheet(element).replaceSync(`
      :host {
        ${getThemeStyleText(theme)}
      }
    `);
  } else {
    element.dataset.fluentTheme = getScopedThemeKey(theme);
    forceRepaint(element);
  }
}
function getShadowAdoptedStyleSheet(element) {
  if (!shadowAdoptedStyleSheetMap.has(element)) {
    const shadowAdoptedStyleSheet = new CSSStyleSheet();
    shadowAdoptedStyleSheetMap.set(element, shadowAdoptedStyleSheet);
    element.shadowRoot?.adoptedStyleSheets.push(shadowAdoptedStyleSheet);
  }
  return shadowAdoptedStyleSheetMap.get(element);
}
function getScopedThemeKey(theme) {
  if (!scopedThemeKeyMap.has(theme)) {
    const themeKey = uniqueId("fluent-theme-");
    const scopedThemeStyleSheet = new CSSStyleSheet();
    scopedThemeKeyMap.set(theme, themeKey);
    scopedThemeStyleSheet.replaceSync(`
      @scope ([data-fluent-theme="${themeKey}"]) {
        :scope {
          ${getThemeStyleText(theme)}
        }
      }
    `);
    document.adoptedStyleSheets.push(scopedThemeStyleSheet);
  }
  return scopedThemeKeyMap.get(theme);
}
function setThemePropertiesOnElement(theme, element) {
  let tokens;
  if (theme === null) {
    if (!elementThemeMap.has(element)) {
      return;
    }
    tokens = elementThemeMap.get(element);
  } else {
    elementThemeMap.set(element, theme);
    tokens = theme;
  }
  for (const [tokenName, tokenValue] of Object.entries(tokens)) {
    if (theme === null) {
      element.style.removeProperty(`--${tokenName}`);
    } else {
      element.style.setProperty(`--${tokenName}`, tokenValue.toString());
    }
  }
}
const { userAgent: UA } = navigator;
const isWebkit = /\bAppleWebKit\/[\d+\.]+\b/.test(UA);
function forceRepaint(element) {
  if (!isWebkit) {
    return;
  }
  const name = "visibility";
  const tempValue = "hidden";
  const currentValue = element.style.getPropertyValue(name);
  element.style.setProperty(name, tempValue);
  Updates.process();
  element.style.setProperty(name, currentValue);
}

globalThis.Fluent = { ...globalThis.Fluent, setTheme };

export { Accordion, AccordionExpandMode, AccordionItem, AccordionItemMarkerPosition, AccordionItemSize, AnchorButton, AnchorButtonAppearance, definition$D as AnchorButtonDefinition, AnchorButtonShape, AnchorButtonSize, template$D as AnchorButtonTemplate, AnchorTarget, Avatar, AvatarActive, AvatarAppearance, AvatarColor, definition$C as AvatarDefinition, AvatarNamedColor, AvatarShape, AvatarSize, styles$A as AvatarStyles, template$C as AvatarTemplate, Badge, BadgeAppearance, BadgeColor, definition$B as BadgeDefinition, BadgeShape, BadgeSize, styles$z as BadgeStyles, template$B as BadgeTemplate, BaseAccordionItem, BaseAnchor, BaseAvatar, BaseButton, BaseCheckbox, BaseDivider, BaseDropdown, BaseField, BaseMenuList, BaseProgressBar, BaseRadioGroup, BaseRatingDisplay, BaseSpinner, BaseTablist, BaseTextArea, BaseTextInput, BaseTree, Button, ButtonAppearance, definition$A as ButtonDefinition, ButtonFormTarget, ButtonShape, ButtonSize, styles$C as ButtonStyles, template$A as ButtonTemplate, ButtonType, Checkbox, definition$z as CheckboxDefinition, CheckboxShape, CheckboxSize, styles$y as CheckboxStyles, template$z as CheckboxTemplate, CompoundButton, CompoundButtonAppearance, definition$y as CompoundButtonDefinition, CompoundButtonShape, CompoundButtonSize, styles$x as CompoundButtonStyles, template$y as CompoundButtonTemplate, CounterBadge, CounterBadgeAppearance, CounterBadgeColor, definition$x as CounterBadgeDefinition, CounterBadgeShape, CounterBadgeSize, styles$w as CounterBadgeStyles, template$x as CounterBadgeTemplate, Dialog, DialogBody, definition$v as DialogBodyDefinition, styles$u as DialogBodyStyles, template$v as DialogBodyTemplate, definition$w as DialogDefinition, styles$v as DialogStyles, template$w as DialogTemplate, DialogType, Direction, Divider, DividerAlignContent, DividerAppearance, definition$u as DividerDefinition, DividerOrientation, DividerRole, styles$t as DividerStyles, template$u as DividerTemplate, Drawer, DrawerBody, definition$s as DrawerBodyDefinition, styles$r as DrawerBodyStyles, template$s as DrawerBodyTemplate, definition$t as DrawerDefinition, DrawerPosition, DrawerSize, styles$s as DrawerStyles, template$t as DrawerTemplate, DrawerType, Dropdown, DropdownAppearance, definition$r as DropdownDefinition, DropdownOption, definition$g as DropdownOptionDefinition, styles$g as DropdownOptionStyles, template$g as DropdownOptionTemplate, DropdownSize, styles$q as DropdownStyles, template$r as DropdownTemplate, DropdownType, Field, definition$q as FieldDefinition, LabelPosition as FieldLabelPosition, styles$p as FieldStyles, template$q as FieldTemplate, FluentDesignSystem, Image, definition$p as ImageDefinition, ImageFit, ImageShape, styles$o as ImageStyles, template$p as ImageTemplate, Label, definition$o as LabelDefinition, LabelSize, styles$n as LabelStyles, template$o as LabelTemplate, LabelWeight, Link, LinkAppearance, definition$n as LinkDefinition, styles$m as LinkStyles, LinkTarget, template$n as LinkTemplate, Listbox, definition$m as ListboxDefinition, styles$l as ListboxStyles, template$m as ListboxTemplate, Menu, MenuButton, MenuButtonAppearance, definition$l as MenuButtonDefinition, MenuButtonShape, MenuButtonSize, styles$C as MenuButtonStyles, template$l as MenuButtonTemplate, definition$i as MenuDefinition, MenuItem, definition$k as MenuItemDefinition, MenuItemRole, styles$k as MenuItemStyles, template$k as MenuItemTemplate, MenuList, definition$j as MenuListDefinition, styles$j as MenuListStyles, template$j as MenuListTemplate, styles$i as MenuStyles, template$i as MenuTemplate, MessageBar, definition$h as MessageBarDefinition, MessageBarIntent, MessageBarLayout, MessageBarShape, styles$h as MessageBarStyles, template$h as MessageBarTemplate, Orientation, ProgressBar, definition$f as ProgressBarDefinition, ProgressBarShape, styles$f as ProgressBarStyles, template$f as ProgressBarTemplate, ProgressBarThickness, ProgressBarValidationState, Radio, definition$d as RadioDefinition, RadioGroup, definition$e as RadioGroupDefinition, RadioGroupOrientation, styles$e as RadioGroupStyles, template$e as RadioGroupTemplate, styles$d as RadioStyles, template$d as RadioTemplate, RatingDisplay, RatingDisplayColor, definition$c as RatingDisplayDefinition, RatingDisplaySize, styles$c as RatingDisplayStyles, template$c as RatingDisplayTemplate, Slider, definition$b as SliderDefinition, SliderMode, SliderOrientation, SliderSize, styles$b as SliderStyles, template$b as SliderTemplate, Spinner, SpinnerAppearance, definition$a as SpinnerDefinition, SpinnerSize, styles$a as SpinnerStyles, template$a as SpinnerTemplate, StartEnd, Switch, definition$9 as SwitchDefinition, SwitchLabelPosition, styles$9 as SwitchStyles, template$9 as SwitchTemplate, Tab, definition$8 as TabDefinition, styles$8 as TabStyles, template$8 as TabTemplate, Tablist, TablistAppearance, definition$7 as TablistDefinition, TablistOrientation, TablistSize, styles$7 as TablistStyles, template$7 as TablistTemplate, Text, TextAlign, TextArea, TextAreaAppearance, TextAreaAppearancesForDisplayShadow, TextAreaAutocomplete, definition$6 as TextAreaDefinition, TextAreaResize, TextAreaSize, styles$6 as TextAreaStyles, template$6 as TextAreaTemplate, definition$4 as TextDefinition, TextFont, TextInput, TextInputAppearance, TextInputControlSize, definition$5 as TextInputDefinition, styles$5 as TextInputStyles, template$5 as TextInputTemplate, TextInputType, TextSize, styles$4 as TextStyles, template$4 as TextTemplate, TextWeight, ToggleButton, ToggleButtonAppearance, definition$3 as ToggleButtonDefinition, ToggleButtonShape, ToggleButtonSize, styles$3 as ToggleButtonStyles, template$3 as ToggleButtonTemplate, Tooltip, definition$2 as TooltipDefinition, TooltipPositioningOption, styles$2 as TooltipStyles, template$2 as TooltipTemplate, Tree, definition$1 as TreeDefinition, TreeItem, definition as TreeItemDefinition, styles as TreeItemStyles, template as TreeItemTemplate, styles$1 as TreeStyles, template$1 as TreeTemplate, ValidationFlags, definition$E as accordionDefinition, definition$F as accordionItemDefinition, styles$E as accordionItemStyles, template$F as accordionItemTemplate, styles$D as accordionStyles, template$E as accordionTemplate, borderRadius2XLarge, borderRadius3XLarge, borderRadius4XLarge, borderRadius5XLarge, borderRadius6XLarge, borderRadiusCircular, borderRadiusLarge, borderRadiusMedium, borderRadiusNone, borderRadiusSmall, borderRadiusXLarge, colorBackgroundOverlay, colorBrandBackground, colorBrandBackground2, colorBrandBackground2Hover, colorBrandBackground2Pressed, colorBrandBackground3Static, colorBrandBackground4Static, colorBrandBackgroundHover, colorBrandBackgroundInverted, colorBrandBackgroundInvertedHover, colorBrandBackgroundInvertedPressed, colorBrandBackgroundInvertedSelected, colorBrandBackgroundPressed, colorBrandBackgroundSelected, colorBrandBackgroundStatic, colorBrandForeground1, colorBrandForeground2, colorBrandForeground2Hover, colorBrandForeground2Pressed, colorBrandForegroundInverted, colorBrandForegroundInvertedHover, colorBrandForegroundInvertedPressed, colorBrandForegroundLink, colorBrandForegroundLinkHover, colorBrandForegroundLinkPressed, colorBrandForegroundLinkSelected, colorBrandForegroundOnLight, colorBrandForegroundOnLightHover, colorBrandForegroundOnLightPressed, colorBrandForegroundOnLightSelected, colorBrandShadowAmbient, colorBrandShadowKey, colorBrandStroke1, colorBrandStroke2, colorBrandStroke2Contrast, colorBrandStroke2Hover, colorBrandStroke2Pressed, colorCompoundBrandBackground, colorCompoundBrandBackgroundHover, colorCompoundBrandBackgroundPressed, colorCompoundBrandForeground1, colorCompoundBrandForeground1Hover, colorCompoundBrandForeground1Pressed, colorCompoundBrandStroke, colorCompoundBrandStrokeHover, colorCompoundBrandStrokePressed, colorNeutralBackground1, colorNeutralBackground1Hover, colorNeutralBackground1Pressed, colorNeutralBackground1Selected, colorNeutralBackground2, colorNeutralBackground2Hover, colorNeutralBackground2Pressed, colorNeutralBackground2Selected, colorNeutralBackground3, colorNeutralBackground3Hover, colorNeutralBackground3Pressed, colorNeutralBackground3Selected, colorNeutralBackground4, colorNeutralBackground4Hover, colorNeutralBackground4Pressed, colorNeutralBackground4Selected, colorNeutralBackground5, colorNeutralBackground5Hover, colorNeutralBackground5Pressed, colorNeutralBackground5Selected, colorNeutralBackground6, colorNeutralBackground7, colorNeutralBackground7Hover, colorNeutralBackground7Pressed, colorNeutralBackground7Selected, colorNeutralBackground8, colorNeutralBackgroundAlpha, colorNeutralBackgroundAlpha2, colorNeutralBackgroundDisabled, colorNeutralBackgroundDisabled2, colorNeutralBackgroundInverted, colorNeutralBackgroundInvertedDisabled, colorNeutralBackgroundInvertedHover, colorNeutralBackgroundInvertedPressed, colorNeutralBackgroundInvertedSelected, colorNeutralBackgroundStatic, colorNeutralCardBackground, colorNeutralCardBackgroundDisabled, colorNeutralCardBackgroundHover, colorNeutralCardBackgroundPressed, colorNeutralCardBackgroundSelected, colorNeutralForeground1, colorNeutralForeground1Hover, colorNeutralForeground1Pressed, colorNeutralForeground1Selected, colorNeutralForeground1Static, colorNeutralForeground2, colorNeutralForeground2BrandHover, colorNeutralForeground2BrandPressed, colorNeutralForeground2BrandSelected, colorNeutralForeground2Hover, colorNeutralForeground2Link, colorNeutralForeground2LinkHover, colorNeutralForeground2LinkPressed, colorNeutralForeground2LinkSelected, colorNeutralForeground2Pressed, colorNeutralForeground2Selected, colorNeutralForeground3, colorNeutralForeground3BrandHover, colorNeutralForeground3BrandPressed, colorNeutralForeground3BrandSelected, colorNeutralForeground3Hover, colorNeutralForeground3Pressed, colorNeutralForeground3Selected, colorNeutralForeground4, colorNeutralForeground5, colorNeutralForeground5Hover, colorNeutralForeground5Pressed, colorNeutralForeground5Selected, colorNeutralForegroundDisabled, colorNeutralForegroundInverted, colorNeutralForegroundInverted2, colorNeutralForegroundInvertedDisabled, colorNeutralForegroundInvertedHover, colorNeutralForegroundInvertedLink, colorNeutralForegroundInvertedLinkHover, colorNeutralForegroundInvertedLinkPressed, colorNeutralForegroundInvertedLinkSelected, colorNeutralForegroundInvertedPressed, colorNeutralForegroundInvertedSelected, colorNeutralForegroundOnBrand, colorNeutralForegroundStaticInverted, colorNeutralShadowAmbient, colorNeutralShadowAmbientDarker, colorNeutralShadowAmbientLighter, colorNeutralShadowKey, colorNeutralShadowKeyDarker, colorNeutralShadowKeyLighter, colorNeutralStencil1, colorNeutralStencil1Alpha, colorNeutralStencil2, colorNeutralStencil2Alpha, colorNeutralStroke1, colorNeutralStroke1Hover, colorNeutralStroke1Pressed, colorNeutralStroke1Selected, colorNeutralStroke2, colorNeutralStroke3, colorNeutralStroke4, colorNeutralStroke4Hover, colorNeutralStroke4Pressed, colorNeutralStroke4Selected, colorNeutralStrokeAccessible, colorNeutralStrokeAccessibleHover, colorNeutralStrokeAccessiblePressed, colorNeutralStrokeAccessibleSelected, colorNeutralStrokeAlpha, colorNeutralStrokeAlpha2, colorNeutralStrokeDisabled, colorNeutralStrokeDisabled2, colorNeutralStrokeInvertedDisabled, colorNeutralStrokeOnBrand, colorNeutralStrokeOnBrand2, colorNeutralStrokeOnBrand2Hover, colorNeutralStrokeOnBrand2Pressed, colorNeutralStrokeOnBrand2Selected, colorNeutralStrokeSubtle, colorPaletteAnchorBackground2, colorPaletteAnchorBorderActive, colorPaletteAnchorForeground2, colorPaletteBeigeBackground2, colorPaletteBeigeBorderActive, colorPaletteBeigeForeground2, colorPaletteBerryBackground1, colorPaletteBerryBackground2, colorPaletteBerryBackground3, colorPaletteBerryBorder1, colorPaletteBerryBorder2, colorPaletteBerryBorderActive, colorPaletteBerryForeground1, colorPaletteBerryForeground2, colorPaletteBerryForeground3, colorPaletteBlueBackground2, colorPaletteBlueBorderActive, colorPaletteBlueForeground2, colorPaletteBrassBackground2, colorPaletteBrassBorderActive, colorPaletteBrassForeground2, colorPaletteBrownBackground2, colorPaletteBrownBorderActive, colorPaletteBrownForeground2, colorPaletteCornflowerBackground2, colorPaletteCornflowerBorderActive, colorPaletteCornflowerForeground2, colorPaletteCranberryBackground2, colorPaletteCranberryBorderActive, colorPaletteCranberryForeground2, colorPaletteDarkGreenBackground2, colorPaletteDarkGreenBorderActive, colorPaletteDarkGreenForeground2, colorPaletteDarkOrangeBackground1, colorPaletteDarkOrangeBackground2, colorPaletteDarkOrangeBackground3, colorPaletteDarkOrangeBorder1, colorPaletteDarkOrangeBorder2, colorPaletteDarkOrangeBorderActive, colorPaletteDarkOrangeForeground1, colorPaletteDarkOrangeForeground2, colorPaletteDarkOrangeForeground3, colorPaletteDarkRedBackground2, colorPaletteDarkRedBorderActive, colorPaletteDarkRedForeground2, colorPaletteForestBackground2, colorPaletteForestBorderActive, colorPaletteForestForeground2, colorPaletteGoldBackground2, colorPaletteGoldBorderActive, colorPaletteGoldForeground2, colorPaletteGrapeBackground2, colorPaletteGrapeBorderActive, colorPaletteGrapeForeground2, colorPaletteGreenBackground1, colorPaletteGreenBackground2, colorPaletteGreenBackground3, colorPaletteGreenBorder1, colorPaletteGreenBorder2, colorPaletteGreenBorderActive, colorPaletteGreenForeground1, colorPaletteGreenForeground2, colorPaletteGreenForeground3, colorPaletteGreenForegroundInverted, colorPaletteLavenderBackground2, colorPaletteLavenderBorderActive, colorPaletteLavenderForeground2, colorPaletteLightGreenBackground1, colorPaletteLightGreenBackground2, colorPaletteLightGreenBackground3, colorPaletteLightGreenBorder1, colorPaletteLightGreenBorder2, colorPaletteLightGreenBorderActive, colorPaletteLightGreenForeground1, colorPaletteLightGreenForeground2, colorPaletteLightGreenForeground3, colorPaletteLightTealBackground2, colorPaletteLightTealBorderActive, colorPaletteLightTealForeground2, colorPaletteLilacBackground2, colorPaletteLilacBorderActive, colorPaletteLilacForeground2, colorPaletteMagentaBackground2, colorPaletteMagentaBorderActive, colorPaletteMagentaForeground2, colorPaletteMarigoldBackground1, colorPaletteMarigoldBackground2, colorPaletteMarigoldBackground3, colorPaletteMarigoldBorder1, colorPaletteMarigoldBorder2, colorPaletteMarigoldBorderActive, colorPaletteMarigoldForeground1, colorPaletteMarigoldForeground2, colorPaletteMarigoldForeground3, colorPaletteMinkBackground2, colorPaletteMinkBorderActive, colorPaletteMinkForeground2, colorPaletteNavyBackground2, colorPaletteNavyBorderActive, colorPaletteNavyForeground2, colorPalettePeachBackground2, colorPalettePeachBorderActive, colorPalettePeachForeground2, colorPalettePinkBackground2, colorPalettePinkBorderActive, colorPalettePinkForeground2, colorPalettePlatinumBackground2, colorPalettePlatinumBorderActive, colorPalettePlatinumForeground2, colorPalettePlumBackground2, colorPalettePlumBorderActive, colorPalettePlumForeground2, colorPalettePumpkinBackground2, colorPalettePumpkinBorderActive, colorPalettePumpkinForeground2, colorPalettePurpleBackground2, colorPalettePurpleBorderActive, colorPalettePurpleForeground2, colorPaletteRedBackground1, colorPaletteRedBackground2, colorPaletteRedBackground3, colorPaletteRedBorder1, colorPaletteRedBorder2, colorPaletteRedBorderActive, colorPaletteRedForeground1, colorPaletteRedForeground2, colorPaletteRedForeground3, colorPaletteRedForegroundInverted, colorPaletteRoyalBlueBackground2, colorPaletteRoyalBlueBorderActive, colorPaletteRoyalBlueForeground2, colorPaletteSeafoamBackground2, colorPaletteSeafoamBorderActive, colorPaletteSeafoamForeground2, colorPaletteSteelBackground2, colorPaletteSteelBorderActive, colorPaletteSteelForeground2, colorPaletteTealBackground2, colorPaletteTealBorderActive, colorPaletteTealForeground2, colorPaletteYellowBackground1, colorPaletteYellowBackground2, colorPaletteYellowBackground3, colorPaletteYellowBorder1, colorPaletteYellowBorder2, colorPaletteYellowBorderActive, colorPaletteYellowForeground1, colorPaletteYellowForeground2, colorPaletteYellowForeground3, colorPaletteYellowForegroundInverted, colorScrollbarOverlay, colorStatusDangerBackground1, colorStatusDangerBackground2, colorStatusDangerBackground3, colorStatusDangerBackground3Hover, colorStatusDangerBackground3Pressed, colorStatusDangerBorder1, colorStatusDangerBorder2, colorStatusDangerBorderActive, colorStatusDangerForeground1, colorStatusDangerForeground2, colorStatusDangerForeground3, colorStatusDangerForegroundInverted, colorStatusSuccessBackground1, colorStatusSuccessBackground2, colorStatusSuccessBackground3, colorStatusSuccessBorder1, colorStatusSuccessBorder2, colorStatusSuccessBorderActive, colorStatusSuccessForeground1, colorStatusSuccessForeground2, colorStatusSuccessForeground3, colorStatusSuccessForegroundInverted, colorStatusWarningBackground1, colorStatusWarningBackground2, colorStatusWarningBackground3, colorStatusWarningBorder1, colorStatusWarningBorder2, colorStatusWarningBorderActive, colorStatusWarningForeground1, colorStatusWarningForeground2, colorStatusWarningForeground3, colorStatusWarningForegroundInverted, colorStrokeFocus1, colorStrokeFocus2, colorSubtleBackground, colorSubtleBackgroundHover, colorSubtleBackgroundInverted, colorSubtleBackgroundInvertedHover, colorSubtleBackgroundInvertedPressed, colorSubtleBackgroundInvertedSelected, colorSubtleBackgroundLightAlphaHover, colorSubtleBackgroundLightAlphaPressed, colorSubtleBackgroundLightAlphaSelected, colorSubtleBackgroundPressed, colorSubtleBackgroundSelected, colorTransparentBackground, colorTransparentBackgroundHover, colorTransparentBackgroundPressed, colorTransparentBackgroundSelected, colorTransparentStroke, colorTransparentStrokeDisabled, colorTransparentStrokeInteractive, curveAccelerateMax, curveAccelerateMid, curveAccelerateMin, curveDecelerateMax, curveDecelerateMid, curveDecelerateMin, curveEasyEase, curveEasyEaseMax, curveLinear, display, dropdownButtonTemplate, dropdownInputTemplate, durationFast, durationFaster, durationGentle, durationNormal, durationSlow, durationSlower, durationUltraFast, durationUltraSlow, endSlotTemplate, fontFamilyBase, fontFamilyMonospace, fontFamilyNumeric, fontSizeBase100, fontSizeBase200, fontSizeBase300, fontSizeBase400, fontSizeBase500, fontSizeBase600, fontSizeHero1000, fontSizeHero700, fontSizeHero800, fontSizeHero900, fontWeightBold, fontWeightMedium, fontWeightRegular, fontWeightSemibold, getDirection, isDialog, isDropdown, isDropdownOption, isListbox, isTab, lineHeightBase100, lineHeightBase200, lineHeightBase300, lineHeightBase400, lineHeightBase500, lineHeightBase600, lineHeightHero1000, lineHeightHero700, lineHeightHero800, lineHeightHero900, listboxTemplate, roleForMenuItem, setTheme, shadow16, shadow16Brand, shadow2, shadow28, shadow28Brand, shadow2Brand, shadow4, shadow4Brand, shadow64, shadow64Brand, shadow8, shadow8Brand, spacingHorizontalL, spacingHorizontalM, spacingHorizontalMNudge, spacingHorizontalNone, spacingHorizontalS, spacingHorizontalSNudge, spacingHorizontalXL, spacingHorizontalXS, spacingHorizontalXXL, spacingHorizontalXXS, spacingHorizontalXXXL, spacingVerticalL, spacingVerticalM, spacingVerticalMNudge, spacingVerticalNone, spacingVerticalS, spacingVerticalSNudge, spacingVerticalXL, spacingVerticalXS, spacingVerticalXXL, spacingVerticalXXS, spacingVerticalXXXL, startSlotTemplate, strokeWidthThick, strokeWidthThicker, strokeWidthThickest, strokeWidthThin, typographyBody1StrongStyles, typographyBody1StrongerStyles, typographyBody1Styles, typographyBody2Styles, typographyCaption1StrongStyles, typographyCaption1StrongerStyles, typographyCaption1Styles, typographyCaption2StrongStyles, typographyCaption2Styles, typographyDisplayStyles, typographyLargeTitleStyles, typographySubtitle1Styles, typographySubtitle2StrongerStyles, typographySubtitle2Styles, typographyTitle1Styles, typographyTitle2Styles, typographyTitle3Styles, zIndexBackground, zIndexContent, zIndexDebug, zIndexFloating, zIndexMessages, zIndexOverlay, zIndexPopup, zIndexPriority };
