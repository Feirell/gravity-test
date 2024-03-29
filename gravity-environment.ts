import { GravityNode } from "./gravity-node.js";

function asymptoticalReachOne(v: number) {
    if (!Number.isFinite(v) || v < 0)
        throw new Error("The given value needs to a number equal or greater than zero but was " + v + " (" + typeof v + ")");

    return 1 - 1 / (v + 1);
}

function applyGravityNodeOnSVGPathNode(gn: GravityNode, path: SVGPolylineElement) {
    const points = Array.from(gn.tail).map(v => v.x + ',' + v.y).join(' ');
    path.setAttribute("points", "" + points);
    path.setAttribute("fill", "none");
    // path.setAttribute("stroke", "hsl(30, 50%, 20%)");
}

function applyGravityNodeOnSVGCircleNode(gn: GravityNode, circle: SVGCircleElement) {
    circle.setAttribute("r", "" + gn.radius);

    circle.setAttribute("cx", "" + gn.position.x);
    circle.setAttribute("cy", "" + gn.position.y);

    const darkness = 1 - asymptoticalReachOne(gn.density / 25);
    // circle.setAttribute("fill", "hsl(30, 50%, " + darkness * 50 + "%)");
}

interface AssociatedElements {
    circle: SVGCircleElement,
    polyline: SVGPolylineElement
}

export class GravityEnvironment {
    private nodes = new Map<GravityNode, AssociatedElements>();

    constructor(private readonly svgElem: SVGElement) { }

    clearNodes() {
        this.svgElem.innerHTML = "";
        this.nodes = new Map();
    }

    append(node: GravityNode) {
        if (this.nodes.has(node))
            return false;

        this.nodes.set(node, {
            circle: this.addNewCircle(node),
            polyline: this.addNewTail(node)
        });

        return true;
    }

    removeNode(node: GravityNode) {
        if (!this.nodes.has(node))
            return false;

        this.nodes.delete(node);
        return true;
    }

    private addNewCircle(gravityNode: GravityNode) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        applyGravityNodeOnSVGCircleNode(gravityNode, circle);

        this.svgElem.appendChild(circle);

        return circle;
    }

    private addNewTail(gravityNode: GravityNode) {
        const tail = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

        applyGravityNodeOnSVGPathNode(gravityNode, tail);

        this.svgElem.appendChild(tail);

        return tail;
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
        for (const [gn, { polyline, circle }] of this.nodes.entries()) {
            applyGravityNodeOnSVGCircleNode(gn, circle);
            applyGravityNodeOnSVGPathNode(gn, polyline);
        }
    }
}
