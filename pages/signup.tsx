import { Container, Divider, Heading, Input, Button, Stack } from '@co-design/core'
import { FormEvent, useCallback } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { NextPageContext } from 'next'

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
    }
  }
`

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { token } = nookies.get(ctx) // nookies의 인자는 무엇일까?
  if (token) {
    return {
      redirect: {
        destination: '/', //만약 토큰이 존재하면 회원가입할 필요가 없기에 메인으로
      },
    }
  }
  return { props: {} } // 없다면 회원가입창
}

const SignUp = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER)
  const router = useRouter()
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const elements = e.currentTarget
      const username = elements.username.value
      const email = elements.email.value
      const password = elements.password.value
      const result = await register({ variables: { username, email, password } })
      nookies.set(null, 'token', result.data.register.jwt, { path: '/' }) // 서버사이드면 안에 context 넣어주지만 여기선 그냥 null 넣어주면 됨
      router.push('/')
    },
    [router, register],
  )

  return (
    <Container size="xsmall" padding={16} co={{ marginTop: 16 }}>
      <Heading strong level={3} align="center">
        Sign up
      </Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack>
          <Input type="text" placeholder="Username" name="username" />
          <Input type="email" placeholder="Email" name="email" />
          <Input type="password" placeholder="Password" name="password" />
          <Button type="submit" loading={loading}>
            Sign Up
          </Button>
        </Stack>
      </form>
    </Container>
  )
}

export default SignUp
