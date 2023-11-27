import * as React from 'react'
import { Button, Spinner, Stack, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import GalleryRow from '../components/GalleryRow.jsx'

export default function Galleries() {
  const [dbGalleries, setDbGalleries] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [galleryInput, setGalleryInput] = React.useState('')
  const [isDeletingGalleries, setIsDeletingGalleries] = React.useState(false)

  React.useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    setDbGalleries(await mainAdapter.getDbGalleries())
  }

  const handleCreateGallery = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbGallery(galleryInput)
    setIsCreating(false)
    setGalleryInput('')
    await loadGalleries()
  }

  const handleDeleteGallery = async (galleryPathToRemove) => {
    await mainAdapter.deleteDbGallery(galleryPathToRemove)
    setDbGalleries(dbGalleries.filter((dbGallery) => dbGallery.galleryPath !== galleryPathToRemove))
  }

  const handleDeleteMissingGalleries = async () => {
    setIsDeletingGalleries(true)
    await mainAdapter.deleteMissingDbGalleries()
    setDbGalleries([])
    await loadGalleries()
    setIsDeletingGalleries(false)
  }

  const getGalleryPathInput = async () => {
    setGalleryInput(await mainAdapter.chooseDirectory())
  }
  const operations = (
    <div className="d-flex my-3">
      {isCreating ? (
        <Spinner />
      ) : (
        <>
          <Button className="me-2" size="sm" onClick={async () => await getGalleryPathInput()}>
            Select Gallery
          </Button>
          <div>{galleryInput}</div>
          {galleryInput && (
            <Button
              variant="success"
              className="ms-2"
              size="sm"
              onClick={async () => await handleCreateGallery(galleryInput)}
            >
              Submit
            </Button>
          )}
        </>
      )}
      {isDeletingGalleries ? (
        <Spinner className="ms-auto" />
      ) : (
        <Button
          className="ms-auto"
          variant="danger"
          size="sm"
          onClick={handleDeleteMissingGalleries}
        >
          Delete Missing Galleries
        </Button>
      )}
    </div>
  )

  const galleriesTable = (
    <Table>
      <thead>
        <tr>
          <th>Gallery</th>
          <th>Exists?</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {dbGalleries.map((dbGallery) => (
          <GalleryRow
            key={dbGallery.galleryPath}
            galleryPath={dbGallery.galleryPath}
            deleteGallery={handleDeleteGallery}
          />
        ))}
      </tbody>
    </Table>
  )

  return (
    <Stack direction="vertical">
      {operations}
      {dbGalleries.length > 0 && galleriesTable}
    </Stack>
  )
}
