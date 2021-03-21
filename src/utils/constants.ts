export const Responses = {
  register: {
    email_taken: 'That email is already registered',
    error: 'Unable to register',
  },
  login: 'Invalid login credentials',
  notLoggedIn: 'You are not currently logged in',
  no_permissions: (action: string) => `You don't have permission to ${action} this`,
  unable_to_perform: (action: string, type: string) => `Unable to ${action} ${type}`,
  invalid_id: (type: string) => `Invalid ${type} id`,
  read: {
    none_found: (type: string) => `Unable to find ${type}`,
  },
};

export enum Actions {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export enum Routes {
  users = '/users',
  posts = '/posts',
  docs = '/docs',
}

export const json = /json/;

export const testUser = {
  email: 'asge0907@easv365.dk',
  displayName: 'Asger Storm',
  createdAt: '2021-03-20T21:53:30.903Z',
  updatedAt: '2021-03-20T21:53:30.903Z',
};
