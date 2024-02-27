import makeRequest from './axios'

const authApi = {
    login: (data: { username: string; password: string }) => makeRequest.post('/auth/login', data, {
        withCredentials: true,
      }),
    logout: () => makeRequest.post('auth/logout', {
        withCredentials: true,
      })
}

export default authApi;