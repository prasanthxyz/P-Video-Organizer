import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import useAvailableVideos from '../hooks/videos'
import GalleryView from '../views/galleries/Gallery'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const { hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  const allVideos = useAvailableVideos().data

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

  let { galleryPath } = useParams()
  galleryPath = decodeURIComponent(galleryPath)

  const loadData = async () => {
    setGalleryImages(
      (await mainAdapter.getGalleryImagePaths(galleryPath)).map(
        (imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')
      )
    )
    setSelectedVideos(
      new Set(
        (await mainAdapter.getDbGalleryData(galleryPath))['videos'].map((video) => video.filePath)
      )
    )
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return (
    <GalleryView
      galleryPath={galleryPath}
      galleryImages={galleryImages}
      allVideos={allVideos}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
    />
  )
}
