import { Request, Response } from 'express';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  const baseRequest: Partial<Request> = {
    body: {},
    params: {},
    query: {},
    headers: {},
  };
  
  // Only add user property if provided in overrides
  if (overrides.user !== undefined) {
    (baseRequest as any).user = overrides.user;
  }
  
  return {
    ...baseRequest,
    ...overrides
  };
};

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  
  return res;
};

export const createMockNext = () => jest.fn();