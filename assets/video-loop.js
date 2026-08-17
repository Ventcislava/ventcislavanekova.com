(() => {
  const videos = [...document.querySelectorAll("video")];
  const restartDelay = 400;

  const keepPlaying = (video) => {
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    const playback = video.play();
    if (playback) playback.catch(() => {});
  };

  const restart = (video) => {
    try {
      video.currentTime = 0;
    } catch (_) {
      // The video will be restarted as soon as its media data is available.
    }
    keepPlaying(video);
  };

  videos.forEach((video) => {
    video.addEventListener("ended", () => restart(video));

    video.addEventListener("pause", () => {
      if (!document.hidden) {
        if (video.ended) restart(video);
        else keepPlaying(video);
      }
    });

    keepPlaying(video);
  });

  // Some browsers occasionally freeze on the final frame without firing the
  // ended event. This fallback notices a stopped video and starts it again.
  window.setInterval(() => {
    if (document.hidden) return;

    videos.forEach((video) => {
      if (video.ended) restart(video);
      else if (video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        keepPlaying(video);
      }
    });
  }, restartDelay);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      videos.forEach((video) => {
        if (video.ended) restart(video);
        else keepPlaying(video);
      });
    }
  });
})();
