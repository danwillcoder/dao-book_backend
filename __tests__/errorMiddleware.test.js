const errorMiddleware = require('../middleware/errorMiddleware');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

const req = mockRequest()
const res = mockResponse()

describe('errorMiddleware', () => {
    it('should return 500 status code and error message in JSON format', () => {
      const errorMessage = 'Test error message';
      const statusCode = 500; 
    
      errorMiddleware({ message: errorMessage, statusCode }, req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    })
    })