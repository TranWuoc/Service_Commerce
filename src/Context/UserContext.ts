
import { createContext, useContext } from 'react';
import { User } from '../types/User'; 


const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | undefined>(undefined);



export default UserContext;
