(function() {
    var mousePos;

    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 100);

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        var pos = mousePos;
        if (!pos) {
        }
        else {
            let background = document.querySelector('.video-bg');
            background.style.filter = `brightness(90%) blur(${pos.y * 0.01}px)`;
        }
    }
})();


document.addEventListener("DOMContentLoaded", () => {
    const worksLink = document.getElementById("works-link");
    const bioLink = document.getElementById("bio-link");
    const main = document.querySelector("main");

    let zIndexCounter = 1;

    const windowData = [
        {
            title: "Bold rotated head",
            content: `<video autoplay loop muted playsinline>
                        <source src="static/0001-0021.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "Boris tag",
            content: `<video autoplay loop muted playsinline>
                        <source src="static/boris_tag0001-0013.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "Aphex demon",
            content: `<video autoplay loop muted playsinline>
                        <source src="static/demon0001-0022.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "3DGS Render",
            content: `<canvas id="canvas"></canvas>`
        }
    ];

    let activeContainer = null;

    function createContainers() {
        windowData.forEach(win => {
            const existingContainer = document.querySelector(`.container[data-title="${win.title}"]`);
            if (existingContainer) {
                animateMove(existingContainer);
            } else {
                createWindow(win.title, win.content);
            }
        });
    }

    function createWindow(title, content) {
        const container = document.createElement("div");
        container.classList.add("container");
        container.setAttribute("data-title", title);

        // Добавляем хедер с кнопкой
        container.innerHTML = `
            <div class="header">
                <span class="title">${title}</span>
                <button class="close-btn">x</button>
            </div>
        `;

        // Создаем канвас только для "3DGS Render", добавляем его в контейнер напрямую
        if (title === "3DGS Render") {
            const canvas = document.createElement("canvas");
            canvas.id = "canvas";
            container.appendChild(canvas); // Добавляем канвас прямо в контейнер
            setTimeout(() => {
                initialize3DRenderer(canvas); // Инициализация рендера
            }, 0);
        } else {
            // Для других типов контента оставляем старую логику
            const mediaContent = document.createElement("div");
            mediaContent.classList.add("media-content");
            mediaContent.innerHTML = content;
            container.appendChild(mediaContent);
        }

        main.appendChild(container);
        setupContainer(container);
    }


    let prevContainer = null; 

    function setupContainer(container) {
        setupDrag(container);
        randomizePosition(container);
        adjustOnResize(container);

        const closeButton = container.querySelector(".close-btn");
        closeButton.addEventListener("click", () => {
            container.remove();
        });

        container.addEventListener("mousedown", () => {
            bringContainerToFront(container);
        });

        window.addEventListener("resize", () => adjustOnResize(container));

        container.addEventListener("dblclick", () => {
            if (prevContainer && prevContainer !== container) {
                resetContainerPosition(prevContainer); 
            }

            animateMoveToCenter(container);
            prevContainer = activeContainer; 
            activeContainer = container; 
        });
    }

    function bringContainerToFront(container) {
        zIndexCounter++;
        container.style.zIndex = zIndexCounter;
    }

    function setupDrag(container) {
        let offsetX, offsetY, isDragging = false;

        container.addEventListener("mousedown", (e) => {
            if (e.target.closest(".close-btn")) return;

            bringContainerToFront(container);
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;

            function onMouseMove(e) {
                if (!isDragging) return;
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                keepContainerInBounds(container, newX, newY);
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    function keepContainerInBounds(container, x = container.offsetLeft, y = container.offsetTop) {
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;
        container.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        container.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }

    function adjustOnResize(container) {
        keepContainerInBounds(container);
    }

    function randomizePosition(container) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const maxOffsetX = (window.innerWidth - container.offsetWidth) / 4;
        const maxOffsetY = (window.innerHeight - container.offsetHeight) / 4;

        const randomX = centerX - container.offsetWidth / 2 + (Math.random() - 0.5) * 2 * maxOffsetX;
        const randomY = centerY - container.offsetHeight / 2 + (Math.random() - 0.5) * 2 * maxOffsetY;

        keepContainerInBounds(container, randomX, randomY);
    }

    function animateMove(container) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const maxOffsetX = (window.innerWidth - container.offsetWidth) / 4;
        const maxOffsetY = (window.innerHeight - container.offsetHeight) / 4;

        const newX = centerX - container.offsetWidth / 2 + (Math.random() - 0.5) * 2 * maxOffsetX;
        const newY = centerY - container.offsetHeight / 2 + (Math.random() - 0.5) * 2 * maxOffsetY;

        container.style.transition = "left 0.5s ease, top 0.5s ease";
        keepContainerInBounds(container, newX, newY);

        setTimeout(() => {
            container.style.transition = "";
        }, 500);
    }

    let initialWidth = null;
    let initialHeight = null;
    let initialPosition = null;

    function animateMoveToCenter(container) {
        const title = container.querySelector('.title').textContent;
        const containerRect = container.getBoundingClientRect();
        const windowCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const isMaximized = container.offsetWidth === 480 && container.offsetHeight === 480;

        if (!isMaximized) {
            initialWidth = container.offsetWidth;
            initialHeight = container.offsetHeight;
            initialPosition = { x: container.offsetLeft, y: container.offsetTop };
        
            const moveDuration = 1; 
            const easing = "ease"; 

            container.style.transition = `width ${moveDuration}s ${easing}, height ${moveDuration}s ${easing}, left ${moveDuration}s ${easing}, top ${moveDuration}s ${easing}`;
            container.style.width = `480px`;
            container.style.height = `480px`;

            const offsetX = (window.innerWidth - 480) / 2;
            const offsetY = (window.innerHeight - 480) / 2;

            container.style.left = `${offsetX}px`;
            container.style.top = `${offsetY}px`;

            activeContainer = container;

            setTimeout(() => {
                container.style.transition = ""; 
            }, moveDuration * 1000);
        } else {
            resetContainerPosition(container);
        }
    }

    function resetContainerPosition(container) {
        const moveDuration = 1; 
        const easing = "ease"; 

        container.style.transition = `width ${moveDuration}s ${easing}, height ${moveDuration}s ${easing}, left ${moveDuration}s ${easing}, top ${moveDuration}s ${easing}`;
        container.style.width = `${initialWidth}px`;
        container.style.height = `${initialHeight}px`;

        const offsetX = initialPosition.x;
        const offsetY = initialPosition.y;

        container.style.left = `${offsetX}px`;
        container.style.top = `${offsetY}px`;

        setTimeout(() => {
            container.style.transition = ""; 
        }, moveDuration * 1000);
    }

    function initialize3DRenderer(canvas) {
        import("./module.js")
            .then((module) => {
                if (module.initialize) {
                    module.initialize(canvas);
                } else {
                    console.error("Функция initialize не найдена в module.js");
                }
            })
            .catch((err) => {
                console.error("Ошибка загрузки 3DGS:", err);
            });
    }

    worksLink.addEventListener("click", (event) => {
        event.preventDefault();
        createContainers();
    });

    bioLink.addEventListener("click", (event) => {
        event.preventDefault();
        createBio();
    });

    createContainers();
});
