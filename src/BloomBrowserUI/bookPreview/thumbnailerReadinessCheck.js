window.setTimeout(() => {
    console.log("Setting...");
    const image = document.querySelector(".bloom-imageContainer img");
    console.log("Got image");
    image.onload = () => {
        console.log("Firing");
        const container = document.querySelector(".bloom-imageContainer");
        var div = document.createElement("div");
        div.id = "loadedIndicator";
        div.style = "display:none";
        container.appendChild(div);
    };
}, 0);
