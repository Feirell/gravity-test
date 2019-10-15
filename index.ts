import { createDetailedConfig, createConfigInterface } from "./config-helper.js";
import { createAnimLoop } from "./anim-loop.js";
import { GravityNode } from "./gravity-node.js";
import { GravityEnvironment } from "./gravity-environment.js";
import { Vector } from "./vector.js";

const detailedConfig = createDetailedConfig({
    speedup: 1,
    multiplier: 10 ** 5,
    initialVelocity: 80,
    numberOfNodes: 12,
    centerDistance: {
        value: 0.4,
        min: 0.05,
        max: 0.5,
        step: 0.05
    },
    initialDirectionDegree: 90
});


addEventListener("DOMContentLoaded", () => {
    // const di = document.getElementById("debug-info");
    // if (di == null)
    //   throw new Error("could not find debug info");

    createConfigInterface(detailedConfig, (name, newValue) => {
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
        const multiplier = detailedConfig.multiplier.value;
        const initialVelocity = detailedConfig.initialVelocity.value;
        const numberOfNodes = detailedConfig.numberOfNodes.value;

        const radius = Math.min(width, height) * detailedConfig.centerDistance.value;
        ge.clearNodes();
        const shift = new Vector(0, radius);
        for (let i = 0; i < numberOfNodes; i++) {
            const radiant = i / numberOfNodes * Math.PI * 2;
            const pos = shift.rotate(radiant);
            ge.append(new GravityNode(
                new Vector(width / 2, height / 2).addVector(pos),
                10,
                multiplier,
                pos.setLength(initialVelocity).rotate(Math.PI * 2 * detailedConfig.initialDirectionDegree.value / 360))
            );
        }

        const center = new GravityNode(new Vector(width / 2, height / 2), 10, (10 ** 8) * multiplier);
        // center.lockPosition = true;
        ge.append(center);


        // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
        // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
        // ge.append(new GravityNode(new Vector(width - 20, height / 2), 10, multiplier, new Vector(0, -initialVelocity)));


        st = createAnimLoop((control, timestamp, frameDelta, startDelta) => {
            ge.updateNodes(frameDelta);

            // di.innerText = 'since Start:' + (startDelta | 0) + '\n' + JSON.stringify(ge.allNodes, null, 2);
        }, detailedConfig.speedup.value);

        console.log((ge as any).nodes);

        // setTimeout(() => st.stop(), 50000);
    }

    setup();
});
