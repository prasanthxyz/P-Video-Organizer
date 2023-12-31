import * as React from 'react'
import { useGallery } from '../hooks/galleries'
import { useVideo } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import RPSView from '../views/home/RPSView'

export default function RPS({ combination, showVid, isVideoPlaying }) {
  const [videoPath, galleryPath] = combination
  const gallery = useGallery(galleryPath)
  const video = useVideo(videoPath)

  if (gallery.isLoading || video.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <RPSView
      showVid={showVid}
      videoPath={videoPath}
      isVideoPlaying={isVideoPlaying}
      gallery={gallery}
      video={video}
    />
  )
}
