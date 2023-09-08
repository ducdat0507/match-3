popups.miscmenu = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Menu";
    
    ButtonWithText(popup.$content, {
        position: Ex(30, -80, 0, 25),
        size: Ex(-60, 60, 100),
    }, "How to Play", () => {
        popups.help(popup);
    });
    
    ButtonWithText(popup.$content, {
        position: Ex(30, 0, 0, 25),
        size: Ex(-60, 60, 100),
    }, "About", () => {
        popups.about(popup);
    });

    

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
    
    return popup;
}
