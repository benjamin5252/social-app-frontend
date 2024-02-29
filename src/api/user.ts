import makeRequest from './axios';

const userApi = {
  getUser: (uerId: number | string) => makeRequest.get(`/users/find/${uerId}`),
  updateUser: (userData: {
    name: string;
    city?: string;
    website?: string;
    coverPic?: string;
    profilePic?: string;
  }) => makeRequest.put('/users', userData),
};

export default userApi;
