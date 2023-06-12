(function () {
  /* add scrolling effect to titles*/
  const main = document.querySelector("main") as HTMLElement;
  const sections = document.getElementsByTagName("section");
  const titles = document.getElementsByTagName("h2");

  if (sections.length >= 3 && titles.length >= 3) {
    main.addEventListener("scroll", () => {
      for (let i = 0; i < 3; i++) {
        let title_y =
          main.scrollTop - sections[i].offsetTop - sections[i].offsetHeight;
        titles[i].style.top = title_y.toString() + "px";
      }
    });
  }
})();
