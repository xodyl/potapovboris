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
            // background.style.setProperty('--dur', pos.y * 0.01);
            background.style.filter = `brightness(90%) blur(${pos.y * 0.01}px)`;
        }
    }
})();


document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".container");

  containers.forEach(container => {
    setupDrag(container);
    setupResize(container);
    randomizePosition(container);
    // adjustContainerSize(container); // Подстроим контейнер по содержимому

    // Кнопка закрытия
    const closeButton = container.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
      container.style.display = "none"; // скрыть контейнер
    });

    // Добавляем обработчик клика, чтобы при нажатии контейнер выходил на верхний слой
    container.addEventListener("click", () => {
      bringContainerToFront(container);
    });
  });

  window.addEventListener("resize", () => {
    containers.forEach(adjustOnResize);
  });

  // Функция для перемещения контейнера на передний план
  function bringContainerToFront(container) {
    containers.forEach(cont => {
      // Сбросить z-index у всех контейнеров
      cont.style.zIndex = "";
    });
    // Установить наибольший z-index для выбранного контейнера
    container.style.zIndex = 9999; // Можно установить любое высокое значение
  }

  function setupDrag(container) {
    const header = container.querySelector(".header");
    let offsetX, offsetY, isDragging = false;

    header.addEventListener("mousedown", (e) => {
      // Установить z-index на передний план сразу при захвате
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

  function setupResize(container) {
    const resizeHandle = container.querySelector(".resize-handle");
    let isResizing = false, startX, startY, startWidth, startHeight;

    // Сохраняем исходные размеры контейнера
    const initialWidth = container.offsetWidth;
    const initialHeight = container.offsetHeight;

    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = container.offsetWidth;
        startHeight = container.offsetHeight;

        function onMouseMove(e) {
            if (!isResizing) return;

            let newWidth = startWidth - (startX - e.clientX);
            let newHeight = startHeight - (startY - e.clientY);

            // Ограничиваем изменения в пределах (минимальный размер, начальный размер)
            if (newWidth >= 150 && newWidth <= initialWidth) {
                container.style.width = `${newWidth}px`;
            }
            if (newHeight >= 100 && newHeight <= initialHeight) {
                container.style.height = `${newHeight}px`;
            }

            keepContainerInBounds(container);
        }

        function onMouseUp() {
            isResizing = false;
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
    adjustContainerSize(container, false); // Убираем автоматическую подстройку размера при ресайзе окна
  }

  // function adjustContainerSize(container, force = true) {
  //   const content = container.querySelector(".content");
  //   if (force) {
  //     container.style.width = `${content.scrollWidth + 10}px`;
  //     container.style.height = `${content.scrollHeight + 40}px`;
  //   }
  // }

  function randomizePosition(container) {
    keepContainerInBounds(container, Math.random() * (window.innerWidth - container.offsetWidth), Math.random() * (window.innerHeight - container.offsetHeight));
  }
});
