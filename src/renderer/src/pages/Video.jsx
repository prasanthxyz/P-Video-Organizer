import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Row, Spinner, Stack, Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import VideoPlayer from '../components/VideoPlayer'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [prevSelectedTags, setPrevSelectedTags] = React.useState(new Set())
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [prevSelectedGalleries, setPrevSelectedGalleries] = React.useState(new Set())

  let { videoPath } = useParams()
  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setAllGalleries((await mainAdapter.getDbGalleries()).map((gallery) => gallery.galleryPath))
    const videoData = await mainAdapter.getDbVideoData(videoPath)
    const selectedTags = new Set(videoData['tags'].map((tag) => tag.title))
    setSelectedTags(selectedTags)
    setPrevSelectedTags(selectedTags)
    const selectedGalleries = new Set(videoData['galleries'].map((gallery) => gallery.galleryPath))
    setSelectedGalleries(selectedGalleries)
    setPrevSelectedGalleries(selectedGalleries)
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, false)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const getUpdateObj = (prevItems, curItems) => {
    const updateObj = { add: [], remove: [] }

    for (const item of curItems) {
      if (!prevItems.has(item)) {
        updateObj['add'].push(item)
      }
    }

    for (const item of prevItems) {
      if (!curItems.has(item)) {
        updateObj['remove'].push(item)
      }
    }

    return updateObj
  }

  const handleUpdateRelated = async () => {
    const updateTagsObj = getUpdateObj(prevSelectedTags, selectedTags)
    await mainAdapter.updateDbVideoTags(videoPath, updateTagsObj)

    const updateGalleriesObj = getUpdateObj(prevSelectedGalleries, selectedGalleries)
    await mainAdapter.updateDbVideoGalleries(videoPath, updateGalleriesObj)

    setPrevSelectedTags(selectedTags)
    setPrevSelectedGalleries(selectedGalleries)
  }

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]
  const getImgPath = () => {
    const imgPathComponents = videoPathComponents.slice(0, videoPathComponents.length - 1)
    imgPathComponents.push('img')
    imgPathComponents.push(videoPathComponents[videoPathComponents.length - 1] + '.jpg')
    return imgPathComponents.join('/')
  }

  const tgpButton = tgpExists ? (
    <></>
  ) : isGeneratingTgp ? (
    <Spinner />
  ) : (
    <Button variant="success" size="sm" onClick={async () => await handleGenerateTgp()}>
      Generate TGP
    </Button>
  )

  const relatedTags = (
    <CheckBoxGroup allItems={allTags} selectedItems={selectedTags} update={setSelectedTags} />
  )

  const relatedGalleries = (
    <CheckBoxGroup
      allItems={allGalleries}
      selectedItems={selectedGalleries}
      update={setSelectedGalleries}
    />
  )

  const imgPath = getImgPath()

  const isSelectionChanged =
    !_.isEqual(prevSelectedTags, selectedTags) ||
    !_.isEqual(prevSelectedGalleries, selectedGalleries)

  return (
    <Stack direction="vertical">
      <h6 className="fs-6">{videoName}</h6>
      <Tabs defaultActiveKey="tgp">
        <Tab eventKey="tgp" title="TGP">
          {tgpExists ? <img width="100%" src={`file:///${imgPath}`} /> : <>TGP MISSING</>}
        </Tab>
        <Tab eventKey="video" title="Video">
          <VideoPlayer autoplay={false} controls={true} sources={videoPath} />
        </Tab>
      </Tabs>
      {tgpButton}
      <Row>
        <Col xs={4}>
          <h6 className="fs-6">Tags</h6>
          {relatedTags}
        </Col>
        <Col xs={4}>
          <h6 className="fs-6">Galleries</h6>
          {relatedGalleries}
        </Col>
        <Col xs={4}>
          {isSelectionChanged && (
            <Button variant="success" size="sm" className="my-2" onClick={handleUpdateRelated}>
              Save
            </Button>
          )}
        </Col>
      </Row>
    </Stack>
  )
}
