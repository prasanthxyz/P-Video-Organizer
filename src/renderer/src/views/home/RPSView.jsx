import { Col, Image, Row } from 'antd'
import VideoPlayer from '../../components/VideoPlayer'
import ImageSlideShowView from '../common/ImageSlideShowView'

const RPSView = ({ showVid, videoPath, isVideoPlaying, gallery, video }) => (
  <Row gutter={5}>
    <Col xs={18}>
      {showVid ? (
        <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${videoPath}`} />
      ) : (
        <Image src={`file:///${video.data.tgpPath}`} loading="lazy" width="100%" />
      )}
    </Col>
    <Col xs={6}>
      {gallery.data.images.length > 0 && <ImageSlideShowView galleryImages={gallery.data.images} />}
    </Col>
  </Row>
)

export default RPSView
