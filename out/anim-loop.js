export function createAnimLoop(fnc, factor = 1) {
    let run = true;
    const controller = {
        stop: () => run = false
    };
    window.requestAnimationFrame(ts => {
        ts *= factor;
        const start = ts;
        let last = ts;
        const looper = (ts) => {
            if (!run)
                return;
            ts *= factor;
            fnc(controller, ts, ts - last, ts - start);
            last = ts;
            window.requestAnimationFrame(looper);
        };
        window.requestAnimationFrame(looper);
    });
    return controller;
}
