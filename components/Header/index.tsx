import { Group, Heading, Button } from '@co-design/core'
import nookies from 'nookies'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

interface Props {
  token?: string
}

export const Header = ({ token }: Props) => {
  const router = useRouter()
  const handleLogout = useCallback(() => {
    nookies.destroy(null, 'token', { path: '/' })
    location.href = '/' //홈으로 보내고 새로고침
  }, [])
  return (
    <Group position="apart" align="center" co={{ height: 70, padding: 16 }}>
      <Heading level={4}>Felog</Heading>
      {token ? (
        <Button size="small" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Group spacing={8}>
          <Button
            size="small"
            onClick={() => {
              router.push('/login')
            }}
          >
            Login
          </Button>
          <Button
            size="small"
            onClick={() => {
              router.push('/signup')
            }}
          >
            SignUp
          </Button>
        </Group>
      )}
    </Group>
  )
}
