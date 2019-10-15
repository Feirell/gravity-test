import { RingBuffer } from "./ring-buffer.js";
import { GravityNode } from "./gravity-node.js";
import { GravityEnvironment } from "./gravity-environment.js";
import { Vector } from "./vector.js";

const config = {
    speedup: 1,
    multiplier: 10 ** 12,
    initialVelocity: 80,
    numberOfNodes: 12,
    centerDistance: 0.4,
    initialDirectionDegree: 90
};

function createAnimLoop(fnc: (controller: ReturnType<typeof createAnimLoop>, timestamp: number, frameDelta: number, startDelta: number) => void) {
    let run = true;

    const controller = {
        stop: () => run = false
    };

    window.requestAnimationFrame(ts => {
        const start = ts;
        let last = ts;

        const looper = (ts: number) => {
            if (!run)
                return;

            ts *= config.speedup;
            fnc(controller, ts, ts - last, ts - start);
            last = ts;

            window.requestAnimationFrame(looper);
        };

        window.requestAnimationFrame(looper);
    });

    return controller;
}

function transformCamelCaseIntoSnakeCase(str: string) {
    return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + '-' + v.toLowerCase()).toLowerCase();
}

function transformCamelCaseIntoReadable(str: string) {
    return str.replace(/[a-z]([A-Z])/g, (_, v) => _.slice(0, 1) + ' ' + v.toLowerCase()).toLowerCase();
}


type Config = typeof config;
interface InputCreator {
    (elem: HTMLInputElement, changeListener: ConfigChange, config: Config, name: keyof Config): void
}

const inputCreator: { [key: string]: InputCreator } = {
    number(elem, changeListener, config, name) {
        elem.value = '' + config[name];
        elem.addEventListener('change', () => {
            config[name] = +elem.value;
            changeListener(name, +elem.value);
        })
    },

    string(elem, changeListener, config, name) {
        elem.value = '' + config[name];
        elem.addEventListener('change', () => {
            config[name] = elem.value;
            changeListener(name, elem.value);
        })
    }
};

interface ConfigChange {
    (name: string, newValue: string | number): void
}

function createConfigInterface(config: Config, changeListener: ConfigChange) {
    const form = document.getElementsByTagName('form')[0];
    if (!form)
        return;

    let configEntry: keyof Config;
    for (configEntry in config) {
        const type = typeof config[configEntry];

        if (!(type in inputCreator))
            throw new Error('could not translate config entry ' + configEntry + ' with the value ' + config[configEntry] + ' (' + type + ')');

        const elem = document.createElement('input');

        elem.setAttribute('type', 'number');
        elem.setAttribute('name', transformCamelCaseIntoSnakeCase(name));

        inputCreator[type](elem, changeListener, config, configEntry);

        const label = document.createElement('label');
        label.innerText = transformCamelCaseIntoReadable(configEntry);
        const group = document.createElement('div');


        group.appendChild(label);
        group.appendChild(elem);

        form.appendChild(group);
    }

}

addEventListener("DOMContentLoaded", () => {
    // const di = document.getElementById("debug-info");
    // if (di == null)
    //   throw new Error("could not find debug info");

    createConfigInterface(config, (name, newValue) => {
        setup();
    });

    const svg = document.getElementsByTagName("svg")[0];


    const ge = new GravityEnvironment(svg);

    let st: ReturnType<typeof createAnimLoop> | null = null;

    function setup() {
        if (st)
            st.stop();

        const width = +(svg.getAttribute('width') || 0);
        const height = +(svg.getAttribute('height') || 0);
        // ge.append(new GravityNode(new Vector(30, 30), 10, 500000000));
        const multiplier = config.multiplier;
        const initialVelocity = config.initialVelocity;
        const numberOfNodes = config.numberOfNodes;

        const radius = Math.min(width, height) * config.centerDistance;
        ge.clearNodes();
        const shift = new Vector(0, radius);
        for (let i = 0; i < numberOfNodes; i++) {
            const radiant = i / numberOfNodes * Math.PI * 2;
            const pos = shift.rotate(radiant);
            ge.append(new GravityNode(
                new Vector(width / 2, height / 2).addVector(pos),
                10,
                multiplier,
                pos.setLength(initialVelocity).rotate(Math.PI * 2 * config.initialDirectionDegree / 360))
            );
        }

        const center = new GravityNode(new Vector(width / 2, height / 2), 10, multiplier);
        // center.lockPosition = true;
        ge.append(center);


        // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
        // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
        // ge.append(new GravityNode(new Vector(width - 20, height / 2), 10, multiplier, new Vector(0, -initialVelocity)));


        st = createAnimLoop((control, timestamp, frameDelta, startDelta) => {
            ge.updateNodes(frameDelta);

            // di.innerText = 'since Start:' + (startDelta | 0) + '\n' + JSON.stringify(ge.allNodes, null, 2);
        });

        console.log((ge as any).nodes);

        // setTimeout(() => st.stop(), 50000);
    }

    setup();
});
