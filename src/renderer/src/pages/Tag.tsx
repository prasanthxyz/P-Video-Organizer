import * as React from 'react'
import { useParams } from 'react-router'
import { ITag } from '../../../types'
import { useTag, useUpdateTagVideos } from '../hooks/tags'
import { useAllVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import TagView from '../views/tags/TagView'

export default function Tag(): JSX.Element {
  const [selectedVideos, setSelectedVideos] = React.useState<Set<string>>(new Set())
  const allVideos = useAllVideos()

  let { tagTitle } = useParams()
  tagTitle = decodeURIComponent(tagTitle as string)
  const tag = useTag(tagTitle)
  const updateTagVideos = useUpdateTagVideos()

  React.useEffect(() => {
    if (tag.isSuccess) setSelectedVideos(new Set(tag.data?.videos || []))
  }, [tag.data])

  if (tag.isLoading || allVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <TagView
      tag={tag.data as ITag}
      allVideos={allVideos.data ? allVideos.data : []}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateTagVideos={updateTagVideos}
    />
  )
}
