
window.addEventListener('load', () => {

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
