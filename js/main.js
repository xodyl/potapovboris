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
            tags: ["animations"],
            content: `<video autoplay loop muted playsinline>
                        <source src="static/0001-0021.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "Boris tag",
            tags: ["animations"],
            content: `<video autoplay loop muted playsinline>
                        <source src="static/boris_tag0001-0013.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "Aphex demon",
            tags: ["animations"],
            content: `<video autoplay loop muted playsinline>
                        <source src="static/demon0001-0022.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "3DGS Render",
            tags: ["3DGS"],
            content: `<canvas id="canvas"></canvas>`
        },
        {
            title: "Bio",
            tags: [], 
            content: `<div class="text-container">Hi! My name is Boris. (,_, )</div>`
        }
    ];

    const tags = ["all", "drawings", "music", "3DGS", "posts", "animations"];
    const tagContainer = document.getElementById("header-tag-container");

    tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "header-tag";
        span.textContent = tag;
        span.onclick = () => toggleTag(span);
        tagContainer.appendChild(span);
    });

    const tag_all = document.querySelectorAll(".header-tag")[0];
    tag_all.classList.add("active");

    function toggleTag(element) {
        const isAll = element.textContent === "all";
        const tags = document.querySelectorAll(".header-tag");
        
        if (isAll) {
            tags.forEach(tag => tag.classList.remove("active"));
            element.classList.add("active");
            filterContainers();
        } else {
            document.querySelector(".header-tag:nth-child(1)").classList.remove("active");
            element.classList.toggle("active");
            filterContainers(); 
        }

        if (![...tags].some(tag => tag !== tags[0] && tag.classList.contains("active"))) {
            tags[0].classList.add("active");
        }

    filterContainers();

    }

    function filterContainers() {
        const activeTags = Array.from(document.querySelectorAll(".header-tag.active"))
            .map(tag => tag.textContent.toLowerCase());

        const existingContainers = document.querySelectorAll(".container");

        existingContainers.forEach(container => {
            const title = container.getAttribute("data-title");
            const containerData = windowData.find(win => win.title === title);
            
            if (!containerData) {
                container.remove(); 
                return;
            }

            const containerTags = containerData.tags.map(tag => tag.toLowerCase());

            if (activeTags.includes("all") || activeTags.some(tag => containerTags.includes(tag))) {
                // Контейнер уже есть, ничего не делаем
            } else {
                container.remove(); 
            }
        });

        windowData.forEach(win => {
            const containerExists = document.querySelector(`.container[data-title="${win.title}"]`);
            const containerTags = win.tags.map(tag => tag.toLowerCase());

            if (!containerExists && (activeTags.includes("all") || activeTags.some(tag => containerTags.includes(tag)))) {
                createWindow(win.title, win.content);
            }
        });
    }

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

    function createBio() {
        const existingBio = document.querySelector('.container[data-title="Bio"]');
        if (existingBio) {
            animateMove(existingBio);
            bringContainerToFront(existingBio);
        } else {
            const bioData = windowData.find(win => win.title === "Bio");
            createWindow(bioData.title, bioData.content);
            bringContainerToFront(existingBio);
        }
    }

    function createWindow(title, content) {
        const container = document.createElement("div");
        container.classList.add("container");
        container.setAttribute("data-title", title);

        // Найти теги для данного окна
        const windowTags = windowData.find(win => win.title === title)?.tags || [];
        container.dataset.tags = windowTags.join(",");

        container.innerHTML = `
            <div class="header">
                <span class="title">${title}</span>
                <button class="close-btn">x</button>
            </div>
        `;

        if (title === "3DGS Render") {
            const canvas = document.createElement("canvas");
            canvas.id = "canvas";
            container.appendChild(canvas);
            setTimeout(() => {
                initialize3DRenderer(canvas);
            }, 0);
        } else {
            const mediaContent = document.createElement("div");
            mediaContent.classList.add("media-content");
            mediaContent.innerHTML = content;
            container.appendChild(mediaContent);
        }

        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("tags-container");

        windowTags.forEach(tag => {
            const tagElement = document.createElement("span");
            tagElement.className = "tag";
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        container.appendChild(tagsContainer);

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

            const canvas = container.querySelector("canvas");
            if (canvas) {
                initialize3DRenderer(canvas);
            }        
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
        
            const moveDuration = 0.5; 
            const easing = "ease"; 

            container.style.transition = `width ${moveDuration}s ${easing}, height ${moveDuration}s ${easing}, left ${moveDuration}s ${easing}, top ${moveDuration}s ${easing}`;
            container.style.width = `480px`;
            container.style.height = `480px`;

            const offsetX = (window.innerWidth - 480) / 2;
            const offsetY = (window.innerHeight - 480) / 2;

            container.style.left = `${offsetX}px`;
            container.style.top = `${offsetY}px`;

            activeContainer = container;
            
            const canvas = container.querySelector("canvas");
            if (canvas) {
                initialize3DRenderer(canvas);
            }

            setTimeout(() => {
                container.style.transition = ""; 
            }, moveDuration * 1000);
        } else {
            resetContainerPosition(container);
        }
    }

    function resetContainerPosition(container) {
        const moveDuration = 0.5; 
        const easing = "ease"; 

        container.style.transition = `width ${moveDuration}s ${easing}, height ${moveDuration}s ${easing}, left ${moveDuration}s ${easing}, top ${moveDuration}s ${easing}`;
        container.style.width = `${initialWidth}px`;
        container.style.height = `${initialHeight}px`;

        const offsetX = initialPosition.x;
        const offsetY = initialPosition.y;

        container.style.left = `${offsetX}px`;
        container.style.top = `${offsetY}px`;

        const canvas = container.querySelector("canvas");
        if (canvas) {
            initialize3DRenderer(canvas);
        }

        setTimeout(() => {
            container.style.transition = ""; 
        }, moveDuration * 1000);
    }

    let currentRender = null;

    function initialize3DRenderer(canvas) {
        if (currentRender) {
            currentRender.stop();  // Остановка предыдущего рендера
        }

        // Обновляем размеры канваса
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Перезапуск рендера
        import("./module.js")
            .then((module) => {
                if (module.initialize) {
                    module.initialize(canvas); // Перезапускаем рендер
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
