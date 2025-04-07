export interface IAdminService {
    getUsers(): Promise<any>;
    getCreators(): Promise<any>;
    blockUser(userId: string): Promise<any>;
    blockCreator(creatorId: string): Promise<any>;
    login(username: string, password: string): Promise<{ 
        token: string; 
        refreshToken: string; 
        admin: { _id: string; username: string }
      }>;

      refreshToken(refreshToken: string): Promise<string | null>;
      logout(refreshToken: string): Promise<void>; // ✅ Add logout method

    }
  