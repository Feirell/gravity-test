import { GravityNode } from "./gravity-node.js";

function asymptoticalReachOne(v: number) {
    if (!Number.isFinite(v) || v < 0)
        throw new Error(
            "The given value needs to a number equal or greater than zero but was " +
            v +
            " (" +
            typeof v +
            ")"
        );
    return 1 - 1 / (v + 1);
}

function applyGravityNodeOnSVGCircleNode(gn: GravityNode, circle: SVGCircleElement) {
    circle.setAttribute("r", "" + gn.radius);

    circle.setAttribute("cx", "" + gn.position.x);
    circle.setAttribute("cy", "" + gn.position.y);

    const darkness = 1 - asymptoticalReachOne(gn.density / 25);
    circle.setAttribute("fill", "hsl(30, 50%, " + darkness * 50 + "%)");
}

export class GravityEnvironment {
    private nodes = new Map<GravityNode, SVGCircleElement>();

    constructor(private readonly svgElem: SVGElement) { }

    clearNodes() {
        this.svgElem.innerHTML = "";
        this.nodes = new Map();
    }

    append(node: GravityNode) {
        const correspondingElement = this.addNewCircle(node);
        this.nodes.set(node, correspondingElement);
        return this.allNodes;
    }

    private addNewCircle(gravityNode: GravityNode) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        applyGravityNodeOnSVGCircleNode(gravityNode, circle);

        this.svgElem.appendChild(circle);

        return circle;
    }

    get allNodes() {
        return Array.from(this.nodes.keys());
    }

    private get allCircles() {
        return Array.from(this.nodes.values());
    }

    updateNodes(timeDiff: number) {
        const nodes = this.allNodes;

        for (const node of nodes)
            node.applyForce(node.getForceVectorForNode(nodes))

        for (const node of nodes) {
            node.updateVelocity(timeDiff / 1000);
            node.updatePosition(timeDiff / 1000);
        }

        this.applyGNPropertiesToCircle();
    }

    applyGNPropertiesToCircle() {
        for (const [gn, circle] of this.nodes.entries())
            applyGravityNodeOnSVGCircleNode(gn, circle);
    }
}
