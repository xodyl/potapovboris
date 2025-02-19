import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@1.2.3";

const canvas = document.getElementById("canvas");
const dataContainer = document.getElementById('data');

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);


async function main() {
    const url = '/potapovboris/out_resize.splat'
    await SPLAT.Loader.LoadAsync(url, scene, () => {});
    const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
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
