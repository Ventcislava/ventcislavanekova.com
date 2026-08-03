(() => {
  const videos = [...document.querySelectorAll("video")];

  const keepPlaying = (video) => {
    video.loop = true;
    video.muted = true;
    const playback = video.play();
    if (playback) playback.catch(() => {});
  };

  videos.forEach((video) => {
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      keepPlaying(video);
    });

    video.addEventListener("pause", () => {
      if (!document.hidden && !video.ended) keepPlaying(video);
    });

    keepPlaying(video);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) videos.forEach(keepPlaying);
  });
})();
