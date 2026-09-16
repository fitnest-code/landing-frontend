/** Lock page scroll without unmounting sticky headers. Supports nested locks. */
let lockCount = 0;

export function lockBodyScroll() {
  const { body, documentElement } = document;

  if (lockCount === 0) {
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.dataset.scrollLockY = String(scrollY);
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;
}

export function unlockBodyScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const { body, documentElement } = document;
  const scrollY = Number(body.dataset.scrollLockY || "0");

  documentElement.style.overflow = "";
  body.style.overflow = "";
  body.style.paddingRight = "";
  delete body.dataset.scrollLockY;

  // Restore in case a browser jumped scroll while locked.
  window.scrollTo(0, scrollY);
}
