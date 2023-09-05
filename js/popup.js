var popups = {};

function doPopup() {
    let popup;
    scene.append(popup = controls.rect({
        position: Ex(0, 0),
        size: Ex(0, 0, 100, 100),
        fill: "#000a",
        close() {
            if (!isAnimating) {
                isAnimating = true;
                outtro();
            }
        }
    }))
    popup.append(controls.rect({
        position: Ex(-280, 0, 50),
        size: Ex(560, 0, 0, 100),
        fill: "#444",
        alpha: 0,
    }), "back")
    popup.append(controls.rect({
        position: Ex(-276, 0, 50),
        size: Ex(552, 0, 0, 100),
        fill: "#0007",
        alpha: 0,
    }), "content")
    popup.append(controls.rect({
        position: Ex(-280, 0, 50),
        size: Ex(560, 0),
        fill: "#777",
    }), "fill")

    let isAnimating = true;

    function setContentAlpha(value) {
        popup.$back.alpha = popup.$content.alpha = value;
        popup.$content.clickthrough = value == 0;
    }

    function intro() {
        function anim1(x) {
            popup.$fill.size.ey = 100 * clamp01(x / 150);
            popup.fill = "rgba(0, 0, 0, " + clamp01(x / 150) * .75 + ")";
            if (x >= 150) {
                setContentAlpha(1);
                startAnimation(anim2);
                return true;
            }
        }
        function anim2(x) {
            popup.$fill.position.ey = 100 * clamp01(x / 150);
            if (x >= 150) {
                isAnimating = false;
                return true;
            }
        }
        startAnimation(anim1);
    }

    function outtro() {
        function anim1(x) {
            popup.$fill.position.ey = 100 * (1 - clamp01(x / 150));
            if (x >= 150) {
                setContentAlpha(0);
                mainCanvas.style.cursor = "";
                startAnimation(anim2);
                return true;
            }
        }
        function anim2(x) {
            popup.$fill.size.ey = 100 * (1 - clamp01(x / 150));
            popup.fill = "rgba(0, 0, 0, " + (1 - clamp01(x / 150)) * .75 + ")";
            if (x >= 150) {
                scene.remove(popup);
                isAnimating = false;
                return true;
            }
        }
        startAnimation(anim1);
    }

    intro();

    return popup;
}