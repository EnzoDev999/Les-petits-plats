export const openCloseDropdown = () => {
  const dropdownButtons = document.querySelectorAll(".dropdown_btn");
  let chevron;

  function toggleDropdown(btn) {
    const dropdownContent = btn.nextElementSibling;
    chevron = btn.querySelector(".fa-chevron-down");
    chevron.classList.toggle("rotate");
    dropdownContent.classList.toggle("active");
  }

  function closeOtherDropdowns(clickedButton) {
    dropdownButtons.forEach((btn) => {
      chevron = btn.querySelector(".fa-chevron-down");
      if (btn !== clickedButton) {
        chevron.classList.remove("rotate");
        btn.nextElementSibling.classList.remove("active");
      }
    });
  }

  function focusableElements(btn) {
    const dropdownContent = btn.nextElementSibling;
    const focusableElements = dropdownContent.querySelectorAll(
      "input, button, li, label"
    );

    dropdownContent.classList.contains("active")
      ? focusableElements.forEach((element) =>
          element.setAttribute("tabindex", "0")
        )
      : focusableElements.forEach((element) =>
          element.setAttribute("tabindex", "-1")
        );
  }

  dropdownButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleDropdown(btn);
      closeOtherDropdowns(btn);
      focusableElements(btn);
    });
  });
};
