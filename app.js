/**
 * Kinsppl Resume Review - Standalone Vanilla JS
 * Zero dependencies, pure static HTML/CSS/JS for GitHub Pages
 */

document.addEventListener("DOMContentLoaded", () => {
  initSliders();
  initBookingDialog();
  initEmailCopy();
});

// ==========================================
// 1. Interactive Resume Comparison Sliders
// ==========================================
function initSliders() {
  const sliders = document.querySelectorAll('[role="slider"]');

  sliders.forEach((slider) => {
    let position = 50;
    let isDragging = false;

    // Direct element references
    const children = slider.children;
    const beforeImageWrapper = children[1];
    const dividerHandle = children[2];
    const beforeBadge = children[3];
    const afterBadge = children[4];

    function setPosition(newPos) {
      position = Math.max(0, Math.min(100, newPos));

      if (beforeImageWrapper) {
        beforeImageWrapper.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      }
      if (dividerHandle) {
        dividerHandle.style.left = `${position}%`;
      }
      if (beforeBadge) {
        beforeBadge.style.opacity = position < 14 ? "0" : "1";
      }
      if (afterBadge) {
        afterBadge.style.opacity = position > 86 ? "0" : "1";
      }

      slider.setAttribute("aria-valuenow", Math.round(position));
    }

    function handlePointer(clientX) {
      const rect = slider.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = clientX - rect.left;
      setPosition((x / rect.width) * 100);
    }

    // Mouse & Touch Pointer Handlers
    function onStart(e) {
      isDragging = true;
      slider.focus();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handlePointer(clientX);
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handlePointer(clientX);
    }

    function onEnd() {
      if (isDragging) {
        isDragging = false;
      }
    }

    slider.addEventListener("mousedown", onStart);
    slider.addEventListener("touchstart", onStart, { passive: false });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    // Keyboard Accessibility (WCAG 2.1)
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition(position - 5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition(position + 5);
      } else if (e.key === "Home") {
        e.preventDefault();
        setPosition(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setPosition(100);
      }
    });

    // Initialize initial state
    setPosition(50);
  });
}

// ==========================================
// 2. Two-Step Booking Dialog Modal
// ==========================================
function initBookingDialog() {
  const dialog = document.getElementById("booking-dialog");
  if (!dialog) return;

  const btnClose = document.getElementById("btn-close-dialog");
  const step1 = document.getElementById("booking-step-1");
  const step2 = document.getElementById("booking-step-2");
  const stepBadge = document.getElementById("booking-step-badge");
  const modalTitle = document.getElementById("booking-modal-title");
  const btnContinue = document.getElementById("btn-continue-step2");
  const btnContinueText = document.getElementById("btn-continue-text");
  const btnBack = document.getElementById("btn-back-step1");
  const checklistBtns = document.querySelectorAll(".checklist-btn");
  const calendarLink = document.getElementById("btn-open-calendar-link");

  let checkedState = [false, false];

  function updateChecklistUI() {
    checklistBtns.forEach((btn, index) => {
      const isChecked = checkedState[index];
      const indicator = btn.querySelector(".checkbox-indicator");
      btn.setAttribute("aria-checked", isChecked ? "true" : "false");

      if (isChecked) {
        btn.classList.add("border-accent/35", "bg-accent-tint/85");
        btn.classList.remove("border-black/[0.07]", "bg-white/85");
        if (indicator) {
          indicator.classList.add("border-accent", "bg-accent", "text-white");
          indicator.classList.remove("border-black/20", "bg-white", "text-transparent");
        }
      } else {
        btn.classList.remove("border-accent/35", "bg-accent-tint/85");
        btn.classList.add("border-black/[0.07]", "bg-white/85");
        if (indicator) {
          indicator.classList.remove("border-accent", "bg-accent", "text-white");
          indicator.classList.add("border-black/20", "bg-white", "text-transparent");
        }
      }
    });

    const allChecked = checkedState.every(Boolean);
    if (btnContinueText) {
      btnContinueText.textContent = allChecked ? "Continue to calendar" : "Continue anyway";
    }
  }

  function goToStep(step) {
    if (step === 1) {
      if (step1) step1.classList.remove("hidden");
      if (step2) step2.classList.add("hidden");
      if (stepBadge) stepBadge.textContent = "1 / 2";
      if (modalTitle) modalTitle.textContent = "Quick check before you book";
    } else {
      if (step1) step1.classList.add("hidden");
      if (step2) step2.classList.remove("hidden");
      if (stepBadge) stepBadge.textContent = "2 / 2";
      if (modalTitle) modalTitle.textContent = "Choose your 10-minute slot";
    }
  }

  function openDialog() {
    goToStep(1);
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function closeDialog() {
    if (dialog.open) {
      dialog.close();
    }
  }

  // Open modal triggers across header, hero, and bottom CTA
  const triggerBtns = document.querySelectorAll("[data-book-trigger]");
  triggerBtns.forEach((btn) => {
    btn.addEventListener("click", openDialog);
  });

  // Checkbox buttons
  checklistBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      checkedState[index] = !checkedState[index];
      updateChecklistUI();
    });
  });

  // Continue to Step 2
  if (btnContinue) {
    btnContinue.addEventListener("click", () => goToStep(2));
  }

  // Back to Step 1
  if (btnBack) {
    btnBack.addEventListener("click", () => goToStep(1));
  }

  // Close buttons
  if (btnClose) {
    btnClose.addEventListener("click", closeDialog);
  }

  // Backdrop click closes dialog
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeDialog();
    }
  });

  // Calendar external link closes dialog
  if (calendarLink) {
    calendarLink.addEventListener("click", closeDialog);
  }
}

// ==========================================
// 3. One-Click Email Copy Feedback
// ==========================================
function initEmailCopy() {
  const btnCopy = document.getElementById("btn-copy-email");
  if (!btnCopy) return;

  const emailToCopy = "contact@kinsppl.ca";
  const originalHTML = btnCopy.innerHTML;

  btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      btnCopy.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-ok" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>
        <span class="text-ok font-semibold">Copied!</span>
      `;
      setTimeout(() => {
        btnCopy.innerHTML = originalHTML;
      }, 2000);
    } catch (err) {
      // Fallback
      const input = document.createElement("input");
      input.value = emailToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);

      btnCopy.textContent = "Copied!";
      setTimeout(() => {
        btnCopy.innerHTML = originalHTML;
      }, 2000);
    }
  });
}
