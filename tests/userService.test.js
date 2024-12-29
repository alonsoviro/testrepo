const userService = require('../src/services/userService');
const User = require('../src/models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../src/models/userModel');

describe('User Service', () => {
    const mockUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('registerUser', () => {
        it('should register a new user and return user data and token', async () => {
            User.findOne.mockResolvedValue(null); // No existing user
            User.create.mockResolvedValue(mockUserData);
            const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            jest.spyOn(jwt, 'sign').mockReturnValue(token); // Mock JWT signing

            const result = await userService.registerUser(mockUserData.name, mockUserData.email, mockUserData.password);

            expect(result.user).toEqual(mockUserData);
            expect(result.token).toBe(token);
            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(User.create).toHaveBeenCalledWith({ name: mockUserData.name, email: mockUserData.email, password: expect.any(String) });
        });

        it('should throw an error if user already exists', async () => {
            User.findOne.mockResolvedValue(mockUserData); // Simulate existing user

            await expect(userService.registerUser(mockUserData.name, mockUserData.email, mockUserData.password))
                .rejects
                .toThrow('User already exists');
        });
    });

    describe('loginUser', () => {
        it('should log in a user and return user data and token', async () => {
            const hashedPassword = await bcrypt.hash(mockUserData.password, 10);
            User.findOne.mockResolvedValue({ ...mockUserData, password: hashedPassword });

            const token = jwt.sign({ id: '123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            jest.spyOn(jwt, 'sign').mockReturnValue(token); // Mock JWT signing

            const result = await userService.loginUser(mockUserData.email, mockUserData.password);

            expect(result.user).toEqual(mockUserData);
            expect(result.token).toBe(token);
            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
        });

        it('should throw an error if credentials are invalid', async () => {
            User.findOne.mockResolvedValue(null); // User not found

            await expect(userService.loginUser(mockUserData.email, mockUserData.password))
                .rejects
                .toThrow('Invalid credentials');
        });
    });

    describe('getUserById', () => {
        it('should return user data for a valid user ID', async () => {
            User.findById.mockResolvedValue(mockUserData); // Simulate found user

            const result = await userService.getUserById('123');

            expect(result).toEqual(mockUserData);
            expect(User.findById).toHaveBeenCalledWith('123');
        });

        it('should throw an error if user is not found', async () => {
            User.findById.mockResolvedValue(null); // User not found

            await expect(userService.getUserById('123'))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile and return updated user data', async () => {
            const updatedUserData = { ...mockUserData, email: 'newemail@example.com' };
            User.findByIdAndUpdate.mockResolvedValue(updatedUserData); // Simulate updated user

            const result = await userService.updateUserProfile('123', { email: 'newemail@example.com' });

            expect(result).toEqual(updatedUserData);
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { email: 'newemail@example.com' }, { new: true, runValidators: true });
        });

        it('should throw an error if user is not found during update', async () => {
            User.findByIdAndUpdate.mockResolvedValue(null); // User not found

            await expect(userService.updateUserProfile('123', { email: 'newemail@example.com' }))
                .rejects
                .toThrow('User not found');
        });
    });
});