
window.addEventListener('load', () => {
    var hydra = new Hydra({
        canvas: document.getElementById("hydraCanvas"),
        detectAudio: false,
        width: window.innerWidth,
        height: window.innerHeight
    });


    setResolution(10,10);
    const idA = Math.floor(Math.random() * Anim.length)
    console.log(idA);
    Anim[idA]();


    const elStats = document.getElementById("server_stats");
    const elSound = document.getElementById("current_sound");

    const statsListener =
          new IcecastMetadataStats(
              "https://giss.tv:667/ganuritov.ogg",
              {
                  interval: 30,
                  sources: [
                      "ogg",
                      "icestats",
                  ],
                  onStats: (stats) => {
                      stats = verificar_live(stats);
                      console.log(stats);
                      info_server(stats, elStats);
                      info_current_sound(stats, elSound)
                  }
              }
          );
    statsListener.start();


});
