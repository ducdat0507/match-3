popups.profile = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Profile";
    
    ButtonWithText(popup.$content, {
        position: Ex(30, 40, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Statistics", () => {
        popups.stats(popup);
    });

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
}