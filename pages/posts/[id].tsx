import { useQuery, gql } from '@apollo/client'
import { Container, Heading, Divider, Text, Spinner } from '@co-design/core'
import { useRouter } from 'next/router'

interface Props {
  id: string
}

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      data {
        id
        attributes {
          title
          body
          user {
            data {
              attributes {
                username
                email
              }
            }
          }
        }
      }
    }
  }
`

const PostDetail = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: router.query.id },
  })
  console.log(data)
  return (
    <Container size={900} co={{ marginTop: 16 }} padding={16}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Heading level={3} strong>
            {data.post.data.attributes.title}
          </Heading>
          <Divider />
          <Text>{data.post.data.attributes.body}</Text>
          <Divider />
          <Text size="small">
            {data.post.data.attributes.user.data.attributes.username} |{' '}
            {data.post.data.attributes.user.data.attributes.email}
          </Text>
        </>
      )}
    </Container>
  )
}

export default PostDetail
