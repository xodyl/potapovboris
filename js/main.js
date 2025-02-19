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
    const worksLink = document.getElementById("works-link"); // Теперь выбираем по ID
    const main = document.querySelector('main');

    let zIndexCounter = 1; // Глобальный счетчик z-index

    // Исходные данные окон
    const windowData = [
        {
            title: "Boris bold rotated head",
            content: `<video autoplay loop muted playsinline>
                        <source src="static/0001-0021.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "Boris sketchbook mp4",
            content: `<video autoplay loop muted playsinline>
                        <source src="static/sketchbook0001-1173.webm" type="video/webm">
                        error..
                      </video>`
        },
        {
            title: "3DGS Render",
            content: `<canvas id="canvas"></canvas>`
        },
        {
            title: "Bio",
            content: `<div class="text-container">Hi! My name is Boris. (,_, )</div>`
        }
    ];

    function createContainers() {
        // Удаляем старые контейнеры
        document.querySelectorAll('.container').forEach(el => el.remove());

        // Создаем новые
        windowData.forEach(win => {
            const container = document.createElement("div");
            container.classList.add("container");

            container.innerHTML = `
                <div class="header">
                    <span class="title">${win.title}</span>
                    <button class="close-btn">x</button>
                </div>
                <div class="media-content">${win.content}</div>
            `;

            main.appendChild(container);
            setupContainer(container); // Применяем логику к новому контейнеру
        });
    }

    function setupContainer(container) {
        setupDrag(container);
        randomizePosition(container);
        adjustOnResize(container);

        // Кнопка закрытия
        const closeButton = container.querySelector(".close-btn");
        closeButton.addEventListener("click", () => {
            container.remove(); // Полностью удаляем контейнер
        });

        // Выводим контейнер на передний план при клике
        container.addEventListener("mousedown", () => {
            bringContainerToFront(container);
        });

        window.addEventListener("resize", () => adjustOnResize(container));
    }

    // Функция для перемещения контейнера на передний план
    function bringContainerToFront(container) {
        zIndexCounter++; // Увеличиваем глобальный счетчик
        container.style.zIndex = zIndexCounter;
    }

    function setupDrag(container) {
        let offsetX, offsetY, isDragging = false;

        container.addEventListener("mousedown", (e) => {
            if (e.target.closest(".close-btn")) return; // Игнорируем клик по кнопке закрытия

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
        keepContainerInBounds(container, 
            Math.random() * (window.innerWidth - container.offsetWidth), 
            Math.random() * (window.innerHeight - container.offsetHeight)
        );
    }

    // Вешаем обработчик на "works"
    worksLink.addEventListener("click", (event) => {
        event.preventDefault(); // Чтобы не обновлялась страница
        createContainers();
    });

    // Создаем окна при первой загрузке
    createContainers();
});

