import React from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'
import 'videojs-hotkeys'

export default function VideoPlayer(props: {
  autoplay: boolean
  controls: boolean
  sources: string
}): JSX.Element {
  const videoRef = React.useRef<HTMLDivElement | null>(null)
  const playerRef = React.useRef<Player | null>(null)
  const playerOptions = {
    ...props,
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        enableVolumeScroll: false
      }
    },
    controlBar: {
      skipButtons: {
        forward: 10,
        backward: 10
      }
    }
  }

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-fluid')

      if (videoRef.current !== null) {
        videoRef.current.appendChild(videoElement)
      }

      const player: Player = (playerRef.current = videojs(videoElement, playerOptions, () => {
        videojs.log('player is ready')
      }))
      player.on('play', () => player.focus())
      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player: Player = playerRef.current
      player.autoplay(playerOptions.autoplay)
      player.src(playerOptions.sources)
    }
  }, [playerOptions, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player: Player = playerRef.current as Player

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player id="videoplayer">
      <div ref={videoRef} />
    </div>
  )
}
