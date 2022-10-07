import { Container, Divider, Heading, Input, Button, Stack } from '@co-design/core'
import { FormEvent, useCallback } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { NextPageContext } from 'next'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { token } = nookies.get(ctx)
  if (token) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }
  return { props: {} }
}

const LoginForm = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN)
  const router = useRouter()
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const elements = e.currentTarget
      const email = elements.email.value
      const password = elements.password.value
      const result = await login({
        variables: { email, password },
      })
      console.log(result)
      nookies.set(null, 'token', result.data.login.jwt, { path: '/' })
      router.push('/')
    },
    [router, login],
  )
  return (
    <Container size="xsmall" padding={16} co={{ marginTop: 16 }}>
      <Heading strong level={3} align="center">
        Login
      </Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack>
          <Input type="email" placeholder="Email" name="email" />
          <Input type="password" placeholder="Password" name="password" />
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  )
}

export default LoginForm
