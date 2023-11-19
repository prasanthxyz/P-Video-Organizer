import { Tag, Video } from '../main/database/database'

export const deleteVideo = async (videoPath) => {
  await Video.destroy({ where: { filePath: videoPath } })
}

export const deleteTag = async (tagTitle) => {
  await Tag.destroy({ where: { title: tagTitle } })
}

export const getVideos = async () => {
  return await Video.findAll({ raw: true })
}

export const getTags = async () => {
  return await Tag.findAll({ raw: true })
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
