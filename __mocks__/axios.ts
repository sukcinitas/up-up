export default {
  defaults: {
    withCredentials: true,
  },
  get: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn(),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
};
