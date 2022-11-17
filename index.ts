type HandlerType = (payload: any) => void;

interface IEvent<Type> {
    type: Type,
    handlers: HandlerType[]
}

class EventEmitter<EVENTS_TYPES> {
    events: IEvent<keyof EVENTS_TYPES>[] = [];

    constructor() {}

    emit<TYPE extends keyof EVENTS_TYPES>(type: TYPE, payload: EVENTS_TYPES[TYPE]) {
        const event = this.#getEvent(type);
        if (event && event?.handlers){
            event.handlers.forEach(handler => handler(payload));
            return
        }
        throw new Error("No such event exists");

    }

    removeListener(type: keyof EVENTS_TYPES, handler: HandlerType) {
        const event = this.#getEvent(type);
        if (event && event?.handlers) {
            event.handlers = event.handlers.filter((item: HandlerType) => handler !== item);
            console.log(handler, 'removed')
            console.log('Remaining handlers',  event.handlers)
            return
        }
    }

    on<TYPE extends keyof EVENTS_TYPES>(type: TYPE, handler: HandlerType) {
        const event =  this.#getEvent(type);
        if ( event ) {
            event.handlers.push(handler)
            return
        }

        this.events.push({type, handlers: [handler]});
    }

    #getEvent<TYPE extends keyof EVENTS_TYPES>(type: TYPE): IEvent<keyof EVENTS_TYPES> | undefined {
        return this.events.find(event => event?.type === type);
    }
}

const globalEventBus = new EventEmitter<{
    event_1: { key: string };
    event_2: undefined;
}>();

globalEventBus.on("event_1", (payload) => {
    console.log(payload);
})
globalEventBus.on("event_2", (payload) => {
    console.log(payload);
})
globalEventBus.on("event_2", removeListenerExample)

globalEventBus.emit("event_1", { key: "value" });
globalEventBus.emit("event_2", undefined);

globalEventBus.removeListener("event_2", removeListenerExample)


function removeListenerExample(payload) {
    console.log(payload + " payload. I'm going to leave" )
}

// Wrong cases

/*

globalEventBus.on("event_3", (payload) => {
    console.log(payload);
})

globalEventBus.emit("event_2", { key: "value" });

globalEventBus.emit("event_3", { key: "value" });

*/



