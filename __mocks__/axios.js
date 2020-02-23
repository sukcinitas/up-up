export default {
  defaults: {
    withCredentials: true,
  },
  get: jest.fn().mockResolvedValue({
    data: {
      polls: [{
        _id: '5e26f24f04f39d26e3cde70e',
        name: "God's gender",
        votes: 69,
        createdBy: 'username',
        createdAt: '2020-01-21T12:45:03.180Z',
        updatedAt: '2020-02-14T09:39:26.151Z',
        id: '5e26f24f04f39d26e3cde70e',
      },
      {
        _id: '5e31b8061907f3051baafd34',
        name: 'This app',
        votes: 18,
        createdBy: 'panemume',
        createdAt: '2020-01-29T16:51:18.874Z',
        updatedAt: '2020-02-12T16:49:15.871Z',
        id: '5e31b8061907f3051baafd34',
      }],
    },
  }),
  delete: jest.fn(),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({
    data: {
      poll: {
        _id: '1',
        question: 'Test question',
        name: 'Test one',
        options: { one: 1, two: 3 },
        votes: 70,
        createdBy: 'testUser1',
        createdAt: '2020-01-21T12:45:03.180Z',
        updatedAt: '2020-02-14T09:39:26.151Z',
        id: '1',
      },
    },
  }),
};
