// Áp dụng bảo vệ ảnh toàn cục - chặn copy, download, right-click
export function initImageProtection() {
  if (typeof window === "undefined") return;

  // Chặn right-click trên ảnh
  document.addEventListener(
    "contextmenu",
    (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // Chặn drag-and-drop ảnh
  document.addEventListener(
    "dragstart",
    (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // Chặn copy ảnh
  document.addEventListener(
    "copy",
    (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    },
    false
  );

  // Chặn save image (Ctrl/Cmd + S, S key)
  document.addEventListener(
    "keydown",
    (e) => {
      const target = document.activeElement as HTMLElement;
      if (target?.tagName === "IMG") {
        // Chặn S key
        if (e.key === "s" || e.key === "S") {
          e.preventDefault();
          return false;
        }
      }
    },
    false
  );

  // Thêm draggable="false" cho tất cả ảnh hiện có
  document.querySelectorAll("img").forEach((img) => {
    img.draggable = false;
    img.oncontextmenu = () => false;
    img.style.userSelect = "none";
    img.style.WebkitUserSelect = "none";
  });

  // Observer để áp dụng cho ảnh được tải động
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const element = node as HTMLElement;
          if (element.tagName === "IMG") {
            element.draggable = false;
            element.oncontextmenu = () => false;
            element.style.userSelect = "none";
            element.style.WebkitUserSelect = "none";
          }
          // Cũng check các ảnh con nếu có
          element.querySelectorAll("img").forEach((img) => {
            img.draggable = false;
            img.oncontextmenu = () => false;
            img.style.userSelect = "none";
            img.style.WebkitUserSelect = "none";
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
