import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../domain/user';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = new User();
      user.id = 1;
      user.firstName = 'John Doe';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      const result = await service.getUserById(1);
      expect(result).toBe(user);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.id = 1;
      user.firstName = 'John Doe';
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);
      const result = await service.createUser(user);
      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user = new User();
      user.id = 1;
      user.firstName = 'John Doe';
      const updatedUser = new User();
      updatedUser.id = 1;
      updatedUser.firstName = 'Jane Doe';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedUser);
      const result = await service.updateUser(1, { firstName: 'Jane Doe' });
      expect(result).toBe(updatedUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(
        service.updateUser(1, { firstName: 'Jane Doe' }),
      ).rejects.toThrowError('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);
      await expect(service.deleteUser(1)).resolves.toBe(undefined);
    });
  });
});
