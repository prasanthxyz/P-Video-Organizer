import { Gallery, Tag, Video } from '../main/database/database'

export const deleteVideo = async (videoPath) => {
  await Video.destroy({ where: { filePath: videoPath } })
}

export const deleteTag = async (tagTitle) => {
  await Tag.destroy({ where: { title: tagTitle } })
}

export const deleteGallery = async (galleryPath) => {
  await Gallery.destroy({ where: { galleryPath: galleryPath } })
}

export const getVideos = async () => {
  return await Video.findAll({ raw: true })
}

export const getTags = async () => {
  return await Tag.findAll({ raw: true })
}

export const getGalleries = async () => {
  return await Gallery.findAll({ raw: true })
}

export const createVideos = async (videoPaths) => {
  const existingVideos = new Set((await getVideos()).map((v) => v.filePath))
  const validVideos = videoPaths
    .filter((videoPath) => !existingVideos.has(videoPath))
    .map((videoPath) => ({
      filePath: videoPath
    }))
  Video.bulkCreate(validVideos)
}

export const createTag = async (tagTitle) => {
  tagTitle = tagTitle.toLowerCase()
  const existingTags = new Set((await getTags()).map((v) => v.title))
  if (existingTags.has(tagTitle)) return
  await Tag.create({ title: tagTitle })
}

export const createGallery = async (galleryPath) => {
  const existingGalleries = new Set((await getGalleries()).map((v) => v.galleryPath))
  if (existingGalleries.has(galleryPath)) return
  await Gallery.create({ galleryPath: galleryPath })
}

export const getVideoData = async (videoPath) => {
  const videoObj = await Video.findOne({
    where: { filePath: videoPath },
    include: [Tag, Gallery]
  })
  return {
    tags: await videoObj.getTags({ raw: true }),
    galleries: await videoObj.getGalleries({ raw: true })
  }
}

export const updateVideoTags = async (videoPath, updateObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addTags(updateObj['add'])
  await videoObj.removeTags(updateObj['remove'])
}

export const updateVideoGalleries = async (videoPath, updateObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addGalleries(updateObj['add'])
  await videoObj.removeGalleries(updateObj['remove'])
}
