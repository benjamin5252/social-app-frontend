import makeRequest from './axios';

const relationshipApi = {
  getRelationship: (userId: number | string) =>
    makeRequest.get('/relationships?followedUserId=' + userId),
  addRelationship: (userId: number | string) =>
    makeRequest.put('/relationships?followedUserId=' + userId),
  deleteRelationship: (userId: number | string) =>
    makeRequest.delete('/relationships?followedUserId=' + userId),
  getFriendList: () => makeRequest.get('/relationships/friends'),
};

export default relationshipApi;

// router.get('/', getRelationship);
// router.put('/', addRelationship);
// router.delete('/', deleteRelationship);
// router.get('/friends', getFriendList);

// get('/relationships?followedUserId=' + userId)
