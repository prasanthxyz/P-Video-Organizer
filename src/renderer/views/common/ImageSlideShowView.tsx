import { Carousel } from 'rsuite';

const ImageSlideShowView = ({ galleryImages }: { galleryImages: string[] }) => (
  <Carousel autoplay autoplayInterval={3000}>
    {galleryImages.map((img: string) => (
      <img
        key={img}
        src={img}
        loading="lazy"
        style={{ objectFit: 'contain' }}
      />
    ))}
  </Carousel>
);

export default ImageSlideShowView;