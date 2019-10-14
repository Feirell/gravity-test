import { GravityNode } from "./gravity-node.js";
import { GravityEnvironment } from "./gravity-environment.js";
import { Vector } from "./vector.js";


const speedup = 1;

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

      ts *= speedup;
      fnc(controller, ts, ts - last, ts - start);
      last = ts;

      window.requestAnimationFrame(looper);
    };

    window.requestAnimationFrame(looper);
  });

  return controller;
}

addEventListener("DOMContentLoaded", () => {
  // const di = document.getElementById("debug-info");
  // if (di == null)
  //   throw new Error("could not find debug info");

  const svg = document.getElementsByTagName("svg")[0];

  const width = +(svg.getAttribute('width') || 0);
  const height = +(svg.getAttribute('height') || 0);

  const ge = new GravityEnvironment(svg);
  // ge.append(new GravityNode(new Vector(30, 30), 10, 500000000));
  const multiplier = 10 ** 11;
  const initialVelocity = 11;

  let r = Math.min(width, height) * 0.4;
  let x = 5;

  const shift = new Vector(0, r);
  for (let i = 0; i < x; i++) {
    const radiant = i / x * Math.PI * 2;
    const pos = shift.rotate(radiant);
    ge.append(new GravityNode(
      new Vector(width / 2, height / 2).addVector(pos),
      10,
      multiplier,
      pos.setLength(initialVelocity).rotate(Math.PI * 2 * 90 / 360))
    );
  }

  const center = new GravityNode(new Vector(width / 2, height / 2), 10, multiplier);
  // center.lockPosition = true;
  ge.append(center);


  // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
  // ge.append(new GravityNode(new Vector(20, height / 2), 10, multiplier, new Vector(0, initialVelocity)));
  // ge.append(new GravityNode(new Vector(width - 20, height / 2), 10, multiplier, new Vector(0, -initialVelocity)));


  const st = createAnimLoop((control, timestamp, frameDelta, startDelta) => {
    ge.updateNodes(frameDelta);

    // di.innerText = 'since Start:' + (startDelta | 0) + '\n' + JSON.stringify(ge.allNodes, null, 2);
  });

  // setTimeout(() => st.stop(), 50000);
});
