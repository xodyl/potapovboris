import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@1.2.3";

export function initialize(canvas) {
    const renderer = new SPLAT.WebGLRenderer(canvas);
    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const controls = new SPLAT.OrbitControls(camera, canvas);

    async function main() {
        const url = '/potapovboris/resize.splat';
        await SPLAT.Loader.LoadAsync(url, scene, () => {});

        const handleResize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
        };

        const frame = () => {
            controls.update();
            renderer.render(scene, camera);

            requestAnimationFrame(frame);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        requestAnimationFrame(frame);
    }

    main();
}
