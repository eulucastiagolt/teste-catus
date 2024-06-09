{

  if (document.querySelector(".header_search_mobile_action_button")) {
    const toggle_search = document.querySelector(".header_search_mobile_action_button");
    toggle_search.addEventListener('click', () => {
      if (document.querySelector(".mobile_search")) {
        const mobile_search = document.querySelector(".mobile_search");
        mobile_search.classList.toggle('show');
      }
    });
  }

  if (document.querySelector(".header_menu_mobile_action_open") && document.querySelector(".mobile_clode_menu")) {
    const open_menu = document.querySelector(".header_menu_mobile_action_open");
    const close_menu = document.querySelector(".mobile_clode_menu");
    open_menu.addEventListener("click", () => {
      if (document.querySelector(".header_menu_nav")) {
        const mobile_search = document.querySelector(".header_menu_nav");
        mobile_search.classList.add("show");
      }
    });
    close_menu.addEventListener("click", () => {
      if (document.querySelector(".header_menu_nav")) {
        const mobile_search = document.querySelector(".header_menu_nav");
        mobile_search.classList.remove("show");
      }
    });
  }

  new Splide(".splide", {
    type: "loop",
    perPage: 4,
    autoWidth: true,
    pagination: false,
    breakpoints: {
      640: {
        perPage: 2,
      },
    },
  }).mount();
}