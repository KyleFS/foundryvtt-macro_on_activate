Hooks.on("init", () => {
    game.settings.register("macro-on-activate", "sceneData", {
        name: "Scene Data",
        hint: false,
        scope: "world",
        config: false,
        default: {},
        type: Object
    })
})

Hooks.on("canvasReady", function() {
    let sceneID = canvas.scene.data._id;

    let currentSettings = game.settings.get("macro-on-activate", "sceneData");
    if( currentSettings[sceneID] === "undefined"){
        return;
    }

    let macroID = currentSettings[sceneID];

    if( typeof macroID === undefined || macroID == 0 ) {
        return;
    }

    let filteredMacro = game.macros.filter(m => m._id === macroID)[0];

    if ( typeof filteredMacro === undefined ) {
        return;
    }

    filteredMacro.execute();
});

Hooks.on("renderSceneConfig", async (app, html) => {
    let macroList = game.macros;
    let sceneID = app.object.data._id;
    let settings = game.settings.get("macro-on-activate", "sceneData");

    let sceneData = {
        macroList: macroList,
        currentMacro: settings[sceneID]
    };

    renderTemplate( 'modules/macro-on-activate/templates/sceneConfig.html', sceneData ).then( (gui) => {
        html.find('button[type="submit"]').before(gui);

        document.querySelector('.scene-sheet button[type="submit"]').addEventListener('click', function (event) {
            let macroDropdown = document.getElementById('macroList');
            let macroID = macroDropdown.options[macroDropdown.selectedIndex].value;

            settings[sceneID] = macroID
            game.settings.set("macro-on-activate", "sceneData", settings);
        }, false);
    });
})

