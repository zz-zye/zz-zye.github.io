// implements pattern lock feature into nav
// a lot of easter eggs may be added in the future here...

(function () {
  /* elements & config */
  const canvas = document.getElementById("nav-pattern") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const pattern_dot_container = document.querySelector(
    "#nav-dots > ol"
  ) as Element;
  const pattern_dots = pattern_dot_container.children;

  const config = {
    classes: {
      dot_focus: "focus",
      dot_wrong: "wrong",
      nav_small: "small"
    },
    colors: {
      default: "white",
      wrong: "rgb(255, 140, 140)"
    },
    pattern: {
      three_dot_lines: [
        /* list of 3 dots that create a line */
        [0, 1, 2] /* → */,
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6] /* ↓ */,
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8] /* ↘︎ */,
        [2, 4, 6] /* ↙︎ */
      ],
      valid_patterns: [
        /* use [1-9] here instead of [0-8] */
        { valid_pattern: 541263789, link: "/projects" },
        { valid_pattern: 183526794, link: "/projects/pattern" },
        { valid_pattern: 4123658, link: "/about" },
        { valid_pattern: 8563214, link: "/about" }
      ],
      wrong_timeout_ms: 1000
    }
  };

  /* ******************************************************* */
  /* variables */

  /* pattern can be drawn only if enabled */
  let enabled: boolean = true;
  let wrong_timeoutId: number | null = null;

  const dot_xs: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const dot_ys: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let dot_r: number = 0;
  let dot_under_mouse: number | null = null;

  let line_width: number = 0;
  let line_color: string = config.colors.default;

  let mousedown: boolean = false;
  let mouse_x: number = 0;
  let mouse_y: number = 0;

  const pattern: number[] = [];

  const is_dot_used: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];

  /* ******************************************************* */
  /* handling dots */

  function update_dots(): void {
    let rect = pattern_dot_container.getBoundingClientRect();
    let center_x = Math.floor((rect.left + rect.right) / 2);
    let center_y = Math.floor((rect.top + rect.bottom) / 2);

    /* x: 1 2 3 1 2 3 1 2 3
       y: 1 1 1 2 2 2 3 3 3 */
    for (let i = 0; i < 3; i++) {
      dot_xs[3 * i] = rect.left;
      dot_xs[3 * i + 1] = center_x;
      dot_xs[3 * i + 2] = rect.right;

      dot_ys[i] = rect.top;
      dot_ys[3 + i] = center_y;
      dot_ys[6 + i] = rect.bottom;
    }

    dot_r = Math.floor((rect.right - rect.left) * 0.18);
    line_width = Math.floor((rect.right - rect.left) * 0.03);
  }

  function toggle_dot_focus(dot = 0, on = true): void {
    if (on) {
      pattern_dots[dot].classList.add(config.classes.dot_focus);
    } else {
      pattern_dots[dot].classList.remove(config.classes.dot_focus);
    }
  }

  function toggle_dot_wrong(dot = 0, on = true): void {
    if (on) {
      /* could get animated in future (flicker?) */
      pattern_dots[dot].classList.add(config.classes.dot_wrong);
    } else {
      pattern_dots[dot].classList.remove(config.classes.dot_wrong);
    }
  }

  function coords_to_dot(x = 0, y = 0): number | null {
    for (let dot = 0; dot < 9; dot++) {
      let dx = x - dot_xs[dot];
      let dy = y - dot_ys[dot];

      if (dx * dx + dy * dy < dot_r * dot_r) {
        return dot;
      }
    }
    return null;
  }

  /* ******************************************************* */
  /* drawing functions */

  function draw_pattern(): void {
    if (pattern.length <= 1) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(dot_xs[pattern[0]], dot_ys[pattern[0]]);
    for (let i = 1; i < pattern.length; i++) {
      ctx.lineTo(dot_xs[pattern[i]], dot_ys[pattern[i]]);
    }
    ctx.stroke();
  }

  function draw_line_to_mouse(): void {
    if (pattern.length === 0) {
      return;
    }

    ctx.beginPath();
    let dot_last = pattern[pattern.length - 1];
    ctx.moveTo(dot_xs[dot_last], dot_ys[dot_last]);
    ctx.lineTo(mouse_x, mouse_y);
    ctx.stroke();
  }

  /* canvas animation step */
  function draw(): void {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.lineWidth = line_width;
    ctx.strokeStyle = line_color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    draw_pattern();
    if (mousedown) {
      draw_line_to_mouse();
    }
  }

  /* ******************************************************* */
  /* handling the pattern */

  function reset_pattern(): void {
    is_dot_used.fill(false);
    pattern.splice(0, pattern.length);

    for (let i = 0; i < 9; i++) {
      if (i !== dot_under_mouse) {
        toggle_dot_focus(i, false);
      }
      toggle_dot_wrong(i, false);
    }

    line_color = config.colors.default;

    /* cancel 'wrong pattern' timeout */
    if (wrong_timeoutId !== null) {
      clearTimeout(wrong_timeoutId);
      wrong_timeoutId = null;
    }
  }

  /* wrongenize the pattern */
  function wrongify_pattern(): void {
    for (let i = 0; i < 9; i++) {
      if (is_dot_used[i]) {
        toggle_dot_wrong(i, true);
      }
    }
    line_color = config.colors.wrong;
  }

  function pattern_add(dot = 0): void {
    if (is_dot_used[dot]) {
      return;
    }

    if (pattern.length > 0) {
      /* see if current and previous dot are endpoints of a three_dot_line */
      let dot_prev = pattern[pattern.length - 1];

      for (let line of config.pattern.three_dot_lines) {
        if (is_dot_used[line[1]]) continue;

        if (
          (dot === line[0] && dot_prev === line[2]) ||
          (dot === line[2] && dot_prev === line[0])
        ) {
          is_dot_used[line[1]] = true;
          pattern.push(line[1]);
          toggle_dot_focus(line[1], true);
          break;
        }
      }
    }

    is_dot_used[dot] = true;
    pattern.push(dot);
    toggle_dot_focus(dot, true);
  }

  function pattern_to_number(): number {
    /* [0, 1, 6, 4] => 1275 */
    return pattern.reduce((total, cur) => total * 10 + (cur + 1), 0);
  }

  function pattern_to_link(): string | null {
    let pattern_code = pattern_to_number();

    for (let { valid_pattern, link } of config.pattern.valid_patterns) {
      if (pattern_code === valid_pattern) {
        return link;
      }
    }
    return null;
  }

  /* ******************************************************* */
  /* handling mouse */

  function on_mousedown(x = 0, y = 0): void {
    if (!enabled || mousedown) {
      return;
    }
    mouse_x = x;
    mouse_y = y;

    dot_under_mouse = coords_to_dot(mouse_x, mouse_y);
    reset_pattern();

    if (dot_under_mouse !== null) {
      mousedown = true;
      pattern_add(dot_under_mouse);
    }

    window.requestAnimationFrame(draw);
  }

  function on_mousemove(x = 0, y = 0): void {
    if (!enabled) {
      return;
    }
    mouse_x = x;
    mouse_y = y;

    let dot = coords_to_dot(mouse_x, mouse_y);

    /* if mouse leaves dot: shrink */
    if (dot_under_mouse !== null && dot_under_mouse !== dot) {
      if (!is_dot_used[dot_under_mouse]) {
        toggle_dot_focus(dot_under_mouse, false);
      }
      dot_under_mouse = null;
    }
    /* if mouse enters dot: enlarge */
    if (dot !== null && dot_under_mouse === null) {
      toggle_dot_focus(dot, true);
      if (mousedown && !is_dot_used[dot]) {
        pattern_add(dot);
      }
      dot_under_mouse = dot;
    }

    if (mousedown) {
      window.requestAnimationFrame(draw);
    }
  }

  function on_mouseup(): void {
    if (!enabled || !mousedown) {
      return;
    }

    mousedown = false;

    /* ignore 'single dot patterns' */
    if (pattern.length <= 1) {
      reset_pattern();
      window.requestAnimationFrame(draw);
      return;
    }

    let link = pattern_to_link();

    if (link === null) {
      wrongify_pattern();
      wrong_timeoutId = setTimeout(() => {
        reset_pattern();
        window.requestAnimationFrame(draw);
      }, config.pattern.wrong_timeout_ms);
    } else {
      /* move to href */
      window.location.href = link;
    }

    window.requestAnimationFrame(draw);
  }

  /* ******************************************************* */
  /* event listeners */

  canvas.addEventListener("mousedown", function (e) {
    on_mousedown(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("touchstart", function (e) {
    let touches = e.changedTouches;
    let touch = touches[touches.length - 1];
    on_mousedown(touch.clientX, touch.clientY);
  });

  canvas.addEventListener("mousemove", function (e) {
    on_mousemove(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("touchmove", function (e) {
    if (!mousedown) {
      return; /* no need to enlarge dots if not touched */
    }
    e.preventDefault();
    let touches = e.changedTouches;
    let touch = touches[touches.length - 1];
    on_mousemove(touch.clientX, touch.clientY);
  });

  canvas.addEventListener("mouseup", function (e) {
    on_mouseup();
  });
  canvas.addEventListener("touchend", function (e) {
    on_mouseup();
  });

  /* ******************************************************* */

  window.addEventListener("load", function (e) {
    canvas.setAttribute("width", canvas.offsetWidth.toString());
    canvas.setAttribute("height", canvas.offsetHeight.toString());
    update_dots();
    window.requestAnimationFrame(draw);
  });

  window.addEventListener("resize", function (e) {
    canvas.setAttribute("width", canvas.offsetWidth.toString());
    canvas.setAttribute("height", canvas.offsetHeight.toString());
    update_dots();
    window.requestAnimationFrame(draw);
  });
})();
