import {
  Button,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'

export default function Tags() {
  const [dbTags, setDbTags] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  React.useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    setDbTags(await mainAdapter.getDbTags())
  }

  const updateTagInput = (e) => {
    setTagInput(e.target.value)
  }

  const handleCreateTag = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbTag(tagInput)
    setIsCreating(false)
    document.getElementById('tagInput').value = ''
    await loadTags()
  }

  const handleDeleteTag = async (tagTitleToRemove) => {
    await mainAdapter.deleteTag(tagTitleToRemove)
    setDbTags(dbTags.filter((dbTag) => dbTag.title !== tagTitleToRemove))
  }

  const tagsTable = (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tag</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {dbTags.map((dbTag) => (
            <Tr key={dbTag.title}>
              <Td>{dbTag.title}</Td>
              <Td>
                <Button onClick={async () => await handleDeleteTag(dbTag.title)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )

  const addTagForm = (
    <div>
      <Input id="tagInput" onChange={updateTagInput} />
      {isCreating ? <Spinner /> : <Button onClick={handleCreateTag}>Add</Button>}
    </div>
  )

  return (
    <VStack>
      {dbTags.length > 0 && tagsTable}
      {addTagForm}
    </VStack>
  )
}