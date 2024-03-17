import * as React from 'react';
import { Stack } from 'rsuite';
import CheckBoxGroups from '../../components/CheckBoxGroups';
import ImageSlideShowView from '../common/ImageSlideShowView';
import { UseMutateFunction } from 'react-query';
import { IDiffObj, IGalleryFull, IVideoFull } from '../../types';

const GalleryView = ({
  gallery,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateGalleryVideos,
}: {
  gallery: IGalleryFull;
  allVideos: IVideoFull[];
  selectedVideos: Set<string>;
  setSelectedVideos: React.Dispatch<React.SetStateAction<Set<string>>>;
  updateGalleryVideos: UseMutateFunction<
    unknown,
    unknown,
    [string, IDiffObj],
    unknown
  >;
}) => (
  <>
    <h5 style={{ textAlign: 'center' }}>{gallery.galleryPath}</h5>
    <Stack alignItems="flex-start" wrap={false}>
      <Stack.Item flex="3 1 0px" style={{ width: 0 }}>
        {gallery.images.length > 0 ? (
          <ImageSlideShowView galleryImages={gallery.images} />
        ) : (
          <div>No images found!</div>
        )}
      </Stack.Item>
      <Stack.Item flex="5 1 0px" style={{ width: 0 }}>
        <CheckBoxGroups
          lists={[
            {
              heading: 'Videos',
              allItems: allVideos.map((v: IVideoFull) => v.id),
              selectedItems: selectedVideos,
            },
          ]}
          saveHandlers={[async (sv: Set<string>) => setSelectedVideos(sv)]}
          postSave={async ([videosDiffObj]) => {
            await updateGalleryVideos([
              gallery.galleryPath,
              videosDiffObj as IDiffObj,
            ]);
          }}
          useDiffObj={true}
        />
      </Stack.Item>
    </Stack>
  </>
);

export default GalleryView;