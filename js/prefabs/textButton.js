prefabs.textButton = (parent, args, text, onclick, id) => {
    let button;
    parent.append(button = controls.button({
        fill: "#fff4",
        onclick,
        ...args
    }), id)
    button.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    button.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        text,
    }), "text")
    return button;
}